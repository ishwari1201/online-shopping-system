const express = require('express');
const router = express.Router();
const {
  getSellerStats,
  getSellerProducts,
  getSellerOrders,
  updateSellerProfile,
} = require('../controllers/sellerController');
const { protect, seller } = require('../middleware/authMiddleware');

router.use(protect);
router.use(seller);

router.get('/stats', getSellerStats);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.put('/profile', updateSellerProfile);

module.exports = router;
