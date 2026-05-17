import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Navigation,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const OrderDetails = () => {
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
        toast.error('Failed to load order details');
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  if (loading) return (
    <div className="pt-40 pb-20 flex justify-center bg-bg-cream min-h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return null;

  const steps = ['Pending', 'Accepted', 'Picked Up', 'Out For Delivery', 'Delivered'];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-cream text-primary">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="p-3 bg-white border border-black/5 rounded-sm hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Order Tracker</h1>
              <p className="text-muted text-[11px] font-black uppercase tracking-widest mt-1">
                Order ID: <span className="text-primary">#{String(order._id).slice(-6).toUpperCase()}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-muted">Real-time tracking active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tracking Progress Card */}
            <div className="bg-white border border-black/5 p-10 rounded-sm shadow-sm">
               <div className="relative flex justify-between items-center mb-12 px-2">
                 {/* Progress Line */}
                 <div className="absolute left-0 top-5 w-full h-[1px] bg-black/5 z-0"></div>
                 
                 {steps.map((step, idx) => {
                   const isActive = order.deliveryTimeline?.some(t => t.status === step);
                   const isCurrent = order.deliveryStatus === step;
                   return (
                     <div key={idx} className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                          isActive 
                            ? 'bg-primary border-primary text-white shadow-lg' 
                            : 'bg-white border-black/5 text-gray-300'
                        }`}>
                          {isActive ? <CheckCircle size={18} /> : <span className="text-[11px] font-black">{idx + 1}</span>}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest text-center max-w-[70px] ${isActive ? 'text-primary' : 'text-gray-300'}`}>
                          {step}
                        </span>
                     </div>
                   );
                 })}
               </div>
               
               <div className="bg-bg-cream border border-black/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6">
                   <div className="p-4 bg-primary text-white rounded-sm shadow-sm">
                     <Truck size={24} className={order.deliveryStatus !== 'Delivered' ? 'animate-pulse' : ''} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Current Status</p>
                      <p className="text-xl font-black uppercase tracking-tighter">{order.deliveryStatus || 'Processing'}</p>
                   </div>
                 </div>
                 
                 {order.deliveryStatus === 'Out For Delivery' && (
                   <div className="bg-white border border-primary/20 px-10 py-5 rounded-sm text-center shadow-md">
                     <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-2">Delivery Verification OTP</p>
                     <p className="text-primary text-4xl font-black tracking-[0.3em]">{order.deliveryOTP}</p>
                     <p className="text-muted text-[8px] font-medium mt-2">Share only with your delivery partner</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Items Card */}
            <div className="bg-white border border-black/5 p-10 rounded-sm shadow-sm">
              <h3 className="text-[13px] font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5">Shipment Contents</h3>
              <div className="space-y-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 group">
                    <div className="w-20 h-20 bg-bg-cream border border-black/5 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] font-black uppercase tracking-tight text-primary mb-1">{item.name}</p>
                      <p className="text-muted text-[10px] font-black uppercase tracking-widest">Qty: {item.qty} · ₹{item.price}</p>
                    </div>
                    <div className="text-primary font-black text-sm">₹{(item.qty * item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-10 border-t border-black/5 flex justify-between items-end">
                 <div>
                   <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Order Total</p>
                   <p className="text-primary font-black text-3xl tracking-tighter">₹{order.totalPrice.toFixed(2)}</p>
                 </div>
                 <Link to="/shop" className="text-[11px] font-black uppercase tracking-widest border-b-2 border-primary pb-1">Continue Shopping</Link>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Shipping Card */}
            <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                 <MapPin size={16} className="text-primary" /> Delivery Destination
               </h3>
               <div className="space-y-2 text-[12px] font-medium text-muted leading-relaxed">
                  <p className="text-primary font-black uppercase tracking-widest mb-4">{order.user?.name}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                  <p className="uppercase tracking-widest text-[10px] pt-2">{order.shippingAddress?.country}</p>
               </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                 <CreditCard size={16} className="text-primary" /> Payment Method
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-bg-cream px-4 py-3 rounded-sm border border-black/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Method</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center bg-bg-cream px-4 py-3 rounded-sm border border-black/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Payment</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                      {order.isPaid ? 'Completed' : 'Awaiting Payment'}
                    </span>
                  </div>
               </div>
            </div>

            {/* Shipment Log Card */}
            <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8">Activity Log</h3>
               <div className="space-y-8">
                 {order.deliveryTimeline?.map((log, idx) => (
                   <div key={idx} className="flex gap-5 relative group">
                     {idx !== order.deliveryTimeline.length - 1 && (
                       <div className="absolute left-[7px] top-4 w-[1px] h-[calc(100%+32px)] bg-black/5"></div>
                     )}
                     <div className="w-4 h-4 rounded-full bg-primary mt-1 flex-shrink-0 border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                     <div className="flex-1">
                       <p className="text-[11px] font-black uppercase tracking-tight text-primary">{log.status}</p>
                       <p className="text-muted text-[9px] font-medium mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                       {log.description && <p className="text-muted text-[10px] mt-2 italic border-l-2 border-black/5 pl-3">{log.description}</p>}
                     </div>
                   </div>
                 ))}
                 {(!order.deliveryTimeline || order.deliveryTimeline.length === 0) && (
                   <div className="flex items-center gap-3 py-4 text-muted">
                     <Clock size={16} />
                     <p className="text-[10px] font-black uppercase tracking-widest italic">Awaiting first update...</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
