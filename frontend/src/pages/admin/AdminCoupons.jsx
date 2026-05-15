import { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Plus, Trash2, X, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/coupons');
      setCoupons(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await axios.delete(`/api/coupons/${id}`);
        toast.success('Coupon removed');
        fetchCoupons();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/coupons', { code: code.toUpperCase(), discount, expiryDate });
      toast.success('Coupon created');
      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCode('');
    setDiscount('');
    setExpiryDate('');
  };

  if (loading && coupons.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Coupon Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => deleteHandler(coupon._id)}
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <Ticket size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-widest">{coupon.code}</h3>
                <span className="text-primary-400 font-bold text-lg">{coupon.discount}% OFF</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 mt-4 pt-4 border-t border-slate-800">
              <Calendar size={14} />
              Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
            </div>
            
            {/* Scalloped edge effect */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-r border-slate-800"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-l border-slate-800"></div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={submitHandler} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER50"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white uppercase"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Discount (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Expiry Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-500 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-primary-900/20"
              >
                {isSubmitting ? 'Creating...' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
