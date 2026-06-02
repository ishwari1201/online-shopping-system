const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'wearify_secret');

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

// Admin middleware
const admin = (req, res, next) => {
  console.log('Checking admin role for user:', req.user?._id, 'Role:', req.user?.role);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    const error = new Error('Not authorized as an admin');
    next(error);
  }
};

// Seller approved by admin (subscription purchase allowed)
const sellerApproved = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  if (req.user && req.user.role === 'seller') {
    if (req.user.sellerStatus !== 'approved') {
      res.status(401);
      return next(new Error(`Seller account is ${req.user.sellerStatus || 'pending approval'}`));
    }
    return next();
  }
  res.status(401);
  next(new Error('Not authorized as a seller'));
};

// Seller with active subscription (dashboard, products, orders)
const seller = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  if (req.user && req.user.role === 'seller') {
    if (req.user.sellerStatus !== 'approved') {
      res.status(401);
      return next(new Error(`Seller account is ${req.user.sellerStatus || 'pending approval'}`));
    }
    const expired = req.user.planExpiry && new Date(req.user.planExpiry) < new Date();
    if (!req.user.isSellerActive || expired) {
      res.status(403);
      return next(
        new Error('Active subscription required. Please purchase a seller plan.')
      );
    }
    return next();
  }
  res.status(401);
  next(new Error('Not authorized as a seller'));
};

// Delivery middleware
const delivery = (req, res, next) => {
  console.log('Checking delivery role for user:', req.user?._id, 'Role:', req.user?.role);
  if (req.user && (req.user.role === 'delivery' || req.user.role === 'admin')) {
    if (req.user.role === 'delivery' && req.user.deliveryStatus !== 'approved') {
      res.status(401);
      return next(new Error(`Delivery account is ${req.user.deliveryStatus || 'pending approval'}`));
    }
    next();
  } else {
    res.status(401);
    const error = new Error('Not authorized as a delivery partner');
    next(error);
  }
};

module.exports = { protect, admin, seller, sellerApproved, delivery };
