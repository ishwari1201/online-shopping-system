const crypto = require('crypto');
const User = require('../models/userModel');
const SubscriptionPayment = require('../models/subscriptionPaymentModel');
const razorpay = require('../config/razorpay');
const { getAllPlans, getPlanById } = require('../constants/sellerPlans');
const { activateSellerPlan, isPlanExpired } = require('../utils/sellerSubscriptionUtils');

const getSubscriptionPlans = async (req, res) => {
  res.json({ plans: getAllPlans() });
};

const getSellerSubscriptionStatus = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user || user.role !== 'seller') {
    return res.status(403).json({ message: 'Not a seller account' });
  }

  const { syncProductsUploaded } = require('../utils/sellerSubscriptionUtils');
  user.productsUploaded = await syncProductsUploaded(user._id);

  const expired = user.isSellerActive && isPlanExpired(user);
  if (expired && user.isSellerActive) {
    user.isSellerActive = false;
  }
  await user.save();

  res.json({
    sellerStatus: user.sellerStatus,
    isSellerApproved: user.isSellerApproved,
    isSellerActive: user.isSellerActive && !isPlanExpired(user),
    subscriptionPlan: user.subscriptionPlan,
    planAmount: user.planAmount,
    productLimit: user.productLimit,
    productsUploaded: user.productsUploaded,
    commissionRate: user.commissionRate,
    planExpiry: user.planExpiry,
    walletBalance: user.walletBalance,
    canUpload:
      user.sellerStatus === 'approved' &&
      user.isSellerActive &&
      !isPlanExpired(user) &&
      (user.productLimit >= 999999 || user.productsUploaded < user.productLimit),
  });
};

const createSubscriptionRazorpayOrder = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const plan = getPlanById(planId);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    if (req.user.sellerStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Seller must be approved by admin before purchasing a plan',
      });
    }

    const options = {
      amount: Math.round(plan.price * 100),
      currency: 'INR',
      receipt: `sub_${req.user._id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await SubscriptionPayment.create({
      seller: req.user._id,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      razorpayOrderId: order.id,
      status: 'Pending',
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

const finalizeSubscriptionPayment = async (sellerId, planId, paymentMeta) => {
  const plan = getPlanById(planId);
  if (!plan) throw new Error('Invalid plan');

  const user = await User.findById(sellerId);
  if (!user) throw new Error('Seller not found');

  await activateSellerPlan(user, planId);

  if (paymentMeta?.razorpayOrderId) {
    await SubscriptionPayment.findOneAndUpdate(
      { razorpayOrderId: paymentMeta.razorpayOrderId, seller: sellerId },
      {
        status: 'Paid',
        razorpayPaymentId: paymentMeta.razorpayPaymentId,
        paymentId: paymentMeta.paymentId,
        paidAt: new Date(),
      }
    );
  }

  return user;
};

const verifySubscriptionPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } =
      req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const pending = await SubscriptionPayment.findOne({
      razorpayOrderId: razorpay_order_id,
      seller: req.user._id,
      status: 'Pending',
    });

    const resolvedPlanId = planId || pending?.planId;
    const user = await finalizeSubscriptionPayment(req.user._id, resolvedPlanId, {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true, seller: user });
  } catch (error) {
    next(error);
  }
};

const verifyFakeSubscriptionPayment = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const plan = getPlanById(planId);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    if (req.user.sellerStatus !== 'approved') {
      return res.status(403).json({ success: false, message: 'Seller not approved yet' });
    }

    await SubscriptionPayment.create({
      seller: req.user._id,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      paymentId: `fake_sub_${Date.now()}`,
      status: 'Paid',
      paidAt: new Date(),
    });

    const user = await finalizeSubscriptionPayment(req.user._id, planId, {
      paymentId: `fake_sub_${Date.now()}`,
    });

    res.json({ success: true, seller: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptionPlans,
  getSellerSubscriptionStatus,
  createSubscriptionRazorpayOrder,
  verifySubscriptionPayment,
  verifyFakeSubscriptionPayment,
};
