import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Ticket, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar,
  Percent,
  Clock,
  Shield,
  Zap,
  Tag
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  
  // Form fields
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [minOrder, setMinOrder] = useState('');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/coupons');
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (editCoupon) {
        await axios.put(`/api/coupons/${editCoupon._id}`, { code, discount, expiryDate, minOrder });
        toast.success('Coupon updated');
      } else {
        await axios.post('/api/coupons', { code, discount, expiryDate, minOrder });
        toast.success('Coupon created');
      }
      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await axios.delete(`/api/coupons/${id}`);
        toast.success('Coupon deleted');
        fetchCoupons();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setCode('');
    setDiscount('');
    setExpiryDate('');
    setMinOrder('');
    setEditCoupon(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Coupon Management</h1>
          <p className="text-gray-400 text-sm">Create and manage marketing discount codes</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg shadow-accent/20"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by coupon code..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Coupon Code</th>
                <th className="px-8 py-5">Discount</th>
                <th className="px-8 py-5">Expiry Date</th>
                <th className="px-8 py-5 text-center">Min Order</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-bold">
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                          <Ticket size={20} />
                        </div>
                        <span className="font-mono text-lg font-black text-white tracking-wider">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-green-400 font-black">
                        <Percent size={14} />
                        {coupon.discount}% OFF
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock size={14} />
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-white font-bold text-sm">${coupon.minOrder || 0}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditCoupon(coupon); setCode(coupon.code); setDiscount(coupon.discount); setExpiryDate(coupon.expiryDate.split('T')[0]); setMinOrder(coupon.minOrder); setShowModal(true); }}
                          className="p-2.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteHandler(coupon._id)}
                          className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  {editCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
              </div>
              <form onSubmit={submitHandler} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Coupon Code</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all font-mono uppercase"
                      placeholder="SUMMER2026"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                    <Tag className="absolute left-4 top-4 text-gray-500" size={18} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Discount %</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="10"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Min Order ($)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="50"
                      value={minOrder}
                      onChange={(e) => setMinOrder(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Expiry Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <Calendar className="absolute left-4 top-4 text-gray-500" size={18} />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/80 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-accent/40"
                >
                  {editCoupon ? 'Update Coupon' : 'Generate Coupon'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;
