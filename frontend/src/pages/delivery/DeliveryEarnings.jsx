import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight,
  BarChart3,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

const DeliveryEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await axios.get('/api/delivery/earnings');
        setEarnings(data);
      } catch (error) {
        console.error('Failed to fetch earnings');
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const data = [
    { name: 'Mon', amount: 160 },
    { name: 'Tue', amount: 200 },
    { name: 'Wed', amount: 120 },
    { name: 'Thu', amount: 280 },
    { name: 'Fri', amount: 240 },
    { name: 'Sat', amount: 400 },
    { name: 'Sun', amount: 320 },
  ];

  if (loading) return <div className="text-center py-20 text-white">Loading Financial Data...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Earnings & Payouts</h1>
          <p className="text-gray-400 text-sm">Track your delivery rewards and withdrawal status</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary-900/20">
          Request Payout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Wallet size={100} />
          </div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Lifetime Earnings</p>
          <h3 className="text-3xl font-black text-white">${earnings?.total || 0}</h3>
          <div className="mt-6 flex items-center gap-2 text-green-500 text-xs font-bold">
            <TrendingUp size={14} /> +12% this week
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Today's Profit</p>
          <h3 className="text-3xl font-black text-white">${earnings?.today || 0}</h3>
          <div className="mt-6 flex items-center gap-2 text-gray-400 text-xs font-bold">
            <Clock size={14} /> Next payout in 2 days
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-4 -right-4 bg-yellow-500/10 text-yellow-500 p-8 rounded-full">
            <Award size={40} />
          </div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Performance Bonus</p>
          <h3 className="text-3xl font-black text-white">$120</h3>
          <div className="mt-6 text-yellow-500/80 text-[10px] font-black uppercase tracking-widest">Top Partner Badge Active</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-bold text-lg flex items-center gap-3">
              <BarChart3 size={20} className="text-primary-500" /> Earnings History
            </h3>
            <div className="flex bg-slate-800 rounded-xl p-1 border border-white/5">
              <button className="px-4 py-1.5 bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Week</button>
              <button className="px-4 py-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white">Month</button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#6366f1' : '#1e293b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {earnings?.history?.slice(0, 5).map((log, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-green-500/10 text-green-500 rounded-xl">
                    <CheckCircle size={14} />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">Delivery Commission</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">{new Date(log.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-white font-black text-sm">+${log.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryEarnings;
