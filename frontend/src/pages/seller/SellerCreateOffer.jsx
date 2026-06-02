import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Check, 
  Percent, 
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

const SellerCreateOffer = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  
  // Form State
  const [offerName, setOfferName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Pending Approval');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch seller products and existing offer (if in edit mode)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch active products owned by this seller
        const { data: productsData } = await axios.get('/api/seller/products');
        // Accept only approved/pending products for promotions
        setProducts(productsData || []);

        if (isEditMode) {
          const { data: offerData } = await axios.get(`/api/offers/${id}`);
          setOfferName(offerData.offerName || '');
          setDescription(offerData.description || '');
          setBannerImage(offerData.bannerImage || '');
          setCouponCode(offerData.couponCode || '');
          setStatus(offerData.status || 'Draft');
          
          // Format dates for input (YYYY-MM-DD)
          if (offerData.startDate) {
            setStartDate(new Date(offerData.startDate).toISOString().split('T')[0]);
          }
          if (offerData.endDate) {
            setEndDate(new Date(offerData.endDate).toISOString().split('T')[0]);
          }

          if (Array.isArray(offerData.products)) {
            setSelectedProductIds(offerData.products.map(p => p._id));
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load details');
        if (isEditMode) navigate('/seller/offers');
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [id, isEditMode, navigate]);

  // Handle banner upload (any image, size limit 5MB)
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. File Size Verification (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Maximum File Size exceeded. Banner must be under 5 MB.');
      e.target.value = null;
      return;
    }

    // Directly upload the file without format or dimension checks
    const formData = new FormData();
    formData.append('banner', file);

    setIsUploading(true);
    try {
      const { data } = await axios.post('/api/upload/banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBannerImage(data.filePath);
      toast.success('Banner uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Banner upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle products list selection
  const handleProductToggle = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!offerName.trim()) {
      return toast.error('Offer Name is required');
    }
    if (!startDate || !endDate) {
      return toast.error('Start and End dates are required');
    }
    if (new Date(endDate) <= new Date(startDate)) {
      return toast.error('End Date must fall after Start Date');
    }
    if (selectedProductIds.length === 0) {
      return toast.error('Please attach at least one product to this offer');
    }

    setLoading(true);
    try {
      const offerPayload = {
        offerName,
        description,
        bannerImage,
        couponCode: couponCode.trim().toUpperCase(),
        startDate,
        endDate,
        status,
        products: selectedProductIds
      };

      if (isEditMode) {
        await axios.put(`/api/offers/${id}`, offerPayload);
        toast.success('Offer successfully updated!');
      } else {
        await axios.post('/api/offers', offerPayload);
        toast.success(status === 'Draft' ? 'Offer draft created!' : 'Offer submitted for admin approval!');
      }
      navigate('/seller/offers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save offer details');
    } finally {
      setLoading(false);
    }
  };

  // Filter products by search term
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7fa] font-sans text-gray-900 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/seller/offers')} 
              className="p-2 border border-pink-100 bg-white rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {isEditMode ? 'Modify Offer Details' : 'Create Promotional Offer'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Design custom seasonal sales campaigns and attach discount coupons for shoppers.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/seller/offers')}
              className="flex-1 md:flex-none text-center bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={submitHandler}
              disabled={loading || isUploading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              {isEditMode ? 'Update Offer' : 'Save Campaign'}
            </button>
          </div>
        </div>

        <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Offer Information Card */}
            <div className="bg-white border border-pink-100 p-6 sm:p-8 rounded-2xl shadow-[0_4px_20px_rgb(233,30,99,0.02)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                  <Percent size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Campaign Specifications</h3>
              </div>

              {/* Offer Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Offer Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Monsoon Collection, Winter Warmers"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-gray-400"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                />
              </div>

              {/* Offer Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Offer Description</label>
                <textarea 
                  rows="4"
                  placeholder="Describe your promotion goals, saving tips, and styles (e.g. Get Extra Savings On Rainy Season Fashion)"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none placeholder:text-gray-400"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Coupon and Status row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    Coupon Code <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. MONSOON20"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm font-bold tracking-wider placeholder:font-normal uppercase focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Campaign Lifecycle Status</label>
                  <select
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Draft">Draft (Save offline)</option>
                    <option value="Pending Approval">Pending Approval (Submit to Admin)</option>
                  </select>
                </div>
              </div>

              {/* Date Spans */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" /> Start Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all cursor-pointer"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" /> End Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all cursor-pointer"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Product Selector Card */}
            <div className="bg-white border border-pink-100 p-6 sm:p-8 rounded-2xl shadow-[0_4px_20px_rgb(233,30,99,0.02)] space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Select Campaign Products</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Attach multiple store products to this offer</p>
                  </div>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full">
                  {selectedProductIds.length} Selected
                </span>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search products by title or brand..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              {/* Products List Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const selected = selectedProductIds.includes(p._id);
                    return (
                      <div 
                        key={p._id}
                        onClick={() => handleProductToggle(p._id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          selected 
                            ? 'bg-pink-50/40 border-pink-300 shadow-[0_2px_8px_rgba(233,30,99,0.04)]' 
                            : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'} 
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate pr-2">{p.name}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">{p.brand} · ₹{p.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all flex-shrink-0 ${
                          selected 
                            ? 'bg-pink-500 border-pink-500 text-white' 
                            : 'border-gray-200'
                        }`}>
                          {selected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-8 text-center text-gray-400 italic text-xs bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    No matching products found. Make sure you have approved listings in your inventory.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Banner Upload Sidebar */}
          <div className="space-y-8">
            <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-[0_4px_20px_rgb(233,30,99,0.02)] space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Offer Banner <span className="text-xs text-gray-400 font-normal">(Optional)</span></h3>
                <p className="text-xs text-gray-400 mt-1">This banner will be displayed in the homepage promotion slider.</p>
              </div>

              {/* Upload Input Area */}
              <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50/70 transition-colors min-h-[160px]">
                <input 
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleBannerUpload}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center text-center">
                  <ImageIcon className="mb-2 text-gray-400 animate-pulse" size={28} />
                  <span className="text-xs font-bold text-gray-700">Choose Banner Image</span>
                  
                  {/* Detailed Specs list */}
                  <div className="mt-3 space-y-1 text-[10px] text-gray-400 font-medium">
                    <p>Recommended Size: <strong className="text-gray-600">1200px × 410px</strong></p>
                    <p>Accepted Formats: <strong className="text-gray-600">JPG, JPEG, PNG, WEBP</strong></p>
                    <p>Maximum File Size: <strong className="text-gray-600">5 MB</strong></p>
                  </div>
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4">
                    <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs font-bold text-pink-600">Uploading banner image...</span>
                  </div>
                )}
              </div>

              {/* Help Text Alert */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
                <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="leading-normal font-medium">
                  <strong>Note:</strong> Any image up to 5 MB can be uploaded. No dimension restrictions.
                </p>
              </div>

              {/* Banner Image Preview */}
              {bannerImage && (
                <div className="relative border border-pink-100 rounded-xl overflow-hidden shadow-sm bg-gray-50">
                  <div className="aspect-[1200/410] w-full">
                    <img 
                      src={bannerImage} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 border-t border-gray-100 flex justify-between items-center bg-white">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> Valid Image Uploaded
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setBannerImage('')}
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default SellerCreateOffer;
