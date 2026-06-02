import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Save, 
  ArrowLeft,
  Package,
  Layers,
  Info,
  Video,
  Play
} from 'lucide-react';
import { toast } from 'react-toastify';

const SellerAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null);

  useEffect(() => {
    axios
      .get('/api/seller/subscription/status', { withCredentials: true })
      .then(({ data }) => setSubStatus(data))
      .catch(() => {});
  }, []);

  const limitReached = subStatus && !subStatus.canUpload;
  
  // Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [sku, setSku] = useState('');
  
  // Media
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [productVideo, setProductVideo] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Advanced
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [variants, setVariants] = useState([{ color: '', size: '', stock: '', price: '' }]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [customColor, setCustomColor] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [colorOptions, setColorOptions] = useState(['Black', 'White', 'Blue', 'Red', 'Grey', 'Green']);
  const [sizeOptions, setSizeOptions] = useState(['S', 'M', 'L', 'XL']);

  const addVariant = () => setVariants([...variants, { color: '', size: '', stock: '', price: '' }]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const generateAllCombinations = (colors, sizes) => {
    if (colors.length === 0 && sizes.length === 0) {
      return [{ color: '', size: '', stock: '', price: '' }];
    }
    
    const basePrice = price || '';
    const baseStock = countInStock || '';
    
    if (colors.length > 0 && sizes.length === 0) {
      return colors.map(c => ({ color: c, size: '', stock: baseStock, price: basePrice }));
    }
    
    if (colors.length === 0 && sizes.length > 0) {
      return sizes.map(s => ({ color: '', size: s, stock: baseStock, price: basePrice }));
    }
    
    const combos = [];
    colors.forEach(c => {
      sizes.forEach(s => {
        combos.push({
          color: c,
          size: s,
          stock: baseStock,
          price: basePrice
        });
      });
    });
    return combos;
  };

  const handleColorToggle = (color) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    setSelectedColors(updated);
    setVariants(generateAllCombinations(updated, selectedSizes));
  };

  const handleSizeToggle = (size) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updated);
    setVariants(generateAllCombinations(selectedColors, updated));
  };

  const handleAddCustomColor = () => {
    if (customColor.trim()) {
      const color = customColor.trim();
      if (!colorOptions.includes(color)) {
        setColorOptions([...colorOptions, color]);
      }
      if (!selectedColors.includes(color)) {
        const updated = [...selectedColors, color];
        setSelectedColors(updated);
        setVariants(generateAllCombinations(updated, selectedSizes));
      }
      setCustomColor('');
    }
  };

  const handleAddCustomSize = () => {
    if (customSize.trim()) {
      const size = customSize.trim();
      if (!sizeOptions.includes(size)) {
        setSizeOptions([...sizeOptions, size]);
      }
      if (!selectedSizes.includes(size)) {
        const updated = [...selectedSizes, size];
        setSelectedSizes(updated);
        setVariants(generateAllCombinations(selectedColors, updated));
      }
      setCustomSize('');
    }
  };

  const handleClearAllVariants = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setVariants([{ color: '', size: '', stock: '', price: '' }]);
  };

  const addImageUrl = () => {
    if (imageUrl) {
      let parsedUrl = imageUrl.trim();
      try {
        if (parsedUrl.includes('google.com/imgres') || (parsedUrl.includes('google.') && parsedUrl.includes('/imgres'))) {
          const urlObj = new URL(parsedUrl);
          const imgUrlParam = urlObj.searchParams.get('imgurl');
          if (imgUrlParam) {
            parsedUrl = decodeURIComponent(imgUrlParam);
            toast.success("Automatically extracted direct image link from Google Search!");
          }
        }
      } catch (e) {
        console.error("URL parsing failed:", e);
      }
      setImages([...images, parsedUrl]);
      setImageUrl('');
    }
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video file size exceeds the 100MB limit!');
      return;
    }

    if (file.type !== 'video/mp4') {
      toast.error('Only MP4 video uploads are supported!');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setProductVideo(data.filePath);
      toast.success('Video uploaded successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddVideoUrl = () => {
    if (videoUrlInput.trim()) {
      setProductVideo(videoUrlInput.trim());
      setVideoUrlInput('');
      toast.success('Product video URL added!');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        name,
        description,
        price: Number(price),
        discount: Number(discount),
        category,
        subcategory,
        type,
        brand,
        countInStock: Number(countInStock),
        sku,
        images,
        specs: specs.filter(s => s.key && s.value),
        variants: variants.filter(v => v.stock || v.price),
        productVideo
      };
      
      await axios.post('/api/products', productData);
      toast.success('Product submitted for review!');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#111827] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-500 mt-1">Fill in the details to list your product in the marketplace.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 md:flex-none text-center bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Discard
            </button>
            <button 
              onClick={submitHandler}
              disabled={loading || limitReached}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
              Save Product
            </button>
          </div>
        </div>

        {limitReached && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              Upgrade your seller package to upload more products. (
              {subStatus.productsUploaded}/{subStatus.productLimit >= 999999 ? '∞' : subStatus.productLimit} used)
            </span>
            <Link
              to="/seller/subscription"
              className="font-bold text-[#E91E63] hover:underline shrink-0"
            >
              Upgrade Plan →
            </Link>
          </div>
        )}

        <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Info size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">General Information</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Product Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" required
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  placeholder="e.g. Premium Cotton T-Shirt"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea 
                  rows="5" required
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400"
                  placeholder="Describe your product features, materials, and benefits..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Brand Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={brand} onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">SKU (Stock Keeping Unit)</label>
                  <input 
                    type="text"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    value={sku} onChange={(e) => setSku(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Pricing & Inventory</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Base Price (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={price} onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Discount (%)</label>
                  <input 
                    type="number"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={discount} onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Total Stock <span className="text-red-500">*</span></label>
                  <input 
                    type="number" required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={countInStock} onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Dynamic Variant Builder (Shopify Style)</h3>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={handleClearAllVariants} className="text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">Reset</button>
                  <button type="button" onClick={addVariant} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <Plus size={14} /> Add Row
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Options Generator Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200/60">
                  {/* Colors Attribute Selection */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-700">1. Colors</span>
                      <span className="text-[10px] text-gray-400 font-bold">{selectedColors.length} Selected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {colorOptions.map((c) => {
                        const active = selectedColors.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleColorToggle(c)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              active
                                ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {active ? '✓ ' : ''}{c}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Custom Color (e.g. Lavender)" 
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        value={customColor} 
                        onChange={(e) => setCustomColor(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomColor())}
                      />
                      <button type="button" onClick={handleAddCustomColor} className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">Add</button>
                    </div>
                  </div>

                  {/* Sizes Attribute Selection */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-700">2. Sizes</span>
                      <span className="text-[10px] text-gray-400 font-bold">{selectedSizes.length} Selected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sizeOptions.map((sz) => {
                        const active = selectedSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleSizeToggle(sz)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              active
                                ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {active ? '✓ ' : ''}{sz}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Custom Size (e.g. XXL)" 
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        value={customSize} 
                        onChange={(e) => setCustomSize(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSize())}
                      />
                      <button type="button" onClick={handleAddCustomSize} className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">Add</button>
                    </div>
                  </div>
                </div>

                {/* Variants List Matrix Table */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-500">Generated Combinations Matrix</span>
                    <span className="text-xs text-gray-400 font-bold">{variants.filter(v => v.color || v.size).length} combinations</span>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-200/70 relative group hover:border-gray-300 transition-all">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-0.5">Color</label>
                          <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-gray-800 font-medium" value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} placeholder="Color" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-0.5">Size</label>
                          <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-gray-800 font-medium" value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="Size" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-0.5">Price (₹)</label>
                          <input type="number" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-gray-800 font-semibold" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} placeholder="Price" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-0.5">Stock</label>
                          <input type="number" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-gray-800 font-semibold" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} placeholder="Stock" />
                        </div>
                        <div className="flex justify-end pb-0.5">
                          <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    {variants.length === 0 && (
                      <p className="text-sm text-gray-400 italic text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/20">No variants generated yet. Tick colors/sizes above to get started!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* Media Upload */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] space-y-6">
              <h3 className="text-base font-bold text-gray-900 mb-2">Product Media</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  placeholder="Paste Image URL..."
                  value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                />
                <button type="button" onClick={addImageUrl} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm">Add</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 bg-gray-50">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {images.length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <ImageIcon size={32} className="mb-3 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-500">No images provided</p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Product Video</h3>
                <span className="text-[10px] bg-indigo-50 text-[#E91E63] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">MP4 / embed</span>
              </div>
              
              <div className="space-y-4">
                {/* File Upload Option */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Option 1: Upload MP4 Video</label>
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <input 
                      type="file" 
                      accept="video/mp4" 
                      onChange={handleVideoUpload}
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Video className="mb-2 text-gray-400" size={24} />
                    <span className="text-xs font-bold text-gray-700">Choose MP4 Video File</span>
                    <span className="text-[10px] text-gray-400 mt-1">Max file size: 100MB</span>
                    
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/90 rounded-xl flex flex-col items-center justify-center p-4">
                        <div className="w-full bg-gray-100 rounded-full h-2 max-w-[200px] overflow-hidden mb-2">
                          <div className="bg-[#E91E63] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700">Uploading Video ({uploadProgress}%)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* URL Option */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Option 2: Paste YouTube / Vimeo / MP4 URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                      placeholder="Paste video URL..."
                      value={videoUrlInput} onChange={(e) => setVideoUrlInput(e.target.value)}
                    />
                    <button type="button" onClick={handleAddVideoUrl} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm">Add</button>
                  </div>
                </div>

                {/* Video Preview */}
                {productVideo && (
                  <div className="relative border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Play size={12} className="text-[#E91E63]" /> Video Selected</span>
                      <button type="button" onClick={() => setProductVideo('')} className="text-xs font-bold text-red-500 hover:text-red-700">Remove</button>
                    </div>
                    {productVideo.includes('youtube.com') || productVideo.includes('youtu.be') || productVideo.includes('vimeo.com') ? (
                      <div className="text-xs text-gray-600 truncate bg-white px-3 py-2 rounded-lg border border-gray-200 font-mono">
                        {productVideo}
                      </div>
                    ) : (
                      <video 
                        src={productVideo} 
                        className="w-full rounded-lg aspect-video object-cover bg-black border border-gray-200" 
                        controls 
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] space-y-6">
              <h3 className="text-base font-bold text-gray-900 mb-2">Organization</h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                  <select 
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    value={category} onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category...</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Watches">Watches</option>
                    <option value="Bags">Bags</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Subcategory (e.g. Men, Women)</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400" 
                    value={subcategory} onChange={(e) => setSubcategory(e.target.value)} 
                    placeholder="e.g. Women"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Product Type (e.g. Hoodie, T-Shirt)</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400" 
                    value={type} onChange={(e) => setType(e.target.value)} 
                    placeholder="e.g. Hoodie"
                  />
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerAddProduct;
