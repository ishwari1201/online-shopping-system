import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Package, 
  CreditCard, 
  Clock, 
  User,
  Navigation,
  CheckCircle,
  Truck
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const DeliveryOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        toast.error('Failed to fetch order details');
        navigate('/delivery/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const updateStatus = async (status) => {
    try {
      await axios.patch(`/api/delivery/orders/${id}/status`, { status });
      toast.success(`Order status: ${status}`);
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Loading Shipment Details...</div>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Shipment Details</h1>
          <p className="text-gray-400 text-sm">Order #{order._id.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Address */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-primary-500/10 text-primary-500 rounded-2xl">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Customer Info</h3>
                <p className="text-white font-black text-xl">{order.user?.name}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold border border-white/5">
                    <Phone size={14} className="text-primary-500" /> Call Customer
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Delivery Location</h3>
                <p className="text-white font-medium text-lg leading-relaxed">{order.shippingAddress?.address}</p>
                <p className="text-gray-400 text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <button className="mt-4 flex items-center gap-2 text-primary-500 text-xs font-black uppercase tracking-widest hover:underline">
                  <Navigation size={14} /> Open in Maps
                </button>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Package Contents</h3>
            <div className="space-y-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{item.name}</p>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Qty: {item.qty} | ${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Truck size={100} />
            </div>
            <h3 className="text-white font-bold text-lg mb-6">Execution</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                <p className="text-primary-400 font-bold text-sm uppercase tracking-widest">{order.deliveryStatus}</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Payment</p>
                <p className="text-white font-bold text-sm uppercase tracking-widest">{order.paymentMethod}</p>
                <p className="text-green-500 text-[10px] font-black uppercase mt-1 tracking-widest">{order.isPaid ? 'Already Paid' : 'Collect Cash'}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {order.deliveryStatus === 'Out For Delivery' ? (
                <button 
                  onClick={() => updateStatus('Delivered')}
                  className="w-full py-5 bg-green-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-green-900/20"
                >
                  Mark as Delivered
                </button>
              ) : (
                <p className="text-gray-500 text-[10px] text-center uppercase font-black tracking-[0.2em]">Update status in main list</p>
              )}
              <button className="w-full py-4 border border-red-500/20 text-red-500 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-red-500/5 transition-all">
                Mark as Failed
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Tracking Log</h3>
            <div className="space-y-6">
              {order.deliveryTimeline?.map((log, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== order.deliveryTimeline.length - 1 && (
                    <div className="absolute left-[7px] top-4 w-[2px] h-full bg-slate-800"></div>
                  )}
                  <div className="w-4 h-4 rounded-full bg-primary-500 mt-1 flex-shrink-0 border-4 border-slate-900 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  <div>
                    <p className="text-white font-bold text-xs">{log.status}</p>
                    <p className="text-gray-500 text-[9px] uppercase tracking-widest mt-1 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderDetails;
