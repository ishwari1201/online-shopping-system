import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Eye, 
  Calendar,
  Filter,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const SellerAnalytics = () => {
  const data = [
    { name: 'Jan', sales: 4000, views: 2400 },
    { name: 'Feb', sales: 3000, views: 1398 },
    { name: 'Mar', sales: 2000, views: 9800 },
    { name: 'Apr', sales: 2780, views: 3908 },
    { name: 'May', sales: 1890, views: 4800 },
    { name: 'Jun', sales: 2390, views: 3800 },
  ];

  const categoryData = [
    { name: 'Mens Wear', value: 400 },
    { name: 'Womens Wear', value: 300 },
    { name: 'Accessories', value: 200 },
  ];

  const COLORS = ['#6366f1', '#a855f7', '#ec4899'];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Store Analytics</h1>
          <p className="text-gray-400 text-sm">Detailed performance metrics for your marketplace business</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 text-white px-4 py-2 rounded-xl border border-white/5 text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-2">
            <Calendar size={14} /> Last 30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales vs Views */}
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
              <BarChart2 size={20} />
            </div>
            <h3 className="text-white font-bold text-lg">Sales vs Views</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Distribution */}
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <PieIcon size={20} />
            </div>
            <h3 className="text-white font-bold text-lg">Inventory Share</h3>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-xs text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl flex items-center gap-6">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Store Views</p>
            <h4 className="text-xl font-black text-white">28,490</h4>
          </div>
        </div>
        <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl flex items-center gap-6">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Conversion Rate</p>
            <h4 className="text-xl font-black text-white">4.2%</h4>
          </div>
        </div>
        <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl flex items-center gap-6">
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Repeat Customers</p>
            <h4 className="text-xl font-black text-white">18%</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
