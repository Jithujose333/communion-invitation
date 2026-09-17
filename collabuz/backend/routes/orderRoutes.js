const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  getCollegeSales
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/college-sales', protect, authorize('college', 'admin'), getCollegeSales);

module.exports = router;
