const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  attending: {
    type: Boolean,
    required: [true, 'Please indicate if you are attending'],
  },
  guests: {
    type: Number,
    required: true,
    min: [1, 'Must have at least 1 guest'],
    max: [10, 'Maximum of 10 guests allowed per party'],
    default: 1
  },
  dietaryRequirements: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RSVP', rsvpSchema);
