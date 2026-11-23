const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const QRCode = require('qrcode');
const { createNotification, sendEmail } = require('../utils/notify');

// Helper to generate unique booking ID
const generateBookingId = () => {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `BK-${digits}`;
};

// Helper to generate unique ticket code
const generateTicketCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CC-TKT-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Get all events with filters, search, and personalized registration context
// @route   GET /api/events
// @access  Public / Authenticated
const getAllEvents = async (req, res) => {
  try {
    const { category, eventType, status, search, sportType } = req.query;

    const filter = { isPublished: true };
    if (category && category !== 'all') filter.category = category;
    if (eventType && eventType !== 'all') filter.eventType = eventType;
    if (sportType && sportType !== 'all') filter.sportType = sportType;

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Admins can see unpublished events too
    if (req.user && req.user.role === 'admin') {
      delete filter.isPublished;
    }

    const events = await Event.find(filter)
      .populate('organizer', 'fullName email')
      .sort({ eventDate: 1 })
      .lean();

    // Map user registrations if authenticated
    let userBookingsMap = new Map();
    const isAdmin = req.user && req.user.role === 'admin';

    if (req.user) {
      const myBookings = await Booking.find({
        user: req.user._id,
        status: 'confirmed'
      }).lean();

      myBookings.forEach((b) => {
        userBookingsMap.set(b.event.toString(), b);
      });
    }

    const enrichedEvents = events.map((evt) => {
      const userBooking = userBookingsMap.get(evt._id.toString());
      const isRegistered = !!userBooking;

      // Restrict virtualMeetingUrl to registered participants and admins
      const sanitizedEvent = { ...evt };
      if (!isRegistered && !isAdmin) {
        sanitizedEvent.virtualMeetingUrl = ''; // Hidden until registered
      }

      return {
        ...sanitizedEvent,
        availableSeats: Math.max(0, (evt.capacity || 0) - (evt.registeredCount || 0)),
        isRegistered,
        userBooking: userBooking
          ? {
              bookingId: userBooking.bookingId,
              ticketCode: userBooking.ticketCode,
              qrCode: userBooking.qrCode,
              checkInStatus: userBooking.checkInStatus
            }
          : null
      };
    });

    res.json({
      success: true,
      count: enrichedEvents.length,
      events: enrichedEvents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public / Authenticated
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'fullName email')
      .lean();

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    let userBooking = null;
    const isAdmin = req.user && req.user.role === 'admin';

    if (req.user) {
      userBooking = await Booking.findOne({
        event: event._id,
        user: req.user._id,
        status: 'confirmed'
      }).lean();
    }

    const isRegistered = !!userBooking;
    const sanitizedEvent = { ...event };

    // Protect virtualMeetingUrl
    if (!isRegistered && !isAdmin) {
      sanitizedEvent.virtualMeetingUrl = '';
    }

    res.json({
      success: true,
      event: {
        ...sanitizedEvent,
        availableSeats: Math.max(0, (event.capacity || 0) - (event.registeredCount || 0)),
        isRegistered,
        userBooking: userBooking || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register / Book Ticket for an event with atomic concurrency lock
// @route   POST /api/events/:id/register
// @access  Private (Student)
const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // 1. Fetch event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // 2. Validate event status & deadlines
    const now = new Date();
    if (['closed', 'completed', 'cancelled', 'sold_out'].includes(event.status)) {
      return res.status(400).json({
        success: false,
        message: `Registration is currently unavailable. Event status: ${event.status}.`
      });
    }

    if (now > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'The registration deadline for this event has passed.'
      });
    }

    if (now < new Date(event.registrationStartDate)) {
      return res.status(400).json({
        success: false,
        message: 'Registration for this event has not opened yet.'
      });
    }

    // 3. Prevent duplicate active registrations
    const existingBooking = await Booking.findOne({
      event: eventId,
      user: userId,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already hold a confirmed ticket for this event.',
        booking: existingBooking
      });
    }

    // 4. ATOMIC CAPACITY INVENTORY UPDATE
    // Safely increment registeredCount ONLY if strictly less than capacity
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        registeredCount: { $lt: event.capacity },
        status: { $nin: ['closed', 'completed', 'cancelled', 'sold_out'] }
      },
      {
        $inc: { registeredCount: 1 }
      },
      { new: true }
    );

    if (!updatedEvent) {
      // Mark event as sold out if capacity was reached
      await Event.findByIdAndUpdate(eventId, { status: 'sold_out' });
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event is now completely sold out!'
      });
    }

    // Dynamically update status to 'filling_fast' or 'sold_out' if applicable
    if (updatedEvent.registeredCount >= updatedEvent.capacity) {
      updatedEvent.status = 'sold_out';
      await updatedEvent.save();
    } else if (updatedEvent.registeredCount / updatedEvent.capacity >= 0.85) {
      if (updatedEvent.status === 'open' || updatedEvent.status === 'upcoming') {
        updatedEvent.status = 'filling_fast';
        await updatedEvent.save();
      }
    }

    // 5. Generate unique IDs and Digital QR Ticket
    const bookingId = generateBookingId();
    const ticketCode = generateTicketCode();

    const qrPayload = JSON.stringify({
      bookingId,
      ticketCode,
      eventId: updatedEvent._id.toString(),
      eventTitle: updatedEvent.title,
      studentName: req.user.fullName,
      studentId: req.user.studentOrEmployeeId,
      issueDate: new Date().toISOString()
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 280,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    });

    // 6. Save Booking
    const booking = await Booking.create({
      bookingId,
      ticketCode,
      event: updatedEvent._id,
      user: userId,
      registrationType: req.body.registrationType || 'individual',
      team: req.body.teamId || null,
      qrCode: qrCodeDataUrl,
      ticketPrice: updatedEvent.ticketPrice || 0,
      paymentStatus: (updatedEvent.ticketPrice || 0) > 0 ? 'completed' : 'free',
      status: 'confirmed',
      checkInStatus: 'unattended',
      attendeeDetails: {
        fullName: req.user.fullName,
        email: req.user.email,
        studentOrEmployeeId: req.user.studentOrEmployeeId,
        department: req.user.department,
        phone: req.user.phone || ''
      }
    });

    // 7. Dispatch Notification and Confirmation Email
    await createNotification({
      recipientId: userId,
      title: 'Ticket Confirmed!',
      message: `You're confirmed for "${updatedEvent.title}". Your ticket code is ${ticketCode}.`,
      type: 'event',
      actionUrl: '/student/my-tickets'
    });

    const emailContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background: #FFFFFF;">
        <h2 style="color: #2563EB; margin-top: 0;">CampusConnect Digital Pass</h2>
        <p>Dear ${req.user.fullName},</p>
        <p>Your registration for <strong>${updatedEvent.title}</strong> has been successfully confirmed!</p>
        <div style="background: #F8FAFC; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Ticket Code:</strong> <span style="font-family: monospace; font-size: 16px; color: #1E293B;">${ticketCode}</span></p>
          <p><strong>Date & Time:</strong> ${new Date(updatedEvent.eventDate).toLocaleDateString()} at ${updatedEvent.startTime} - ${updatedEvent.endTime}</p>
          <p><strong>Venue:</strong> ${updatedEvent.venue}</p>
          ${updatedEvent.isVirtual && updatedEvent.virtualMeetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${updatedEvent.virtualMeetingUrl}">${updatedEvent.virtualMeetingUrl}</a></p>` : ''}
        </div>
        <p>Present your digital QR pass from the CampusConnect portal at the venue door check-in desk.</p>
        <p style="color: #64748B; font-size: 13px;">Team CampusConnect • College Events Administration</p>
      </div>
    `;

    sendEmail({
      to: req.user.email,
      subject: `Confirmed: Your Ticket for ${updatedEvent.title} [${ticketCode}]`,
      html: emailContent
    });

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully!',
      booking: {
        _id: booking._id,
        bookingId: booking.bookingId,
        ticketCode: booking.ticketCode,
        qrCode: booking.qrCode,
        status: booking.status,
        event: {
          _id: updatedEvent._id,
          title: updatedEvent.title,
          venue: updatedEvent.venue,
          eventDate: updatedEvent.eventDate,
          startTime: updatedEvent.startTime,
          endTime: updatedEvent.endTime,
          virtualMeetingUrl: updatedEvent.virtualMeetingUrl
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an event registration / booking
// @route   DELETE /api/events/:id/register or PUT /api/bookings/:id/cancel
// @access  Private (Student / Admin)
const cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Look for active booking for this event
    const booking = await Booking.findOne({
      event: eventId,
      user: req.user.role === 'admin' && req.body.studentId ? req.body.studentId : userId,
      status: 'confirmed'
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No active confirmed booking found for this event.'
      });
    }

    booking.status = 'cancelled';
    booking.checkInStatus = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by attendee';
    await booking.save();

    // Safely decrement event registered count
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { registeredCount: -1 } },
      { new: true }
    );

    // Recalculate event status if it was sold out
    if (updatedEvent && updatedEvent.status === 'sold_out') {
      if (updatedEvent.registeredCount < updatedEvent.capacity) {
        updatedEvent.status = updatedEvent.registeredCount / updatedEvent.capacity >= 0.85 ? 'filling_fast' : 'open';
        await updatedEvent.save();
      }
    }

    await createNotification({
      recipientId: booking.user,
      title: 'Registration Cancelled',
      message: `Your booking for "${updatedEvent ? updatedEvent.title : 'Event'}" was successfully cancelled.`,
      type: 'event'
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all current user registrations / tickets
// @route   GET /api/events/my/registrations
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    if (status && status !== 'all') filter.status = status;

    const bookings = await Booking.find(filter)
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

// @desc    Create new event (Admin)
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      eventType,
      venue,
      isVirtual,
      virtualMeetingUrl,
      platform,
      eventDate,
      startTime,
      endTime,
      capacity,
      registrationStartDate,
      registrationDeadline,
      ticketPrice,
      bannerUrl,
      tags,
      // Hackathon specific
      minTeamSize,
      maxTeamSize,
      problemStatement,
      submissionDeadline,
      submissionInstructions,
      prizes,
      // Sports specific
      sportType,
      tournamentFormat,
      matchSchedule
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      eventType: eventType || 'general',
      venue,
      isVirtual: !!isVirtual || eventType === 'virtual',
      virtualMeetingUrl: virtualMeetingUrl || '',
      platform: platform || (isVirtual ? 'Zoom' : 'In-Person'),
      eventDate,
      startTime,
      endTime,
      capacity: Number(capacity),
      registrationStartDate: registrationStartDate || Date.now(),
      registrationDeadline,
      ticketPrice: Number(ticketPrice) || 0,
      bannerUrl: bannerUrl || undefined,
      organizer: req.user._id,
      organizerName: req.user.fullName,
      tags: Array.isArray(tags) ? tags : [],
      status: 'open',
      minTeamSize: minTeamSize ? Number(minTeamSize) : 1,
      maxTeamSize: maxTeamSize ? Number(maxTeamSize) : 4,
      problemStatement: problemStatement || '',
      submissionDeadline: submissionDeadline || null,
      submissionInstructions: submissionInstructions || '',
      prizes: Array.isArray(prizes) ? prizes : [],
      sportType: sportType || 'Other',
      tournamentFormat: tournamentFormat || 'Knockout',
      matchSchedule: Array.isArray(matchSchedule) ? matchSchedule : []
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

// @desc    Update existing event (Admin)
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / Cancel event (Admin)
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Cancel related active bookings
    await Booking.updateMany(
      { event: event._id, status: 'confirmed' },
      { status: 'cancelled', checkInStatus: 'cancelled', cancellationReason: 'Event cancelled by administration' }
    );

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event and associated tickets removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendee list for an event (Admin)
// @route   GET /api/events/:id/attendees
// @access  Private/Admin
const getEventAttendees = async (req, res) => {
  try {
    const attendees = await Booking.find({ event: req.params.id })
      .populate('user', 'fullName email studentOrEmployeeId department phone avatarUrl')
      .populate('team')
      .sort({ createdAt: -1 })
      .lean();

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
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees
};
