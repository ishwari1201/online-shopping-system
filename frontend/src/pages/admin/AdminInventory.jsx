import { useState, useEffect } from 'react';
import axios from 'axios';
import { Archive, Search, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products');
      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = (id, newStock) => {
    setProducts(products.map(p => p._id === id ? { ...p, countInStock: newStock } : p));
  };

  const updateStockHandler = async (product) => {
    try {
      setUpdatingId(product._id);
      await axios.put(`/api/products/${product._id}`, {
        countInStock: product.countInStock
      });
      toast.success(`${product.name} stock updated!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && products.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
        <div className="text-sm text-gray-400">Total Products: {products.length}</div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-slate-800/50 text-xs uppercase text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Current Stock</th>
                <th className="px-6 py-4 font-medium">Quick Edit</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {Array.isArray(products) && products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0] || product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="font-medium text-white truncate max-w-[200px]">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.countInStock > 10 
                        ? 'bg-green-500/10 text-green-500' 
                        : product.countInStock > 0 
                        ? 'bg-orange-500/10 text-orange-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {product.countInStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      value={product.countInStock}
                      onChange={(e) => handleStockChange(product._id, parseInt(e.target.value) || 0)}
                      className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => updateStockHandler(product)}
                      disabled={updatingId === product._id}
                      className="bg-primary-600/10 text-primary-400 hover:bg-primary-600 hover:text-white p-2 rounded-lg transition-all"
                      title="Save Stock"
                    >
                      {updatingId === product._id ? (
                        <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
                      ) : (
                        <Save size={20} />
                      )}
                    </button>
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

export default AdminInventory;
