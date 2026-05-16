import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  UserMinus, 
  Search, 
  Filter,
  Eye,
  Store,
  Shield,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('pending');

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/sellers');
      setSellers(data);
    } catch (error) {
      toast.error('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const updateStatus = async (id, status) => {
    if (window.confirm(`Are you sure you want to ${status} this seller?`)) {
      try {
        await axios.put(`/api/admin/sellers/${id}/status`, { status });
        
        setSellers(prevSellers => 
          prevSellers.map(s => s._id === id ? { ...s, sellerStatus: status, isSellerApproved: status === 'approved' } : s)
        );
        
        toast.success(`Seller ${status} successfully`);
      } catch (err) {
        console.error('Update status error:', err);
        toast.error(err?.response?.data?.message || 'Failed to update status');
      }
    }
  };

  const filteredSellers = sellers.filter(s => {
    const matchesSearch = 
      (s.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.sellerProfile?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = activeFilter === 'all' || s.sellerStatus === activeFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Seller Management</h1>
          <p className="text-gray-400 text-sm">Review and manage vendor applications</p>
        </div>
        <button 
          onClick={fetchSellers}
          className="p-3 bg-slate-800 text-white rounded-xl border border-white/5 hover:bg-slate-700 transition-all"
          title="Refresh List"
        >
          <Users size={18} />
        </button>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-6 bg-slate-900/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search store, name or email..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected', 'blocked'].map(status => (
              <button 
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeFilter === status 
                    ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20' 
                    : 'bg-slate-800 text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="px-8 py-5">Store / Owner</th>
                  <th className="px-8 py-5">GST / Phone</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Date Applied</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                <AnimatePresence mode='popLayout'>
                  {filteredSellers.length > 0 ? (
                    filteredSellers.map((seller) => (
                      <motion.tr 
                        key={seller._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="hover:bg-white/[0.02] transition-colors group border-l-2 border-transparent hover:border-primary-500"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 overflow-hidden flex items-center justify-center">
                              {seller.sellerProfile?.storeLogo ? (
                                <img src={seller.sellerProfile.storeLogo} className="w-full h-full object-cover" alt="Store" />
                              ) : (
                                <Store size={20} className="text-gray-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-white leading-tight">{seller.sellerProfile?.storeName || 'New Application'}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{seller.name} · {seller.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <p className="text-white font-mono text-[11px]">{seller.sellerProfile?.gstNumber || 'PENDING GST'}</p>
                            <p className="text-xs text-gray-500 mt-1">{seller.sellerProfile?.phone || 'No Phone'}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            seller.sellerStatus === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            seller.sellerStatus === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            seller.sellerStatus === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-gray-500/10 text-gray-400 border-white/5'
                          }`}>
                            {seller.sellerStatus}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-gray-500 text-xs">
                          {new Date(seller.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            {seller.sellerStatus === 'pending' && (
                              <>
                                <button 
                                  onClick={() => updateStatus(seller._id, 'approved')}
                                  className="px-4 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
                                >
                                  <CheckCircle size={14} /> Approve
                                </button>
                                <button 
                                  onClick={() => updateStatus(seller._id, 'rejected')}
                                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Reject"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            <button className="p-2 text-gray-400 hover:text-white rounded-lg transition-all">
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-5 bg-slate-800/50 rounded-full text-gray-600">
                            <Store size={40} />
                          </div>
                          <div>
                            <p className="text-white font-bold uppercase tracking-widest text-[11px]">No matching applications</p>
                            <p className="text-gray-500 text-xs mt-1">Refine your search or check another status tab</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSellers;
