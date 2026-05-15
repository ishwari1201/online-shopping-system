import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Filter, Search, ChevronDown, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((x) => x._id === product._id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist({ _id: product._id, name: product.name, price: product.price, image: product.images[0] }));
    toast.info(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 group flex flex-col h-full cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative h-64 overflow-hidden bg-slate-900 flex-shrink-0">
        <img 
          src={product.images && product.images[0] ? product.images[0] : ''} 
          alt={product.name} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.countInStock === 0 ? 'grayscale opacity-50' : ''}`} 
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-primary-400 font-medium">
          {product.category}
        </div>
        {product.countInStock === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest z-20 shadow-2xl">
            Out of Stock
          </div>
        )}
        <div 
          className={`absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm p-2 rounded-full transition-colors z-10 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
          onClick={handleWishlist}
        >
          <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-slate-900 to-transparent">
          <button className="w-full bg-primary-600 hover:bg-primary-500 text-white py-2 rounded-lg font-medium shadow-lg transition-colors flex items-center justify-center gap-2">
            <Search size={18} /> View Details
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white line-clamp-2">{product.name}</h3>
        </div>
        <div className="mt-auto pt-4 flex justify-between items-end">
          <p className="text-primary-400 font-bold text-xl">${product.price}</p>
          <span className="flex items-center text-accent text-sm">
            <Star size={14} className="fill-current mr-1" /> {product.rating || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Shop All</h1>
            <p className="text-gray-400">Discover your next favorite item</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-4">
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <Search className="absolute right-4 top-3 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 sticky top-28">
              <div className="flex items-center gap-2 text-white font-bold text-lg mb-6 pb-4 border-b border-white/10">
                <Filter size={20} /> Filters
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3 flex justify-between items-center cursor-pointer">
                    Categories <ChevronDown size={16} />
                  </h3>
                  <div className="space-y-2">
                    {['All', 'Men', 'Women', 'Kids', 'Accessories', 'Shoes'].map(cat => (
                      <label key={cat} className="flex items-center text-gray-400 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="mr-3 rounded border-slate-600 bg-slate-900 text-primary-500 focus:ring-primary-500" />
                        <span className="group-hover:translate-x-1 transition-transform">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-white font-medium mb-3 flex justify-between items-center cursor-pointer">
                    Price Range <ChevronDown size={16} />
                  </h3>
                  <div className="px-2">
                    <input type="range" className="w-full accent-primary-500" min="0" max="500" />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>$0</span>
                      <span>$500+</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-8 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl transition-colors text-sm font-medium">
                Reset Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase())).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Pagination Mock */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 disabled:opacity-50">Previous</button>
                <button className="w-10 h-10 rounded-lg bg-primary-600 text-white font-medium">1</button>
                <button className="w-10 h-10 rounded-lg bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700">2</button>
                <button className="w-10 h-10 rounded-lg bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700">3</button>
                <button className="p-2 rounded-lg bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700">Next</button>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shop;
