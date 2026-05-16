import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seller/products');
      setProducts(data);
    } catch (error) {
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
    navigate(`/seller/edit-product/${product._id}`);
  };





  const resubmitHandler = async (id) => {
    try {
      await axios.patch(`/api/seller/products/${id}/resubmit`);
      toast.success('Product resubmitted for approval');
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Resubmission failed');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="bg-green-500/10 text-green-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit"><CheckCircle size={12} /> Live</span>;
      case 'Rejected':
        return <span className="bg-red-500/10 text-red-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit"><XCircle size={12} /> Rejected</span>;
      case 'Disabled':
        return <span className="bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit"><Ban size={12} /> Disabled</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit"><Clock size={12} /> Pending</span>;
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Products</h1>
          <p className="text-gray-400 text-sm">Manage and monitor your product listings</p>
        </div>
        <Link 
          to="/seller/add-product"
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20 font-bold"
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by name, SKU..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-3">
            <button className="bg-slate-800 text-white p-3 rounded-xl border border-white/5 hover:bg-slate-700 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Product Info</th>
                <th className="px-8 py-5">Category & Price</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.tr 
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border border-white/5">
                          <img 
                            src={product.images?.[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">SKU: {product._id.substring(18).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{product.category}</span>
                        <span className="text-white font-black text-sm">${product.price}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between w-24">
                          <span className={`text-[10px] font-bold ${product.countInStock < 5 ? 'text-red-400' : 'text-gray-500'}`}>
                            {product.countInStock} Left
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${product.countInStock < 5 ? 'bg-red-500' : 'bg-primary-500'}`}
                            style={{ width: `${Math.min(100, (product.countInStock / 50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(product.status)}
                        {product.status === 'Rejected' && product.rejectionReason && (
                          <div className="flex items-center gap-1.5 text-red-400/60 group/reason cursor-help relative">
                            <AlertCircle size={10} />
                            <span className="text-[9px] font-medium truncate max-w-[100px]">Reason: {product.rejectionReason}</span>
                            <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-slate-800 border border-white/10 rounded-xl text-[10px] text-gray-300 opacity-0 group-hover/reason:opacity-100 transition-opacity z-10 pointer-events-none shadow-2xl">
                              {product.rejectionReason}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {product.status === 'Rejected' && (
                          <button 
                            onClick={() => resubmitHandler(product._id)}
                            className="p-2.5 text-primary-400 hover:bg-primary-500/10 rounded-xl transition-all"
                            title="Resubmit for Approval"
                          >
                            <RefreshCcw size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => editHandler(product)}
                          className="p-2.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteHandler(product._id)}
                          className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default SellerProducts;
