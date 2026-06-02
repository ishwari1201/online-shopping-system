const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getAllReviews,
  deleteReview,
  getSimilarProducts,
  getStyleWithProducts,
} = require('../controllers/productController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/top').get(getTopProducts);
router.route('/:id/similar').get(getSimilarProducts);
router.route('/:id/style-with').get(getStyleWithProducts);
router.route('/:id/stylewith').get(getStyleWithProducts);
router.route('/reviews').get(protect, admin, getAllReviews);
router.route('/:productId/reviews/:reviewId').delete(protect, admin, deleteReview);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
