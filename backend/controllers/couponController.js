const Coupon = require('../models/couponModel');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  try {
    const { code, discount, expiryDate } = req.body;
    const couponExists = await Coupon.findOne({ code });
    if (couponExists) {
      res.status(400);
      throw new Error('Coupon code already exists');
    }
    const coupon = await Coupon.create({ code, discount, expiryDate });
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await Coupon.deleteOne({ _id: coupon._id });
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getCoupons, createCoupon, deleteCoupon };
