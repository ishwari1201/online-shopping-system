import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  FileText,
  Calendar,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

const SellerEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seller/earnings');
      setEarnings(data);
    } catch (error) {
      console.error('Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const chartData = [
    { name: 'Mon', amount: 400 },
    { name: 'Tue', amount: 300 },
    { name: 'Wed', amount: 500 },
    { name: 'Thu', amount: 450 },
    { name: 'Fri', amount: 700 },
    { name: 'Sat', amount: 600 },
    { name: 'Sun', amount: 800 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Earnings & Finance</h1>
        <p className="text-gray-400 text-sm">Track your revenue, payouts, and marketplace commission</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign size={80} className="text-primary-500" />
          </div>
          <div className="p-4 bg-primary-500/10 text-primary-500 rounded-2xl w-fit mb-6">
            <Wallet size={24} />
          </div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-3xl font-black text-white">${earnings?.totalEarnings?.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold">
            <ArrowUpRight size={14} /> +12% from last month
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-2xl w-fit mb-6">
            <Clock size={24} />
          </div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Pending Payouts</p>
          <h3 className="text-3xl font-black text-white">${earnings?.pendingPayouts?.toLocaleString()}</h3>
          <p className="text-gray-500 text-[10px] mt-2 font-bold uppercase tracking-tighter italic">* Commission of 10% deducted</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl w-fit mb-6">
            <CheckCircle size={24} />
          </div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Successful Payouts</p>
          <h3 className="text-3xl font-black text-white">$0.00</h3>
          <p className="text-gray-500 text-xs mt-2">Next payout scheduled for Monday</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Earnings Trend</h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <FileText size={20} />
            </div>
            <h3 className="text-white font-bold text-lg">Recent Payouts</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 text-center py-12">
              <p className="text-gray-500 text-sm italic">No payout history yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;
