import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  ChevronRight, 
  Shield, 
  CheckCircle, 
  RefreshCw, 
  Info, 
  Smartphone, 
  X
} from 'lucide-react';
import axios from 'axios';
import { clearCartItems } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, onConfirm, amount }) => {
  const [step, setStep] = useState(1); // 1: Method, 2: Processing, 3: Success

  const handlePay = () => {
    setStep(2);
    setTimeout(() => {
      onConfirm();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary/20 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-sm overflow-hidden shadow-2xl border border-black/5"
      >
        {/* Header */}
        <div className="bg-primary p-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center">
                <CreditCard size={24} />
             </div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Payment Portal</p>
               <p className="text-xl font-black tracking-tight">${amount}</p>
             </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8">
               <h3 className="text-primary font-black uppercase tracking-[0.2em] text-[11px] pb-4 border-b border-black/5 text-center">Select Payment Securely</h3>
               <div className="grid grid-cols-1 gap-4">
                  {['Digital UPI', 'Debit/Credit Card', 'Netbanking'].map((method, i) => (
                    <button key={i} className="flex items-center gap-4 p-5 border border-black/5 hover:border-primary hover:bg-bg-cream transition-all group">
                       <div className="w-10 h-10 bg-bg-cream rounded-sm flex items-center justify-center text-muted group-hover:text-primary">
                          {i === 0 ? <Smartphone size={18}/> : <CreditCard size={18}/>}
                       </div>
                       <span className="font-black text-primary text-[10px] uppercase tracking-widest">{method}</span>
                    </button>
                  ))}
               </div>
               <button 
                 onClick={handlePay}
                 className="btn-allbirds w-full py-5 text-[11px]"
               >
                 Confirm Payment
               </button>
            </div>
          )}

          {step === 2 && (
            <div className="py-16 flex flex-col items-center justify-center text-center">
               <div className="relative w-20 h-20 mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-bg-cream border-t-primary rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-primary">
                     <Shield size={32} />
                  </div>
               </div>
               <h3 className="text-primary font-black uppercase tracking-[0.2em] text-[12px] mb-2">Authenticating</h3>
               <p className="text-muted text-[10px] uppercase tracking-widest">Securing your transaction...</p>
            </div>
          )}
        </div>

        <div className="bg-bg-cream p-5 text-center border-t border-black/5">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted flex items-center justify-center gap-2">
            <Shield size={12} /> Encrypted by Wearify Secure
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart) || { cartItems: [] };
  const { cartItems = [], itemsPrice = 0, shippingPrice = 0, taxPrice = 0, totalPrice = 0, shippingAddress: savedAddress = {} } = cart;

  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: savedAddress?.address || '', city: savedAddress?.city || '', postalCode: savedAddress?.postalCode || '', country: savedAddress?.country || 'India'
  });

  useEffect(() => {
    if (cartItems.length === 0 && !success) navigate('/cart');
    if (!userInfo) navigate('/login?redirect=/checkout');
  }, [cartItems, navigate, userInfo, success]);

  const handleCheckoutSubmit = async () => {
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.error('Please fill all shipping details');
      return;
    }
    if (paymentMethod === 'Razorpay') {
      setShowModal(true);
    } else {
      handleCOD();
    }
  };

  const processOrder = async () => {
    setShowModal(false);
    setLoading(true);
    try {
      const sanitizedItems = cartItems.map(item => ({
        ...item, _id: item._id || item.id, seller: item.seller || item.user
      }));

      const { data } = await axios.post('/api/payment/verify-fake', {
        orderData: { orderItems: sanitizedItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice },
        paymentMethod: 'Online Payment'
      }, { withCredentials: true });

      if (data.success) {
        setCreatedOrderId(data.order._id);
        setSuccess(true);
        dispatch(clearCartItems());
        toast.success('Payment Successful!');
      }
    } catch (error) {
      toast.error('Payment Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    setLoading(true);
    try {
      const sanitizedItems = cartItems.map(item => ({ ...item, _id: item._id || item.id, seller: item.seller || item.user }));
      const { data } = await axios.post('/api/payment/cod', {
        orderData: { orderItems: sanitizedItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice }
      }, { withCredentials: true });
      if (data.success) {
        setCreatedOrderId(data.order._id);
        setSuccess(true);
        dispatch(clearCartItems());
        toast.success('Order Placed Successfully!');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-bg-cream flex flex-col items-center justify-center px-4">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-lg bg-white p-16 border border-black/5 shadow-sm">
          <div className="w-24 h-24 bg-green-500 rounded-sm mx-auto mb-10 flex items-center justify-center shadow-lg">
             <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-primary mb-6">Order Placed</h1>
          <p className="text-muted text-[11px] font-black uppercase tracking-[0.2em] mb-12 leading-relaxed">
            Order #{String(createdOrderId).slice(-6).toUpperCase()} confirmed. Nature is on its way to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate(`/order/${createdOrderId}`)} className="btn-allbirds flex-1">Track Order</button>
            <button onClick={() => navigate('/shop')} className="flex-1 py-4 border border-black/10 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-bg-cream transition-all">Back to Shop</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-cream text-primary">
      <PaymentModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={processOrder} amount={totalPrice} />
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Checkout</h1>
          <div className="w-12 h-1 bg-primary mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Shipping */}
            <section className="bg-white border border-black/5 p-10 rounded-sm shadow-sm">
               <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5 flex items-center gap-3">
                 <MapPin size={16}/> Shipping Address
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Street Address" className="bg-bg-cream border border-black/5 rounded-sm p-5 text-sm font-medium focus:outline-none focus:border-primary" value={shippingAddress.address} onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})} />
                  <input type="text" placeholder="City" className="bg-bg-cream border border-black/5 rounded-sm p-5 text-sm font-medium focus:outline-none focus:border-primary" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
                  <input type="text" placeholder="Postal Code" className="bg-bg-cream border border-black/5 rounded-sm p-5 text-sm font-medium focus:outline-none focus:border-primary" value={shippingAddress.postalCode} onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})} />
                  <input type="text" className="bg-bg-cream border border-black/5 rounded-sm p-5 text-sm font-medium opacity-50 cursor-not-allowed uppercase tracking-widest text-[10px]" value="India" disabled />
               </div>
            </section>

            {/* Payment Selection */}
            <section className="bg-white border border-black/5 p-10 rounded-sm shadow-sm">
               <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5 flex items-center gap-3">
                 <CreditCard size={16}/> Payment Choice
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setPaymentMethod('Razorpay')} 
                    className={`p-8 border transition-all text-center ${paymentMethod === 'Razorpay' ? 'border-primary bg-bg-cream shadow-inner' : 'border-black/5 hover:border-black/20'}`}
                  >
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">Online Payment</p>
                    <p className="text-[9px] text-muted font-medium uppercase tracking-tight">Digital & Cards</p>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('COD')} 
                    className={`p-8 border transition-all text-center ${paymentMethod === 'COD' ? 'border-primary bg-bg-cream shadow-inner' : 'border-black/5 hover:border-black/20'}`}
                  >
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">Cash on Delivery</p>
                    <p className="text-[9px] text-muted font-medium uppercase tracking-tight">Pay at your Door</p>
                  </button>
               </div>
            </section>
          </div>

          {/* Side Summary */}
          <div className="w-full">
            <div className="bg-white border border-black/5 p-10 rounded-sm shadow-sm sticky top-32">
               <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5 text-muted">Order Total</h3>
               <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted">
                    <span>Cart Items</span>
                    <span>${itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted pb-6 border-b border-black/5">
                    <span>Tax Estimate</span>
                    <span>${taxPrice}</span>
                  </div>
                  <div className="flex justify-between text-primary font-black uppercase tracking-tighter pt-2">
                    <span className="text-[15px]">Grand Total</span>
                    <span className="text-3xl">${totalPrice}</span>
                  </div>
               </div>
               <button 
                 onClick={handleCheckoutSubmit} 
                 disabled={loading} 
                 className="btn-allbirds w-full flex items-center justify-center gap-4 py-6"
               >
                  {loading ? <RefreshCw className="animate-spin" size={20}/> : (
                    <>
                      Place Your Order <ChevronRight size={18}/>
                    </>
                  )}
               </button>
               <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted mt-10 leading-relaxed">
                 Fast shipping and easy 30-day returns on every order.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
