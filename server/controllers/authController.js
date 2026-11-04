const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FacultyProfile = require('../models/FacultyProfile');
const { createNotification } = require('../utils/notify');

/**
 * Generate JWT signed token
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'campusconnect_super_secure_jwt_secret_key_2026_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register new student or faculty
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, department, studentOrEmployeeId, phone } = req.body;

    if (!fullName || !email || !password || !department || !studentOrEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, department, ID).'
      });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const existingId = await User.findOne({ studentOrEmployeeId: studentOrEmployeeId.toUpperCase() });
    if (existingId) {
      return res.status(400).json({
        success: false,
        message: 'An account with this Student / Employee ID already exists.'
      });
    }

    // Disallow arbitrary self-registration as admin; allow student or faculty
    const assignedRole = role === 'faculty' ? 'faculty' : 'student';

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      department,
      studentOrEmployeeId: studentOrEmployeeId.toUpperCase(),
      phone: phone || ''
    });

    // If registered as faculty, automatically provision their profile
    if (assignedRole === 'faculty') {
      await FacultyProfile.create({
        user: user._id,
        designation: req.body.designation || 'Assistant Professor',
        officeRoom: req.body.officeRoom || 'Main Faculty Block',
        subjects: req.body.subjects ? req.body.subjects.split(',').map((s) => s.trim()) : ['Core Engineering']
      });
    }

    // Dispatch welcome notification
    await createNotification({
      recipientId: user._id,
      title: 'Welcome to CampusConnect!',
      message: `Your ${assignedRole} account is active. Explore doubt sessions, events, and campus resources.`,
      type: 'system'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentOrEmployeeId: user.studentOrEmployeeId,
        avatarUrl: user.avatarUrl,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during user registration.'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email credentials or incorrect password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact the campus administrator.'
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentOrEmployeeId: user.studentOrEmployeeId,
        avatarUrl: user.avatarUrl,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Authentication error.'
    });
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let facultyDetails = null;

    if (user.role === 'faculty') {
      facultyDetails = await FacultyProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user,
      facultyProfile: facultyDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile.'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatarUrl = req.body.avatarUrl !== undefined ? req.body.avatarUrl : user.avatarUrl;
    user.department = req.body.department || user.department;

    const updatedUser = await user.save();

    // If faculty, update faculty profile fields if provided
    if (user.role === 'faculty') {
      const faculty = await FacultyProfile.findOne({ user: user._id });
      if (faculty) {
        if (req.body.designation) faculty.designation = req.body.designation;
        if (req.body.officeRoom) faculty.officeRoom = req.body.officeRoom;
        if (req.body.bio) faculty.bio = req.body.bio;
        if (req.body.subjects && Array.isArray(req.body.subjects)) faculty.subjects = req.body.subjects;
        await faculty.save();
      }
    }

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password provided is incorrect.'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword
};

