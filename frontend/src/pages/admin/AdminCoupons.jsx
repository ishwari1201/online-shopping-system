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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Coupon Management</h1>
          <p className="text-gray-500 text-sm">Create and manage marketing discount codes</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} className="text-gray-900" /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by coupon code..." 
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-gray-100">
                <th className="px-8 py-5">Coupon Code</th>
                <th className="px-8 py-5">Discount</th>
                <th className="px-8 py-5">Expiry Date</th>
                <th className="px-8 py-5 text-center">Min Order</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
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
                  <tr key={coupon._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl border border-primary-100">
                          <Ticket size={20} />
                        </div>
                        <span className="font-mono text-lg font-black text-gray-900 tracking-wider">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-green-600 font-black">
                        <Percent size={14} />
                        {coupon.discount}% OFF
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <Clock size={14} />
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-gray-900 font-bold text-sm">₹{coupon.minOrder || 0}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditCoupon(coupon); setCode(coupon.code); setDiscount(coupon.discount); setExpiryDate(coupon.expiryDate.split('T')[0]); setMinOrder(coupon.minOrder); setShowModal(true); }}
                          className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteHandler(coupon._id)}
                          className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white border border-gray-200 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-xl"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono uppercase"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="10"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Min Order (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <Calendar className="absolute left-4 top-4 text-gray-500" size={18} />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all shadow-sm"
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
