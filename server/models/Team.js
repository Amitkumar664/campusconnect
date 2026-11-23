const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: [50, 'Team name cannot exceed 50 characters']
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required']
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team leader is required']
    },
    teamCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        role: {
          type: String,
          enum: ['leader', 'member'],
          default: 'member'
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    maxMembers: {
      type: Number,
      default: 4
    },
    projectSubmission: {
      title: { type: String, default: '' },
      repoUrl: { type: String, default: '' },
      demoUrl: { type: String, default: '' },
      description: { type: String, default: '' },
      submittedAt: { type: Date }
    },
    status: {
      type: String,
      enum: ['active', 'submitted', 'finalist', 'winner', 'disqualified'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

teamSchema.index({ event: 1, teamCode: 1 });
teamSchema.index({ event: 1, 'members.user': 1 });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
