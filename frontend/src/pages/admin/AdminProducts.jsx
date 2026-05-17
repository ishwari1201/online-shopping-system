import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState(null);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products');
      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Delete failed');
      }
    }
  };

  const editHandler = (product) => {
    setProductId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.category);
    setBrand(product.brand);
    setCountInStock(product.countInStock);
    setImage(product.images[0] || '');
    setEditMode(true);
    setShowModal(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const productData = {
        name,
        price,
        description,
        category,
        brand,
        countInStock,
        images: [image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop']
      };

      if (editMode) {
        await axios.put(`/api/products/${productId}`, productData);
        toast.success('Product updated');
      } else {
        await axios.post('/api/products', productData);
        toast.success('Product created');
      }
      
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductId(null);
    setName('');
    setPrice('');
    setDescription('');
    setCategory('');
    setBrand('');
    setCountInStock('');
    setImage('');
    setEditMode(false);
  };

  if (loading && products.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Products Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage marketplace products</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm font-bold text-sm"
        >
          <Plus size={20} className="text-gray-900" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.isArray(products) && products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} alt={product.name} className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-100 object-cover" />
                      <div className="font-bold text-gray-900 truncate max-w-[200px]">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-gray-900">₹{product.price}</td>
                  <td className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-gray-500">{product.category}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-black border ${product.countInStock > 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {product.countInStock} in stock
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right space-x-3">
                    <button 
                      onClick={() => editHandler(product)}
                      className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-primary-100"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => deleteHandler(product._id)}
                      className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white border border-gray-200 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{editMode ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={submitHandler} className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                    placeholder="e.g. Shoes, Electronics"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Brand</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                    placeholder="e.g. Nike, Apple"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                    placeholder="0"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none shadow-sm"
                    placeholder="Describe your product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-4 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 text-xs uppercase tracking-widest"
                >
                  {isSubmitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
