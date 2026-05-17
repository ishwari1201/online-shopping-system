import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Plus
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
import { Link } from 'react-router-dom';

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
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, monthlySales, recentOrders } = data || {};

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header & Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Store Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/seller/orders" className="flex-1 md:flex-none text-center bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
              View Orders
            </Link>
            <Link to="/seller/add-product" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm">
              <Plus size={16} /> New Product
            </Link>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. Main Revenue Chart (Spans 2 columns) */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
                  Total Revenue <TrendingUp size={14} className="text-emerald-500" />
                </p>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                    ₹{(stats?.totalRevenue || 0).toLocaleString()}
                  </h2>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center">
                    <ArrowUpRight size={14} /> 12.5%
                  </span>
                </div>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg px-3 py-1.5 outline-none hover:bg-gray-100 transition-colors cursor-pointer">
                <option>This Year</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            
            <div className="h-[240px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales || []} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 6px -1px rgb(0,0,0,0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                    cursor={{ stroke: '#d1d5db', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#111827" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Side Stacked Cards (Column 3) */}
          <div className="flex flex-col gap-6">
            {/* Orders Metric */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex-1 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingCart size={20} strokeWidth={2} />
                </div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</h3>
              </div>
            </div>

            {/* Inventory / Action Required */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <Package size={20} strokeWidth={2} />
                </div>
                {stats?.lowStockCount > 0 && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Active Listings</p>
              <div className="flex items-end gap-3 mb-3">
                <h3 className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</h3>
              </div>
              
              {stats?.lowStockCount > 0 ? (
                <Link to="/seller/inventory" className="mt-auto flex items-center justify-between bg-red-50 text-red-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                  <span>{stats.lowStockCount} items low in stock</span>
                  <ChevronRight size={14} />
                </Link>
              ) : (
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> All stock healthy
                </div>
              )}
            </div>
          </div>

          {/* 3. Recent Orders Table (Spans 2 columns) */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <Link to="/seller/orders" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders?.length > 0 ? (
                    recentOrders.slice(0,5).map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <Link to={`/seller/orders`} className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            #{order._id.substring(18).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600 capitalize">
                          {order.user?.name || 'Guest'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 
                            order.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                          ₹{(order.totalPrice || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-gray-500">No recent orders found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Action Center / Pending Items (Column 3) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Action Center</h3>
            
            <div className="space-y-4 flex-1">
              {/* Pending Review Alert */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Pending Reviews</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{stats?.pendingProducts || 0} items waiting for admin approval.</p>
                </div>
              </div>

              {/* Notification Link */}
              <Link to="/seller/notifications" className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Notifications</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Check latest updates & alerts.</p>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
