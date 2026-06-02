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

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Week,Revenue,Orders\n"
      + salesTrend.map(e => `${e.name},${e.revenue},${e.orders}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
  const summary = analyticsData?.summary || {};
  const productAnalytics = analyticsData?.productAnalytics || [];
  const sellerAnalytics = analyticsData?.sellerAnalytics || [];

  const salesTrend = analyticsData?.salesData?.map((row) => ({
    name: `${row._id.month}/${row._id.year}`,
    revenue: row.totalSales,
    orders: row.count,
    commission: row.commission,
  })) || [
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(summary.totalRevenue || 0).toLocaleString()}`, icon: DollarSign },
          { label: 'Subscription Revenue', value: `₹${(summary.subscriptionRevenue || 0).toLocaleString()}`, icon: TrendingUp },
          { label: 'Commission Revenue', value: `₹${(summary.commissionRevenue || 0).toLocaleString()}`, icon: ShoppingCart },
          { label: 'Total Sellers', value: summary.totalSellers ?? 0, icon: Users },
          { label: 'Total Users', value: summary.totalUsers ?? 0, icon: Users },
          { label: 'Total Orders', value: summary.totalOrders ?? 0, icon: ShoppingCart },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <Icon size={18} className="text-[#E91E63] mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
            <p className="text-xl font-black text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Deep dive into marketplace growth and financial performance</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-600 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-2 shadow-sm">
            <Calendar size={14} /> Last 6 Months
          </button>
          <button onClick={handleExport} className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
            <Download size={14} className="text-gray-900" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Growth Chart */}
        <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-50 text-primary-600 border border-primary-100 rounded-xl">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">Revenue Growth</h3>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume Chart */}
        <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl">
                <ShoppingCart size={20} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">Order Volume</h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', color: '#0f172a' }}
                />
                <Bar dataKey="orders" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm">
          <h3 className="text-gray-900 font-bold text-lg mb-8">Category Market Share</h3>
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
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-500 text-xs font-medium">{item.name}</span>
                </div>
                <span className="text-gray-900 font-black text-sm">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm">
          <h3 className="text-gray-900 font-bold text-lg mb-8">User Acquisition</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip />
                <Line type="stepAfter" dataKey="orders" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl text-white shadow-md">
            <h4 className="font-bold text-lg">Acquisition Surge!</h4>
            <p className="text-white/80 text-sm mt-1">Your user base grew by 24% this month due to the Summer Sale campaign.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white border border-gray-200 rounded-[2rem] p-6 overflow-x-auto">
          <h3 className="font-black text-lg text-gray-900 mb-4">Product Analytics</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-gray-400 border-b">
              <tr>
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Seller</th>
                <th className="py-3 pr-4">Sales</th>
                <th className="py-3 pr-4">Revenue</th>
                <th className="py-3 pr-4">Admin Comm.</th>
                <th className="py-3 pr-4">Seller Earn.</th>
                <th className="py-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {productAnalytics.slice(0, 15).map((p) => (
                <tr key={p._id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-semibold">{p.name}</td>
                  <td className="py-3 pr-4 text-gray-500">{p.sellerName}</td>
                  <td className="py-3 pr-4">{p.totalSales}</td>
                  <td className="py-3 pr-4">₹{p.revenue}</td>
                  <td className="py-3 pr-4 text-[#E91E63]">₹{p.adminCommission}</td>
                  <td className="py-3 pr-4">₹{p.sellerEarning}</td>
                  <td className="py-3">{p.countInStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-gray-200 rounded-[2rem] p-6 overflow-x-auto">
          <h3 className="font-black text-lg text-gray-900 mb-4">Seller Analytics</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-gray-400 border-b">
              <tr>
                <th className="py-3 pr-4">Store</th>
                <th className="py-3 pr-4">Plan</th>
                <th className="py-3 pr-4">Commission %</th>
                <th className="py-3 pr-4">Revenue</th>
                <th className="py-3 pr-4">Admin Comm.</th>
                <th className="py-3 pr-4">Wallet</th>
                <th className="py-3">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {sellerAnalytics.map((s) => (
                <tr key={s._id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-semibold">{s.storeName || s.name}</td>
                  <td className="py-3 pr-4">{s.subscriptionPlan || '—'}</td>
                  <td className="py-3 pr-4">{s.commissionRate || 0}%</td>
                  <td className="py-3 pr-4">₹{s.sellerRevenue}</td>
                  <td className="py-3 pr-4 text-[#E91E63]">₹{s.adminCommission}</td>
                  <td className="py-3 pr-4">₹{s.walletBalance}</td>
                  <td className="py-3">
                    {s.planExpiry ? new Date(s.planExpiry).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
