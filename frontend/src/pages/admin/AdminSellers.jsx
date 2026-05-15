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
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        const { data } = await axios.put(`/api/admin/sellers/${id}/status`, { status });
        
        // Optimistically update local state
        setSellers(prevSellers => 
          prevSellers.map(s => s._id === id ? { ...s, sellerStatus: status, isSellerApproved: status === 'approved' } : s)
        );
        
        toast.success(`Seller ${status} successfully`);
        
        // Re-fetch to ensure sync
        setTimeout(() => fetchSellers(), 500);
      } catch (err) {
        console.error('Update status error:', err);
        toast.error(err?.response?.data?.message || 'Failed to update status');
      }
    }
  };

  const filteredSellers = sellers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sellerProfile?.storeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Seller Management</h1>
          <p className="text-gray-400 text-sm">Review and manage vendor applications</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4 bg-slate-900/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by store or owner..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-2">
            {['pending', 'approved', 'rejected', 'blocked'].map(status => (
              <button 
                key={status}
                className="px-4 py-2 bg-slate-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all border border-white/5"
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
              <AnimatePresence>
                {filteredSellers.map((seller) => (
                  <motion.tr 
                    key={seller._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 overflow-hidden">
                          <img 
                            src={seller.sellerProfile?.storeLogo || `https://ui-avatars.com/api/?name=${seller.sellerProfile?.storeName}&background=random`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white">{seller.sellerProfile?.storeName || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{seller.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <p className="text-white font-mono text-xs">{seller.sellerProfile?.gstNumber || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{seller.sellerProfile?.phone || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        seller.sellerStatus === 'approved' ? 'bg-green-500/10 text-green-400' :
                        seller.sellerStatus === 'pending' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {seller.sellerStatus}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-500">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {seller.sellerStatus === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(seller._id, 'approved')}
                              className="px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
                            >
                              <CheckCircle size={14} /> Verify
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
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSellers;
