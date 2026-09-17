const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyCollegeEvents
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/college/my-events', protect, authorize('college', 'admin'), getMyCollegeEvents);
router.get('/:id', getEventById);

router.post('/', protect, authorize('college', 'admin'), createEvent);
router.put('/:id', protect, authorize('college', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('college', 'admin'), deleteEvent);

module.exports = router;
