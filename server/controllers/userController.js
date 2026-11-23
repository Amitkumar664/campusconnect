const User = require('../models/User');

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

// @desc    Create new user by Admin (Student or Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role, department, studentOrEmployeeId, phone } = req.body;

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const existingId = await User.findOne({ studentOrEmployeeId: studentOrEmployeeId.toUpperCase() });
    if (existingId) {
      return res.status(400).json({ success: false, message: 'ID is already registered' });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      department,
      studentOrEmployeeId: studentOrEmployeeId.toUpperCase(),
      phone: phone || ''
    });

    res.status(201).json({
      success: true,
      message: `${user.role} user created successfully`,
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active/deactivated status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivating own admin account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own administrative account.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user details by Admin
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { fullName, department, phone, role, isActive } = req.body;

    if (fullName) user.fullName = fullName;
    if (department) user.department = department;
    if (phone !== undefined) user.phone = phone;
    if (role && ['student', 'admin'].includes(role)) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: 'User details updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentOrEmployeeId: user.studentOrEmployeeId,
        isActive: user.isActive
      }
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
