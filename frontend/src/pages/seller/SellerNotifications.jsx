import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const SellerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seller/notifications');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/seller/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const deleteNotification = async (id) => {
    // Note: Backend might need a delete route if we want to support this
    // For now, let's just mark as read or mock removal if no backend delete exists
    toast.info('Feature coming soon');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={24} />;
      case 'error': return <XCircle className="text-red-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-orange-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Notifications</h1>
          <p className="text-gray-400 text-sm">Stay updated with your store activity</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="text-xs font-bold text-primary-500 hover:text-primary-400 transition-all uppercase tracking-widest"
            onClick={() => notifications.forEach(n => !n.read && markAsRead(n._id))}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-white/5 rounded-3xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-16 text-center shadow-2xl">
            <div className="bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 text-gray-500">
              <Bell size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No notifications yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">
              We'll notify you when your products are approved, rejected, or when you receive new orders.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div 
                key={n._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative bg-slate-900 border ${n.read ? 'border-white/5 opacity-70' : 'border-primary-500/20 shadow-lg shadow-primary-900/5'} rounded-3xl p-6 transition-all hover:border-white/20`}
              >
                <div className="flex gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${n.read ? 'bg-slate-800' : 'bg-primary-500/10'}`}>
                    {getIcon(n.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold truncate pr-10 ${n.read ? 'text-gray-300' : 'text-white'}`}>{n.title}</h3>
                      <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-500' : 'text-gray-300'}`}>
                      {n.message}
                    </p>
                  </div>
                </div>

                <div className="absolute right-6 bottom-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.read && (
                    <button 
                      onClick={() => markAsRead(n._id)}
                      className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-500 shadow-lg shadow-primary-900/40 transition-all"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(n._id)}
                    className="p-2 bg-slate-800 text-gray-400 rounded-xl hover:bg-red-500/20 hover:text-red-500 border border-white/5 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {!n.read && (
                  <div className="absolute top-6 right-6">
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse shadow-lg shadow-primary-500/50"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default SellerNotifications;
