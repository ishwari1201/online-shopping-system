import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, 
  Package, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">NOTIFICATIONS</h1>
            <p className="text-gray-400 text-sm mt-1">Stay updated with the latest marketplace activities</p>
          </div>
          <button 
            onClick={markAllRead}
            className="px-6 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/10 transition-all"
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-20 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-500">
              <Bell size={32} />
            </div>
            <h3 className="text-white font-bold text-lg">No Notifications</h3>
            <p className="text-gray-500 text-sm mt-2">When something happens in the marketplace, we'll let you know.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notifications.map((n) => (
                <motion.div 
                  key={n._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group relative bg-slate-900 border border-white/5 p-6 rounded-3xl transition-all hover:border-white/10 ${!n.isRead ? 'shadow-[0_0_20px_rgba(99,102,241,0.05)]' : 'opacity-60'}`}
                >
                  {!n.isRead && <div className="absolute top-6 right-6 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>}
                  
                  <div className="flex gap-6">
                    <div className={`p-4 rounded-2xl h-fit ${
                      n.type === 'success' ? 'bg-green-500/10 text-green-500' : 
                      n.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-primary-500/10 text-primary-500'
                    }`}>
                      <Package size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg ${!n.isRead ? 'text-white' : 'text-gray-400'}`}>{n.title}</h3>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
                          <Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">{n.message}</p>
                      
                      <div className="flex gap-3">
                        {n.order && (
                          <button 
                            onClick={() => { markAsRead(n._id); navigate(`/order/${n.order}`); }}
                            className="px-4 py-2 bg-primary-600/10 text-primary-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-600 hover:text-white transition-all flex items-center gap-2"
                          >
                            <ExternalLink size={12} /> View Order Details
                          </button>
                        )}
                        {!n.isRead && (
                          <button 
                            onClick={() => markAsRead(n._id)}
                            className="px-4 py-2 bg-slate-800 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:text-white transition-all"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
