const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  assignDeliveryPartner,
  updateDeliveryStatus,
  generateOTP
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/my-orders').get(protect, getMyOrders);
router.route('/mine').get(protect, getMyOrders); // Keep for compatibility
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/assign-delivery').patch(protect, admin, assignDeliveryPartner);
router.route('/:id/delivery-status').patch(protect, updateDeliveryStatus);
router.route('/:id/generate-otp').post(protect, generateOTP);

module.exports = router;
