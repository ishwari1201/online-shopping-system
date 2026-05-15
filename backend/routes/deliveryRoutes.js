const express = require('express');
const router = express.Router();
const {
  getDeliveryStats,
  getAssignedOrders,
  updateDeliveryStatus,
} = require('../controllers/deliveryController');
const { protect, delivery } = require('../middleware/authMiddleware');

router.use(protect);
router.use(delivery);

router.get('/stats', getDeliveryStats);
router.get('/orders', getAssignedOrders);
router.put('/orders/:id/status', updateDeliveryStatus);

module.exports = router;
