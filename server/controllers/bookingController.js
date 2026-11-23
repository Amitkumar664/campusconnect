const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Get all campus event bookings (Admin Master Bookings view)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, eventId, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (eventId && eventId !== 'all') query.event = eventId;

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { ticketCode: { $regex: search, $options: 'i' } },
        { 'attendeeDetails.fullName': { $regex: search, $options: 'i' } },
        { 'attendeeDetails.email': { $regex: search, $options: 'i' } },
        { 'attendeeDetails.studentOrEmployeeId': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalBookings = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('event', 'title category eventType eventDate venue startTime endTime bannerUrl')
      .populate('user', 'fullName email studentOrEmployeeId department phone')
      .populate('team', 'teamName teamCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      totalBookings,
      page: pageNum,
      pages: Math.ceil(totalBookings / limitNum),
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };
    if (status && status !== 'all') query.status = status;

    const bookings = await Booking.find(query)
      .populate('event')
      .populate('team')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking (by student or admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership if not admin
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.checkInStatus = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();

    // Decrement event registered count
    await Event.findByIdAndUpdate(booking.event, { $inc: { registeredCount: -1 } });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBookings,
  getMyBookings,
  cancelBooking
};
