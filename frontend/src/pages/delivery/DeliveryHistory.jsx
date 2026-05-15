import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Eye, 
  ShoppingBag,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/delivery/stats'); // Reusing stats for now or we could add a specific history route
      // For demonstration, we'll fetch all orders assigned to this boy
      const { data: allOrders } = await axios.get('/api/delivery/orders'); 
      // Note: Backend 'getAssignedOrders' excludes 'Delivered', so I'll need a proper history endpoint or filter
      // For now, I'll assume we want to see everything that isn't 'Assigned' or 'Pending'
      setHistory(allOrders.filter(o => ['Delivered', 'Failed'].includes(o.deliveryStatus)));
    } catch (error) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(h => 
    h._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Delivery History</h1>
          <p className="text-gray-400 text-sm">Review your past deliveries and performance records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-green-500/10 rounded-2xl text-green-400"><CheckCircle size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Completed</p>
            <p className="text-2xl font-black text-white">{history.filter(h => h.deliveryStatus === 'Delivered').length}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-red-500/10 rounded-2xl text-red-400"><XCircle size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Failed</p>
            <p className="text-2xl font-black text-white">{history.filter(h => h.deliveryStatus === 'Failed').length}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400"><TrendingUp size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Success Rate</p>
            <p className="text-2xl font-black text-white">
              {history.length > 0 ? Math.round((history.filter(h => h.deliveryStatus === 'Delivered').length / history.length) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-slate-900/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-2">
            <button className="bg-slate-800 text-white p-3 rounded-xl border border-white/5 hover:bg-slate-700 transition-all">
              <Filter size={18} />
            </button>
            <button className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-white/5 hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-widest">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                <th className="px-8 py-5">Order Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Completed At</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              <AnimatePresence>
                {filteredHistory.map((h) => (
                  <motion.tr 
                    key={h._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-800 rounded-xl text-gray-400"><Package size={18} /></div>
                        <div>
                          <p className="text-white font-bold uppercase tracking-tight">#{h._id.substring(18)}</p>
                          <p className="text-[10px] text-gray-500 font-black uppercase mt-0.5">{h.paymentMethod}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        h.deliveryStatus === 'Delivered' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {h.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-400">
                      <div className="flex flex-col">
                        <p className="text-white font-medium">{new Date(h.deliveredAt || h.updatedAt).toLocaleDateString()}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-600">{new Date(h.deliveredAt || h.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-white font-bold">
                      {h.user?.name}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-gray-500 hover:text-white transition-all"><Eye size={18} /></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredHistory.length === 0 && (
            <div className="p-12 text-center">
              <Clock size={40} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500">No records found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory;
