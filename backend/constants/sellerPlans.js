const SELLER_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter Plan',
    price: 3000,
    productLimit: 25,
    commissionRate: 12,
    validityDays: 30,
  },
  growth: {
    id: 'growth',
    name: 'Growth Plan',
    price: 4000,
    productLimit: 75,
    commissionRate: 10,
    validityDays: 30,
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 6000,
    productLimit: null,
    commissionRate: 7,
    validityDays: 30,
  },
};

const getPlanById = (planId) => SELLER_PLANS[planId] || null;

const getAllPlans = () => Object.values(SELLER_PLANS);

module.exports = { SELLER_PLANS, getPlanById, getAllPlans };
