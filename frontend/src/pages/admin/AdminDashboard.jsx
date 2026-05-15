import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
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
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  const statCards = [
    { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-400">{item.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{item.value}</p>
                </div>
                <div className={`p-4 rounded-xl ${item.bg}`}>
                  <Icon size={24} className={item.color} />
                </div>
              </div>
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${item.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary-500" /> Revenue Analytics
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.salesData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff' }}
                  itemStyle={{ color: '#0ea5e9' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">New order received</p>
                  <p className="text-xs text-gray-500 mt-1">Order #102{i} from John Doe</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">2h ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
