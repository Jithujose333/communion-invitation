const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllTransactions,
  getColleges,
  getUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/transactions', protect, authorize('admin'), getAllTransactions);
router.get('/colleges', protect, authorize('admin'), getColleges);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
