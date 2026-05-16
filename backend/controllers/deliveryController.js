const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// @desc    Get delivery dashboard stats
// @route   GET /api/delivery/dashboard
// @access  Private/Delivery
const getDeliveryStats = async (req, res, next) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user._id });
    const user = await User.findById(req.user._id);
    
    const stats = {
      assigned: orders.filter(o => o.deliveryStatus === 'Assigned').length,
      pending: orders.filter(o => ['Accepted', 'Picked Up', 'Out For Delivery'].includes(o.deliveryStatus)).length,
      delivered: orders.filter(o => o.deliveryStatus === 'Delivered').length,
      totalEarnings: user.earnings || 0,
      recentDeliveries: orders.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5)
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned orders
const getAssignedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 
      deliveryPartner: req.user._id,
      deliveryStatus: { $ne: 'Delivered' } 
    }).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status (with OTP for final delivery)
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, otp } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.deliveryPartner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    // Debug Logs as requested
    console.log('--- OTP VERIFICATION DEBUG ---');
    console.log('Request Body:', req.body);
    console.log('Order OTP in DB:', order.deliveryOTP);
    console.log('OTP from Partner:', otp);

    // OTP Verification with String conversion fix
    if (status === 'Delivered') {
      if (!otp) {
        return res.status(400).json({ success: false, message: 'OTP is required for delivery' });
      }
      
      if (String(order.deliveryOTP) !== String(otp)) {
        console.log('VERIFICATION FAILED: Mismatch detected');
        return res.status(400).json({ success: false, message: 'Invalid OTP. Please check with customer.' });
      }
      
      console.log('VERIFICATION SUCCESS: OTP matched');
      order.otpVerified = true;
    }

    order.deliveryStatus = status;
    let description = `Delivery status: ${status}`;
    
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = 'Delivered';
      
      // Update Earnings
      const partner = await User.findById(req.user._id);
      partner.earnings = (partner.earnings || 0) + 50;
      await partner.save();

      // Notify Admin
      const admin = await User.findOne({ role: 'admin' });
      await Notification.create({
        user: admin._id,
        order: order._id,
        title: 'Order Delivered',
        message: `Order #${String(order._id).slice(-6).toUpperCase()} was delivered.`,
        type: 'success'
      });
    }

    order.deliveryTimeline.push({
      status,
      timestamp: Date.now(),
      description: description
    });

    await order.save();

    // Notify Customer
    await Notification.create({
      user: order.user._id,
      order: order._id,
      title: `Order ${status}`,
      message: `Your order status has been updated to: ${status}`,
      type: 'info'
    });

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get delivery history
const getDeliveryHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ 
      deliveryPartner: req.user._id,
      deliveryStatus: 'Delivered' 
    }).sort({ updatedAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get delivery earnings
const getDeliveryEarnings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const orders = await Order.find({ deliveryPartner: req.user._id, deliveryStatus: 'Delivered' });
    
    res.json({
      total: user.earnings || 0,
      count: orders.length,
      history: orders.map(o => ({
        orderId: o._id,
        amount: 50,
        date: o.deliveredAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDeliveryStats,
  getAssignedOrders,
  updateDeliveryStatus,
  getDeliveryHistory,
  getDeliveryEarnings
};
