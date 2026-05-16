import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  Search, 
  RefreshCcw, 
  AlertTriangle, 
  Save, 
  ArrowUpRight,
  TrendingDown,
  Archive,
  Edit2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Store Inventory</h1>
          <p className="text-gray-400 text-sm">Manage your product stock levels and availability</p>
        </div>
        <button 
          onClick={fetchInventory}
          className="p-3 bg-slate-800 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-slate-900/50 flex flex-col md:row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search your inventory..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20 text-xs font-bold">
              <AlertTriangle size={14} /> Low Stock: {products.filter(p => p.countInStock < 5).length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5 text-center">In Stock</th>
                <th className="px-8 py-5 text-center">Status</th>
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-bold">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={product.images?.[0]} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-bold text-white line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-white font-bold">${product.price}</td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        {editId === product._id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              className="w-16 bg-slate-800 border border-primary-500/50 text-white rounded-lg px-2 py-1 text-center font-bold"
                              value={newStock}
                              onChange={(e) => setNewStock(e.target.value)}
                              autoFocus
                            />
                            <button onClick={() => updateStock(product._id)} className="p-1.5 bg-green-500 text-white rounded-lg"><Save size={14} /></button>
                          </div>
                        ) : (
                          <span className={`px-4 py-1.5 rounded-xl font-black text-xs ${
                            product.countInStock === 0 ? 'bg-red-500/10 text-red-500' :
                            product.countInStock < 5 ? 'bg-orange-500/10 text-orange-500' :
                            'bg-green-500/10 text-green-500'
                          }`}>
                            {product.countInStock} Units
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          product.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-gray-500'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => { setEditId(product._id); setNewStock(product.countInStock); }}
                        className="text-primary-400 hover:text-primary-300 font-bold text-xs uppercase tracking-widest"
                      >
                        Adjust
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

export default SellerInventory;
