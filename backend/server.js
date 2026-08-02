const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const RSVP = require('./models/rsvp');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'felixfestin2026';

// Middleware
app.use(cors());
app.use(express.json());

// JSON File Fallback Setup
const dataDir = path.join(__dirname, 'data');
const jsonFilePath = path.join(dataDir, 'rsvps.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(jsonFilePath)) {
  fs.writeFileSync(jsonFilePath, JSON.stringify([], null, 2));
}

const getLocalRSVPs = () => {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading local JSON file:', err);
    return [];
  }
};

const saveLocalRSVP = (data) => {
  const rsvps = getLocalRSVPs();
  const newRsvp = {
    _id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    name: data.name,
    email: data.email,
    attending: !!data.attending,
    guests: Number(data.guests) || 1,
    dietaryRequirements: data.dietaryRequirements || '',
    message: data.message || '',
    submittedAt: new Date().toISOString()
  };
  rsvps.push(newRsvp);
  fs.writeFileSync(jsonFilePath, JSON.stringify(rsvps, null, 2));
  return newRsvp;
};

const deleteLocalRSVP = (id) => {
  const rsvps = getLocalRSVPs();
  const filtered = rsvps.filter(r => r._id !== id);
  fs.writeFileSync(jsonFilePath, JSON.stringify(filtered, null, 2));
  return filtered.length < rsvps.length;
};

// MongoDB Connection Check
let isMongoConnected = false;
const MONGO_URI = process.env.MONGO_URI || '';

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB connected successfully!');
      isMongoConnected = true;
    })
    .catch(err => {
      console.warn('MongoDB connection failed. Falling back to local JSON storage.', err.message);
      isMongoConnected = false;
    });
} else {
  console.log('No MONGO_URI provided in environment. Storing RSVPs in local JSON database.');
}

// Middleware to check admin passcode
const checkPasscode = (req, res, next) => {
  const code = req.headers['x-admin-passcode'] || req.query.passcode;
  if (code === ADMIN_PASSCODE) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Invalid passcode.' });
  }
};

// --- API ROUTES ---

// 1. Submit RSVP
app.post('/api/rsvp', async (req, res) => {
  const { name, email, attending, guests, dietaryRequirements, message } = req.body;

  if (!name || !email || attending === undefined) {
    return res.status(400).json({ error: 'Name, email, and attending status are required fields.' });
  }

  try {
    if (isMongoConnected) {
      const newRsvp = new RSVP({
        name,
        email,
        attending,
        guests: attending ? guests : 1,
        dietaryRequirements,
        message
      });
      const saved = await newRsvp.save();
      return res.status(201).json(saved);
    } else {
      const saved = saveLocalRSVP({
        name,
        email,
        attending,
        guests: attending ? guests : 1,
        dietaryRequirements,
        message
      });
      return res.status(201).json(saved);
    }
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Failed to submit RSVP. Please try again.' });
  }
});

// 2. Get All RSVPs (Admin Only)
app.get('/api/rsvp', checkPasscode, async (req, res) => {
  try {
    let rsvps;
    if (isMongoConnected) {
      rsvps = await RSVP.find().sort({ submittedAt: -1 });
    } else {
      rsvps = getLocalRSVPs().sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }
    res.json(rsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ error: 'Failed to retrieve RSVPs.' });
  }
});

// 3. Delete RSVP (Admin Only)
app.delete('/api/rsvp/:id', checkPasscode, async (req, res) => {
  const { id } = req.params;
  try {
    let success = false;
    if (isMongoConnected) {
      const result = await RSVP.findByIdAndDelete(id);
      success = !!result;
    } else {
      success = deleteLocalRSVP(id);
    }

    if (success) {
      res.json({ message: 'RSVP successfully deleted.' });
    } else {
      res.status(404).json({ error: 'RSVP not found.' });
    }
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({ error: 'Failed to delete RSVP.' });
  }
});

// 4. Get RSVP Statistics (Admin Only)
app.get('/api/stats', checkPasscode, async (req, res) => {
  try {
    let rsvps;
    if (isMongoConnected) {
      rsvps = await RSVP.find();
    } else {
      rsvps = getLocalRSVPs();
    }

    const totalCount = rsvps.length;
    const attending = rsvps.filter(r => r.attending);
    const attendingCount = attending.length;
    const declinedCount = totalCount - attendingCount;
    const totalGuests = attending.reduce((sum, r) => sum + (Number(r.guests) || 1), 0);

    res.json({
      totalCount,
      attendingCount,
      declinedCount,
      totalGuests,
      databaseType: isMongoConnected ? 'MongoDB' : 'Local JSON File'
    });
  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({ error: 'Failed to load statistics.' });
  }
});

// --- SERVE FRONTEND STATIC ASSETS IN PRODUCTION ---
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// For any request that doesn't match an API route, serve index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`RSVP Admin Panel passcode is: ${ADMIN_PASSCODE}`);
});
