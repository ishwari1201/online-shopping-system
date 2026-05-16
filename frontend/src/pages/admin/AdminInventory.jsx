import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  Search, 
  Filter, 
  AlertCircle,
  Plus,
  Minus,
  Save,
  Store,
  RefreshCcw,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editStockId, setEditStockId] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/inventory');
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

  const updateStockHandler = async (id) => {
    if (!newStockValue || isNaN(newStockValue)) {
      return toast.error('Please enter a valid number');
    }

    setIsUpdating(true);
    try {
      await axios.patch(`/api/admin/inventory/${id}/stock`, { countInStock: Number(newStockValue) });
      toast.success('Stock updated successfully');
      setEditStockId(null);
      fetchInventory();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.seller?.sellerProfile?.storeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Inventory Management</h1>
          <p className="text-gray-400 text-sm">Monitor stock levels and manage marketplace inventory</p>
        </div>
        <button 
          onClick={fetchInventory}
          className="p-3 bg-slate-800 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by product or seller..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-xs font-bold">
              <AlertCircle size={14} />
              Low Stock: {products.filter(p => p.countInStock < 5).length}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-400 rounded-xl border border-white/5 text-xs font-bold">
              <Package size={14} />
              Total Items: {products.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Product Info</th>
                <th className="px-8 py-5">Seller</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-center">Current Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <p className="text-gray-500 font-bold">No inventory items found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-white/5">
                          <img 
                            src={product.images?.[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">SKU: {product._id.substring(18).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Store size={14} className="text-primary-500" />
                        <span className="text-sm font-bold text-white">{product.seller?.sellerProfile?.storeName || product.seller?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-400 uppercase tracking-widest">{product.category}</td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        {editStockId === product._id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              className="w-20 bg-slate-800 border border-primary-500/50 text-white rounded-lg px-2 py-1 text-center font-bold"
                              value={newStockValue}
                              onChange={(e) => setNewStockValue(e.target.value)}
                              autoFocus
                            />
                            <button 
                              onClick={() => updateStockHandler(product._id)}
                              className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all"
                            >
                              <Save size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className={`px-4 py-1.5 rounded-xl font-black text-xs ${
                            product.countInStock === 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            product.countInStock < 5 ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                            'bg-green-500/10 text-green-500 border border-green-500/20'
                          }`}>
                            {product.countInStock} Units
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => {
                          setEditStockId(product._id);
                          setNewStockValue(product.countInStock);
                        }}
                        className="text-primary-400 hover:text-primary-300 font-bold text-xs uppercase tracking-widest p-2"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
