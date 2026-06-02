import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PLAN_ICONS = { starter: Zap, growth: Crown, premium: Sparkles };

const SellerSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payingPlan, setPayingPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get('/api/payment/subscription/plans', {
          withCredentials: true,
        });
        setPlans(data.plans || []);
      } catch {
        toast.error('Failed to load subscription plans');
      }
    };
    fetchPlans();
  }, []);

  const handleFakePay = async (planId) => {
    setLoading(true);
    setPayingPlan(planId);
    try {
      const { data } = await axios.post(
        '/api/payment/subscription/verify-fake',
        { planId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Subscription activated! Welcome to Wearify Seller.');
        navigate('/seller/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
      setPayingPlan(null);
    }
  };

  const handleRazorpayPay = async (plan) => {
    setLoading(true);
    setPayingPlan(plan.id);
    try {
      const { data: keyData } = await axios.get('/api/payment/key', {
        withCredentials: true,
      });
      const razorpayKey = keyData.key;

      if (!razorpayKey || razorpayKey === 'rzp_test_placeholder') {
        toast.info('Using payment simulator for subscription...');
        await handleFakePay(plan.id);
        return;
      }

      const { data: orderData } = await axios.post(
        '/api/payment/subscription/create-order',
        { planId: plan.id },
        { withCredentials: true }
      );

      if (!orderData.success) throw new Error('Failed to create payment order');

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Wearify',
        description: `${plan.name} — Seller Subscription`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const { data: verifyData } = await axios.post(
              '/api/payment/subscription/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
              },
              { withCredentials: true }
            );
            if (verifyData.success) {
              toast.success('Subscription activated!');
              navigate('/seller/dashboard');
            }
          } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
          }
        },
        prefill: { name: 'Wearify Seller' },
        theme: { color: '#E91E63' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setPayingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7fa] to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E91E63]">
            Wearify Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
            Choose Your Seller Plan
          </h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
            Unlock your store after admin approval. Subscription payment goes to Wearify admin
            revenue. Start selling with professional tools and analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const Icon = PLAN_ICONS[plan.id] || Zap;
            const isPopular = plan.id === 'growth';
            const limitLabel =
              plan.productLimit === null ? 'Unlimited' : `${plan.productLimit} products`;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl border p-8 flex flex-col ${
                  isPopular
                    ? 'border-[#E91E63] bg-white shadow-[0_20px_50px_rgba(233,30,99,0.15)] scale-[1.02]'
                    : 'border-[#FCE4EC] bg-white/90 shadow-sm'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E91E63] text-white text-[10px] font-bold uppercase tracking-widest">
                    Most Popular
                  </span>
                )}

                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] flex items-center justify-center mb-5">
                  <Icon className="text-[#E91E63]" size={22} />
                </div>

                <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-black text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">/ 30 days</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    `${limitLabel}`,
                    `${plan.commissionRate}% platform commission`,
                    '30 days validity',
                    'Seller dashboard & analytics',
                    'Withdraw earnings to bank',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={16} className="text-[#E91E63] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleRazorpayPay(plan)}
                  className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all ${
                    isPopular
                      ? 'bg-[#E91E63] text-white hover:bg-[#D81B60] shadow-lg shadow-[#E91E63]/30'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-60`}
                >
                  {payingPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SellerSubscription;
