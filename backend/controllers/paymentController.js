const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

// @desc    Process Fake Payment and Create Order
// @route   POST /api/payment/verify-fake
// @access  Private
const verifyFakePayment = async (req, res, next) => {
  try {
    const { orderData, paymentMethod } = req.body;

    // 1. CREATE ORDER IN DATABASE (Real Order, Real Data)
    const order = new Order({
      user: req.user._id,
      orderItems: orderData.orderItems.map(item => ({
        name: item.name,
        qty: Number(item.qty),
        image: item.image,
        price: Number(item.price),
        product: item._id, 
        seller: item.seller || item.user || req.user._id
      })),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: paymentMethod || 'Fake Razorpay',
      paymentId: `fake_pay_${Date.now()}`,
      razorpayOrderId: `fake_ord_${Date.now()}`,
      paymentStatus: 'Paid',
      taxPrice: Number(orderData.taxPrice) || 0,
      shippingPrice: Number(orderData.shippingPrice) || 0,
      totalPrice: Number(orderData.totalPrice) || 0,
      isPaid: true,
      paidAt: Date.now(),
      deliveryTimeline: [{
        status: 'Pending',
        timestamp: Date.now(),
        description: 'Payment successful. Order being processed.'
      }]
    });

    const createdOrder = await order.save();

    // 2. INVENTORY REDUCTION & STATUS UPDATE
    for (const item of createdOrder.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.qty;
        
        if (product.countInStock <= 0) {
          product.countInStock = 0;
          product.status = 'OutOfStock';
        }
        
        await product.save();

        // Notify Seller
        await Notification.create({
          user: product.seller || product.user,
          title: 'New Order Received',
          message: `Order #${createdOrder._id} for ${item.name} placed successfully.`,
          type: 'success'
        });
      }
    }

    // 3. NOTIFY ADMIN
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await Notification.create({
        user: adminUser._id,
        order: createdOrder._id,
        title: 'New Order Received',
        message: `Customer ${req.user.name} placed a new order of $${createdOrder.totalPrice}`,
        type: 'success'
      });
    }

    res.status(201).json({
      success: true,
      order: createdOrder
    });

  } catch (error) {
    console.error('Payment Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Handle COD Order
const handleCOD = async (req, res, next) => {
    // Keep COD logic similar but use same mapping
    try {
      const { orderData } = req.body;
      const order = new Order({
        user: req.user._id,
        orderItems: orderData.orderItems.map(item => ({
          name: item.name,
          qty: Number(item.qty),
          image: item.image,
          price: Number(item.price),
          product: item._id,
          seller: item.seller || item.user
        })),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'COD',
        taxPrice: Number(orderData.taxPrice) || 0,
        shippingPrice: Number(orderData.shippingPrice) || 0,
        totalPrice: Number(orderData.totalPrice) || 0,
        deliveryTimeline: [{
          status: 'Pending',
          timestamp: Date.now(),
          description: 'COD Order placed.'
        }]
      });
      const createdOrder = await order.save();
      res.status(201).json({ success: true, order: createdOrder });
    } catch (error) {
      next(error);
    }
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment and Create Order
// @route   POST /api/payment/verify
// @access  Private
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderData 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment credentials are required' });
    }

    // 1. CRYPTOGRAPHIC SIGNATURE VERIFICATION
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
    }

    // 2. CREATE ORDER IN DATABASE (Only after signature is verified successfully)
    const order = new Order({
      user: req.user._id,
      orderItems: orderData.orderItems.map(item => ({
        name: item.name,
        qty: Number(item.qty),
        image: item.image,
        price: Number(item.price),
        product: item._id, 
        seller: item.seller || item.user || req.user._id
      })),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: 'Razorpay',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: 'Paid',
      taxPrice: Number(orderData.taxPrice) || 0,
      shippingPrice: Number(orderData.shippingPrice) || 0,
      totalPrice: Number(orderData.totalPrice) || 0,
      isPaid: true,
      paidAt: Date.now(),
      deliveryTimeline: [{
        status: 'Pending',
        timestamp: Date.now(),
        description: 'Payment verified successfully. Order being processed.'
      }]
    });

    const createdOrder = await order.save();

    // 3. INVENTORY REDUCTION & STATUS UPDATE
    for (const item of createdOrder.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.qty;
        
        if (product.countInStock <= 0) {
          product.countInStock = 0;
          product.status = 'OutOfStock';
        }
        
        await product.save();

        // Notify Seller
        await Notification.create({
          user: product.seller || product.user,
          title: 'New Order Received',
          message: `Order #${createdOrder._id} for ${item.name} placed successfully.`,
          type: 'success'
        });
      }
    }

    // 4. NOTIFY ADMIN
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await Notification.create({
        user: adminUser._id,
        order: createdOrder._id,
        title: 'New Order Received',
        message: `Customer ${req.user.name} placed a new order of ₹${createdOrder.totalPrice}`,
        type: 'success'
      });
    }

    res.status(201).json({
      success: true,
      order: createdOrder
    });

  } catch (error) {
    console.error('Payment Verification Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  verifyFakePayment,
  handleCOD,
  createRazorpayOrder,
  verifyRazorpayPayment
};
