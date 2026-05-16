import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle, 
  Package, 
  Clock,
  User,
  MapPin,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Processing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Order Management</h1>
        <p className="text-gray-400 text-sm">Process your sales and track product deliveries</p>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-slate-800 text-gray-400 rounded-xl text-xs font-bold border border-white/5">
              Pending: {orders.filter(o => o.status !== 'Delivered').length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Your Items</th>
                <th className="px-8 py-5 text-center">Revenue</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-500 font-bold">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 text-sm font-mono text-gray-400">#{String(order._id).slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{order.user?.name}</span>
                        <span className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400">{order.orderItems?.length} items</td>
                    <td className="px-8 py-5 text-center text-sm font-black text-white">
                      ${order.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                        className="p-2.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Seller Order View</h2>
                  <p className="text-gray-500 text-xs font-mono mt-1">ID: #{String(selectedOrder._id).slice(-6).toUpperCase()}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">Close</button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
                {/* Shipping & Payment */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Customer Contact</h3>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex gap-4">
                      <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl h-fit">
                        <User size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-bold">{selectedOrder.user?.name}</p>
                        <p className="text-gray-400 text-sm">{selectedOrder.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Shipping Destination</h3>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex gap-4">
                      <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl h-fit">
                        <MapPin size={20} />
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>{selectedOrder.shippingAddress?.address}</p>
                        <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                        <p>{selectedOrder.shippingAddress?.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Your Sold Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-white font-bold text-sm line-clamp-1">{item.name}</p>
                          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Qty: {item.qty} | Price: ${item.price}</p>
                        </div>
                        <div className="text-primary-400 font-black text-sm">${(item.qty * item.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between items-center bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Your Total Earnings</p>
                        <p className="text-white text-2xl font-black mt-1">
                          ${selectedOrder.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2)}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Progress for Seller */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Delivery Progress</h3>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                       <div className="flex justify-between items-center mb-4">
                         <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Partner: {selectedOrder.deliveryPartner?.name || 'Not Assigned'}</span>
                         <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary-500/10 text-primary-500 border border-primary-500/20`}>
                           {selectedOrder.deliveryStatus || 'Pending'}
                         </span>
                       </div>
                       <div className="space-y-3">
                         {selectedOrder.deliveryTimeline?.slice(-2).map((log, idx) => (
                           <div key={idx} className="flex gap-3 text-[10px]">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1 flex-shrink-0"></div>
                             <p className="text-gray-400"><span className="text-white font-bold">{log.status}:</span> {log.description}</p>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerOrders;
