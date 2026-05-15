const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  updateSellerStatus, 
  getSellers,
  getDeliveryPartners,
  updateDeliveryPartnerStatus,
  assignDeliveryBoy
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, admin, getAdminStats);
router.route('/sellers').get(protect, admin, getSellers);
router.route('/sellers/:id/status').put(protect, admin, updateSellerStatus);
router.route('/delivery').get(protect, admin, getDeliveryPartners);
router.route('/delivery/:id/status').put(protect, admin, updateDeliveryPartnerStatus);
router.route('/orders/:id/assign').put(protect, admin, assignDeliveryBoy);

module.exports = router;
