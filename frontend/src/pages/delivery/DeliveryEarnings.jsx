import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle,
  Clock,
  Download,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DeliveryEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await axios.get('/api/delivery/stats');
        setEarnings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const chartData = [
    { day: 'Mon', amount: 45 },
    { day: 'Tue', amount: 65 },
    { day: 'Wed', amount: 50 },
    { day: 'Thu', amount: 85 },
    { day: 'Fri', amount: 120 },
    { day: 'Sat', amount: 150 },
    { day: 'Sun', amount: 90 },
  ];

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
          <h1 className="text-2xl font-black text-white tracking-tight">Earnings Portfolio</h1>
          <p className="text-gray-400 text-sm">Track your daily income, bonuses, and COD collections</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20 font-bold uppercase tracking-widest text-xs">
          <Download size={18} /> Download Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-full blur-3xl"></div>
          <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400 w-fit mb-6"><DollarSign size={24} /></div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Earned</p>
          <p className="text-3xl font-black text-white">${earnings?.earnings || 0}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-400 font-bold">
            <ArrowUpRight size={14} /> +15.2% from last week
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full blur-3xl"></div>
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 w-fit mb-6"><Wallet size={24} /></div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Available for Payout</p>
          <p className="text-3xl font-black text-white">${(earnings?.earnings || 0) * 0.9}</p>
          <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <Clock size={12} /> Next Payout: May 25
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full blur-3xl"></div>
          <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-400 w-fit mb-6"><AlertCircle size={24} /></div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">COD Collections</p>
          <p className="text-3xl font-black text-white">$420.00</p>
          <p className="mt-4 text-[10px] text-orange-400 font-black uppercase tracking-widest">To be deposited</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-primary-400" /> Income Breakdown
            </h3>
            <div className="bg-slate-800 p-1 rounded-xl flex">
              <button className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold transition-all">Week</button>
              <button className="px-4 py-1.5 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-all">Month</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem' }}
                />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Recent Collections</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5 group hover:bg-slate-800 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400"><CheckCircle size={16} /></div>
                  <div>
                    <p className="text-white font-bold text-sm">COD #ORD-{820 + i}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Collected 2h ago</p>
                  </div>
                </div>
                <p className="text-white font-black text-sm">$129.00</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 border border-dashed border-slate-700 rounded-2xl text-gray-500 text-xs font-bold hover:text-white hover:border-slate-500 transition-all uppercase tracking-widest">
            Deposit to Vault
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryEarnings;
