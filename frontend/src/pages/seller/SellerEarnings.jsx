import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  FileText,
  CheckCircle,
  BarChart3
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

const SellerEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seller/earnings');
      setEarnings(data);
    } catch (error) {
      console.error('Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const chartData = [
    { name: 'Mon', amount: 4000 },
    { name: 'Tue', amount: 3000 },
    { name: 'Wed', amount: 5000 },
    { name: 'Thu', amount: 4500 },
    { name: 'Fri', amount: 7000 },
    { name: 'Sat', amount: 6000 },
    { name: 'Sun', amount: 8000 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Earnings & Finance</h1>
          <p className="text-sm text-gray-500 mt-1">Track your revenue, pending payouts, and settlements.</p>
        </div>

        {/* Bento Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Wallet size={24} strokeWidth={2} />
            </div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{(earnings?.totalEarnings || 0).toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 w-fit px-2 py-1 rounded-md">
              <ArrowUpRight size={14} /> 12% from last month
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Clock size={24} strokeWidth={2} />
            </div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Pending Payouts</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{(earnings?.pendingPayouts || 0).toLocaleString()}</h3>
            <p className="text-gray-400 text-[11px] mt-2 font-medium italic">* Subject to standard processing time</p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle size={24} strokeWidth={2} />
            </div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Successful Payouts</p>
            <h3 className="text-3xl font-bold text-gray-900">₹0</h3>
            <p className="text-gray-500 text-xs font-medium mt-2">Next settlement scheduled for Monday</p>
          </div>
        </div>

        {/* Charts and Tables Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Earnings Trend</h3>
              </div>
            </div>
            <div className="h-[300px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 6px -1px rgb(0,0,0,0.1)' }}
                    itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Recent Payouts</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center py-12">
                <p className="text-gray-500 text-sm font-medium">No payout history yet.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;
