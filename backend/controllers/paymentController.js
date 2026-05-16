const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

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

module.exports = {
  verifyFakePayment,
  handleCOD,
  createRazorpayOrder: (req, res) => res.json({ id: 'fake_init_id' }) // Placeholder for API compatibility
};
