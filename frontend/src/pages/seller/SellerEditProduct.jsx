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
  AlertCircle
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
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [variants, setVariants] = useState([{ color: '', size: '', stock: '', price: '' }]);
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
        setSpecs(data.specs?.length ? data.specs : [{ key: '', value: '' }]);
        setVariants(data.variants?.length ? data.variants : [{ color: '', size: '', stock: '', price: '' }]);
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
      
      await axios.put(`/api/products/${id}`, productData);
      toast.success('Product updated! Re-submitted for review.');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20 text-white">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Edit Product</h1>
          <p className="text-gray-400 text-sm">Update your product information and re-submit if needed.</p>
        </div>
      </div>

      {status === 'Rejected' && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex gap-4 items-start">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <h4 className="text-red-500 font-black uppercase tracking-widest text-xs mb-1">Rejection Reason</h4>
            <p className="text-red-200/80 text-sm font-medium">{rejectionReason || 'Your product did not meet our guidelines. Please update and resubmit.'}</p>
          </div>
        </div>
      )}

      <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Same form as AddProduct */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl"><Info size={20} /></div>
              <h3 className="text-white font-bold text-lg">General Information</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Title</label>
              <input type="text" required className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
              <textarea rows="6" required className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Brand</label>
                <input type="text" required className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white" value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">SKU</label>
                <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono" value={sku} onChange={(e) => setSku(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Package size={20} /></div>
              <h3 className="text-white font-bold text-lg">Pricing & Inventory</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price ($)</label>
                <input type="number" required className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Discount (%)</label>
                <input type="number" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stock</label>
                <input type="number" required className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <h3 className="text-white font-bold text-lg mb-4">Media</h3>
            <div className="flex gap-2">
              <input type="text" className="flex-1 bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white text-xs" placeholder="Image URL..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <button type="button" onClick={addImageUrl} className="p-3 bg-primary-600 text-white rounded-xl"><Plus size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square border border-white/10 bg-slate-800">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <h3 className="text-white font-bold text-lg mb-4">Organization</h3>
            <div className="space-y-4">
              <select required className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
              </select>
              <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white" placeholder="Subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-500 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3">
            {loading ? <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div> : <Save size={20} />}
            {status === 'Rejected' ? 'Save & Resubmit' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerEditProduct;
