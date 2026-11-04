const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const User = require('../models/User');
const { timeStringToMinutes, minutesToTimeString, isValidTimeFormat } = require('../utils/timeUtils');
const { detectBookingConflict } = require('../utils/conflictDetector');
const { createNotification } = require('../utils/notify');

// @desc    Create new booking (faculty doubt session OR classroom/lab booking)
// @route   POST /api/bookings
// @access  Private (Student, Faculty, Admin)
const createBooking = async (req, res) => {
  try {
    const {
      bookingType,
      facultyId,
      resourceId,
      date,
      startTime,
      endTime,
      subject,
      description
    } = req.body;

    // Basic payload validation
    if (!bookingType || !date || !startTime || !endTime || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields (type, date, start time, end time, subject, description).'
      });
    }

    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Times must follow 24-hour HH:mm format (e.g. 10:30, 14:00).'
      });
    }

    const startMinutes = timeStringToMinutes(startTime);
    const endMinutes = timeStringToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      return res.status(400).json({
        success: false,
        message: 'End time must be strictly after start time.'
      });
    }

    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);

    // Validate date is not in the past
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule bookings for past dates.'
      });
    }

    // Target validation
    let targetId = null;
    let facultyDoc = null;
    let resourceDoc = null;

    if (bookingType === 'faculty_session') {
      if (!facultyId) {
        return res.status(400).json({ success: false, message: 'Faculty member selection is required' });
      }
      facultyDoc = await User.findOne({ _id: facultyId, role: 'faculty' });
      if (!facultyDoc) {
        return res.status(404).json({ success: false, message: 'Selected faculty member not found' });
      }
      targetId = facultyDoc._id;
    } else if (bookingType === 'resource_booking') {
      if (!resourceId) {
        return res.status(400).json({ success: false, message: 'Resource (room/lab) selection is required' });
      }
      resourceDoc = await Resource.findById(resourceId);
      if (!resourceDoc || !resourceDoc.isActive) {
        return res.status(404).json({ success: false, message: 'Resource is not available or inactive' });
      }
      targetId = resourceDoc._id;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid booking type' });
    }

    // RUN SMART CONFLICT DETECTION
    const conflictResult = await detectBookingConflict({
      bookingType,
      targetId,
      date: bookingDate,
      startMinutes,
      endMinutes
    });

    if (conflictResult.hasConflict) {
      return res.status(409).json({
        success: false,
        conflict: true,
        message: conflictResult.message
      });
    }

    // Admin auto-approves their own resource bookings; others start as 'pending'
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const booking = await Booking.create({
      bookingType,
      requester: req.user._id,
      faculty: bookingType === 'faculty_session' ? targetId : null,
      resource: bookingType === 'resource_booking' ? targetId : null,
      date: bookingDate,
      startTime,
      endTime,
      startMinutes,
      endMinutes,
      durationMinutes: endMinutes - startMinutes,
      subject,
      description,
      status: initialStatus,
      actionedBy: req.user.role === 'admin' ? req.user._id : null,
      actionedAt: req.user.role === 'admin' ? new Date() : null
    });

    // Populate for response
    await booking.populate('requester', 'fullName email department studentOrEmployeeId');
    if (bookingType === 'faculty_session') {
      await booking.populate('faculty', 'fullName email department');
      // Notify faculty
      await createNotification({
        recipientId: targetId,
        title: 'New Doubt Session Request',
        message: `${req.user.fullName} (${req.user.department}) requested a doubt session on ${date} from ${startTime} to ${endTime} for "${subject}".`,
        type: 'session_request',
        actionUrl: '/faculty/requests'
      });
    } else {
      await booking.populate('resource', 'name code type building floor');
    }

    // Notify student confirmation
    await createNotification({
      recipientId: req.user._id,
      title: 'Booking Request Submitted',
      message: `Your request for ${bookingType === 'faculty_session' ? facultyDoc.fullName : resourceDoc.name} on ${date} (${startTime} - ${endTime}) has been received.`,
      type: 'booking_status',
      actionUrl: '/student/my-bookings'
    });

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully.',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings submitted by currently logged in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const { status, bookingType } = req.query;
    const filter = { requester: req.user._id };

    if (status && status !== 'all') filter.status = status;
    if (bookingType && bookingType !== 'all') filter.bookingType = bookingType;

    const bookings = await Booking.find(filter)
      .populate('faculty', 'fullName email department phone')
      .populate('resource', 'name code type building floor capacity')
      .sort({ date: -1, startMinutes: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get session requests directed to currently logged in faculty member
// @route   GET /api/bookings/faculty-sessions
// @access  Private (Faculty only)
const getFacultySessions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { faculty: req.user._id, bookingType: 'faculty_session' };

    if (status && status !== 'all') filter.status = status;

    const sessions = await Booking.find(filter)
      .populate('requester', 'fullName email department studentOrEmployeeId phone avatarUrl')
      .sort({ date: 1, startMinutes: 1 });

    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all campus bookings across all users (Admin master list)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { bookingType, status, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (bookingType && bookingType !== 'all') filter.bookingType = bookingType;
    if (status && status !== 'all') filter.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('requester', 'fullName email department studentOrEmployeeId')
      .populate('faculty', 'fullName email department')
      .populate('resource', 'name code type building floor')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Approve / Reject)
// @route   PUT /api/bookings/:id/status
// @access  Private (Faculty for their sessions, Admin for all)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status transition' });
    }

    if (status === 'rejected' && (!rejectionReason || rejectionReason.trim().length < 3)) {
      return res.status(400).json({
        success: false,
        message: 'A clear reason is required when rejecting a booking request.'
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('requester', 'fullName email')
      .populate('faculty', 'fullName email')
      .populate('resource', 'name code');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Permission checks:
    // If faculty_session: either assigned faculty member or Admin can action
    // If resource_booking: Admin can action
    const isAssignedFaculty =
      booking.faculty && booking.faculty._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAssignedFaculty && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this booking request.'
      });
    }

    // If approving, re-check conflict to guarantee no concurrent approvals collided
    if (status === 'approved') {
      const targetId = booking.bookingType === 'faculty_session' ? booking.faculty._id : booking.resource._id;
      const conflict = await detectBookingConflict({
        bookingType: booking.bookingType,
        targetId,
        date: booking.date,
        startMinutes: booking.startMinutes,
        endMinutes: booking.endMinutes,
        excludeBookingId: booking._id
      });

      if (conflict.hasConflict) {
        return res.status(409).json({
          success: false,
          conflict: true,
          message: `Cannot approve: A conflicting confirmed booking now exists for this time window. ${conflict.message}`
        });
      }
    }

    booking.status = status;
    booking.rejectionReason = status === 'rejected' ? rejectionReason : '';
    booking.actionedBy = req.user._id;
    booking.actionedAt = new Date();
    await booking.save();

    // Dispatch notification to requester
    const targetTitle =
      booking.bookingType === 'faculty_session'
        ? `Doubt session with ${booking.faculty.fullName}`
        : `Resource booking for ${booking.resource.name}`;

    await createNotification({
      recipientId: booking.requester._id,
      title: `Booking Request ${status.toUpperCase()}`,
      message:
        status === 'approved'
          ? `Your request for ${targetTitle} on ${new Date(booking.date).toLocaleDateString()} (${booking.startTime}-${booking.endTime}) was APPROVED!`
          : `Your request for ${targetTitle} was ${status}. Reason: ${rejectionReason || 'Schedule conflict'}`,
      type: 'booking_status',
      actionUrl: '/student/my-bookings'
    });

    res.json({
      success: true,
      message: `Booking has been marked as ${status}.`,
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking by creator, faculty, or admin
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('requester', 'fullName email')
      .populate('faculty', 'fullName email')
      .populate('resource', 'name');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isCreator = booking.requester._id.toString() === req.user._id.toString();
    const isAssignedFaculty =
      booking.faculty && booking.faculty._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssignedFaculty && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.rejectionReason = req.body.reason || 'Cancelled by user/faculty';
    booking.actionedBy = req.user._id;
    booking.actionedAt = new Date();
    await booking.save();

    // Notify other party
    if (isCreator && booking.faculty) {
      await createNotification({
        recipientId: booking.faculty._id,
        title: 'Session Cancelled by Student',
        message: `${booking.requester.fullName} cancelled their session on ${new Date(booking.date).toLocaleDateString()} (${booking.startTime}).`,
        type: 'session_request'
      });
    } else if (isAssignedFaculty) {
      await createNotification({
        recipientId: booking.requester._id,
        title: 'Session Cancelled by Faculty',
        message: `Faculty member cancelled the session scheduled for ${new Date(booking.date).toLocaleDateString()}. Reason: ${booking.rejectionReason}`,
        type: 'booking_status'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully. The slot is now released.',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getFacultySessions,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
};

