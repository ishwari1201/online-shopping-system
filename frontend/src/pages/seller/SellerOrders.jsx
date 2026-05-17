import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  User,
  MapPin,
  ChevronRight,
  Clock,
  Package,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

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
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order Management</h1>
            <p className="text-sm text-gray-500 mt-1">View and track all customer orders containing your products.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm">
              <Clock size={16} className="text-amber-500" />
              Pending: {orders.filter(o => o.status !== 'Delivered').length}
            </div>
          </div>
        </div>

        {/* Main Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search by Order ID or Customer..." 
                className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
            </div>
            
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Filter size={16} /> Filter Orders
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Items</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Revenue</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-24 text-center">
                      <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-24 text-center text-gray-500 font-medium text-sm">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        #{String(order._id).slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{order.user?.name || 'Guest'}</span>
                          <span className="text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {order.orderItems?.length} items
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        ₹{order.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
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
        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setShowModal(false)}
            />
            
            <div className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-gray-500 text-sm font-medium mt-1">ID: #{String(selectedOrder._id).slice(-6).toUpperCase()}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50/30">
                
                {/* Left Column: Customer & Delivery Info */}
                <div className="space-y-6">
                  
                  {/* Customer Card */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Customer Contact</h3>
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold">{selectedOrder.user?.name || 'Guest'}</p>
                        <p className="text-gray-500 text-sm font-medium">{selectedOrder.user?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Card */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Shipping Destination</h3>
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div className="space-y-1 text-sm font-medium text-gray-600 mt-1">
                        <p className="text-gray-900 font-bold">{selectedOrder.shippingAddress?.address}</p>
                        <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                        <p>{selectedOrder.shippingAddress?.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Progress */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Delivery Tracking</h3>
                    <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-100">
                      <span className="text-gray-500 text-sm font-semibold">Partner: <span className="text-gray-900">{selectedOrder.deliveryPartner?.name || 'Not Assigned'}</span></span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(selectedOrder.deliveryStatus || 'Pending')}`}>
                        {selectedOrder.deliveryStatus || 'Pending'}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {selectedOrder.deliveryTimeline?.slice(-2).map((log, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                          <p className="text-gray-600 font-medium"><span className="text-gray-900 font-bold">{log.status}:</span> {log.description}</p>
                        </div>
                      ))}
                      {(!selectedOrder.deliveryTimeline || selectedOrder.deliveryTimeline.length === 0) && (
                        <p className="text-sm text-gray-500 italic">No tracking updates available yet.</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Column: Order Items & Totals */}
                <div className="space-y-6">
                  
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Sold Items</h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 py-2">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                          <div className="flex-1">
                            <p className="text-gray-900 font-bold text-sm line-clamp-1">{item.name}</p>
                            <p className="text-gray-500 text-xs font-semibold mt-1">Qty: {item.qty} × ₹{item.price.toLocaleString()}</p>
                          </div>
                          <div className="text-gray-900 font-bold text-sm">₹{(item.qty * item.price).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Your Total Earnings</p>
                        <p className="text-gray-900 text-2xl font-bold mt-1">
                          ₹{selectedOrder.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toLocaleString()}
                        </p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-md font-bold text-xs border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
