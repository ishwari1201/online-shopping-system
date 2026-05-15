import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Archive, 
  Search, 
  RefreshCcw, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown,
  Activity,
  History
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SellerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seller/products');
      setInventory(data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateStock = async (id, newStock) => {
    try {
      await axios.put(`/api/products/${id}`, { countInStock: newStock });
      toast.success('Stock updated');
      fetchInventory();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const filteredItems = inventory.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Inventory Management</h1>
        <p className="text-gray-400 text-sm">Monitor stock levels and warehouse operations</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400"><Archive size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Stock</p>
            <p className="text-2xl font-black text-white">{inventory.reduce((acc, item) => acc + item.countInStock, 0)} Units</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-red-500/10 rounded-2xl text-red-400"><AlertCircle size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Low Stock Alerts</p>
            <p className="text-2xl font-black text-white">{inventory.filter(i => i.countInStock < 5).length} Items</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-green-500/10 rounded-2xl text-green-400"><Activity size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">In-Stock Rate</p>
            <p className="text-2xl font-black text-white">92%</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-slate-900/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          <button 
            onClick={fetchInventory}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all border border-white/5"
          >
            <RefreshCcw size={18} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
              <tr>
                <th className="px-8 py-5">Product Name</th>
                <th className="px-8 py-5">SKU</th>
                <th className="px-8 py-5">Availability</th>
                <th className="px-8 py-5">Current Stock</th>
                <th className="px-8 py-5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={item.images?.[0]} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-bold text-white line-clamp-1">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-mono text-[10px] text-gray-500">
                    {item._id.substring(18).toUpperCase()}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      item.countInStock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className={`font-black ${item.countInStock < 5 ? 'text-red-400' : 'text-white'}`}>
                        {item.countInStock}
                      </span>
                      {item.countInStock < 5 && <AlertCircle size={14} className="text-red-500" />}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => updateStock(item._id, item.countInStock + 10)}
                        className="p-2 bg-slate-800 text-primary-400 rounded-lg hover:bg-primary-500 hover:text-white transition-all border border-white/5"
                        title="Add 10 units"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => updateStock(item._id, Math.max(0, item.countInStock - 10))}
                        className="p-2 bg-slate-800 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-white/5"
                        title="Remove 10 units"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerInventory;
