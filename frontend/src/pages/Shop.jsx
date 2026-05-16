import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
    toast.info(isWishlisted ? 'Removed' : 'Saved');
  };

  return (
    <motion.div 
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-sm border border-black/5">
        <img 
          src={product.images && product.images[0] ? product.images[0] : ''} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div 
          className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`} 
          onClick={handleWishlist}
        >
          <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-[12px] font-black text-primary uppercase tracking-tight">{product.name}</h3>
        <p className="text-[12px] text-muted font-medium">${product.price}</p>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

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

  const categories = ['All', 'Clothes', 'Shoes', 'Watches', 'Bags', 'Accessories'];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tighter uppercase mb-4">Shop All</h1>
          <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>
          
          <div className="max-w-xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search by product name..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white text-primary border border-black/5 rounded-full py-4 px-8 focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
            <Search className="absolute right-6 top-4 text-muted" size={20} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="sticky top-32 space-y-10">
              <div>
                <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-6">Categories</h3>
                <div className="flex flex-col gap-4">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left text-sm transition-all hover:pl-2 ${activeCategory === cat ? 'text-primary font-black border-l-2 border-primary pl-3' : 'text-muted hover:text-primary'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-black/5">
                <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-6">Sort By</h3>
                <select className="w-full bg-transparent text-sm border-b border-black/10 py-2 focus:outline-none">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {products
                  .filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()))
                  .filter(p => activeCategory === 'All' || p.category === activeCategory)
                  .map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
              </div>
            )}
            
            {!loading && products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted font-medium">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shop;
