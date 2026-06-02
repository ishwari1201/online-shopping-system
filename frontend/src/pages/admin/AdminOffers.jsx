import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Percent, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Calendar,
  Store,
  Tag,
  Package,
  Power,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOfferId, setExpandedOfferId] = useState(null);

  const fetchAllOffers = async () => {
    try {
      const { data } = await axios.get('/api/offers/admin');
      setOffers(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load campaigns for review');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOffers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/offers/${id}/approve`);
      toast.success('Offer approved successfully!');
      setOffers(offers.map(o => o._id === id ? { ...o, status: 'Approved' } : o));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`/api/offers/${id}/reject`);
      toast.success('Offer marked as Rejected');
      setOffers(offers.map(o => o._id === id ? { ...o, status: 'Rejected' } : o));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Rejection failed');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/offers/${id}/toggle`);
      const newStatus = currentStatus === 'Approved' ? 'Draft' : 'Approved';
      toast.success(currentStatus === 'Approved' ? 'Offer disabled on website' : 'Offer enabled on website');
      setOffers(offers.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this offer? This will delete all relationships.')) return;
    
    try {
      await axios.delete(`/api/offers/${id}`);
      toast.success('Offer permanently deleted');
      setOffers(offers.filter(o => o._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
      'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
      'Expired': 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${classes[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Percent size={24} className="text-blue-600" />
            Seller Offers Moderation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review banner advertisements, promotional contents, and connected catalogs before they appear live on the homepage promotion slider.
          </p>
        </div>

        {/* Content Table / List */}
        {offers.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/75 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer Banner</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller / Store</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Span</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {offers.map((offer) => {
                    const isExpanded = expandedOfferId === offer._id;
                    const hasProducts = Array.isArray(offer.products) && offer.products.length > 0;
                    const storeName = offer.sellerId?.sellerProfile?.storeName || offer.sellerId?.name || 'Unknown Seller';
                    const ownerName = offer.sellerId?.name || 'Seller';
                    
                    return (
                      <tr key={offer._id} className="hover:bg-gray-50/40 transition-colors">
                        
                        {/* Banner Image */}
                        <td className="px-6 py-4">
                          <div className="w-[140px] aspect-[1200/410] rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 shadow-sm relative group">
                            <img 
                              src={offer.bannerImage} 
                              alt={offer.offerName}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            {offer.couponCode && (
                              <span className="absolute bottom-1 right-1 bg-gray-900/90 text-white font-mono text-[7px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                                {offer.couponCode}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Offer Name */}
                        <td className="px-6 py-4">
                          <div className="max-w-[200px]">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{offer.offerName}</h4>
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{offer.description || 'No description provided.'}</p>
                          </div>
                        </td>

                        {/* Seller Store */}
                        <td className="px-6 py-4 text-xs">
                          <div className="flex items-center gap-2">
                            <Store size={14} className="text-gray-400" />
                            <div>
                              <p className="font-bold text-gray-800">{storeName}</p>
                              <p className="text-[10px] text-gray-400 font-semibold">{ownerName}</p>
                            </div>
                          </div>
                        </td>

                        {/* Active Span */}
                        <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                          <div className="space-y-1">
                            <p className="flex items-center gap-1"><span className="text-[10px] font-bold text-gray-400 uppercase w-8">From:</span> {new Date(offer.startDate).toLocaleDateString()}</p>
                            <p className="flex items-center gap-1"><span className="text-[10px] font-bold text-gray-400 uppercase w-8">To:</span> {new Date(offer.endDate).toLocaleDateString()}</p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {getStatusBadge(offer.status)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            
                            {/* Products expander */}
                            {hasProducts && (
                              <button
                                onClick={() => setExpandedOfferId(isExpanded ? null : offer._id)}
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                title="Inspect catalog items"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            )}

                            {/* Approval actions (Only show if pending review) */}
                            {offer.status === 'Pending Approval' && (
                              <>
                                <button
                                  onClick={() => handleApprove(offer._id)}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer"
                                  title="Approve campaign"
                                >
                                  <Check size={16} strokeWidth={2.5} />
                                </button>
                                <button
                                  onClick={() => handleReject(offer._id)}
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                                  title="Reject campaign"
                                >
                                  <X size={16} strokeWidth={2.5} />
                                </button>
                              </>
                            )}

                            {/* Active toggle */}
                            {(offer.status === 'Approved' || offer.status === 'Draft') && (
                              <button
                                onClick={() => handleToggleStatus(offer._id, offer.status)}
                                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                  offer.status === 'Approved' 
                                    ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                }`}
                                title={offer.status === 'Approved' ? 'Disable Offer' : 'Enable/Approve Offer'}
                              >
                                <Power size={16} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(offer._id)}
                              className="p-1.5 bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-all cursor-pointer"
                              title="Permanently remove"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Expander list sub-rows */}
            {expandedOfferId && (
              (() => {
                const activeOffer = offers.find(o => o._id === expandedOfferId);
                if (!activeOffer || !activeOffer.products || activeOffer.products.length === 0) return null;
                return (
                  <div className="bg-gray-50/50 p-6 border-t border-gray-100 space-y-3">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Package size={14} /> Catalog Inspection ({activeOffer.products.length} Products connected to "{activeOffer.offerName}")
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {activeOffer.products.map((prod) => (
                        <div key={prod._id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-150 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-xs">
                          <img 
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'} 
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-800 truncate">{prod.name}</h4>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{prod.brand} · ₹{prod.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}

          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-gray-200 rounded-2xl max-w-xl mx-auto px-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 mx-auto">
              <Percent size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No campaigns found</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              Sellers haven't submitted any promotional campaign requests yet. Check back later!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOffers;
