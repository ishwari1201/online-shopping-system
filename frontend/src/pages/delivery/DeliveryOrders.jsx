import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Truck, 
  XCircle,
  Eye,
  AlertTriangle,
  ChevronRight,
  User,
  Package,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/delivery/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch assigned orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status, failureReason = '') => {
    try {
      await axios.put(`/api/delivery/orders/${orderId}/status`, { status, failureReason });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = ['Assigned', 'Picked Up', 'Out For Delivery', 'Delivered'];
    return steps;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Active Route</h1>
          <p className="text-gray-400 text-sm">You have {orders.length} active deliveries to complete</p>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="bg-slate-900 rounded-[2rem] border border-white/5 p-12 text-center">
            <Truck size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Empty Route</h3>
            <p className="text-gray-500">No orders have been assigned to you yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <motion.div 
              key={order._id}
              layout
              className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-primary-500/30 transition-all shadow-xl"
            >
              <div className="p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 bg-slate-900/50">
                <div className="flex gap-6 items-center">
                  <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Order #{order._id.substring(18)}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {order.deliveryStatus}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all border border-white/5"
                  >
                    <Eye size={16} /> Details
                  </button>
                  
                  {order.deliveryStatus === 'Assigned' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'Picked Up')}
                      className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-500 transition-all"
                    >
                      Pick Up Package
                    </button>
                  )}
                  {order.deliveryStatus === 'Picked Up' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'Out For Delivery')}
                      className="px-6 py-2.5 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent/80 transition-all"
                    >
                      Start Delivery
                    </button>
                  )}
                  {order.deliveryStatus === 'Out For Delivery' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateStatus(order._id, 'Delivered')}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-500 transition-all"
                      >
                        Mark Delivered
                      </button>
                      <button 
                        onClick={() => {
                          const reason = window.prompt('Reason for failure:');
                          if (reason) updateStatus(order._id, 'Failed', reason);
                        }}
                        className="px-6 py-2.5 bg-red-600/20 text-red-400 rounded-xl text-xs font-bold hover:bg-red-600/30 transition-all border border-red-500/20"
                      >
                        Failed
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Customer Info */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Customer Information</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold">{order.user?.name}</p>
                      <button className="text-primary-400 text-xs font-medium flex items-center gap-1 mt-1 hover:underline">
                        <Phone size={12} /> {order.shippingAddress?.phone || 'Call Customer'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Delivery Address</p>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-primary-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm leading-relaxed">
                        {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Payment Method</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.paymentMethod === 'COD' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold">{order.paymentMethod}</p>
                      <p className={`text-xs font-black uppercase mt-1 ${order.paymentMethod === 'COD' ? 'text-orange-400' : 'text-green-400'}`}>
                        {order.paymentMethod === 'COD' ? `Collect $${order.totalPrice}` : 'Already Paid'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal for Order Details */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950 w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-black text-white">Delivery Items</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><XCircle size={24} /></button>
              </div>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 p-4 bg-slate-900 rounded-2xl border border-white/5">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-white font-bold">{item.name}</p>
                      <p className="text-xs text-gray-500">Quantity: {item.qty} • Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-slate-900/50 border-t border-white/5 text-center">
                <p className="text-gray-400 text-sm">Please verify all items before marking as picked up.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryOrders;
