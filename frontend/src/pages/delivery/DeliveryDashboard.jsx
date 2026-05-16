import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Navigation,
  ArrowUpRight,
  ChevronRight
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
import { Link } from 'react-router-dom';

const DeliveryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/delivery/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch delivery stats');
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
    { name: 'Thu', count: 12 },
    { name: 'Fri', count: 9 },
    { name: 'Sat', count: 15 },
    { name: 'Sun', count: 10 },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  const cards = [
    { title: 'Assigned Orders', value: stats?.assigned || 0, icon: Truck, color: 'primary' },
    { title: 'In Progress', value: stats?.pending || 0, icon: Navigation, color: 'blue' },
    { title: 'Today Earnings', value: `$${stats?.totalEarnings || 0}`, icon: DollarSign, color: 'green' },
    { title: 'Completed', value: stats?.delivered || 0, icon: CheckCircle, color: 'purple' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Delivery Console</h1>
          <p className="text-gray-400 text-sm">Welcome back! You have {stats?.assigned} new orders waiting.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Accepting Orders
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-xl hover:border-white/10 transition-all group"
          >
            <div className={`p-4 rounded-2xl w-fit mb-4 bg-${card.color}-500/10 text-${card.color}-500`}>
              <card.icon size={24} />
            </div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">{card.title}</p>
            <h3 className="text-2xl font-black text-white mt-1 group-hover:scale-105 transition-transform origin-left">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-bold text-lg">Weekly Performance</h3>
            <div className="text-primary-500 text-xs font-bold flex items-center gap-2">
              <TrendingUp size={14} /> +24% growth
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-6">Recent Assignments</h3>
          <div className="space-y-4">
            {stats?.recentDeliveries?.length > 0 ? (
              stats.recentDeliveries.map((order) => (
                <Link 
                  to={`/delivery/order/${order._id}`} 
                  key={order._id}
                  className="block p-4 bg-slate-800/50 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-bold truncate w-32">Order #{order._id.substring(18).toUpperCase()}</p>
                      <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-1">{order.deliveryStatus}</p>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" size={18} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm italic">No recent activity</p>
              </div>
            )}
          </div>
          <Link to="/delivery/orders" className="block text-center mt-6 text-primary-500 text-xs font-black uppercase tracking-widest hover:underline">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
