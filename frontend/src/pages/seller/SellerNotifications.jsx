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
    toast.info('Feature coming soon');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-emerald-600" size={24} />;
      case 'error': return <XCircle className="text-red-600" size={24} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={24} />;
      default: return <Info className="text-blue-600" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">Stay updated with your store activity and alerts.</p>
          </div>
          <button 
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            onClick={() => notifications.forEach(n => !n.read && markAsRead(n._id))}
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 text-gray-400">
                <Bell size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                We'll notify you when your products are approved, rejected, or when you receive new orders.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((n) => (
                <motion.div 
                  key={n._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative bg-white border ${n.read ? 'border-gray-200 shadow-sm' : 'border-blue-200 shadow-[0_4px_12px_rgb(59,130,246,0.12)]'} rounded-2xl p-6 transition-all hover:shadow-md`}
                >
                  <div className="flex gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-gray-50 border border-gray-100' : 'bg-blue-50 border border-blue-100'}`}>
                      {getIcon(n.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-start mb-1.5">
                        <h3 className={`font-bold text-sm truncate pr-10 ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</h3>
                        <span className="text-xs font-semibold text-gray-500 whitespace-nowrap flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {n.message}
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-6 bottom-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read && (
                      <button 
                        onClick={() => markAsRead(n._id)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(n._id)}
                      className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200 hover:border-red-200"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {!n.read && (
                    <div className="absolute top-6 right-6">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_0_4px_rgb(59,130,246,0.2)]"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerNotifications;
