import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  AlertCircle,
  Video,
  Play
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SellerEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // State variables (same as AddProduct)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [sku, setSku] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [productVideo, setProductVideo] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [variants, setVariants] = useState([{ color: '', size: '', stock: '', price: '' }]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [customColor, setCustomColor] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [colorOptions, setColorOptions] = useState(['Black', 'White', 'Blue', 'Red', 'Grey', 'Green']);
  const [sizeOptions, setSizeOptions] = useState(['S', 'M', 'L', 'XL']);
  const [status, setStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setDiscount(data.discount || 0);
        setCategory(data.category);
        setSubcategory(data.subcategory || '');
        setBrand(data.brand);
        setCountInStock(data.countInStock);
        setSku(data.sku || '');
        setImages(data.images);
        setProductVideo(data.productVideo || '');
        setSpecs(data.specs?.length ? data.specs : [{ key: '', value: '' }]);
        
        const fetchedVariants = data.variants?.length ? data.variants : [{ color: '', size: '', stock: '', price: '' }];
        setVariants(fetchedVariants);
        
        if (data.variants && data.variants.length > 0) {
          const uniqueColors = [...new Set(data.variants.map(v => v.color).filter(Boolean))];
          const uniqueSizes = [...new Set(data.variants.map(v => v.size).filter(Boolean))];
          setSelectedColors(uniqueColors);
          setSelectedSizes(uniqueSizes);
          setColorOptions(prev => [...new Set([...uniqueColors, ...prev])]);
          setSizeOptions(prev => [...new Set([...uniqueSizes, ...prev])]);
        }
        
        setStatus(data.status);
        setRejectionReason(data.rejectionReason || '');
      } catch (error) {
        toast.error('Failed to fetch product details');
        navigate('/seller/products');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

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
        brand,
        countInStock: Number(countInStock),
        sku,
        images,
        specs: specs.filter(s => s.key && s.value),
        variants: variants.filter(v => v.stock || v.price),
        productVideo
      };
      
      await axios.put(`/api/products/${id}`, productData);
      toast.success('Product updated! Re-submitted for review.');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20 text-gray-900 font-bold">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">Update your product information and re-submit if needed.</p>
        </div>
      </div>

      {status === 'Rejected' && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex gap-4 items-start">
          <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="text-red-600 font-black uppercase tracking-widest text-xs mb-1">Rejection Reason</h4>
            <p className="text-red-700 text-sm font-medium">{rejectionReason || 'Your product did not meet our guidelines. Please update and resubmit.'}</p>
          </div>
        </div>
      )}

      <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Same form as AddProduct */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary-50 text-primary-600 border border-primary-100 rounded-xl"><Info size={20} /></div>
              <h3 className="text-gray-900 font-bold text-lg">General Information</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Title</label>
              <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
              <textarea rows="6" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Brand</label>
                <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">SKU</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" value={sku} onChange={(e) => setSku(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-50 text-green-600 border border-green-100 rounded-xl"><Package size={20} /></div>
              <h3 className="text-gray-900 font-bold text-lg">Pricing & Inventory</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                <input type="number" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Discount (%)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stock</label>
                <input type="number" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl"><Layers size={20} /></div>
                <h3 className="text-gray-900 font-bold text-lg">Dynamic Variant Builder (Shopify Style)</h3>
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
           <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Media</h3>
            <div className="flex gap-2">
              <input type="text" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs shadow-sm" placeholder="Image URL..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
               <button type="button" onClick={addImageUrl} className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 shadow-sm"><Plus size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square border border-gray-200 bg-gray-50 shadow-sm">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Video Upload */}
          <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900 font-bold text-lg mb-2">Product Video</h3>
              <span className="text-[10px] bg-indigo-50 text-[#E91E63] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">MP4 / embed</span>
            </div>
            
            <div className="space-y-4">
              {/* File Upload Option */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Option 1: Upload MP4 Video</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
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
                    <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center p-4">
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
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Option 2: Paste YouTube / Vimeo / MP4 URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs shadow-sm"
                    placeholder="Paste video URL..."
                    value={videoUrlInput} onChange={(e) => setVideoUrlInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddVideoUrl} className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 shadow-sm"><Plus size={18} /></button>
                </div>
              </div>

              {/* Video Preview */}
              {productVideo && (
                <div className="relative border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-3">
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
                      className="w-full rounded-2xl aspect-video object-cover bg-black border border-gray-200" 
                      controls 
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Organization</h3>
            <div className="space-y-4">
              <select required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
              </select>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm" placeholder="Subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-sm">
            {loading ? <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div> : <Save size={20} />}
            {status === 'Rejected' ? 'Save & Resubmit' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerEditProduct;
