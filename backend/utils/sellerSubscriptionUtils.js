const Product = require('../models/productModel');
const { getPlanById } = require('../constants/sellerPlans');

const isPlanExpired = (user) => {
  if (!user.planExpiry) return true;
  return new Date(user.planExpiry) < new Date();
};

const syncProductsUploaded = async (sellerId) => {
  const count = await Product.countDocuments({ seller: sellerId });
  return count;
};

const canUploadProduct = (user) => {
  if (user.role === 'admin') return { allowed: true };
  if (user.sellerStatus !== 'approved') {
    return { allowed: false, message: 'Seller account is not approved yet.' };
  }
  if (!user.isSellerActive || isPlanExpired(user)) {
    return {
      allowed: false,
      message: 'Activate a subscription plan to upload products.',
    };
  }
  const limit = user.productLimit;
  if (limit !== null && limit !== undefined && user.productsUploaded >= limit) {
    return {
      allowed: false,
      message: 'Upgrade your seller package to upload more products.',
      limitReached: true,
    };
  }
  return { allowed: true };
};

const activateSellerPlan = async (user, planId) => {
  const plan = getPlanById(planId);
  if (!plan) throw new Error('Invalid subscription plan');

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + plan.validityDays);

  const productCount = await syncProductsUploaded(user._id);

  user.isSellerActive = true;
  user.subscriptionPlan = plan.name;
  user.planAmount = plan.price;
  user.productLimit = plan.productLimit === null ? 999999 : plan.productLimit;
  user.commissionRate = plan.commissionRate;
  user.planExpiry = expiry;
  user.productsUploaded = productCount;

  await user.save();
  return user;
};

module.exports = {
  isPlanExpired,
  syncProductsUploaded,
  canUploadProduct,
  activateSellerPlan,
};
