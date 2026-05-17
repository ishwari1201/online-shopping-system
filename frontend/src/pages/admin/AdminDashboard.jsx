import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-gray-200 p-6 rounded-[2rem] shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 border border-${color}-100 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}%
        </div>
      )}
    </div>
    <div>
      <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-900">{value}</h3>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get('/api/admin/dashboard/stats');
        setData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const stats = data?.stats || {};

  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const pieData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home', value: 300 },
    { name: 'Others', value: 200 },
  ];

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Marketplace Overview</h1>
          <p className="text-gray-500 text-sm">Real-time performance analytics and management</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-2 shadow-sm">
            <Clock size={14} /> Last 24 Hours
          </button>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} icon={DollarSign} color="primary" trend="up" trendValue="12.5" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="purple" trend="up" trendValue="8.2" />
        <StatCard title="Active Users" value={stats.totalUsers} icon={Users} color="pink" trend="up" trendValue="5.1" />
        <StatCard title="Total Sellers" value={stats.totalSellers} icon={Store} color="blue" trend="up" trendValue="2.4" />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-blue-100 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-50/50 pointer-events-none"></div>
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20 relative z-10">
            <Store size={24} />
          </div>
          <div className="relative z-10">
            <h4 className="text-blue-900 font-bold">New Sellers</h4>
            <p className="text-blue-700/80 text-sm">Review vendor applications</p>
          </div>
          <button onClick={() => navigate('/admin/sellers')} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all relative z-10 shadow-sm">Review</button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-orange-100 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-orange-50/50 pointer-events-none"></div>
          <div className="bg-orange-500 p-4 rounded-2xl text-white shadow-lg shadow-orange-500/20 relative z-10">
            <AlertTriangle size={24} />
          </div>
          <div className="relative z-10">
            <h4 className="text-orange-900 font-bold">Products</h4>
            <p className="text-orange-700/80 text-sm">{stats.pendingProducts} pending review</p>
          </div>
          <button onClick={() => navigate('/admin/products/pending')} className="ml-auto bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-400 transition-all relative z-10 shadow-sm">Check</button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-red-100 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-50/50 pointer-events-none"></div>
          <div className="bg-red-500 p-4 rounded-2xl text-white shadow-lg shadow-red-500/20 relative z-10">
            <Package size={24} />
          </div>
          <div className="relative z-10">
            <h4 className="text-red-900 font-bold">Low Stock</h4>
            <p className="text-red-700/80 text-sm">{stats.lowStockProducts} items left</p>
          </div>
          <button onClick={() => navigate('/admin/inventory')} className="ml-auto bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-400 transition-all relative z-10 shadow-sm">Stock</button>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-50 text-primary-600 border border-primary-100 rounded-xl">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">Sales Performance</h3>
            </div>
            <select className="bg-gray-50 text-gray-900 text-xs border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '1rem', color: '#111827' }}
                  itemStyle={{ color: '#4f46e5' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl">
              <Activity size={20} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">Categories</h3>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '1rem', color: '#111827' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-500 font-medium">{item.name}</span>
                </div>
                <span className="text-gray-900 font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-gray-900 font-bold text-lg">Recent Orders</h3>
          <button className="text-primary-600 text-xs font-bold hover:underline">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-500 font-black border-b border-gray-100 bg-gray-50/50">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 text-sm font-mono text-gray-500">#{order._id.substring(18).toUpperCase()}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">{order.user?.name}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-200' :
                      order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-gray-900">₹{order.totalPrice}</td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
