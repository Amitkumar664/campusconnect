const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Resource code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: {
        values: ['classroom', 'laboratory', 'seminar_hall', 'conference_room'],
        message: '{VALUE} is not a valid resource type'
      },
      required: [true, 'Resource type is required']
    },
    building: {
      type: String,
      required: [true, 'Building name is required'],
      trim: true
    },
    floor: {
      type: String,
      required: [true, 'Floor is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    amenities: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

resourceSchema.index({ type: 1, isActive: 1 });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;

