const express = require('express');
const router = express.Router();
const { 
  createRazorpayOrder, 
  handleCOD,
  verifyFakePayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify-fake', protect, verifyFakePayment);
router.post('/cod', protect, handleCOD);

module.exports = router;
