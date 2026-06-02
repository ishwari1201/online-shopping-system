import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DollarSign, Wallet, ArrowUpRight, Clock, CheckCircle, BarChart3, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

/**
 * SellerEarnings – Premium earnings dashboard using the luxury pink theme.
 */
const SellerEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

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

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    setWithdrawing(true);
    try {
      await axios.post('/api/seller/withdraw', { amount }, { withCredentials: true });
      toast.success('Withdrawal request submitted');
      setWithdrawAmount('');
      fetchEarnings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  // Mock chart data – replace with real analytics when available
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
      <div className="flex items-center justify-center min-h-[60vh] bg-[#fff7fa]">
        <div className="w-10 h-10 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#fff7fa] pb-24 font-sans text-[#212a2f]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-[#212a2f] mb-2">Earnings &amp; Finance</h1>
          <p className="text-sm text-[#212a2f]/70">Track revenue, pending payouts, and upcoming settlements.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Revenue */}
          <div className="relative rounded-2xl p-6 glass-card">
            <div className="w-12 h-12 bg-[#E91E63]/10 text-[#E91E63] rounded-xl flex items-center justify-center mb-4">
              <DollarSign size={28} strokeWidth={2} />
            </div>
            <p className="text-[#212a2f]/70 text-sm font-semibold mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-[#212a2f]">
              ₹{(earnings?.totalEarnings || 0).toLocaleString()}
            </h3>
            <div className="mt-4 flex items-center gap-1.5 text-[#E91E63] text-xs font-bold bg-[#E91E63]/10 w-fit px-2 py-1 rounded-md">
              <ArrowUpRight size={14} /> 12% from last month
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="relative rounded-2xl p-6 glass-card">
            <div className="w-12 h-12 bg-[#F8BBD0]/10 text-[#F8BBD0] rounded-xl flex items-center justify-center mb-4">
              <Wallet size={28} strokeWidth={2} />
            </div>
            <p className="text-[#212a2f]/70 text-sm font-semibold mb-1">Wallet Balance</p>
            <h3 className="text-3xl font-black text-[#212a2f]">
              ₹{(earnings?.walletBalance || 0).toLocaleString()}
            </h3>
            <p className="text-[#212a2f]/50 text-[11px] mt-2 font-medium">
              Plan: {earnings?.subscriptionPlan || '—'} · {earnings?.commissionRate}% commission
            </p>
          </div>

          {/* Commission Paid */}
          <div className="relative rounded-2xl p-6 glass-card">
            <div className="w-12 h-12 bg-[#D4A373]/10 text-[#D4A373] rounded-xl flex items-center justify-center mb-4">
              <CheckCircle size={28} strokeWidth={2} />
            </div>
            <p className="text-[#212a2f]/70 text-sm font-semibold mb-1">Commission to Admin</p>
            <h3 className="text-3xl font-black text-[#212a2f]">
              ₹{(earnings?.totalCommissionPaid || 0).toLocaleString()}
            </h3>
            <p className="text-[#212a2f]/50 text-xs font-medium mt-2">
              Expires: {earnings?.planExpiry ? new Date(earnings.planExpiry).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#FCE4EC] p-6 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Withdraw to bank</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={`Max ₹${earnings?.walletBalance || 0}`}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#E91E63] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawing || !earnings?.walletBalance}
            className="px-8 py-3 rounded-xl bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#D81B60] disabled:opacity-50"
          >
            {withdrawing ? 'Submitting...' : 'Request Withdrawal'}
          </button>
        </div>

        {/* Chart and History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Earnings Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#E91E63]/10 text-[#E91E63] rounded-lg flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-lg font-black text-[#212a2f]">Earnings Trend</h3>
            </div>
            <div className="h-[300px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E91E63" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#E91E63', fontWeight: 'bold' }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#E91E63" strokeWidth={3} fillOpacity={1} fill="url(#colorPink)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Payouts Sidebar */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 bg-[#F8BBD0]/10 text-[#F8BBD0] rounded-lg flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="text-lg font-black text-[#212a2f]">Recent Payouts</h3>
            </div>
            <div className="space-y-3 max-h-[320px] overflow-y-auto">
              {(earnings?.payoutHistory || []).length === 0 ? (
                <div className="p-4 bg-[#fff7fa] rounded-xl border border-[#e5e7eb] text-center py-8">
                  <p className="text-[#212a2f]/70 text-sm font-medium">No withdrawal requests yet.</p>
                </div>
              ) : (
                earnings.payoutHistory.map((w) => (
                  <div
                    key={w._id}
                    className="p-3 bg-[#fff7fa] rounded-xl border border-[#e5e7eb] flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-sm">₹{w.amount}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(w.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        w.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : w.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerEarnings;
