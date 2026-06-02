const Order = require('../models/orderModel');
const {
  buildCommissionedOrderItems,
  creditSellerWallets,
  reduceInventoryAndNotify,
} = require('../utils/orderPaymentUtils');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

const createOrderFromPayment = async (req, orderData, paymentFields) => {
  const { orderItems, orderAdminCommission, orderSellerEarning } =
    await buildCommissionedOrderItems(orderData.orderItems);

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: paymentFields.paymentMethod,
    paymentId: paymentFields.paymentId,
    razorpayOrderId: paymentFields.razorpayOrderId,
    razorpayPaymentId: paymentFields.razorpayPaymentId,
    paymentStatus: paymentFields.paymentStatus || 'Paid',
    taxPrice: Number(orderData.taxPrice) || 0,
    shippingPrice: Number(orderData.shippingPrice) || 0,
    totalPrice: Number(orderData.totalPrice) || 0,
    adminCommission: orderAdminCommission,
    sellerEarning: orderSellerEarning,
    isPaid: paymentFields.isPaid !== false,
    paidAt: paymentFields.isPaid !== false ? Date.now() : undefined,
    deliveryTimeline: [
      {
        status: 'Pending',
        timestamp: Date.now(),
        description: paymentFields.timelineNote || 'Order placed successfully.',
      },
    ],
  });

  const createdOrder = await order.save();

  if (createdOrder.isPaid) {
    await creditSellerWallets(createdOrder.orderItems);
    await reduceInventoryAndNotify(createdOrder, req.user.name);
  }

  return createdOrder;
};

const verifyFakePayment = async (req, res, next) => {
  try {
    const { orderData, paymentMethod } = req.body;
    const createdOrder = await createOrderFromPayment(req, orderData, {
      paymentMethod: paymentMethod || 'Fake Razorpay',
      paymentId: `fake_pay_${Date.now()}`,
      razorpayOrderId: `fake_ord_${Date.now()}`,
      paymentStatus: 'Paid',
      isPaid: true,
      timelineNote: 'Payment successful. Order being processed.',
    });

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    console.error('Payment Error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

const handleCOD = async (req, res, next) => {
  try {
    const { orderData } = req.body;
    const createdOrder = await createOrderFromPayment(req, orderData, {
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'COD',
      isPaid: false,
      timelineNote: 'COD Order placed.',
    });

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    next(error);
  }
};

const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: 'Payment credentials are required' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: 'Payment verification failed: Signature mismatch' });
    }

    const createdOrder = await createOrderFromPayment(req, orderData, {
      paymentMethod: 'Razorpay',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: 'Paid',
      isPaid: true,
      timelineNote: 'Payment verified successfully. Order being processed.',
    });

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    console.error('Payment Verification Error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  verifyFakePayment,
  handleCOD,
  createRazorpayOrder,
  verifyRazorpayPayment,
};
