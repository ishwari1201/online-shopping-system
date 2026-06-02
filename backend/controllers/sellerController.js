const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const WithdrawalRequest = require('../models/withdrawalRequestModel');
const { isPlanExpired } = require('../utils/sellerSubscriptionUtils');

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard/stats
// @access  Private/Seller
const getSellerStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({ seller: req.user._id });
    const pendingProducts = await Product.countDocuments({ seller: req.user._id, status: 'Pending' });
    const lowStockCount = await Product.countDocuments({ 
      seller: req.user._id, 
      countInStock: { $lt: 5 } 
    });
    
    // Find orders containing products from this seller
    const orders = await Order.find({ 'orderItems.seller': req.user._id });
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status !== 'Delivered').length;
    
    // Calculate revenue for this seller's products only
    let totalRevenue = 0;
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.seller?.toString() === req.user._id.toString()) {
          totalRevenue += item.price * item.qty;
        }
      });
    });

    const recentOrders = await Order.find({ 'orderItems.seller': req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const monthlySales = [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 2000 },
      { month: 'Apr', sales: 2780 },
      { month: 'May', sales: totalRevenue > 0 ? totalRevenue : 1890 },
    ];

    const seller = await User.findById(req.user._id).select('-password');
    const productLimitDisplay =
      seller.productLimit >= 999999 ? 'Unlimited' : seller.productLimit;
    const remainingProducts =
      seller.productLimit >= 999999
        ? 'Unlimited'
        : Math.max(0, seller.productLimit - seller.productsUploaded);

    let walletEarnings = 0;
    orders.forEach((order) => {
      if (!order.isPaid) return;
      order.orderItems.forEach((item) => {
        if (item.seller?.toString() === req.user._id.toString()) {
          walletEarnings += item.sellerEarning ?? item.price * item.qty;
        }
      });
    });

    res.json({
      stats: {
        totalProducts,
        pendingProducts,
        lowStockCount,
        totalOrders,
        pendingOrders,
        totalRevenue,
        walletBalance: seller.walletBalance,
        walletEarnings,
      },
      subscription: {
        isSellerActive: seller.isSellerActive && !isPlanExpired(seller),
        subscriptionPlan: seller.subscriptionPlan,
        planAmount: seller.planAmount,
        productLimit: productLimitDisplay,
        productsUploaded: seller.productsUploaded,
        remainingProducts,
        commissionRate: seller.commissionRate,
        planExpiry: seller.planExpiry,
      },
      monthlySales,
      recentOrders,
      sellerStatus: seller.sellerStatus || 'pending',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller products
// @route   GET /api/seller/products
// @access  Private/Seller
const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private/Seller
const getSellerOrders = async (req, res, next) => {
  try {
    // Orders where at least one item belongs to this seller
    const orders = await Order.find({ 'orderItems.seller': req.user._id })
      .populate('user', 'name email');
    
    // Transform orders to show only relevant items for the seller
    const sellerOrders = orders.map(order => {
      const items = order.orderItems.filter(item => 
        item.seller?.toString() === req.user._id.toString()
      );
      return {
        ...order._doc,
        orderItems: items
      };
    });

    res.json(sellerOrders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private/Seller
const updateSellerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.sellerProfile.storeName = req.body.storeName || user.sellerProfile.storeName;
      user.sellerProfile.description = req.body.description || user.sellerProfile.description;
      user.sellerProfile.storeLogo = req.body.storeLogo || user.sellerProfile.storeLogo;
      user.sellerProfile.storeBanner = req.body.storeBanner || user.sellerProfile.storeBanner;
      
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Resubmit a rejected product
// @route   PATCH /api/seller/products/:id/resubmit
// @access  Private/Seller
const resubmitProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.seller.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
      }

      if (product.status !== 'Rejected') {
        res.status(400);
        throw new Error('Only rejected products can be resubmitted');
      }

      product.status = 'Pending';
      product.rejectionReason = undefined;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller notifications
// @route   GET /api/seller/notifications
// @access  Private/Seller
const getSellerNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/seller/notifications/:id/read
// @access  Private/Seller
const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      if (notification.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
      }

      notification.read = true;
      await notification.save();
      res.json({ message: 'Notification marked as read' });
    } else {
      res.status(404);
      throw new Error('Notification not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update Product Stock
// @route   PATCH /api/seller/inventory/:id/stock
// @access  Private/Seller
const updateSellerStock = async (req, res, next) => {
  try {
    const { countInStock } = req.body;
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    
    if (product) {
      product.countInStock = countInStock;
      await product.save();
      res.json({ message: 'Stock updated successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get Seller Earnings
// @route   GET /api/seller/earnings
// @access  Private/Seller
const getSellerEarnings = async (req, res, next) => {
  try {
    const seller = await User.findById(req.user._id).select('-password');
    const orders = await Order.find({
      'orderItems.seller': req.user._id,
      isPaid: true,
    }).sort({ createdAt: -1 });

    let totalOrderEarnings = 0;
    let totalCommissionPaid = 0;
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.seller?.toString() === req.user._id.toString()) {
          totalOrderEarnings += item.sellerEarning ?? item.price * item.qty;
          totalCommissionPaid += item.adminCommission ?? 0;
        }
      });
    });

    const withdrawals = await WithdrawalRequest.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      totalEarnings: totalOrderEarnings,
      walletBalance: seller.walletBalance,
      commissionRate: seller.commissionRate,
      totalCommissionPaid,
      subscriptionPlan: seller.subscriptionPlan,
      planExpiry: seller.planExpiry,
      payoutHistory: withdrawals,
    });
  } catch (error) {
    next(error);
  }
};

const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const seller = await User.findById(req.user._id);

    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error('Enter a valid withdrawal amount');
    }
    if (amount > seller.walletBalance) {
      res.status(400);
      throw new Error('Insufficient wallet balance');
    }

    seller.walletBalance -= amount;
    await seller.save();

    const request = await WithdrawalRequest.create({
      seller: req.user._id,
      amount,
      status: 'Pending',
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const getWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await WithdrawalRequest.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(withdrawals);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
