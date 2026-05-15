const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Get delivery dashboard stats
// @route   GET /api/delivery/stats
// @access  Private/Delivery
const getDeliveryStats = async (req, res, next) => {
  try {
    const assignedOrders = await Order.find({ 
      deliveryBoy: req.user._id, 
      deliveryStatus: { $in: ['Assigned', 'Picked Up', 'Out For Delivery'] } 
    });

    const completedOrders = await Order.find({ 
      deliveryBoy: req.user._id, 
      deliveryStatus: 'Delivered' 
    });

    const failedOrders = await Order.find({ 
      deliveryBoy: req.user._id, 
      deliveryStatus: 'Failed' 
    });

    // Mock earnings calculation: $5 per delivery
    const earnings = completedOrders.length * 5;

    res.json({
      assignedCount: assignedOrders.length,
      completedCount: completedOrders.length,
      failedCount: failedOrders.length,
      earnings,
      recentDeliveries: completedOrders.slice(-5)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned orders
// @route   GET /api/delivery/orders
// @access  Private/Delivery
const getAssignedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 
      deliveryBoy: req.user._id,
      deliveryStatus: { $ne: 'Delivered' }
    }).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status
// @route   PUT /api/delivery/orders/:id/status
// @access  Private/Delivery
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, failureReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.deliveryBoy.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this order');
      }

      order.deliveryStatus = status;
      
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        // If COD, mark as paid
        if (order.paymentMethod === 'COD') {
          order.isPaid = true;
          order.paidAt = Date.now();
        }
      }

      if (status === 'Failed') {
        order.failureReason = failureReason;
      }

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
  getDeliveryStats,
  getAssignedOrders,
  updateDeliveryStatus,
};
