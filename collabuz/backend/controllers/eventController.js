const Event = require('../models/Event');
const mongoose = require('mongoose');
const memoryStore = require('../config/memoryStore');

// @desc    Get all published events with filtering & search
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search, category, college } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = { status: 'published' };
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { collegeName: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }
      if (category && category !== 'All') query.category = category;
      if (college && college !== 'All') query.collegeName = { $regex: college, $options: 'i' };

      const events = await Event.find(query).sort({ createdAt: -1 });
      return res.json(events);
    }

    // Memory Fallback
    let result = [...memoryStore.events];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(s) || 
        e.description.toLowerCase().includes(s) || 
        e.collegeName.toLowerCase().includes(s)
      );
    }
    if (category && category !== 'All') {
      result = result.filter(e => e.category === category);
    }
    if (college && college !== 'All') {
      result = result.filter(e => e.collegeName.toLowerCase().includes(college.toLowerCase()));
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event details
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const event = await Event.findById(req.params.id);
      if (event) return res.json(event);
    }

    const memoryEvt = memoryStore.events.find(e => e._id === req.params.id);
    if (memoryEvt) return res.json(memoryEvt);

    res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (College Host / Admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, category, bannerUrl, location, date, time, ticketTypes } = req.body;

    const newEvtData = {
      collegeId: req.user._id,
      collegeName: req.user.collegeName || req.user.name,
      title,
      description,
      category,
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      location,
      date,
      time,
      ticketTypes: ticketTypes || [
        { name: 'Regular', price: 199, totalQty: 100, soldQty: 0 },
        { name: 'VIP Pass', price: 499, totalQty: 30, soldQty: 0 }
      ],
      status: 'published'
    };

    if (mongoose.connection.readyState === 1) {
      const event = new Event(newEvtData);
      const createdEvent = await event.save();
      return res.status(201).json(createdEvent);
    }

    const created = { _id: 'evt_' + Date.now(), ...newEvtData };
    memoryStore.events.unshift(created);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
const updateEvent = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      Object.assign(event, req.body);
      const updated = await event.save();
      return res.json(updated);
    }

    const evtIndex = memoryStore.events.findIndex(e => e._id === req.params.id);
    if (evtIndex > -1) {
      Object.assign(memoryStore.events[evtIndex], req.body);
      return res.json(memoryStore.events[evtIndex]);
    }
    res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
const deleteEvent = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Event.deleteOne({ _id: req.params.id });
      return res.json({ message: 'Event removed successfully' });
    }

    memoryStore.events = memoryStore.events.filter(e => e._id !== req.params.id);
    res.json({ message: 'Event removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in college events
const getMyCollegeEvents = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const events = await Event.find({ collegeId: req.user._id }).sort({ createdAt: -1 });
      return res.json(events);
    }

    const myEvts = memoryStore.events.filter(
      e => e.collegeId === req.user._id || e.collegeName === req.user.collegeName
    );
    res.json(myEvts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyCollegeEvents
};
