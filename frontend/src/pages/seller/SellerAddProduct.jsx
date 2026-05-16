import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Save, 
  ArrowLeft,
  ChevronRight,
  Package,
  Layers,
  Settings,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Add New Product</h1>
          <p className="text-gray-400 text-sm">Fill in the details to list your product in the marketplace.</p>
        </div>
      </div>

      <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl"><Info size={20} /></div>
              <h3 className="text-white font-bold text-lg">General Information</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Title</label>
              <input 
                type="text" required
                className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g. Premium Cotton T-Shirt"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                rows="6" required
                className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                placeholder="Describe your product features, materials, and benefits..."
                value={description} onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Brand Name</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  value={brand} onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">SKU (Stock Keeping Unit)</label>
                <input 
                  type="text"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                  value={sku} onChange={(e) => setSku(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Package size={20} /></div>
              <h3 className="text-white font-bold text-lg">Pricing & Inventory</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Base Price ($)</label>
                <input 
                  type="number" required
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  value={price} onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Discount (%)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  value={discount} onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Total Stock</label>
                <input 
                  type="number" required
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  value={countInStock} onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
             <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Layers size={20} /></div>
                <h3 className="text-white font-bold text-lg">Product Variants</h3>
              </div>
              <button type="button" onClick={addVariant} className="text-primary-500 font-bold text-xs uppercase tracking-widest hover:underline">+ Add Variant</button>
            </div>
            
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end bg-slate-800/50 p-4 rounded-2xl border border-white/5 relative group">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Color</label>
                  <input type="text" className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Size</label>
                  <input type="text" className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Price</label>
                  <input type="number" className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Stock</label>
                  <input type="number" className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Media Upload */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <h3 className="text-white font-bold text-lg mb-4">Media / Images</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white text-xs"
                placeholder="Paste Image URL..."
                value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              />
              <button type="button" onClick={addImageUrl} className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all"><Plus size={18} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square border border-white/10 bg-slate-800">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-2xl">
                  <ImageIcon size={32} className="mb-2" />
                  <p className="text-xs font-bold">No images added</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <h3 className="text-white font-bold text-lg mb-4">Organization</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                <select 
                  required
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none"
                  value={category} onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subcategory</label>
                <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-tr from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-primary-900/40 flex items-center justify-center gap-3"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <Save size={20} />}
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerAddProduct;
