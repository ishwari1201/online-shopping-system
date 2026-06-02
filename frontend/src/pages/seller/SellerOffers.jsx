import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Percent, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit3, 
  Package, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

const SellerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOfferId, setExpandedOfferId] = useState(null);

  const fetchOffers = async () => {
    try {
      const { data } = await axios.get('/api/offers/my');
      setOffers(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to retrieve your offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this promotional offer?')) return;
    
    try {
      await axios.delete(`/api/offers/${id}`);
      toast.success('Offer successfully deleted');
      setOffers(offers.filter(o => o._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete offer');
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200',
      'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
      'Expired': 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${classes[status] || 'bg-gray-100 text-gray-700'}`}>
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
    <div className="min-h-screen bg-[#fff7fa] font-sans text-gray-900 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Percent size={28} className="text-pink-600" />
              Promotions & Campaigns
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Organize campaigns, submit banner designs, and associate discount codes with products.
            </p>
          </div>
          <Link
            to="/seller/create-offer"
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Create Offer
          </Link>
        </div>

        {/* Offers Grid */}
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {offers.map((offer) => {
              const isExpanded = expandedOfferId === offer._id;
              const hasProducts = Array.isArray(offer.products) && offer.products.length > 0;
              
              return (
                <div 
                  key={offer._id}
                  className="bg-white border border-pink-100/60 rounded-2xl shadow-[0_4px_20px_rgb(233,30,99,0.01)] hover:shadow-[0_4px_24px_rgb(233,30,99,0.03)] overflow-hidden transition-all duration-300 flex flex-col md:flex-row md:items-stretch"
                >
                  
                  {/* Banner Image Area */}
                  <div className="w-full md:w-[320px] aspect-[1200/410] md:aspect-auto overflow-hidden bg-gray-50 border-r border-gray-100 flex items-center justify-center flex-shrink-0 relative">
                    <img 
                      src={offer.bannerImage} 
                      alt={offer.offerName}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {offer.couponCode && (
                      <div className="absolute top-3 left-3 bg-gray-900/90 text-white px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase flex items-center gap-1 backdrop-blur-sm shadow-sm">
                        <Tag size={10} /> {offer.couponCode}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Name and Pill Badge */}
                      <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {offer.offerName}
                        </h2>
                        {getStatusBadge(offer.status)}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-normal">
                        {offer.description || 'No description provided.'}
                      </p>

                      {/* Parameters Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        
                        {/* Start Date */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Start Date</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(offer.startDate).toLocaleDateString()}
                          </div>
                        </div>

                        {/* End Date */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">End Date</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(offer.endDate).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Connected Products */}
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Attached Products</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                            <Package size={14} className="text-gray-400" />
                            {offer.products?.length || 0} Products
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      
                      {/* Products toggle link */}
                      {hasProducts ? (
                        <button
                          onClick={() => setExpandedOfferId(isExpanded ? null : offer._id)}
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold outline-none cursor-pointer"
                        >
                          {isExpanded ? (
                            <>Hide Attached Products <ChevronUp size={14} /></>
                          ) : (
                            <>Show Attached Products ({offer.products.length}) <ChevronDown size={14} /></>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic font-semibold flex items-center gap-1">
                          <AlertCircle size={14} /> No products connected
                        </span>
                      )}

                      {/* Edit and Delete Actions */}
                      <div className="flex items-center gap-2 justify-end sm:justify-start">
                        {offer.status === 'Approved' && (
                          <Link 
                            to={`/offer/${offer.slug}`}
                            target="_blank"
                            className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                          >
                            <ExternalLink size={14} /> Visit Page
                          </Link>
                        )}
                        <Link 
                          to={`/seller/edit-offer/${offer._id}`}
                          className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                        >
                          <Edit3 size={14} /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteOffer(offer._id)}
                          className="p-2 border border-red-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold shadow-sm cursor-pointer"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>

                    </div>

                    {/* Collapsible products lists */}
                    {isExpanded && hasProducts && (
                      <div className="mt-4 pt-4 border-t border-dashed border-gray-100 space-y-2">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider px-1">Active Promotion Catalog</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {offer.products.map((prod) => (
                            <div key={prod._id} className="flex items-center gap-2 p-2 rounded-xl border border-gray-50 bg-gray-50/20 text-xs">
                              <img 
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'} 
                                alt={prod.name}
                                className="w-8 h-8 object-cover rounded-lg border border-gray-100"
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-gray-800 truncate pr-1">{prod.name}</h4>
                                <p className="text-[10px] text-gray-400 font-semibold">₹{prod.price.toLocaleString()} · {prod.brand}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-pink-100/60 rounded-3xl shadow-[0_4px_24px_rgb(233,30,99,0.01)] flex flex-col items-center justify-center max-w-xl mx-auto px-6">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6">
              <Percent size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No promotions created yet</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-sm">
              Seasonal offers, active banner ads, and discount coupons are the easiest way to increase seller revenue!
            </p>
            <Link
              to="/seller/create-offer"
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Get Started Now
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default SellerOffers;
