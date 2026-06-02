import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  Search, 
  RefreshCcw, 
  AlertTriangle, 
  Save, 
  Archive,
  Edit2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const SellerInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [newStock, setNewStock] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seller/inventory');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateStock = async (id) => {
    try {
      await axios.patch(`/api/seller/inventory/${id}/stock`, { countInStock: Number(newStock) });
      toast.success('Stock updated');
      setEditId(null);
      fetchInventory();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#fff7fa] pb-24 font-sans text-[#212a2f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Store Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product stock levels and availability.</p>
          </div>
          <button 
            onClick={fetchInventory}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Sync Stock
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search your inventory..." 
                className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm font-semibold">
              <AlertTriangle size={16} /> Low Stock: {products.filter(p => p.countInStock < 5).length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">In Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-24 text-center">
                      <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-24 text-center text-gray-500 font-medium text-sm">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filtered.map((product) => (
                      <motion.tr 
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                            <div>
                              <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-bold text-sm">₹{product.price?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {editId === product._id ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  type="number" 
                                  className="w-20 bg-white border border-blue-500 text-gray-900 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                  value={newStock}
                                  onChange={(e) => setNewStock(e.target.value)}
                                  autoFocus
                                />
                                <button onClick={() => updateStock(product._id)} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors"><Save size={16} /></button>
                              </div>
                            ) : (
                              <span className={`px-3 py-1 rounded-md font-bold text-xs border ${
                                product.countInStock === 0 ? 'bg-red-50 text-red-700 border-red-200' :
                                product.countInStock < 5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                {product.countInStock} Units
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              product.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {product.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => { setEditId(product._id); setNewStock(product.countInStock); }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                          >
                            Adjust
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInventory;
