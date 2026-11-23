const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

// Setup reusable transporter
let transporter = null;
try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
} catch (err) {
  console.warn('[Notification Service] Nodemailer initialization warning:', err.message);
}

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

/**
 * Send an email notification (Ticket confirmation, cancellation, reminders)
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!to) return false;

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"CampusConnect Events" <noreply@campusconnect.edu>',
        to,
        subject,
        text: text || subject,
        html
      });
      console.log(`[Email Dispatched] To: ${to} | Subject: ${subject}`);
      return true;
    } else {
      // In development / demo environment without SMTP credentials, log simulated dispatch
      console.log(`[Simulated Email Dispatch] To: ${to} | Subject: "${subject}"`);
      return true;
    }
  } catch (error) {
    console.warn(`[Email Dispatch Warning] ${error.message}`);
    return false;
  }
};

module.exports = {
  createNotification,
  sendEmail
};
