const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  registerSeller,
  registerDelivery,
  logoutUser,
  getUserProfile,
  getUsers,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/seller-register', registerSeller);
router.post('/delivery-register', registerDelivery);
router.route('/:id').delete(protect, admin, deleteUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
