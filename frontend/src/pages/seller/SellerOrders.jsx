import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seller/orders');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/10 text-green-400';
      case 'Processing': return 'bg-blue-500/10 text-blue-400';
      case 'Pending': return 'bg-orange-500/10 text-orange-400';
      default: return 'bg-slate-500/10 text-slate-400';
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Order Management</h1>
          <p className="text-gray-400 text-sm">Track and fulfill your customer orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.length === 0 ? (
          <div className="bg-slate-900 rounded-[2rem] border border-white/5 p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
            <p className="text-gray-500">You haven't received any orders for your products yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <motion.div 
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden hover:border-primary-500/30 transition-all duration-300 shadow-xl"
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 bg-slate-900/50">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">#{order._id.substring(18)}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.isDelivered ? 'Delivered' : 'Processing')}`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items</p>
                  </div>
                </div>

                <div className="flex flex-col text-left md:text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Total Earnings</p>
                  <p className="text-2xl font-black text-white">
                    ${order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-white/5 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-sm mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 font-medium">Qty: {item.qty} • ${item.price} each</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-black text-sm">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-white/5">
                      <CheckCircle size={14} className="text-green-500" /> Payment: {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-white/5">
                      <Truck size={14} className="text-primary-400" /> Shipping: Standard
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all border border-white/5">
                      <Eye size={16} /> Details
                    </button>
                    {!order.isDelivered && (
                      <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/20">
                        Process Shipping
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
