const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
};

// --- NEW DELIVERY & MARKETPLACE FEATURES ---

// @desc    Assign Delivery Partner to Order
// @route   PATCH /api/orders/:id/assign-delivery
// @access  Private/Admin
const assignDeliveryPartner = async (req, res) => {
  const { deliveryPartnerId } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    order.deliveryPartner = deliveryPartnerId;
    order.deliveryStatus = 'Assigned';
    order.deliveryOTP = otp;
    order.deliveryTimeline.push({
      status: 'Assigned',
      timestamp: Date.now(),
      description: 'Order assigned to delivery partner. OTP generated for customer.'
    });

    await order.save();
    
    // Notify Delivery Partner
    await Notification.create({
      user: deliveryPartnerId,
      order: order._id,
      title: 'New Task Assigned',
      message: `You have a new delivery task: Order #${String(order._id).slice(-6).toUpperCase()}`,
      type: 'info'
    });

    res.json({ message: 'Partner assigned and OTP generated' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update Delivery Status
// @route   PATCH /api/orders/:id/delivery-status
// @access  Private/Delivery
const updateDeliveryStatus = async (req, res) => {
  const { status, otp } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // OTP Verification for 'Delivered' status
  if (status === 'Delivered') {
    if (otp !== order.deliveryOTP) {
      return res.status(400).json({ message: 'Invalid OTP. Delivery cannot be completed.' });
    }
  }

  order.deliveryStatus = status;
  
  let description = `Order status updated to ${status}`;
  if (status === 'Picked Up') description = 'Partner has picked up your order from the seller.';
  if (status === 'Out For Delivery') description = 'Partner is on the way to your location.';
  if (status === 'Delivered') {
    description = 'Order delivered successfully. Thank you for shopping!';
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    // If Cash on Delivery, mark payment as paid upon successful delivery
    if (order.paymentMethod === 'Cash on Delivery') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentStatus = 'Paid';
    }

    // Update Delivery Partner Earnings (₹50 per delivery)
    const partner = await User.findById(order.deliveryPartner);
    if (partner) {
      partner.earnings = (partner.earnings || 0) + 50;
      await partner.save();
    }

    // Notify Admin & Seller
    const admin = await User.findOne({ role: 'admin' });
    await Notification.create({
      user: admin._id,
      order: order._id,
      title: 'Order Delivered',
      message: `Order #${String(order._id).slice(-6).toUpperCase()} was delivered successfully.`,
      type: 'success'
    });
  }

  order.deliveryTimeline.push({
    status,
    timestamp: Date.now(),
    description
  });

  await order.save();

  // Notify Customer
  await Notification.create({
    user: order.user._id,
    order: order._id,
    title: `Order Update: ${status}`,
    message: description,
    type: 'info'
  });

  res.json({ message: `Status updated to ${status}`, order });
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate 4-digit Delivery OTP
// @route   POST /api/orders/:id/generate-otp
// @access  Private
const generateOTP = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (order.deliveryStatus !== 'Out For Delivery') {
      return res.status(400).json({ message: 'OTP can only be generated when order is Out For Delivery' });
    }

    // Generate random 4-digit OTP as STRING
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOTP = otp;
    order.otpVerified = false; // Reset verification status if new OTP is generated
    
    await order.save();
    console.log(`OTP generated for Order ${order._id}: ${otp}`);
    res.json({ otp, message: 'OTP generated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  assignDeliveryPartner,
  updateDeliveryStatus,
  getMyOrders,
  generateOTP
};
