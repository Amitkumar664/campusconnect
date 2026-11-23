const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    matchNumber: { type: Number, required: true },
    round: { type: String, default: 'Round 1' }, // e.g. Quarterfinal, Semifinal, Final
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    matchTime: { type: String, required: true },
    matchDate: { type: Date },
    courtOrField: { type: String, default: 'Main Sports Complex' },
    score: { type: String, default: '' },
    winner: { type: String, default: '' },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'postponed'],
      default: 'scheduled'
    }
  },
  { _id: true }
);

const prizeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // 1st Place / Winner, Runner Up
    reward: { type: String, required: true }, // e.g. ₹50,000 + Trophies
    description: { type: String, default: '' }
  },
  { _id: false }
);

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
        values: [
          'technical',
          'cultural',
          'workshop',
          'seminar',
          'guest_lecture',
          'competition',
          'festival',
          'hackathon',
          'sports',
          'webinar'
        ],
        message: '{VALUE} is not a valid event category'
      },
      required: [true, 'Event category is required']
    },
    eventType: {
      type: String,
      enum: ['general', 'hackathon', 'sports', 'virtual'],
      default: 'general'
    },
    venue: {
      type: String,
      required: [true, 'Venue or meeting info is required'],
      trim: true
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    virtualMeetingUrl: {
      type: String,
      default: '',
      trim: true
    },
    platform: {
      type: String,
      enum: ['In-Person', 'Zoom', 'Google Meet', 'Microsoft Teams', 'YouTube Live', 'Discord', 'Other'],
      default: 'In-Person'
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
      required: [true, 'Ticket capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0
    },
    registrationStartDate: {
      type: Date,
      default: Date.now
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    ticketPrice: {
      type: Number,
      default: 0,
      min: [0, 'Ticket price cannot be negative']
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
    },
    status: {
      type: String,
      enum: [
        'upcoming',
        'open',
        'filling_fast',
        'sold_out',
        'closed',
        'ongoing',
        'completed',
        'cancelled'
      ],
      default: 'open'
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    organizerName: {
      type: String,
      default: 'CampusConnect Student Affairs'
    },
    tags: {
      type: [String],
      default: []
    },

    // Hackathon specific fields
    minTeamSize: {
      type: Number,
      default: 1
    },
    maxTeamSize: {
      type: Number,
      default: 4
    },
    problemStatement: {
      type: String,
      default: ''
    },
    submissionDeadline: {
      type: Date
    },
    submissionInstructions: {
      type: String,
      default: ''
    },
    prizes: [prizeSchema],

    // Sports specific fields
    sportType: {
      type: String,
      enum: ['Cricket', 'Football', 'Basketball', 'Badminton', 'Volleyball', 'Table Tennis', 'Chess', 'Athletics', 'Other'],
      default: 'Other'
    },
    tournamentFormat: {
      type: String,
      enum: ['Knockout', 'League', 'Single Elimination', 'Round Robin', 'Open Invitational'],
      default: 'Knockout'
    },
    matchSchedule: [matchSchema],
    resultsSummary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for remaining seats
eventSchema.virtual('availableSeats').get(function () {
  return Math.max(0, this.capacity - (this.registeredCount || 0));
});

// Automatic dynamic status calculation helper
eventSchema.methods.calculateDynamicStatus = function () {
  if (this.status === 'cancelled' || this.status === 'completed') {
    return this.status;
  }
  const now = new Date();
  if (now > this.eventDate) {
    return 'completed';
  }
  if (now > this.registrationDeadline) {
    return 'closed';
  }
  if (this.registeredCount >= this.capacity) {
    return 'sold_out';
  }
  if (this.capacity > 0 && this.registeredCount / this.capacity >= 0.8) {
    return 'filling_fast';
  }
  if (now < this.registrationStartDate) {
    return 'upcoming';
  }
  return 'open';
};

eventSchema.index({ eventDate: 1, status: 1 });
eventSchema.index({ category: 1, eventType: 1 });
eventSchema.index({ isPublished: 1, registrationDeadline: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
