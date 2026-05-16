import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Package,
  MapPin,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryPartners = async () => {
    try {
      const { data } = await axios.get('/api/admin/delivery');
      // Show approved partners first, otherwise show all delivery roles for testing
      const approved = data.filter(p => p.deliveryStatus === 'approved');
      setDeliveryPartners(approved.length > 0 ? approved : data);
    } catch (err) {
      console.error('Failed to fetch partners');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  const assignPartner = async (orderId, partnerId) => {
    try {
      setAssigning(true);
      await axios.patch(`/api/orders/${orderId}/assign-delivery`, { deliveryPartnerId: partnerId });
      toast.success('Delivery partner assigned!');
      fetchOrders();
      setShowDetailsModal(false);
    } catch (err) {
      toast.error('Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
      if (selectedOrder) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Processing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Orders Management</h1>
          <p className="text-gray-400 text-sm">Monitor and process marketplace orders</p>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-2xl border border-white/5">
          {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50">
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5 text-center">Total</th>
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
                        <span className="text-xs text-gray-500">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400">{order.orderItems?.length} Products</td>
                    <td className="px-8 py-5 text-center text-sm font-black text-white">${order.totalPrice}</td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => { setSelectedOrder(order); setShowDetailsModal(true); }}
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
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setShowDetailsModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Order Details</h2>
                  <p className="text-gray-500 text-xs font-mono mt-1">ID: #{selectedOrder._id}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
                {/* Order Summary */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Shipping Information</h3>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex gap-4">
                      <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl h-fit">
                        <MapPin size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-bold">{selectedOrder.user?.name}</p>
                        <p className="text-gray-400 text-sm">{selectedOrder.shippingAddress?.address}</p>
                        <p className="text-gray-400 text-sm">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                        <p className="text-gray-400 text-sm">{selectedOrder.shippingAddress?.country}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Payment Method</h3>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                        <CreditCard size={20} />
                      </div>
                      <p className="text-white font-bold">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-white font-bold">${selectedOrder.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-white font-bold">${selectedOrder.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-white font-bold">${selectedOrder.taxPrice}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex justify-between">
                      <span className="text-white font-black uppercase tracking-widest text-xs">Total</span>
                      <span className="text-primary-400 font-black text-lg">${selectedOrder.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Items & Actions */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={index} className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="text-white font-bold text-sm line-clamp-1">{item.name}</p>
                            <p className="text-gray-500 text-xs">{item.qty} x ${item.price}</p>
                          </div>
                          <div className="text-white font-black text-sm">${(item.qty * item.price).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => updateOrderStatus(selectedOrder._id, 'Shipped')}
                        disabled={selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered'}
                        className="flex items-center justify-center gap-2 bg-purple-600 text-white p-3 rounded-xl font-bold text-xs hover:bg-purple-500 transition-all disabled:opacity-50"
                      >
                        <Truck size={16} /> Mark Shipped
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(selectedOrder._id, 'Delivered')}
                        disabled={selectedOrder.status === 'Delivered'}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-xl font-bold text-xs hover:bg-green-500 transition-all disabled:opacity-50"
                      >
                        <CheckCircle size={16} /> Mark Delivered
                      </button>
                    </div>
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder._id, 'Cancelled')}
                      disabled={selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Delivered'}
                      className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 p-3 rounded-xl font-bold text-xs hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      <XCircle size={16} /> Cancel Order
                    </button>
                  </div>

                  {/* Delivery Assignment Section */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Truck size={14} /> Assign Delivery Partner
                    </h3>
                    {selectedOrder.deliveryPartner ? (
                      <div className="bg-primary-500/10 p-4 rounded-2xl border border-primary-500/20">
                         <p className="text-primary-400 text-sm font-bold">Assigned to: {selectedOrder.deliveryPartner.name || 'Partner'}</p>
                         <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-1">Status: {selectedOrder.deliveryStatus}</p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <select 
                          className="flex-1 bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white text-xs focus:outline-none"
                          onChange={(e) => setSelectedOrder({...selectedOrder, tempPartner: e.target.value})}
                        >
                          <option value="">Select Partner</option>
                          {deliveryPartners.map(p => (
                            <option key={p._id} value={p._id}>{p.name} ({p.deliveryProfile?.vehicleType})</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => assignPartner(selectedOrder._id, selectedOrder.tempPartner)}
                          disabled={!selectedOrder.tempPartner || assigning}
                          className="bg-primary-600 text-white px-6 rounded-xl font-bold text-xs hover:bg-primary-500 disabled:opacity-50"
                        >
                          {assigning ? '...' : 'Assign'}
                        </button>
                      </div>
                    )}
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

export default AdminOrders;
