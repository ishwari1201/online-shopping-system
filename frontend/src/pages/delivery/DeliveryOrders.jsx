import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  MapPin, 
  Phone, 
  ChevronRight, 
  CheckCircle, 
  Navigation,
  Clock,
  ArrowRight,
  Truck
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [otp, setOtp] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/delivery/orders');
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Expected array but got:', data);
        setOrders([]);
        toast.error('Received invalid data from server');
      }
    } catch (error) {
      toast.error('Failed to fetch assigned orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status, deliveryOtp = null) => {
    try {
      setProcessing(true);
      const payload = { status };
      if (deliveryOtp) payload.otp = deliveryOtp;

      await axios.patch(`/api/delivery/orders/${id}/status`, payload);
      toast.success(`Order status: ${status}`);
      setShowOtpModal(false);
      setOtp('');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-blue-500 bg-blue-500/10';
      case 'Picked Up': return 'text-purple-500 bg-purple-500/10';
      case 'Out For Delivery': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Active Shipments</h1>
        <p className="text-gray-500 text-sm">Manage your currently assigned deliveries and updates</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-20 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 border border-gray-100">
            <Truck size={32} />
          </div>
          <h3 className="text-gray-900 font-bold text-lg">No Active Assignments</h3>
          <p className="text-gray-500 text-sm mt-2">New orders will appear here once assigned by the admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div 
                key={order._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-gray-200 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md relative overflow-hidden group transition-shadow"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.deliveryStatus)}`}>
                      {order.deliveryStatus}
                    </span>
                    <h3 className="text-gray-900 font-black text-lg mt-2">#{String(order._id).slice(-6).toUpperCase()}</h3>
                  </div>
                  <Link to={`/delivery/order/${order._id}`} className="p-3 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-xl transition-all border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-sm">
                    <ChevronRight size={18} />
                  </Link>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 text-gray-500 rounded-lg border border-gray-100">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Delivery Address</p>
                      <p className="text-gray-900 text-sm font-medium leading-relaxed">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 text-gray-500 rounded-lg border border-gray-100">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Customer Phone</p>
                      <p className="text-gray-900 text-sm font-medium">{order.user?.phone || 'Not Provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 text-gray-500 rounded-lg border border-gray-100">
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Items</p>
                      <p className="text-gray-900 text-sm font-medium">{order.orderItems?.length} Products • ₹{order.totalPrice}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {order.deliveryStatus === 'Assigned' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'Accepted')}
                      className="col-span-2 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
                    >
                      Accept Order
                    </button>
                  )}
                  {order.deliveryStatus === 'Accepted' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'Picked Up')}
                      className="col-span-2 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-purple-900/20"
                    >
                      Mark as Picked Up
                    </button>
                  )}
                  {order.deliveryStatus === 'Picked Up' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'Out For Delivery')}
                      className="col-span-2 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-900/20"
                    >
                      Start Delivery
                    </button>
                  )}
                  {order.deliveryStatus === 'Out For Delivery' && (
                    <button 
                      onClick={() => { setSelectedOrderId(order._id); setShowOtpModal(true); }}
                      className="col-span-2 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-green-900/20"
                    >
                      Enter OTP & Deliver
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setShowOtpModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white border border-gray-200 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2">Verify Delivery</h3>
              <p className="text-gray-500 text-sm mb-6">Ask the customer for the 4-digit OTP sent to their tracking page.</p>
              
              <input 
                type="text"
                maxLength="4"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 text-center text-2xl font-black tracking-[0.5em] text-primary focus:outline-none focus:ring-2 focus:ring-primary mb-6"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => updateStatus(selectedOrderId, 'Delivered', otp)}
                  disabled={otp.length !== 4 || processing}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                >
                  {processing ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryOrders;
