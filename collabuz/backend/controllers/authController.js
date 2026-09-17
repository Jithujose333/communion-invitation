const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const memoryStore = require('../config/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'collabuz_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, collegeName, phone } = req.body;
    const userRole = role || 'user';

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: userRole,
        collegeName: userRole === 'college' ? (collegeName || name) : '',
        phone: phone || ''
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
        phone: user.phone,
        token: generateToken(user._id)
      });
    }

    // Memory Fallback
    const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email: email.toLowerCase(),
      role: userRole,
      collegeName: userRole === 'college' ? (collegeName || name) : '',
      phone: phone || ''
    };
    memoryStore.users.push(newUser);

    res.status(201).json({
      ...newUser,
      token: generateToken(newUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          collegeName: user.collegeName,
          phone: user.phone,
          avatar: user.avatar,
          token: generateToken(user._id)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Memory Fallback
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      return res.json({
        ...user,
        token: generateToken(user._id)
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json(user);
    }
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
