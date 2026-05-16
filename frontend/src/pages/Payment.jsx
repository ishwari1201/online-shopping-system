import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight, Shield } from 'lucide-react';

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
    <div className="min-h-screen pt-32 pb-20 bg-bg-cream flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 border border-black/5 shadow-sm"
      >
        <div className="mb-12 text-center">
          <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-primary">Payment Secure</h2>
          <div className="w-10 h-0.5 bg-primary mx-auto mt-4 mb-2"></div>
          <p className="text-muted text-[10px] font-black uppercase tracking-widest">
            Step 2 of 3: Payment Method
          </p>
        </div>

        <form className="space-y-6" onSubmit={submitHandler}>
          <div className="space-y-3">
            {[
              { id: 'PayPal', label: 'PayPal or Credit Card' },
              { id: 'Stripe', label: 'Stripe (Global)' },
              { id: 'Razorpay', label: 'Razorpay (India)' }
            ].map((method) => (
              <label 
                key={method.id}
                className={`block w-full cursor-pointer border p-6 transition-all ${
                  paymentMethod === method.id 
                  ? 'border-primary bg-bg-cream shadow-inner' 
                  : 'border-black/5 hover:border-black/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary">{method.label}</span>
                  </div>
                  {method.id === 'Stripe' && <CreditCard size={16} className="text-muted" />}
                </div>
              </label>
            ))}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="btn-allbirds w-full flex items-center justify-center gap-2"
            >
              Continue to Review <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-8 text-muted">
            <Shield size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Secure Payment</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Payment;
