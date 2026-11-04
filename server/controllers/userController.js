const User = require('../models/User');
const FacultyProfile = require('../models/FacultyProfile');

// @desc    Get all users (with search and filters)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { role, department, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (role && role !== 'all') query.role = role;
    if (department && department !== 'all') query.department = department;

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentOrEmployeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      totalUsers,
      page: pageNum,
      pages: Math.ceil(totalUsers / limitNum),
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new user by Admin (e.g. Faculty account)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role, department, studentOrEmployeeId, phone, designation, officeRoom, subjects } = req.body;

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const existingId = await User.findOne({ studentOrEmployeeId: studentOrEmployeeId.toUpperCase() });
    if (existingId) {
      return res.status(400).json({ success: false, message: 'ID is already registered' });
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      role: role || 'faculty',
      department,
      studentOrEmployeeId: studentOrEmployeeId.toUpperCase(),
      phone: phone || ''
    });

    if (user.role === 'faculty') {
      await FacultyProfile.create({
        user: user._id,
        designation: designation || 'Assistant Professor',
        officeRoom: officeRoom || 'Faculty Cabin',
        subjects: Array.isArray(subjects) ? subjects : ['Computer Science']
      });
    }

    res.status(201).json({
      success: true,
      message: `${user.role} user created successfully`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentOrEmployeeId: user.studentOrEmployeeId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user status (Active / Deactive)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account is now ${user.isActive ? 'Active' : 'Deactivated'}`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user details / role
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.department = req.body.department || user.department;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    if (req.body.role) user.role = req.body.role;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  toggleUserStatus,
  updateUser
};

