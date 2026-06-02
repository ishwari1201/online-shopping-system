const express = require('express');
const router = express.Router();
const {
  getSellerStats,
  getSellerProducts,
  getSellerOrders,
  updateSellerProfile,
  resubmitProduct,
  getSellerNotifications,
  markNotificationAsRead,
  updateSellerStock,
  getSellerEarnings,
  requestWithdrawal,
  getWithdrawals,
} = require('../controllers/sellerController');
const { getSellerSubscriptionStatus } = require('../controllers/subscriptionController');
const { protect, seller, sellerApproved } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/subscription/status', sellerApproved, getSellerSubscriptionStatus);

router.use(seller);

router.get('/dashboard/stats', getSellerStats);
router.get('/products', getSellerProducts);
router.patch('/products/:id/resubmit', resubmitProduct);
router.get('/orders', getSellerOrders);
router.get('/earnings', getSellerEarnings);
router.post('/withdraw', requestWithdrawal);
router.get('/withdrawals', getWithdrawals);
router.get('/inventory', getSellerProducts); // Reuse getSellerProducts for inventory
router.patch('/inventory/:id/stock', updateSellerStock);
router.put('/profile', updateSellerProfile);
router.get('/notifications', getSellerNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

module.exports = router;
