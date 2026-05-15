import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight } from 'lucide-react';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 glass-dark p-10 rounded-[2rem] border border-white/10 shadow-2xl relative"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Payment Method
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Step 2 of 3: Choose how you want to pay
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="space-y-4">
            
            <label className={`block w-full cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'PayPal' ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}`}>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 block text-white font-medium">PayPal or Credit Card</span>
              </div>
            </label>

            <label className={`block w-full cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'Stripe' ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}`}>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 block text-white font-medium flex items-center gap-2">
                  <CreditCard size={18} /> Stripe
                </span>
              </div>
            </label>

            <label className={`block w-full cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'Razorpay' ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}`}>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 block text-white font-medium">Razorpay (India)</span>
              </div>
            </label>
            
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-slate-900 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            >
              Continue to Review Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Payment;
