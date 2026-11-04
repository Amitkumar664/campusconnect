const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const { createNotification } = require('../utils/notify');

// Helper to generate unique human-readable ticket code
const generateTicketCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CC-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Get all events with filters & optional registration flag for logged in user
// @route   GET /api/events
// @access  Public / Protected
const getAllEvents = async (req, res) => {
  try {
    const { category, status, search } = req.query;

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter)
      .populate('resource', 'name code building')
      .populate('organizer', 'fullName email')
      .sort({ eventDate: 1 })
      .lean();

    // If user is logged in, attach their registration status
    let userRegistrations = new Set();
    if (req.user) {
      const myRegs = await EventRegistration.find({
        user: req.user._id,
        status: 'confirmed'
      }).select('event ticketCode').lean();
      
      const regMap = new Map();
      myRegs.forEach((r) => regMap.set(r.event.toString(), r.ticketCode));

      const enriched = events.map((evt) => ({
        ...evt,
        isRegistered: regMap.has(evt._id.toString()),
        ticketCode: regMap.get(evt._id.toString()) || null
      }));

      return res.json({
        success: true,
        count: enriched.length,
        events: enriched
      });
    }

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public / Protected
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('resource', 'name code building floor capacity')
      .populate('organizer', 'fullName email')
      .lean();

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    let registration = null;
    if (req.user) {
      registration = await EventRegistration.findOne({
        event: event._id,
        user: req.user._id,
        status: 'confirmed'
      }).lean();
    }

    res.json({
      success: true,
      event: {
        ...event,
        isRegistered: !!registration,
        ticket: registration
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      resourceId,
      eventDate,
      startTime,
      endTime,
      capacity,
      registrationDeadline,
      bannerUrl,
      tags
    } = req.body;

    if (!title || !description || !category || !venue || !eventDate || !startTime || !endTime || !capacity || !registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'All core event fields are required.'
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      venue,
      resource: resourceId || null,
      eventDate: new Date(eventDate),
      startTime,
      endTime,
      capacity: parseInt(capacity, 10),
      registrationDeadline: new Date(registrationDeadline),
      bannerUrl: bannerUrl || '',
      organizer: req.user._id,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : [])
    });

    res.status(201).json({
      success: true,
      message: 'Event published successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update existing event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.body.title) event.title = req.body.title;
    if (req.body.description) event.description = req.body.description;
    if (req.body.category) event.category = req.body.category;
    if (req.body.venue) event.venue = req.body.venue;
    if (req.body.capacity) event.capacity = parseInt(req.body.capacity, 10);
    if (req.body.eventDate) event.eventDate = new Date(req.body.eventDate);
    if (req.body.startTime) event.startTime = req.body.startTime;
    if (req.body.endTime) event.endTime = req.body.endTime;
    if (req.body.registrationDeadline) event.registrationDeadline = new Date(req.body.registrationDeadline);
    if (req.body.bannerUrl !== undefined) event.bannerUrl = req.body.bannerUrl;
    if (req.body.status) event.status = req.body.status;

    const updatedEvent = await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await EventRegistration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event and related registrations removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register student for an event (concurrency-safe with duplicate & capacity checks)
// @route   POST /api/events/:id/register
// @access  Private (Students, Faculty)
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline for this event has closed.'
      });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      event: event._id,
      user: req.user._id,
      status: 'confirmed'
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.',
        ticketCode: existingRegistration.ticketCode
      });
    }

    // Check capacity atomically
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: event._id,
        registeredCount: { $lt: event.capacity }
      },
      { $inc: { registeredCount: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: 'Event registration is fully booked (capacity reached).'
      });
    }

    const ticketCode = generateTicketCode();

    const registration = await EventRegistration.create({
      event: event._id,
      user: req.user._id,
      ticketCode,
      status: 'confirmed'
    });

    // Dispatch notification
    await createNotification({
      recipientId: req.user._id,
      title: 'Event Registration Confirmed!',
      message: `You are confirmed for "${event.title}" on ${new Date(event.eventDate).toLocaleDateString()} at ${event.venue}. Ticket Code: ${ticketCode}`,
      type: 'event_alert',
      actionUrl: '/student/events'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      ticketCode,
      registration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private
const cancelRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findOne({
      event: req.params.id,
      user: req.user._id,
      status: 'confirmed'
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Active registration not found' });
    }

    registration.status = 'cancelled';
    await registration.save();

    // Decrement registeredCount
    await Event.findByIdAndUpdate(req.params.id, {
      $inc: { registeredCount: -1 }
    });

    res.json({
      success: true,
      message: 'Event registration cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's registered events
// @route   GET /api/events/my/registrations
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({
      user: req.user._id,
      status: 'confirmed'
    })
      .populate({
        path: 'event',
        populate: { path: 'resource', select: 'name code' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all attendees for an event (Admin)
// @route   GET /api/events/:id/attendees
// @access  Private/Admin
const getEventAttendees = async (req, res) => {
  try {
    const attendees = await EventRegistration.find({ event: req.params.id })
      .populate('user', 'fullName email department studentOrEmployeeId phone')
      .sort({ registeredAt: 1 });

    res.json({
      success: true,
      count: attendees.length,
      attendees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventAttendees
};

