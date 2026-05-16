const express = require('express');
const router = express.Router();
const { 
  getAdminDashboardStats, 
  updateSellerStatus, 
  getSellers,
  getDeliveryPartners,
  updateDeliveryPartnerStatus,
  assignDeliveryBoy,
  getAdminProducts,
  approveProduct,
  rejectProduct,
  toggleProductStatus,
  getAdminAnalytics,
  getAdminUsers,
  updateUserStatus,
  getInventory,
  updateStock,
  getAdminOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/dashboard/stats').get(protect, admin, getAdminDashboardStats);
router.route('/analytics').get(protect, admin, getAdminAnalytics);
router.route('/users').get(protect, admin, getAdminUsers);
router.route('/users/:id/status').patch(protect, admin, updateUserStatus);
router.route('/inventory').get(protect, admin, getInventory);
router.route('/inventory/:id/stock').patch(protect, admin, updateStock);
router.route('/orders').get(protect, admin, getAdminOrders);
router.route('/orders/:id/status').patch(protect, admin, updateOrderStatus);
router.route('/sellers').get(protect, admin, getSellers);
router.route('/sellers/:id/status').put(protect, admin, updateSellerStatus);
router.route('/delivery').get(protect, admin, getDeliveryPartners);
router.route('/delivery/:id/status').put(protect, admin, updateDeliveryPartnerStatus);
router.route('/orders/:id/assign').put(protect, admin, assignDeliveryBoy);
router.route('/products').get(protect, admin, getAdminProducts);
router.route('/products/:id/approve').patch(protect, admin, approveProduct);
router.route('/products/:id/reject').patch(protect, admin, rejectProduct);
router.route('/products/:id/toggle').patch(protect, admin, toggleProductStatus);

module.exports = router;
