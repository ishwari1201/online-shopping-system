import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get('/api/delivery/history');
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(h => 
    h._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Delivery History</h1>
        <p className="text-gray-400 text-sm">Review your past deliveries and performance logs</p>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-800 text-gray-400 rounded-xl text-xs font-bold border border-white/5">
              Total: {history.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5 text-center">Completed At</th>
                <th className="px-8 py-5 text-center">Earnings</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-bold italic">
                    No delivery history found
                  </td>
                </tr>
              ) : (
                filteredHistory.map((order) => (
                  <tr key={order._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-mono text-sm">#{order._id.substring(18).toUpperCase()}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">COD Shipment</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-bold">{new Date(order.deliveredAt || order.updatedAt).toLocaleDateString()}</span>
                        <span className="text-[10px] text-gray-500 uppercase font-black">{new Date(order.deliveredAt || order.updatedAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-green-500 font-black text-sm">+$40.00</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          order.deliveryStatus === 'Delivered' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {order.deliveryStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link 
                        to={`/delivery/order/${order._id}`}
                        className="p-2.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all inline-block"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory;
