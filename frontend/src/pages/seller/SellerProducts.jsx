import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
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
        return <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit border border-emerald-200"><CheckCircle size={12} /> Live</span>;
      case 'Rejected':
        return <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit border border-red-200"><XCircle size={12} /> Rejected</span>;
      case 'Disabled':
        return <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit border border-amber-200"><Ban size={12} /> Disabled</span>;
      default:
        return <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit border border-blue-200"><Clock size={12} /> Pending</span>;
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and monitor your product listings in the marketplace.</p>
          </div>
          <Link 
            to="/seller/add-product"
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm font-semibold text-sm"
          >
            <Plus size={18} /> Add New Product
          </Link>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search by product name..." 
                className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category & Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
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
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-24 text-center text-gray-500 font-medium text-sm">
                      No products found matching your search.
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr 
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                             <img 
                                src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                            </div>
                            <div className="max-w-[200px]">
                              <p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
                              <p className="text-xs text-gray-500 font-medium mt-0.5">SKU: {product._id.substring(18).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{product.category}</span>
                            <span className="text-gray-900 font-bold text-sm">₹{product.price?.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between w-24">
                              <span className={`text-xs font-bold ${product.countInStock <= 5 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {product.countInStock} Left
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${product.countInStock <= 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, (product.countInStock / 50) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {getStatusBadge(product.status)}
                            {product.status === 'Rejected' && product.rejectionReason && (
                              <div className="flex items-center gap-1 text-red-600 group/reason cursor-help relative mt-1">
                                <AlertCircle size={12} />
                                <span className="text-[10px] font-semibold truncate max-w-[120px]">Reason: {product.rejectionReason}</span>
                                <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-gray-900 border border-gray-700 rounded-lg text-[11px] text-white opacity-0 group-hover/reason:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl">
                                  {product.rejectionReason}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {product.status === 'Rejected' && (
                              <button 
                                onClick={() => resubmitHandler(product._id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Resubmit for Approval"
                              >
                                <RefreshCcw size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => editHandler(product)}
                              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => deleteHandler(product._id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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

export default SellerProducts;
