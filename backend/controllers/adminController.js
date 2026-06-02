const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Notification = require('../models/notificationModel');
const SubscriptionPayment = require('../models/subscriptionPaymentModel');
const { creditSellerWallets } = require('../utils/orderPaymentUtils');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: 'Pending' });
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 5 } });
    
    const orders = await Order.find({ isPaid: true });
    const allOrders = await Order.find({});
    const totalOrders = allOrders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const commissionRevenue = orders.reduce(
      (acc, order) => acc + (order.adminCommission || 0),
      0
    );
    const subscriptionRevenue = await SubscriptionPayment.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const topSellingProducts = await Product.find({})
      .sort({ rating: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue,
        commissionRevenue,
        subscriptionRevenue: subscriptionRevenue[0]?.total || 0,
        totalPlatformRevenue:
          (subscriptionRevenue[0]?.total || 0) + commissionRevenue,
        pendingProducts,
        lowStockProducts
      },
      recentOrders,
      topSellingProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update seller status
// @route   PUT /api/admin/sellers/:id/status
// @access  Private/Admin
const updateSellerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    console.log('Admin updating seller:', req.params.id, 'to status:', status);
    
    const user = await User.findById(req.params.id);

    if (user && user.role === 'seller') {
      user.sellerStatus = status;
      user.isSellerApproved = status === 'approved';
      if (status !== 'approved') {
        user.isSellerActive = false;
      }
      
      const updatedUser = await user.save();
      console.log('Seller updated successfully:', updatedUser._id);
      return res.json(updatedUser);
    } else {
      console.log('Seller not found or role mismatch:', req.params.id);
      return res.status(404).json({ message: 'Seller not found or not a seller role' });
    }
  } catch (error) {
    console.error('Controller Error (updateSellerStatus):', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sellers
// @route   GET /api/admin/sellers
// @access  Private/Admin
const getSellers = async (req, res, next) => {
  try {
    const sellers = await User.find({ role: 'seller' });
    return res.json(sellers);
  } catch (error) {
    console.error('Controller Error (getSellers):', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery partner status
// @route   PUT /api/admin/delivery/:id/status
// @access  Private/Admin
const updateDeliveryPartnerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (user && user.role === 'delivery') {
      user.deliveryStatus = status;
      if (status === 'approved') {
        user.isDeliveryApproved = true;
      } else {
        user.isDeliveryApproved = false;
      }
      
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('Delivery partner not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all delivery partners
// @route   GET /api/admin/delivery
// @access  Private/Admin
const getDeliveryPartners = async (req, res, next) => {
  try {
    const partners = await User.find({ role: 'delivery' });
    res.json(partners);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign delivery partner to order
// @route   PUT /api/admin/orders/:id/assign
// @access  Private/Admin
const assignDeliveryBoy = async (req, res, next) => {
  try {
    const { deliveryBoyId } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.deliveryPartner = deliveryBoyId;
      order.deliveryStatus = 'Assigned';
      
      // Add to timeline
      order.deliveryTimeline.push({
        status: 'Assigned',
        timestamp: Date.now(),
        description: 'Delivery partner has been assigned to this order.'
      });
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
const getAdminProducts = async (req, res, next) => {
  try {
    const { status, seller } = req.query;
    const query = {};
    if (status) query.status = status;
    if (seller) query.seller = seller;

    const products = await Product.find(query)
      .populate('seller', 'name email sellerProfile.storeName')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a product
// @route   PATCH /api/admin/products/:id/approve
// @access  Private/Admin
const approveProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.status = 'Approved';
      product.approvedBy = req.user._id;
      product.rejectionReason = undefined;

      const updatedProduct = await product.save();

      // Create notification for seller
      await Notification.create({
        user: product.seller,
        title: 'Product Approved',
        message: `Your product "${product.name}" has been approved and is now live.`,
        type: 'success',
      });

      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a product
// @route   PATCH /api/admin/products/:id/reject
// @access  Private/Admin
const rejectProduct = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.status = 'Rejected';
      product.rejectionReason = reason;

      const updatedProduct = await product.save();

      // Create notification for seller
      await Notification.create({
        user: product.seller,
        title: 'Product Rejected',
        message: `Your product "${product.name}" was rejected. Reason: ${reason}`,
        type: 'error',
      });

      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product status (Enable/Disable)
// @route   PATCH /api/admin/products/:id/toggle
// @access  Private/Admin
const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.status === 'Approved') {
        product.status = 'Disabled';
      } else if (product.status === 'Disabled') {
        product.status = 'Approved';
      } else {
        res.status(400);
        throw new Error('Only approved or disabled products can be toggled');
      }

      const updatedProduct = await product.save();

      // Create notification for seller
      await Notification.create({
        user: product.seller,
        title: `Product ${product.status}`,
        message: `Your product "${product.name}" has been ${product.status.toLowerCase()}.`,
        type: product.status === 'Approved' ? 'success' : 'warning',
      });

      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAdminAnalytics = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, isPaid: true } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
          commission: { $sum: '$adminCommission' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const paidOrders = await Order.find({ isPaid: true });
    const subscriptionAgg = await SubscriptionPayment.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    const commissionRevenue = paidOrders.reduce(
      (acc, o) => acc + (o.adminCommission || 0),
      0
    );
    const orderRevenue = paidOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    const subscriptionRevenue = subscriptionAgg[0]?.total || 0;

    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalOrders = await Order.countDocuments();

    const productAnalytics = await Product.find({})
      .populate('seller', 'name email sellerProfile.storeName subscriptionPlan commissionRate')
      .select('name price countInStock status seller');

    const productStats = await Promise.all(
      productAnalytics.map(async (product) => {
        const orders = await Order.find({
          isPaid: true,
          'orderItems.product': product._id,
        });
        let totalSales = 0;
        let revenue = 0;
        let adminCommission = 0;
        let sellerEarning = 0;
        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            if (item.product?.toString() === product._id.toString()) {
              totalSales += item.qty;
              revenue += item.lineTotal || item.price * item.qty;
              adminCommission += item.adminCommission || 0;
              sellerEarning += item.sellerEarning || 0;
            }
          });
        });
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          countInStock: product.countInStock,
          status: product.status,
          sellerName:
            product.seller?.sellerProfile?.storeName || product.seller?.name || 'N/A',
          totalSales,
          revenue,
          adminCommission,
          sellerEarning,
        };
      })
    );

    const sellers = await User.find({ role: 'seller' }).select(
      '-password'
    );
    const sellerAnalytics = await Promise.all(
      sellers.map(async (seller) => {
        const orders = await Order.find({
          isPaid: true,
          'orderItems.seller': seller._id,
        });
        let sellerRevenue = 0;
        let adminCommission = 0;
        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            if (item.seller?.toString() === seller._id.toString()) {
              sellerRevenue += item.sellerEarning ?? item.price * item.qty;
              adminCommission += item.adminCommission ?? 0;
            }
          });
        });
        return {
          _id: seller._id,
          name: seller.name,
          email: seller.email,
          storeName: seller.sellerProfile?.storeName,
          sellerStatus: seller.sellerStatus,
          subscriptionPlan: seller.subscriptionPlan,
          planExpiry: seller.planExpiry,
          commissionRate: seller.commissionRate,
          isSellerActive: seller.isSellerActive,
          sellerRevenue,
          adminCommission,
          walletBalance: seller.walletBalance,
        };
      })
    );

    res.json({
      salesData,
      summary: {
        totalRevenue: orderRevenue + subscriptionRevenue,
        orderRevenue,
        subscriptionRevenue,
        commissionRevenue,
        totalUsers,
        totalSellers,
        totalOrders,
      },
      productAnalytics: productStats,
      sellerAnalytics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Status (Block/Unblock)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}` });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory
// @route   GET /api/admin/inventory
// @access  Private/Admin
const getInventory = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate('seller', 'name email sellerProfile.storeName')
      .sort({ countInStock: 1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Stock
// @route   PATCH /api/admin/inventory/:id/stock
// @access  Private/Admin
const updateStock = async (req, res, next) => {
  try {
    const { countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.countInStock = countInStock;
      await product.save();
      res.json({ message: 'Stock updated successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Order Status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        
        // If Cash on Delivery, mark payment as paid upon successful delivery
        if (order.paymentMethod === 'Cash on Delivery' && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentStatus = 'Paid';
          await creditSellerWallets(order.orderItems);
        }
      }
      await order.save();
      res.json({ message: 'Order status updated' });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  updateSellerStatus,
  getSellers,
  updateDeliveryPartnerStatus,
  getDeliveryPartners,
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
};
