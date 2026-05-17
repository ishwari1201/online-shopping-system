import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  ChevronRight, 
  Search, 
  Clock, 
  Shield, 
  ArrowRight,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders/my-orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const generateOtp = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/otp`);
      toast.success('Security OTP Generated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to generate OTP');
    }
  };

  const filteredOrders = orders.filter(o => 
    String(o._id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-cream">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-cream pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-primary">Your Journey</h1>
            <div className="w-16 h-1.5 bg-primary mt-4 mb-4"></div>
            <p className="text-muted text-[11px] font-black uppercase tracking-[0.3em]">Track your sustainable style</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-4 text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search orders or products..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-12">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-black/5 p-8 md:p-12 shadow-sm relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em]">
                  {order.status}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  
                  {/* Order Info */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-1">Order Identifier</p>
                      <p className="text-primary font-black text-sm font-mono uppercase">#{String(order._id).slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-1">Placed On</p>
                      <p className="text-primary font-bold text-sm">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-1">Shipping Destination</p>
                      <div className="flex items-start gap-2 text-primary font-medium text-xs">
                        <MapPin size={14} className="mt-0.5 text-muted" />
                        <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-6 border-y md:border-y-0 md:border-x border-black/5 py-8 md:py-0 md:px-12">
                    <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-4">Parcel Contents</p>
                    <div className="space-y-6 max-h-[180px] overflow-y-auto pr-4 scrollbar-hide">
                      {order.orderItems.map((item) => (
                        <div key={item._id} className="flex gap-4 group">
                          <div className="w-16 h-16 bg-bg-cream rounded-sm overflow-hidden flex-shrink-0 border border-black/5">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-primary text-[11px] font-black uppercase tracking-tight truncate mb-1">{item.name}</p>
                            <p className="text-muted text-[10px] font-black tracking-widest italic">{item.qty} × ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="flex flex-col justify-between">
                    <div className="text-left md:text-right">
                      <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-1">Total Charged</p>
                      <p className="text-primary text-4xl font-black tracking-tighter">₹{order.totalPrice.toFixed(2)}</p>
                    </div>
                    
                    <div className="space-y-4 mt-8">
                      {!order.isDelivered ? (
                        <div className="space-y-4">
                          {order.deliveryOTP ? (
                            <div className="bg-primary text-white p-5 rounded-sm text-center shadow-md">
                              <p className="text-white/70 text-[8px] font-black uppercase tracking-widest mb-1">Secure Delivery OTP</p>
                              <p className="text-3xl font-black tracking-[0.3em]">{order.deliveryOTP}</p>
                            </div>
                          ) : (
                            <button 
                              onClick={() => generateOtp(order._id)}
                              className="w-full bg-white border-2 border-primary text-primary py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                              <Shield size={14} /> Generate Security OTP
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[10px] justify-start md:justify-end">
                          <CheckCircle size={16} /> Order Fulfilled
                        </div>
                      )}
                      
                      <Link 
                        to={`/order/${order._id}`}
                        className="w-full btn-allbirds py-4 flex items-center justify-center gap-2 group"
                      >
                        Track Shipment <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 text-center bg-white border border-black/5">
              <Package className="mx-auto text-muted mb-6" size={48} />
              <h3 className="text-xl font-black uppercase tracking-tighter text-primary">No orders yet</h3>
              <p className="text-muted text-[11px] font-black uppercase tracking-widest mt-2">Start your journey into sustainable fashion</p>
              <Link to="/shop" className="inline-block mt-8 btn-allbirds px-12">Shop Now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
