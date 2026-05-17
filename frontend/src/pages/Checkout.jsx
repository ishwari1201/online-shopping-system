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

const PaymentModal = ({ isOpen, onClose, onConfirm, amount, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-primary/20 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-black/5"
      >
        {/* Header */}
        <div className="bg-gray-950 p-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield size={24} className="text-emerald-400" />
             </div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Secure Payment Portal</p>
               <p className="text-xl font-black tracking-tight text-white">₹{amount}</p>
             </div>
          </div>
          {!loading && (
            <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={20}/>
            </button>
          )}
        </div>

        <div className="p-10">
          {!loading ? (
            <div className="space-y-8 flex flex-col items-center">
               <div className="flex flex-col items-center gap-3">
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
                   alt="Razorpay" 
                   className="h-7 opacity-90 my-2" 
                 />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 flex items-center gap-2">
                   <Shield size={11} className="text-emerald-500" /> Secure Sandbox Gateway
                 </span>
               </div>
               
               <p className="text-center text-xs text-gray-500 font-semibold leading-relaxed">
                 You are paying via Razorpay Test Mode. No real money will be charged. Please use the sandbox testing cards.
               </p>

               <button 
                 onClick={onConfirm}
                 className="w-full py-5 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-gray-900/10 flex items-center justify-center gap-3"
               >
                 Proceed to Checkout <ChevronRight size={16} />
               </button>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center">
               <div className="relative w-20 h-20 mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-indigo-50 border-t-indigo-600 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                     <Shield size={32} className="animate-pulse" />
                  </div>
               </div>
               <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-xs mb-2">Processing Sandbox</h3>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">Connecting to Razorpay secure interface...</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-5 text-center border-t border-gray-100">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center justify-center gap-2">
            <Shield size={12} className="text-emerald-500" /> Encrypted by Wearify SSL Secure
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const RazorpaySimulatorModal = ({ isOpen, onClose, amount, onConfirm }) => {
  const [method, setMethod] = useState('card'); // 'card', 'upi', 'netbanking'
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [expiry, setExpiry] = useState('12/30');
  const [cvv, setCvv] = useState('123');
  const [upiId, setUpiId] = useState('wearify@razorpay');
  const [selectedBank, setSelectedBank] = useState('SBI');
  const [paying, setPaying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      onConfirm();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={paying ? undefined : onClose}
        className="absolute inset-0 bg-primary/20 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-black/5"
      >
        {/* Razorpay Brand Blue Header */}
        <div className="bg-[#3399cc] p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard size={20} />
             </div>
             <div>
               <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-100">Razorpay Checkout Sandbox</p>
               <p className="text-lg font-black tracking-tight">₹{amount}</p>
             </div>
          </div>
          {!paying && (
            <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={18}/>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!paying ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
                  alt="Razorpay" 
                  className="h-5" 
                />
                <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 flex items-center gap-1.5 uppercase tracking-widest">
                  ⚠️ Demo Simulator
                </span>
              </div>

              {/* Method Selector Tabs */}
              <div className="flex border-b border-gray-100 mb-2">
                {[
                  { id: 'card', name: 'Card' },
                  { id: 'upi', name: 'UPI' },
                  { id: 'netbanking', name: 'Netbanking' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setMethod(t.id)}
                    className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                      method === t.id 
                        ? 'border-[#3399cc] text-[#3399cc]' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {/* Conditionally Render Method Form Fields */}
              {method === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Card Number (Test Card)</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3399cc] transition-all"
                      value={cardNumber} 
                      onChange={e => setCardNumber(e.target.value)} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        required 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3399cc] transition-all text-center"
                        value={expiry} 
                        onChange={e => setExpiry(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">CVV</label>
                      <input 
                        type="password" 
                        maxLength="3" 
                        required 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3399cc] transition-all text-center"
                        value={cvv} 
                        onChange={e => setCvv(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Enter UPI ID / VPA</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3399cc] transition-all"
                      value={upiId} 
                      onChange={e => setUpiId(e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiId(`${app.toLowerCase().replace(' ', '')}@ybl`)}
                        className="py-2.5 border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-wider text-gray-600 hover:border-[#3399cc] hover:text-[#3399cc] transition-all bg-white"
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Bank</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3399cc] transition-all cursor-pointer font-bold"
                      value={selectedBank} 
                      onChange={e => setSelectedBank(e.target.value)}
                    >
                      {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'KOTAK Bank'].map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {['SBI', 'HDFC', 'ICICI', 'Axis'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank === 'HDFC' ? 'HDFC Bank' : bank === 'ICICI' ? 'ICICI Bank' : bank === 'Axis' ? 'Axis Bank' : 'SBI')}
                        className={`py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                          selectedBank.startsWith(bank) 
                            ? 'border-[#3399cc] text-[#3399cc] bg-blue-50/20' 
                            : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-[#3399cc] hover:bg-[#2888b9] text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 animate-pulse mt-2"
              >
                Pay Securely ₹{amount}
              </button>
            </>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
               <div className="relative w-16 h-16 mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-blue-50 border-t-[#3399cc] rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[#3399cc]">
                     <Shield size={26} className="animate-pulse" />
                  </div>
               </div>
               <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-xs mb-2">Authorizing Payment</h3>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">Processing payment sandbox simulation...</p>
            </div>
          )}
        </form>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100 flex items-center justify-center gap-2">
          <Shield size={11} className="text-[#3399cc]" />
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">
            Powered by Razorpay Simulation API
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
  const [showSimulator, setShowSimulator] = useState(false);
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

  const handleSimulatorSuccess = async () => {
    setShowSimulator(false);
    setLoading(true);
    try {
      const sanitizedItems = cartItems.map(item => ({
        ...item, _id: item._id || item.id, seller: item.seller || item.user
      }));

      const { data } = await axios.post('/api/payment/verify-fake', {
        orderData: { orderItems: sanitizedItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice },
        paymentMethod: 'Online Payment (Simulator)'
      }, { withCredentials: true });

      if (data.success) {
        setCreatedOrderId(data.order._id);
        setSuccess(true);
        dispatch(clearCartItems());
        toast.success('Simulated Razorpay Payment Successful!');
      }
    } catch (error) {
      toast.error('Simulated Payment Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const processOrder = async () => {
    setLoading(true);
    try {
      // 1. Get Razorpay Key from backend
      const { data: keyData } = await axios.get('/api/payment/key', { withCredentials: true });
      const razorpayKey = keyData.key;

      if (!razorpayKey || razorpayKey === 'rzp_test_placeholder') {
        toast.info('Razorpay keys not configured. Launching Razorpay Simulator...', { autoClose: 3000 });
        setLoading(false);
        setShowModal(false);
        setShowSimulator(true);
        return;
      }

      // 2. Create Razorpay order on backend
      const { data: orderData } = await axios.post('/api/payment/create-order', {
        amount: totalPrice
      }, { withCredentials: true });

      if (!orderData.success) {
        throw new Error('Failed to create Razorpay order');
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Wearify',
        description: 'Secure Payment Transaction',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            const sanitizedItems = cartItems.map(item => ({
              ...item, _id: item._id || item.id, seller: item.seller || item.user
            }));

            // 3. Verify Razorpay signature and create Order on backend
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                orderItems: sanitizedItems,
                shippingAddress,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice
              }
            };

            const { data: verifyData } = await axios.post('/api/payment/verify', verifyPayload, { withCredentials: true });

            if (verifyData.success) {
              setCreatedOrderId(verifyData.order._id);
              setShowModal(false);
              setSuccess(true);
              dispatch(clearCartItems());
              toast.success('Payment Verified! Order Created.');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            toast.error('Signature Verification Failed: ' + (err.response?.data?.message || err.message));
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userInfo?.name || 'Customer',
          email: userInfo?.email || 'customer@example.com',
          contact: userInfo?.phone || '9999999999'
        },
        notes: {
          address: `${shippingAddress.address}, ${shippingAddress.city}`
        },
        theme: {
          color: '#111827'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.warning('Payment was cancelled.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error('Payment Initialization Error: ' + (error.response?.data?.message || error.message));
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
      <PaymentModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={processOrder} amount={totalPrice} loading={loading} />
      <RazorpaySimulatorModal isOpen={showSimulator} onClose={() => setShowSimulator(false)} amount={totalPrice} onConfirm={handleSimulatorSuccess} />
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
               
               {/* Cart Items List with Images */}
               <div className="space-y-6 mb-10 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
                  {cartItems.map((item, index) => (
                    <div key={item._id || item.id || index} className="flex items-center gap-5 py-3 border-b border-black/5 last:border-0">
                      <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-black/5 flex-shrink-0 flex items-center justify-center">
                         {item.image ? (
                           <img 
                             src={item.image} 
                             alt={item.name} 
                             className="w-full h-full object-cover" 
                             onError={(e) => {
                               e.target.onerror = null;
                               e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`;
                               e.target.className = "w-6 h-6 object-contain opacity-40";
                             }}
                           />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center">
                             <span className="text-[14px] font-black text-gray-400 uppercase tracking-widest">
                               {item.name ? item.name.charAt(0).toUpperCase() : 'P'}
                             </span>
                           </div>
                         )}
                         <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
                           {item.qty}
                         </span>
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[11px] font-black uppercase truncate tracking-tight text-primary leading-tight">{item.name}</p>
                         <p className="text-[9px] text-muted font-bold mt-1.5">₹{item.price} each</p>
                      </div>
                      <div className="text-[11px] font-black text-primary flex-shrink-0">
                         ₹{Number(item.price) * Number(item.qty)}
                      </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-bold">₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted">Tax (GST)</span>
                  <span className="font-bold">₹{taxPrice}</span>
                </div>
                <div className="pt-6 border-t border-black/5 flex justify-between items-center text-lg font-black uppercase tracking-tight">
                  <span className="text-primary">Total Amount</span>
                  <span className="text-3xl">₹{totalPrice}</span>
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
