import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  Shield,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingOtp, setGeneratingOtp] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders/my-orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll for updates every 30s
    return () => clearInterval(interval);
  }, []);

  const generateOtp = async (orderId) => {
    try {
      setGeneratingOtp(orderId);
      const { data } = await axios.post(`/api/orders/${orderId}/generate-otp`);
      toast.success('OTP Generated! Share this with your delivery partner.');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate OTP');
    } finally {
      setGeneratingOtp(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Out For Delivery': return 'bg-primary text-white border-primary shadow-sm';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-bg-cream text-muted border-black/5';
    }
  };

  if (loading) return (
    <div className="pt-40 pb-20 flex justify-center bg-bg-cream min-h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-cream text-primary">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 pb-6 border-b border-black/5">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">My Orders</h1>
            <p className="text-muted text-[11px] font-black uppercase tracking-widest mt-2">Manage and track your sustainable journey</p>
          </div>
          <Link to="/shop" className="text-[11px] font-black uppercase tracking-widest border border-black/10 px-6 py-3 hover:bg-primary hover:text-white transition-all flex items-center gap-2">
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-black/5 p-24 text-center shadow-sm">
            <div className="w-20 h-20 bg-bg-cream rounded-sm flex items-center justify-center mx-auto mb-8 text-muted/30">
              <Package size={40} strokeWidth={1} />
            </div>
            <h3 className="text-[13px] font-black uppercase tracking-[0.3em] mb-4">No Orders Yet</h3>
            <p className="text-muted text-[12px] font-medium max-w-xs mx-auto mb-10 leading-relaxed">Your purchase history is empty. Discover our latest collections and start your journey.</p>
            <Link to="/shop" className="btn-allbirds inline-block px-12 py-4">
              Explore Now
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-black/5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-8 md:p-10">
                  {/* Order Top Bar */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-black/5">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-bg-cream text-primary border border-black/5 rounded-sm">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em]">Order Identifier</p>
                        <p className="text-primary font-black uppercase tracking-widest text-[13px] mt-0.5">#{String(order._id).slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <span className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.deliveryStatus)}`}>
                        {order.deliveryStatus || 'Processing'}
                      </span>
                      <span className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${order.isPaid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {order.isPaid ? 'Payment Confirmed' : 'Awaiting Payment'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {/* Items Section */}
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Bag Items</h3>
                      <div className="space-y-4">
                        {order.orderItems.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-bg-cream/50 p-3 border border-black/5">
                            <img src={item.image} className="w-12 h-12 object-cover rounded-sm" />
                            <div className="flex-1 overflow-hidden">
                              <p className="text-primary text-[11px] font-black uppercase tracking-tight truncate">{item.name}</p>
                              <p className="text-muted text-[10px] font-medium mt-0.5">{item.qty} × ${item.price}</p>
                            </div>
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <p className="text-muted text-[9px] font-black uppercase tracking-widest pl-2">+{order.orderItems.length - 2} Additional Items</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Section */}
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Destination</h3>
                      <div className="bg-bg-cream/50 p-6 border border-black/5 space-y-6">
                        <div className="flex items-center gap-4">
                          <MapPin size={16} className="text-muted" />
                          <p className="text-muted text-[11px] font-medium leading-relaxed truncate">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                        </div>
                        {order.deliveryPartner && (
                          <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                            <Truck size={16} className="text-primary" />
                            <div>
                              <p className="text-primary text-[11px] font-black uppercase tracking-widest">{order.deliveryPartner.name}</p>
                              <p className="text-muted text-[9px] font-medium">Official Delivery Partner</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="flex flex-col justify-between">
                      <div className="text-left md:text-right">
                        <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-1">Total Charged</p>
                        <p className="text-primary text-4xl font-black tracking-tighter">${order.totalPrice.toFixed(2)}</p>
                      </div>
                      
                      <div className="space-y-4 mt-8">
                        {order.deliveryStatus === 'Out For Delivery' && (
                          <div className="space-y-2">
                            {order.deliveryOTP ? (
                              <div className="bg-primary text-white p-5 rounded-sm text-center shadow-md">
                                <p className="text-white/70 text-[8px] font-black uppercase tracking-widest mb-1">Secure Delivery OTP</p>
                                <p className="text-3xl font-black tracking-[0.3em]">{order.deliveryOTP}</p>
                              </div>
                            ) : (
                              <button 
                                onClick={() => generateOtp(order._id)}
                                disabled={generatingOtp === order._id}
                                className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                              >
                                <Shield size={16} /> 
                                {generatingOtp === order._id ? 'Securing...' : 'Get Delivery OTP'}
                              </button>
                            )}
                          </div>
                        )}
                        <Link 
                          to={`/order/${order._id}`}
                          className="w-full py-4 border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-bg-cream transition-all flex items-center justify-center gap-2"
                        >
                          <Truck size={16} /> Track Details <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
