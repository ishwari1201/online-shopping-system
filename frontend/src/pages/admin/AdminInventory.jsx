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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 text-sm">Monitor stock levels and manage marketplace inventory</p>
        </div>
        <button 
          onClick={fetchInventory}
          className="p-3 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all shadow-sm"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by product or seller..." 
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-bold shadow-sm">
              <AlertCircle size={14} />
              Low Stock: {products.filter(p => p.countInStock < 5).length}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 text-xs font-bold shadow-sm">
              <Package size={14} />
              Total Items: {products.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-gray-100">
                <th className="px-8 py-5">Product Info</th>
                <th className="px-8 py-5">Seller</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-center">Current Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
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
                  <tr key={product._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img 
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">SKU: {product._id.substring(18).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Store size={14} className="text-primary-600" />
                        <span className="text-sm font-bold text-gray-900">{product.seller?.sellerProfile?.storeName || product.seller?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-500 uppercase tracking-widest font-bold">{product.category}</td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        {editStockId === product._id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              className="w-20 bg-white border border-primary-500 text-gray-900 rounded-lg px-2 py-1 text-center font-bold shadow-sm"
                              value={newStockValue}
                              onChange={(e) => setNewStockValue(e.target.value)}
                              autoFocus
                            />
                            <button 
                              onClick={() => updateStockHandler(product._id)}
                              className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm"
                            >
                              <Save size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className={`px-4 py-1.5 rounded-xl font-black text-xs border ${
                            product.countInStock === 0 ? 'bg-red-50 text-red-600 border-red-200' :
                            product.countInStock < 5 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                            'bg-green-50 text-green-600 border-green-200'
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
