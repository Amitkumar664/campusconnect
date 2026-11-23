const Notification = require('../models/Notification');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { createNotification, sendEmail } = require('../utils/notify');

// @desc    Get user's notifications with unread count
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send broadcast or event announcement (Admin)
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
const sendBroadcast = async (req, res) => {
  try {
    const { title, message, type = 'announcement', target = 'all', eventId, sendAsEmail = true } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    let recipients = [];

    if (target === 'event_attendees' && eventId) {
      const bookings = await Booking.find({ event: eventId, status: 'confirmed' }).populate('user', 'email fullName');
      recipients = bookings.map((b) => b.user).filter(Boolean);
    } else {
      recipients = await User.find({ role: 'student', isActive: true }).select('_id email fullName');
    }

    // Dispatch notifications in parallel batches
    const notificationPromises = recipients.map((user) =>
      createNotification({
        recipientId: user._id,
        title,
        message,
        type: type === 'reminder' ? 'reminder' : 'announcement',
        actionUrl: eventId ? `/student/events` : ''
      })
    );

    await Promise.all(notificationPromises);

    // Optional email blast
    if (sendAsEmail && recipients.length > 0) {
      recipients.slice(0, 50).forEach((user) => {
        sendEmail({
          to: user.email,
          subject: `[CampusConnect Notice] ${title}`,
          html: `<div style="font-family: sans-serif; padding: 20px;"><h3>${title}</h3><p>${message}</p></div>`
        });
      });
    }

    res.json({
      success: true,
      message: `Announcement dispatched to ${recipients.length} students successfully.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  sendBroadcast
};
