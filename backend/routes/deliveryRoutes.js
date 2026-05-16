const express = require('express');
const router = express.Router();
const {
  getDeliveryStats,
  getAssignedOrders,
  updateDeliveryStatus,
  getDeliveryHistory,
  getDeliveryEarnings
} = require('../controllers/deliveryController');
const { protect, delivery } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, delivery, getDeliveryStats);
router.get('/orders', protect, delivery, getAssignedOrders);
router.patch('/orders/:id/status', protect, delivery, updateDeliveryStatus);
router.get('/history', protect, delivery, getDeliveryHistory);
router.get('/earnings', protect, delivery, getDeliveryEarnings);

module.exports = router;
