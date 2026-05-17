const express = require('express');
const router = express.Router();
const { 
  createRazorpayOrder, 
  handleCOD,
  verifyFakePayment,
  verifyRazorpayPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/key', protect, (req, res) => res.json({ key: process.env.RAZORPAY_KEY_ID }));
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify-fake', protect, verifyFakePayment);
router.post('/verify', protect, verifyRazorpayPayment);
router.post('/cod', protect, handleCOD);

module.exports = router;
