const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const { minutesToTimeString, doIntervalsOverlap } = require('../utils/timeUtils');

// @desc    Get all campus resources (classrooms, labs, etc.)
// @route   GET /api/resources
// @access  Public / Protected
const getAllResources = async (req, res) => {
  try {
    const { type, minCapacity, search, isActive } = req.query;

    const filter = {};
    if (type && type !== 'all') filter.type = type;
    if (minCapacity) filter.capacity = { $gte: parseInt(minCapacity, 10) };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { building: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(filter).sort({ type: 1, name: 1 });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resource with its schedule
// @route   GET /api/resources/:id
// @access  Public / Protected
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resource availability & occupied slots for a specific date
// @route   GET /api/resources/:id/availability?date=YYYY-MM-DD
// @access  Protected
const getResourceAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date query param is required' });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);
    const nextDay = new Date(bookingDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const bookings = await Booking.find({
      resource: resource._id,
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ['pending', 'approved'] }
    })
      .populate('requester', 'fullName email')
      .select('startTime endTime startMinutes endMinutes subject status requester')
      .sort({ startMinutes: 1 })
      .lean();

    // Standard campus operational hours: 08:00 (480 mins) to 20:00 (1200 mins)
    const campusStart = 480;
    const campusEnd = 1200;

    // Calculate free time slots (1-hour resolution)
    const freeSlots = [];
    for (let t = campusStart; t < campusEnd; t += 60) {
      const slotStart = t;
      const slotEnd = t + 60;
      const isOccupied = bookings.some((b) =>
        doIntervalsOverlap(slotStart, slotEnd, b.startMinutes, b.endMinutes)
      );

      freeSlots.push({
        startTime: minutesToTimeString(slotStart),
        endTime: minutesToTimeString(slotEnd),
        startMinutes: slotStart,
        endMinutes: slotEnd,
        isAvailable: !isOccupied
      });
    }

    res.json({
      success: true,
      resource,
      date,
      occupiedBookings: bookings,
      slots: freeSlots
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new campus resource (Classroom, Lab, etc.)
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const { name, code, type, building, floor, capacity, amenities, description } = req.body;

    const existingCode = await Resource.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ success: false, message: 'Resource code already exists' });
    }

    const resource = await Resource.create({
      name,
      code: code.toUpperCase(),
      type,
      building,
      floor,
      capacity: parseInt(capacity, 10),
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map((s) => s.trim()) : []),
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update resource details
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (req.body.name) resource.name = req.body.name;
    if (req.body.type) resource.type = req.body.type;
    if (req.body.building) resource.building = req.body.building;
    if (req.body.floor) resource.floor = req.body.floor;
    if (req.body.capacity) resource.capacity = parseInt(req.body.capacity, 10);
    if (req.body.amenities) {
      resource.amenities = Array.isArray(req.body.amenities)
        ? req.body.amenities
        : req.body.amenities.split(',').map((s) => s.trim());
    }
    if (req.body.description !== undefined) resource.description = req.body.description;
    if (req.body.isActive !== undefined) resource.isActive = req.body.isActive;

    const updatedResource = await resource.save();

    res.json({
      success: true,
      message: 'Resource updated successfully',
      resource: updatedResource
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / deactivate resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Check if future active bookings exist
    const futureBookings = await Booking.countDocuments({
      resource: resource._id,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'approved'] }
    });

    if (futureBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete resource: ${futureBookings} active upcoming booking(s) are linked to this resource. Please cancel or reassign them first.`
      });
    }

    await resource.deleteOne();

    res.json({
      success: true,
      message: 'Resource removed from system successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  getResourceAvailability,
  createResource,
  updateResource,
  deleteResource
};

