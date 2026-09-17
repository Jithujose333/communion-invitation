const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const memoryStore = require('../config/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Handle demo tokens
      if (token.startsWith('demo_token_')) {
        const role = token.replace('demo_token_', '');
        const matched = memoryStore.users.find(u => u.role === role) || {
          _id: role + '_123',
          name: role === 'admin' ? 'System Administrator' : role === 'college' ? 'Stanford University Events' : 'Aarav Sharma',
          email: `${role}@collabuz.com`,
          role: role,
          collegeName: role === 'college' ? 'Stanford University' : ''
        };
        req.user = matched;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'collabuz_super_secret_jwt_key_2026');
      
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      
      if (!req.user) {
        req.user = memoryStore.users.find(u => u._id === decoded.id) || {
          _id: decoded.id,
          name: 'Collabuz User',
          email: 'user@collabuz.com',
          role: 'user'
        };
      }
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
