const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required']
    },
    category: {
      type: String,
      enum: {
        values: ['workshop', 'seminar', 'hackathon', 'cultural', 'sports', 'technical'],
        message: '{VALUE} is not a valid event category'
      },
      required: [true, 'Event category is required']
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      default: null
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

eventSchema.index({ eventDate: 1, status: 1 });
eventSchema.index({ category: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

