const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  handleCOD,
  verifyFakePayment,
  verifyRazorpayPayment,
} = require('../controllers/paymentController');
const {
  getSubscriptionPlans,
  createSubscriptionRazorpayOrder,
  verifySubscriptionPayment,
  verifyFakeSubscriptionPayment,
} = require('../controllers/subscriptionController');
const { protect, sellerApproved } = require('../middleware/authMiddleware');

router.get('/key', protect, (req, res) => res.json({ key: process.env.RAZORPAY_KEY_ID }));
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify-fake', protect, verifyFakePayment);
router.post('/verify', protect, verifyRazorpayPayment);
router.post('/cod', protect, handleCOD);

router.get('/subscription/plans', protect, sellerApproved, getSubscriptionPlans);
router.post('/subscription/create-order', protect, sellerApproved, createSubscriptionRazorpayOrder);
router.post('/subscription/verify', protect, sellerApproved, verifySubscriptionPayment);
router.post('/subscription/verify-fake', protect, sellerApproved, verifyFakeSubscriptionPayment);

module.exports = router;
