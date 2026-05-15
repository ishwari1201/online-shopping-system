const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const salesData = [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 5000 },
      { name: 'Apr', sales: 4500 },
      { name: 'May', sales: totalRevenue > 0 ? totalRevenue : 6000 },
    ];

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      salesData
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
      user.isSellerApproved = (status === 'approved');
      
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
      order.deliveryBoy = deliveryBoyId;
      order.deliveryStatus = 'Assigned';
      
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

module.exports = {
  getAdminStats,
  updateSellerStatus,
  getSellers,
  updateDeliveryPartnerStatus,
  getDeliveryPartners,
  assignDeliveryBoy
};
