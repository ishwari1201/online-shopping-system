import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  Clock, 
  FileText,
  Download,
  Calendar,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SellerEarnings = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await axios.get('/api/seller/stats');
        setEarningsData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Earnings & Payouts</h1>
          <p className="text-gray-400 text-sm">Monitor your revenue, commissions, and upcoming payouts</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20 font-bold">
          <Download size={18} /> Export Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-full blur-3xl"></div>
          <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400 w-fit mb-6">
            <DollarSign size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-white">${earningsData?.totalRevenue?.toFixed(2)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-400 font-bold">
            <ArrowUpRight size={14} /> +12.5% from last month
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full blur-3xl"></div>
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 w-fit mb-6">
            <Wallet size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Available for Payout</p>
          <p className="text-3xl font-black text-white">${(earningsData?.totalRevenue * 0.85).toFixed(2)}</p>
          <p className="mt-4 text-xs text-gray-500">Includes 15% platform commission</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full blur-3xl"></div>
          <div className="p-4 bg-accent/10 rounded-2xl text-accent w-fit mb-6">
            <Clock size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Next Payout</p>
          <p className="text-3xl font-black text-white">May 25, 2026</p>
          <p className="mt-4 text-xs text-primary-400 font-bold">Estimated: $1,240.00</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-primary-400" /> Revenue Breakdown
            </h3>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-all">
                <Calendar size={18} />
              </button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData?.monthlySales}>
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
                />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem' }}
                />
                <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Payout History</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Payout #{i}829</p>
                    <p className="text-gray-500 text-xs">April {10 + i}, 2026</p>
                  </div>
                </div>
                <p className="text-white font-black text-sm">$840.00</p>
              </div>
            ))}
            <button className="w-full py-4 text-xs font-bold text-gray-400 hover:text-white transition-colors border border-dashed border-slate-700 rounded-2xl hover:border-slate-500 transition-all">
              View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;
