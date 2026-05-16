import { useState } from 'react';
import { 
  Bell, 
  Package, 
  Truck, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', title: 'New Order Assigned', message: 'Order #O-9182 is assigned to you. Pick up by 4:00 PM.', time: '2 mins ago', unread: true },
    { id: 2, type: 'payout', title: 'Earnings Processed', message: 'Weekly earnings of $480.00 have been transferred to your bank.', time: '5 hours ago', unread: false },
    { id: 3, type: 'system', title: 'Weather Alert', message: 'Heavy rain expected. Drive safely and use rain covers for packages.', time: '1 day ago', unread: false },
  ]);

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <Truck className="text-blue-500" />;
      case 'payout': return <DollarSign className="text-green-500" />;
      default: return <Bell className="text-primary-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Activity Center</h1>
          <p className="text-gray-400 text-sm">Stay updated with order alerts and system notifications</p>
        </div>
        <button onClick={() => setNotifications([])} className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
          <Trash2 size={14} /> Clear All
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="bg-slate-900 border border-white/5 p-20 rounded-[2.5rem] text-center">
              <p className="text-gray-500 font-bold italic">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <motion.div 
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`bg-slate-900 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all flex gap-6 relative group ${notif.unread ? 'ring-1 ring-primary-500/30' : ''}`}
                onClick={() => markRead(notif.id)}
              >
                <div className="p-4 bg-slate-800 rounded-2xl h-fit">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-bold text-lg">{notif.title}</h4>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{notif.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{notif.message}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                  className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={18} />
                </button>
                {notif.unread && (
                  <div className="absolute top-6 left-6 w-3 h-3 bg-primary-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeliveryNotifications;
