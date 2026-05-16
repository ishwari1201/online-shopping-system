import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/admin/analytics');
        setAnalyticsData(data);
      } catch (error) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#fb923c'];

  const salesTrend = [
    { name: 'Week 1', revenue: 45000, orders: 120 },
    { name: 'Week 2', revenue: 52000, orders: 145 },
    { name: 'Week 3', revenue: 48000, orders: 132 },
    { name: 'Week 4', revenue: 61000, orders: 168 },
    { name: 'Week 5', revenue: 55000, orders: 150 },
    { name: 'Week 6', revenue: 67000, orders: 185 },
  ];

  const categoryDistribution = [
    { name: 'Electronics', value: 45 },
    { name: 'Fashion', value: 30 },
    { name: 'Home', value: 15 },
    { name: 'Beauty', value: 10 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Advanced Analytics</h1>
          <p className="text-gray-400 text-sm">Deep dive into marketplace growth and financial performance</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-white/5 text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-2">
            <Calendar size={14} /> Last 6 Months
          </button>
          <button className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary-500 transition-all flex items-center gap-2">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Growth Chart */}
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Revenue Growth</h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume Chart */}
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                <ShoppingCart size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Order Volume</h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                />
                <Bar dataKey="orders" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-8">Category Market Share</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-400 text-xs">{item.name}</span>
                </div>
                <span className="text-white font-black text-sm">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-8">User Acquisition</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip />
                <Line type="stepAfter" dataKey="orders" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl text-white">
            <h4 className="font-bold text-lg">Acquisition Surge!</h4>
            <p className="text-white/80 text-sm mt-1">Your user base grew by 24% this month due to the Summer Sale campaign.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
