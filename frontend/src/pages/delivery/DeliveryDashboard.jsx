import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Truck,
  MapPin,
  Clock,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon, subValue, color }) => (
  <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full blur-2xl`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 bg-${color}-500/10 rounded-2xl text-${color}-400`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{subValue}</span>
    </div>
    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-black text-white">{value}</p>
  </div>
);

const DeliveryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/delivery/stats');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 12 },
    { name: 'Sat', count: 15 },
    { name: 'Sun', count: 10 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Howdy, Partner!</h1>
          <p className="text-gray-400 mt-1">Ready to hit the road? You have {stats?.assignedCount || 0} deliveries waiting.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 p-2 pl-4 rounded-2xl border border-white/5">
          <span className="text-xs font-bold text-gray-400">Driver Rating</span>
          <div className="flex items-center gap-1 bg-primary-500/10 px-3 py-1.5 rounded-xl text-primary-400">
            <Star size={14} fill="currentColor" />
            <span className="font-black">4.9</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Assigned" 
          value={stats?.assignedCount || 0} 
          icon={<Truck size={24} />} 
          subValue="Active" 
          color="primary"
        />
        <StatCard 
          title="Completed" 
          value={stats?.completedCount || 0} 
          icon={<CheckCircle size={24} />} 
          subValue="Total" 
          color="green"
        />
        <StatCard 
          title="Failed" 
          value={stats?.failedCount || 0} 
          icon={<XCircle size={24} />} 
          subValue="Issues" 
          color="red"
        />
        <StatCard 
          title="Earnings" 
          value={`$${stats?.earnings || 0}`} 
          icon={<DollarSign size={24} />} 
          subValue="Today" 
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-primary-400" /> Delivery Performance
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem' }}
                />
                <Area type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">Recent Deliveries</h3>
          <div className="space-y-6">
            {stats?.recentDeliveries?.length > 0 ? (
              stats.recentDeliveries.map((delivery) => (
                <div key={delivery._id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white font-bold text-sm truncate">#{delivery._id.substring(18)}</p>
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{new Date(delivery.deliveredAt).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-600" />
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <ShoppingBag size={40} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 text-sm">No recent deliveries</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-4 bg-slate-800 text-gray-400 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:text-white transition-all">
            View All History
          </button>
        </div>
      </div>

      {/* Current Task Banner */}
      {stats?.assignedCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary-600 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-primary-900/40"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-3xl">
              <Navigation size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">Active Deliveries</h3>
              <p className="text-white/80 font-medium">Head over to the orders page to start your route.</p>
            </div>
          </div>
          <button className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
            View My Route
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
