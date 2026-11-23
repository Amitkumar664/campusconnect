const Team = require('../models/Team');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Helper to generate unique team code
const generateTeamCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TEAM-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Create a new team for a Hackathon or Sports Tournament
// @route   POST /api/teams
// @access  Private (Student)
const createTeam = async (req, res) => {
  try {
    const { teamName, eventId, maxMembers } = req.body;

    if (!teamName || !eventId) {
      return res.status(400).json({ success: false, message: 'Team name and event are required.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Verify user is not already leader or member in another team for this event
    const existingTeam = await Team.findOne({
      event: eventId,
      'members.user': req.user._id
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: `You are already part of team "${existingTeam.teamName}" for this event.`
      });
    }

    const teamCode = generateTeamCode();
    const team = await Team.create({
      teamName,
      event: eventId,
      leader: req.user._id,
      teamCode,
      maxMembers: maxMembers || event.maxTeamSize || 4,
      members: [
        {
          user: req.user._id,
          role: 'leader',
          joinedAt: new Date()
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: `Team "${teamName}" created! Share code ${teamCode} with your teammates.`,
      team
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join an existing team via 6-char team code
// @route   POST /api/teams/join
// @access  Private (Student)
const joinTeam = async (req, res) => {
  try {
    const { teamCode } = req.body;

    if (!teamCode) {
      return res.status(400).json({ success: false, message: 'Team invite code is required.' });
    }

    const team = await Team.findOne({ teamCode: teamCode.trim().toUpperCase() })
      .populate('event', 'title registrationDeadline status')
      .populate('members.user', 'fullName email studentOrEmployeeId department');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team with this code was not found.' });
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: `Team "${team.teamName}" is already at full capacity (${team.maxMembers} members).`
      });
    }

    // Check if user already joined
    const alreadyMember = team.members.some((m) => m.user._id.toString() === req.user._id.toString());
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team.' });
    }

    team.members.push({
      user: req.user._id,
      role: 'member',
      joinedAt: new Date()
    });

    await team.save();

    res.json({
      success: true,
      message: `Successfully joined "${team.teamName}"!`,
      team
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's teams
// @route   GET /api/teams/my
// @access  Private
const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ 'members.user': req.user._id })
      .populate('event', 'title category eventType eventDate venue status submissionDeadline')
      .populate('members.user', 'fullName email studentOrEmployeeId department avatarUrl')
      .populate('leader', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: teams.length, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit project for hackathon
// @route   POST /api/teams/:id/submit
// @access  Private (Leader)
const submitProject = async (req, res) => {
  try {
    const { title, repoUrl, demoUrl, description } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found.' });
    }

    // Ensure requester is team leader
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only team leader can submit the project.' });
    }

    team.projectSubmission = {
      title,
      repoUrl,
      demoUrl,
      description,
      submittedAt: new Date()
    };
    team.status = 'submitted';
    await team.save();

    res.json({
      success: true,
      message: 'Project submitted successfully!',
      team
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all teams for an event (Admin / Participants)
// @route   GET /api/teams/event/:eventId
// @access  Private
const getEventTeams = async (req, res) => {
  try {
    const teams = await Team.find({ event: req.params.eventId })
      .populate('members.user', 'fullName email studentOrEmployeeId department avatarUrl')
      .populate('leader', 'fullName email studentOrEmployeeId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: teams.length, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTeam,
  joinTeam,
  getMyTeams,
  submitProject,
  getEventTeams
};
