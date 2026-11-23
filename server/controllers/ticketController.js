const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Verify and check in a ticket at venue door
// @route   POST /api/tickets/verify
// @access  Private/Admin
const verifyTicket = async (req, res) => {
  try {
    const { code, eventId } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        verificationStatus: 'invalid',
        message: 'No ticket code or QR payload provided.'
      });
    }

    // Support raw ticket code or parsed JSON payload from QR scan
    let searchCode = code.trim();
    try {
      if (searchCode.startsWith('{') && searchCode.endsWith('}')) {
        const parsed = JSON.parse(searchCode);
        searchCode = parsed.ticketCode || parsed.bookingId || searchCode;
      }
    } catch (e) {
      // Raw string
    }

    const query = {
      $or: [
        { ticketCode: searchCode.toUpperCase() },
        { bookingId: searchCode.toUpperCase() }
      ]
    };

    if (eventId) {
      query.event = eventId;
    }

    const booking = await Booking.findOne(query)
      .populate('event', 'title venue eventDate startTime endTime bannerUrl')
      .populate('user', 'fullName email studentOrEmployeeId department phone avatarUrl');

    if (!booking) {
      return res.json({
        success: false,
        verificationStatus: 'invalid',
        message: `Ticket "${searchCode}" was not found in campus database.`
      });
    }

    // Check cancellation
    if (booking.status === 'cancelled') {
      return res.json({
        success: false,
        verificationStatus: 'cancelled',
        message: `This ticket was CANCELLED on ${booking.cancelledAt ? new Date(booking.cancelledAt).toLocaleDateString() : 'N/A'}. Reason: ${booking.cancellationReason || 'Cancelled'}`,
        ticket: booking
      });
    }

    // Check if already checked in
    if (booking.checkInStatus === 'checked_in') {
      return res.json({
        success: false,
        verificationStatus: 'already_used',
        message: `Ticket ALREADY CHECKED IN at ${new Date(booking.checkedInAt).toLocaleTimeString()} by door staff.`,
        ticket: booking
      });
    }

    // Successful check-in!
    booking.checkInStatus = 'checked_in';
    booking.status = 'attended';
    booking.checkedInAt = new Date();
    booking.checkedInBy = req.user._id;
    await booking.save();

    res.json({
      success: true,
      verificationStatus: 'valid',
      message: `Check-in SUCCESSFUL! Welcome, ${booking.attendeeDetails.fullName || booking.user?.fullName}.`,
      ticket: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Undo ticket check-in (in case staff made accidental scan)
// @route   POST /api/tickets/:id/undo-checkin
// @access  Private/Admin
const undoCheckIn = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Ticket booking not found' });
    }

    booking.checkInStatus = 'unattended';
    booking.status = 'confirmed';
    booking.checkedInAt = null;
    booking.checkedInBy = null;
    await booking.save();

    res.json({
      success: true,
      message: 'Check-in reverted successfully.',
      ticket: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get live door check-in attendee list for an event
// @route   GET /api/tickets/door-list/:eventId
// @access  Private/Admin
const getDoorList = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { search, filter } = req.query;

    const event = await Event.findById(eventId).select('title capacity registeredCount eventDate startTime venue');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const query = { event: eventId };
    if (filter === 'checked_in') query.checkInStatus = 'checked_in';
    if (filter === 'unattended') query.checkInStatus = 'unattended';
    if (filter === 'cancelled') query.status = 'cancelled';

    if (search) {
      query.$or = [
        { ticketCode: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } },
        { 'attendeeDetails.fullName': { $regex: search, $options: 'i' } },
        { 'attendeeDetails.email': { $regex: search, $options: 'i' } },
        { 'attendeeDetails.studentOrEmployeeId': { $regex: search, $options: 'i' } }
      ];
    }

    const attendees = await Booking.find(query)
      .populate('user', 'fullName email studentOrEmployeeId department phone')
      .sort({ createdAt: -1 })
      .lean();

    const checkedInCount = await Booking.countDocuments({ event: eventId, checkInStatus: 'checked_in' });
    const totalConfirmed = await Booking.countDocuments({ event: eventId, status: 'confirmed' });

    res.json({
      success: true,
      event,
      stats: {
        total: totalConfirmed,
        checkedIn: checkedInCount,
        remaining: Math.max(0, totalConfirmed - checkedInCount)
      },
      attendees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  verifyTicket,
  undoCheckIn,
  getDoorList
};
