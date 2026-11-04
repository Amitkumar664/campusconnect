const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingType: {
      type: String,
      enum: {
        values: ['faculty_session', 'resource_booking'],
        message: '{VALUE} is not a valid booking type'
      },
      required: [true, 'Booking type is required']
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required']
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      default: null
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    startMinutes: {
      type: Number,
      required: true
    },
    endMinutes: {
      type: Number,
      required: true
    },
    durationMinutes: {
      type: Number,
      required: true
    },
    subject: {
      type: String,
      required: [true, 'Subject or topic is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description/purpose is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
        message: '{VALUE} is not a valid booking status'
      },
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    actionedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    actionedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// High performance compound indexes for collision checking and analytics
bookingSchema.index({ faculty: 1, date: 1, status: 1, startMinutes: 1, endMinutes: 1 });
bookingSchema.index({ resource: 1, date: 1, status: 1, startMinutes: 1, endMinutes: 1 });
bookingSchema.index({ requester: 1, createdAt: -1 });
bookingSchema.index({ bookingType: 1, status: 1, date: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

