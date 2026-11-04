const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: {
      type: String,
      required: true,
      default: '10:00'
    },
    endTime: {
      type: String,
      required: true,
      default: '16:00'
    },
    slotDurationMinutes: {
      type: Number,
      default: 30,
      min: 15,
      max: 120
    }
  },
  { _id: false }
);

const facultyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    designation: {
      type: String,
      required: true,
      default: 'Assistant Professor'
    },
    officeRoom: {
      type: String,
      required: true,
      default: 'Main Academic Block, Room 301'
    },
    bio: {
      type: String,
      default: 'Faculty member dedicated to academic mentoring and student research guidance.'
    },
    subjects: {
      type: [String],
      default: []
    },
    weeklyAvailability: {
      type: [availabilitySlotSchema],
      default: [
        { dayOfWeek: 'Monday', startTime: '10:00', endTime: '13:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Friday', startTime: '11:00', endTime: '15:00', slotDurationMinutes: 30 }
      ]
    },
    blockedDates: {
      type: [Date],
      default: []
    },
    acceptingBookings: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const FacultyProfile = mongoose.model('FacultyProfile', facultyProfileSchema);
module.exports = FacultyProfile;

