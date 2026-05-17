import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Truck, 
  CheckCircle, 
  XCircle, 
  Search, 
  Eye, 
  Star,
  MapPin,
  Shield,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDelivery = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/delivery');
      setPartners(data);
    } catch (error) {
      toast.error('Failed to fetch delivery partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const updateStatus = async (id, status) => {
    if (window.confirm(`Are you sure you want to ${status} this partner?`)) {
      try {
        await axios.put(`/api/admin/delivery/${id}/status`, { status });
        toast.success(`Partner status updated to ${status}`);
        fetchPartners();
      } catch (err) {
        toast.error('Failed to update status');
      }
    }
  };

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.deliveryProfile?.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Fleet</h1>
          <p className="text-gray-500 text-sm">Review applications and monitor delivery partners</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by name or vehicle..." 
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 font-black border-b border-gray-100">
                <th className="px-8 py-5">Partner</th>
                <th className="px-8 py-5">Vehicle</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Performance</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <AnimatePresence>
                {filteredPartners.map((partner) => (
                  <motion.tr 
                    key={partner._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-black border border-gray-200">
                          {partner.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{partner.name}</p>
                          <p className="text-xs text-gray-500">{partner.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <p className="text-gray-900 font-bold">{partner.deliveryProfile?.vehicleType}</p>
                        <p className="text-xs text-gray-500 font-mono">{partner.deliveryProfile?.vehicleNumber}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        partner.deliveryStatus === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                        partner.deliveryStatus === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                        'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {partner.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-primary-600">
                        <Star size={14} fill="currentColor" />
                        <span className="font-black">4.9</span>
                        <span className="text-gray-500 font-medium ml-2">({partner.deliveryProfile?.totalDeliveries || 0})</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {partner.deliveryStatus === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(partner._id, 'approved')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => updateStatus(partner._id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"><Eye size={18} /></button>
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

export default AdminDelivery;
