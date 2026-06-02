import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  MessageSquare,
  AlertTriangle,
  Clock,
  Shield,
  Ban,
  Play
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProductModeration = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products?status=${statusFilter}`);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const approveHandler = async (id) => {
    if (window.confirm('Are you sure you want to approve this product?')) {
      try {
        await axios.patch(`/api/admin/products/${id}/approve`);
        toast.success('Product approved successfully');
        fetchProducts();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Approval failed');
      }
    }
  };

  const rejectHandler = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      return toast.error('Please provide a reason for rejection');
    }

    setIsSubmitting(true);
    try {
      await axios.patch(`/api/admin/products/${selectedProduct._id}/reject`, { reason: rejectionReason });
      toast.success('Product rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Rejection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatusHandler = async (id, currentStatus) => {
    const action = currentStatus === 'Approved' ? 'disable' : 'enable';
    if (window.confirm(`Are you sure you want to ${action} this product?`)) {
      try {
        await axios.patch(`/api/admin/products/${id}/toggle`);
        toast.success(`Product ${action}d`);
        fetchProducts();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Action failed');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><CheckCircle size={12} /> Approved</span>;
      case 'Rejected':
        return <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><XCircle size={12} /> Rejected</span>;
      case 'Disabled':
        return <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><Ban size={12} /> Disabled</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Product Moderation</h1>
          <p className="text-gray-500 text-sm">Review and manage seller product submissions</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
          {['Pending', 'Approved', 'Rejected', 'Disabled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status 
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search products or sellers..." 
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-gray-100">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Seller</th>
                <th className="px-8 py-5">Category & Price</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Loading products...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <AlertTriangle size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-bold">No products found</p>
                    <p className="text-gray-500 text-sm">There are no products in this category at the moment.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img 
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: {product._id.substring(18).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{product.seller?.sellerProfile?.storeName || product.seller?.name || 'Unknown Seller'}</span>
                        <span className="text-xs text-gray-500">{product.seller?.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.category}</span>
                        <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedProduct(product); setShowDetailsModal(true); }}
                          className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        {product.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => approveHandler(product._id)}
                              className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                              title="Approve"
                            >
                              <Shield size={18} />
                            </button>
                            <button 
                              onClick={() => { setSelectedProduct(product); setShowRejectModal(true); }}
                              className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}

                        {(product.status === 'Approved' || product.status === 'Disabled') && (
                          <button 
                            onClick={() => toggleStatusHandler(product._id, product.status)}
                            className={`p-2.5 rounded-xl transition-all ${
                              product.status === 'Approved' 
                                ? 'text-orange-600 hover:bg-orange-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={product.status === 'Approved' ? 'Disable' : 'Enable'}
                          >
                            {product.status === 'Approved' ? <Ban size={18} /> : <CheckCircle size={18} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white border border-gray-200 rounded-[2rem] w-full max-w-md overflow-hidden shadow-xl p-8"
          >
            <div className="flex items-center gap-3 text-red-600 mb-6">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-black uppercase tracking-wider">Reject Product</h2>
            </div>
            
            <p className="text-gray-500 text-sm mb-6">
              Please specify the reason why you are rejecting <span className="text-gray-900 font-bold">"{selectedProduct?.name}"</span>. 
              This will be visible to the seller.
            </p>

            <form onSubmit={rejectHandler} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Rejection Reason</label>
                <textarea
                  required
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                  placeholder="e.g. Incomplete details, poor image quality, policy violation..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-4 border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all shadow-sm disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Reject'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white border border-gray-200 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <div className="w-full md:w-1/2 h-80 md:h-auto bg-gray-100 relative flex flex-col justify-center min-h-[300px]">
              {selectedProduct.productVideo ? (
                <div className="w-full h-full min-h-[300px] flex flex-col justify-center items-center bg-black relative">
                  {selectedProduct.productVideo.includes('youtube.com') || selectedProduct.productVideo.includes('youtu.be') || selectedProduct.productVideo.includes('vimeo.com') ? (
                    <iframe
                      src={
                        selectedProduct.productVideo.includes('youtube.com') || selectedProduct.productVideo.includes('youtu.be')
                          ? `https://www.youtube.com/embed/${
                              selectedProduct.productVideo.includes('watch?v=')
                                ? selectedProduct.productVideo.split('v=')[1]?.split('&')[0]
                                : selectedProduct.productVideo.split('/').pop()
                            }`
                          : `https://player.vimeo.com/video/${selectedProduct.productVideo.split('/').pop()}`
                      }
                      title="Product Video Review"
                      className="w-full aspect-video md:h-full border-none"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={selectedProduct.productVideo}
                      className="w-full h-full object-contain"
                      controls
                      playsInline
                    />
                  )}
                  <span className="absolute bottom-4 right-4 bg-black/60 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"><Play size={9} /> Video Moderation</span>
                </div>
              ) : (
                <img 
                  src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-6 left-6">
                {getStatusBadge(selectedProduct.status)}
              </div>
            </div>

            <div className="w-full md:w-1/2 p-10 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight mb-1">{selectedProduct.name}</h2>
                  <p className="text-primary-600 font-bold text-xl">₹{selectedProduct.price}</p>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                  <Eye size={24} className="rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</p>
                  <p className="text-gray-900 font-bold">{selectedProduct.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Brand</p>
                  <p className="text-gray-900 font-bold">{selectedProduct.brand}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stock</p>
                  <p className="text-gray-900 font-bold">{selectedProduct.countInStock} Units</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Seller</p>
                  <p className="text-gray-900 font-bold">{selectedProduct.seller?.sellerProfile?.storeName || selectedProduct.seller?.name}</p>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</p>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
              </div>

              {selectedProduct.rejectionReason && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-8">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MessageSquare size={12} /> Rejection Reason
                  </p>
                  <p className="text-red-700 text-sm">{selectedProduct.rejectionReason}</p>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
                {selectedProduct.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => { approveHandler(selectedProduct._id); setShowDetailsModal(false); }}
                      className="flex-1 px-4 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition-all shadow-sm uppercase tracking-widest text-xs"
                    >
                      Approve Product
                    </button>
                    <button
                      onClick={() => { setShowRejectModal(true); setShowDetailsModal(false); }}
                      className="flex-1 px-4 py-4 border border-red-200 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all uppercase tracking-widest text-xs"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { toggleStatusHandler(selectedProduct._id, selectedProduct.status); setShowDetailsModal(false); }}
                    className={`flex-1 px-4 py-4 font-black rounded-2xl transition-all shadow-sm uppercase tracking-widest text-xs ${
                      selectedProduct.status === 'Approved'
                        ? 'bg-orange-600 text-white hover:bg-orange-500'
                        : 'bg-green-600 text-white hover:bg-green-500'
                    }`}
                  >
                    {selectedProduct.status === 'Approved' ? 'Disable Product' : 'Enable Product'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProductModeration;
