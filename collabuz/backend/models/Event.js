const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['VIP Pass', 'Regular', 'Student Pass', 'Early Bird', 'All-Access']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalQty: {
    type: Number,
    required: true,
    min: 1
  },
  soldQty: {
    type: Number,
    default: 0
  }
});

const eventSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Symposium', 'Management', 'Music']
  },
  bannerUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200'
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  ticketTypes: [ticketTypeSchema],
  status: {
    type: String,
    enum: ['published', 'draft', 'completed'],
    default: 'published'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
