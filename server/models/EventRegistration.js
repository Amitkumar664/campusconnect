const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'attended'],
      default: 'confirmed'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate event registrations by the same user
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });
eventRegistrationSchema.index({ user: 1, status: 1 });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
module.exports = EventRegistration;

