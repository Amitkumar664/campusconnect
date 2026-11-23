const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    registrationType: {
      type: String,
      enum: ['individual', 'team'],
      default: 'individual'
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    qrCode: {
      type: String, // Data URL base64 image string
      default: ''
    },
    ticketPrice: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['free', 'completed', 'pending', 'refunded'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'attended'],
      default: 'confirmed'
    },
    checkInStatus: {
      type: String,
      enum: ['unattended', 'checked_in', 'cancelled'],
      default: 'unattended'
    },
    checkedInAt: {
      type: Date,
      default: null
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    attendeeDetails: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      studentOrEmployeeId: { type: String, default: '' },
      department: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes
bookingSchema.index({ event: 1, user: 1, status: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
