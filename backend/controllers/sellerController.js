const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Get seller dashboard stats
// @route   GET /api/seller/stats
// @access  Private/Seller
const getSellerStats = async (req, res, next) => {
  try {
    const productsCount = await Product.countDocuments({ seller: req.user._id });
    
    // Find orders containing products from this seller
    const orders = await Order.find({ 'orderItems.seller': req.user._id });
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => !o.isDelivered).length;
    
    // Calculate revenue for this seller's products only
    let totalRevenue = 0;
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.seller?.toString() === req.user._id.toString()) {
          totalRevenue += item.price * item.qty;
        }
      });
    });

    const lowStockProducts = await Product.find({ 
      seller: req.user._id, 
      countInStock: { $lt: 5 } 
    });

    // Monthly analytics (Mock or simplified for now)
    const monthlySales = [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 2000 },
      { month: 'Apr', sales: 2780 },
      { month: 'May', sales: 1890 },
      { month: 'Jun', sales: 2390 },
    ];

    res.json({
      productsCount,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStockCount: lowStockProducts.length,
      monthlySales,
      recentProducts: await Product.find({ seller: req.user._id }).sort({ createdAt: -1 }).limit(5),
      recentOrders: await Order.find({ 'orderItems.seller': req.user._id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
      sellerStatus: req.user.sellerStatus || 'pending'
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

module.exports = {
  getSellerStats,
  getSellerProducts,
  getSellerOrders,
  updateSellerProfile,
};
