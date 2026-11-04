const Notification = require('../models/Notification');

/**
 * Dispatch an in-app notification to a user
 */
const createNotification = async ({ recipientId, title, message, type = 'system', actionUrl = '' }) => {
  try {
    if (!recipientId) return null;
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      actionUrl
    });
    return notification;
  } catch (error) {
    console.error(`[Notification Dispatch Error] ${error.message}`);
    return null;
  }
};

module.exports = { createNotification };

