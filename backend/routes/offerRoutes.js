const express = require('express');
const router = express.Router();
const {
  createOffer,
  updateOffer,
  getMyOffers,
  getOfferById,
  deleteOffer,
  getAllOffers,
  approveOffer,
  rejectOffer,
  toggleOfferStatus,
  getActiveOffers,
  getOfferDetailsBySlug,
} = require('../controllers/offerController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/active', getActiveOffers);
router.get('/slug/:slug', getOfferDetailsBySlug);

// Private Seller/Admin endpoints
router.post('/', protect, seller, createOffer);
router.get('/my', protect, seller, getMyOffers);

// Private Admin endpoints
router.get('/admin', protect, admin, getAllOffers);
router.patch('/:id/approve', protect, admin, approveOffer);
router.patch('/:id/reject', protect, admin, rejectOffer);
router.patch('/:id/toggle', protect, admin, toggleOfferStatus);

// Private shared Detail/Edit/Delete endpoints
router.route('/:id')
  .get(protect, getOfferById)
  .put(protect, updateOffer)
  .delete(protect, deleteOffer);

module.exports = router;
