import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
  <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-bl-full blur-3xl group-hover:bg-${color}-500/20 transition-all duration-500`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 bg-${color}-500/10 rounded-2xl text-${color}-400`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}
      </div>
    </div>
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-black text-white">{value}</p>
  </div>
);

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/seller/stats');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Seller Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your store today.</p>
        </div>
        {stats?.sellerStatus !== 'approved' && (
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-orange-500 font-bold text-sm uppercase tracking-wider">Account Pending Approval</p>
              <p className="text-orange-500/70 text-xs font-medium">Please wait for an administrator to verify your store.</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats?.productsCount || 0} 
          icon={<Package size={24} />} 
          trend="up" 
          trendValue="+12%" 
          color="primary"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={<ShoppingBag size={24} />} 
          trend="up" 
          trendValue="+5%" 
          color="purple"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} 
          icon={<DollarSign size={24} />} 
          trend="up" 
          trendValue="+18%" 
          color="green"
        />
        <StatCard 
          title="Low Stock" 
          value={stats?.lowStockCount || 0} 
          icon={<AlertTriangle size={24} />} 
          trend="down" 
          trendValue="-2%" 
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-primary-400" /> Sales Analytics
            </h3>
            <select className="bg-slate-800 text-white text-xs border-none rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlySales}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">Best Sellers</h3>
          <div className="space-y-6">
            {stats?.recentProducts?.map((product) => (
              <div key={product._id} className="flex items-center gap-4">
                <img 
                  src={product.images?.[0]} 
                  alt={product.name} 
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-white font-bold truncate text-sm">{product.name}</p>
                  <p className="text-gray-500 text-xs">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">${product.price}</p>
                  <p className="text-primary-400 text-[10px] font-bold">128 Sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Recent Orders</h3>
          <button className="text-primary-400 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-gray-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4 text-white font-medium">#{order._id.substring(18).toUpperCase()}</td>
                    <td className="px-8 py-4 text-gray-300">{order.user?.name || 'Guest'}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${order.isDelivered ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-white font-bold">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-primary-400 hover:text-white transition-colors font-bold">Details</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-gray-500">No recent orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
