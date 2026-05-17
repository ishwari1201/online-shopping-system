import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Save, 
  ArrowLeft,
  Package,
  Layers,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';

const SellerAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [sku, setSku] = useState('');
  
  // Media
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  
  // Advanced
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [variants, setVariants] = useState([{ color: '', size: '', stock: '', price: '' }]);

  const addVariant = () => setVariants([...variants, { color: '', size: '', stock: '', price: '' }]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addImageUrl = () => {
    if (imageUrl) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

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
        variants: variants.filter(v => v.stock || v.price)
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
              disabled={loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
              Save Product
            </button>
          </div>
        </div>

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
                  <h3 className="text-lg font-bold text-gray-900">Product Variants</h3>
                </div>
                <button type="button" onClick={addVariant} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                  <Plus size={16} /> Add Variant
                </button>
              </div>
              
              <div className="space-y-4">
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end bg-gray-50/50 p-5 rounded-xl border border-gray-200 relative group">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500">Color</label>
                      <input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} placeholder="e.g. Red" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500">Size</label>
                      <input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="e.g. XL" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500">Add. Price</label>
                      <input type="number" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500">Stock</label>
                      <input type="number" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} placeholder="0" />
                    </div>
                    <div className="flex justify-end pb-1">
                      <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {variants.length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center py-4">No variants added.</p>
                )}
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
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerAddProduct;
