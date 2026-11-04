const User = require('../models/User');
const FacultyProfile = require('../models/FacultyProfile');
const Booking = require('../models/Booking');
const { timeStringToMinutes, minutesToTimeString, doIntervalsOverlap } = require('../utils/timeUtils');

// @desc    Get all active faculty members with profiles
// @route   GET /api/faculty
// @access  Public or Protected
const getAllFaculty = async (req, res) => {
  try {
    const { department, search } = req.query;

    const userFilter = { role: 'faculty', isActive: true };
    if (department && department !== 'all') {
      userFilter.department = department;
    }
    if (search) {
      userFilter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const facultyUsers = await User.find(userFilter)
      .select('fullName email department studentOrEmployeeId phone avatarUrl')
      .lean();

    const facultyUserIds = facultyUsers.map((u) => u._id);
    const profiles = await FacultyProfile.find({ user: { $in: facultyUserIds } }).lean();

    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.user.toString(), p));

    const combined = facultyUsers.map((u) => ({
      ...u,
      profile: profileMap.get(u._id.toString()) || null
    }));

    res.json({
      success: true,
      count: combined.length,
      faculty: combined
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single faculty details by user ID
// @route   GET /api/faculty/:id
// @access  Public or Protected
const getFacultyById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'faculty' })
      .select('fullName email department phone avatarUrl')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }

    let profile = await FacultyProfile.findOne({ user: user._id }).lean();
    if (!profile) {
      profile = await FacultyProfile.create({ user: user._id });
    }

    res.json({
      success: true,
      faculty: {
        ...user,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Calculate available slots for a faculty member on a specific date
// @route   GET /api/faculty/:id/slots?date=YYYY-MM-DD
// @access  Protected
const getFacultySlotsForDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    const profile = await FacultyProfile.findOne({ user: req.params.id }).lean();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    }

    if (!profile.acceptingBookings) {
      return res.json({
        success: true,
        isAvailable: false,
        reason: 'Faculty member is currently not accepting doubt session bookings.',
        slots: []
      });
    }

    // Check if date is blocked
    const isBlocked = profile.blockedDates?.some((blocked) => {
      const b = new Date(blocked);
      return (
        b.getUTCFullYear() === targetDate.getUTCFullYear() &&
        b.getUTCMonth() === targetDate.getUTCMonth() &&
        b.getUTCDate() === targetDate.getUTCDate()
      );
    });

    if (isBlocked) {
      return res.json({
        success: true,
        isAvailable: false,
        reason: 'Date is blocked by the faculty member for official leave or examinations.',
        slots: []
      });
    }

    // Determine day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[targetDate.getDay()];

    const dayConfig = profile.weeklyAvailability?.find((s) => s.dayOfWeek === dayName);
    if (!dayConfig) {
      return res.json({
        success: true,
        isAvailable: false,
        reason: `Faculty has no scheduled office hours on ${dayName}s.`,
        slots: []
      });
    }

    // Generate candidate intervals
    const startMinutes = timeStringToMinutes(dayConfig.startTime);
    const endMinutes = timeStringToMinutes(dayConfig.endTime);
    const step = dayConfig.slotDurationMinutes || 30;

    // Fetch existing booked intervals on this date
    const dayStart = new Date(targetDate);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const existingBookings = await Booking.find({
      faculty: req.params.id,
      date: { $gte: dayStart, $lt: dayEnd },
      status: { $in: ['pending', 'approved'] }
    }).select('startMinutes endMinutes status').lean();

    const slots = [];
    for (let cur = startMinutes; cur + step <= endMinutes; cur += step) {
      const candidateStart = cur;
      const candidateEnd = cur + step;

      const hasOverlap = existingBookings.some((b) =>
        doIntervalsOverlap(candidateStart, candidateEnd, b.startMinutes, b.endMinutes)
      );

      slots.push({
        startTime: minutesToTimeString(candidateStart),
        endTime: minutesToTimeString(candidateEnd),
        startMinutes: candidateStart,
        endMinutes: candidateEnd,
        isAvailable: !hasOverlap
      });
    }

    res.json({
      success: true,
      day: dayName,
      date,
      isAvailable: true,
      slots
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Faculty updates their weekly availability
// @route   PUT /api/faculty/availability
// @access  Private/Faculty
const updateAvailability = async (req, res) => {
  try {
    const { weeklyAvailability, acceptingBookings, designation, officeRoom, bio, subjects } = req.body;

    let profile = await FacultyProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new FacultyProfile({ user: req.user._id });
    }

    if (weeklyAvailability && Array.isArray(weeklyAvailability)) {
      profile.weeklyAvailability = weeklyAvailability;
    }

    if (acceptingBookings !== undefined) {
      profile.acceptingBookings = acceptingBookings;
    }

    if (designation) profile.designation = designation;
    if (officeRoom) profile.officeRoom = officeRoom;
    if (bio) profile.bio = bio;
    if (subjects && Array.isArray(subjects)) profile.subjects = subjects;

    await profile.save();

    res.json({
      success: true,
      message: 'Faculty availability profile updated successfully',
      profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Faculty blocks a date
// @route   POST /api/faculty/block-date
// @access  Private/Faculty
const blockDate = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required to block' });
    }

    const profile = await FacultyProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    }

    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);

    const alreadyBlocked = profile.blockedDates.some(
      (b) => new Date(b).toISOString().split('T')[0] === d.toISOString().split('T')[0]
    );

    if (!alreadyBlocked) {
      profile.blockedDates.push(d);
      await profile.save();
    }

    res.json({
      success: true,
      message: 'Date added to blocked list',
      blockedDates: profile.blockedDates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Faculty unblocks a date
// @route   DELETE /api/faculty/block-date
// @access  Private/Faculty
const unblockDate = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const profile = await FacultyProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    }

    const targetStr = new Date(date).toISOString().split('T')[0];
    profile.blockedDates = profile.blockedDates.filter(
      (b) => new Date(b).toISOString().split('T')[0] !== targetStr
    );

    await profile.save();

    res.json({
      success: true,
      message: 'Date unblocked successfully',
      blockedDates: profile.blockedDates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  getFacultySlotsForDate,
  updateAvailability,
  blockDate,
  unblockDate
};

