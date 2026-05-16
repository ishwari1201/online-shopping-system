import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ChevronRight,
  PlusCircle,
  ArrowUpRight,
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
  Bar
} from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-xl hover:border-white/10 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} /> {trend}%
        </div>
      )}
    </div>
    <div>
      <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
  </motion.div>
);

const SellerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get('/api/seller/dashboard/stats');
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

  const { stats, monthlySales, recentOrders } = data || {};

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Seller Central</h1>
          <p className="text-gray-400 text-sm">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link to="/seller/add-product" className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20">
            <PlusCircle size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString()}`} icon={DollarSign} color="primary" trend="15.4" />
        <StatCard title="Total Orders" value={stats?.totalOrders} icon={ShoppingCart} color="purple" trend="8.2" />
        <StatCard title="Active Products" value={stats?.totalProducts} icon={Package} color="blue" />
        <StatCard title="Pending Review" value={stats?.pendingProducts} icon={Clock} color="orange" />
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Sales Chart */}
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
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Recent Orders</h3>
              <Link to="/seller/orders" className="text-primary-500 text-xs font-bold hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-gray-500 font-black border-b border-white/5">
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders?.map((order) => (
                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 font-mono text-gray-400">#{order._id.substring(18).toUpperCase()}</td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-white font-bold">{order.user?.name}</td>
                      <td className="px-8 py-5 text-right text-white font-black">${order.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Low Stock Alert */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Inventory Alerts</h3>
            </div>
            {stats?.lowStockCount > 0 ? (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">{stats.lowStockCount} products are running low on stock. Restock soon to avoid missing sales.</p>
                <Link to="/seller/inventory" className="block w-full text-center py-3 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-white/5">
                  Manage Stock
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">All products are well-stocked.</p>
            )}
          </div>

          {/* Activity Widget */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                <Activity size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Link to="/seller/profile" className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5 hover:border-primary-500/50 transition-all group">
                <span className="text-sm text-gray-300 font-bold">Update Store Profile</span>
                <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/seller/notifications" className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5 hover:border-primary-500/50 transition-all group">
                <span className="text-sm text-gray-300 font-bold">Check Notifications</span>
                <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
