import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Star, ShieldCheck, Truck, RefreshCw, Search, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
      className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 group cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative h-64 overflow-hidden bg-slate-900">
        <img 
          src={product.images && product.images[0] ? product.images[0] : ''} 
          alt={product.name} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.countInStock === 0 ? 'grayscale opacity-50' : ''}`} 
        />
        {product.countInStock === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-20 shadow-2xl border border-white/20">
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
          <h3 className="text-lg font-semibold text-white line-clamp-1">{product.name}</h3>
          <span className="flex items-center text-accent text-sm">
            <Star size={14} className="fill-current mr-1" /> {product.rating || 0}
          </span>
        </div>
        <p className="text-primary-400 font-bold text-xl mt-auto pt-2">${product.price}</p>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary-500/10 text-primary-400 font-medium text-sm mb-6 border border-primary-500/20">
                New Collection 2026
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white">
                Discover Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500">
                  Unique Style
                </span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                Explore our premium collection of contemporary fashion. Designed for comfort, styled for you. Elevate your wardrobe today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1">
                  Shop Now
                </Link>
                <Link to="/categories" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1">
                  View Categories
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" 
                alt="Fashion Model" 
                className="relative z-10 w-full h-[600px] object-cover rounded-[2rem] shadow-2xl border border-white/10"
              />
              
              {/* Floating Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -left-10 glass-dark p-4 rounded-2xl flex items-center gap-4 z-20 shadow-2xl"
              >
                <div className="bg-accent/20 p-3 rounded-full text-accent">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-white font-bold">Trending Now</p>
                  <p className="text-sm text-gray-400">Summer Collection</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900/50 py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-4">
              <Truck size={40} className="text-primary-500" />
              <div>
                <h4 className="text-white font-bold">Free Shipping</h4>
                <p className="text-gray-400 text-sm">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <ShieldCheck size={40} className="text-primary-500" />
              <div>
                <h4 className="text-white font-bold">Secure Payment</h4>
                <p className="text-gray-400 text-sm">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <RefreshCw size={40} className="text-primary-500" />
              <div>
                <h4 className="text-white font-bold">Easy Returns</h4>
                <p className="text-gray-400 text-sm">30 days return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Products</h2>
              <p className="text-gray-400">Handpicked items just for you</p>
            </div>
            <Link to="/shop" className="text-primary-400 hover:text-primary-300 font-medium hidden sm:block">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/20"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Join The Wearify Club</h2>
          <p className="text-gray-300 mb-8">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input type="email" placeholder="Enter your email" className="px-6 py-4 rounded-full bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-primary-500 w-full sm:w-96" />
            <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-bold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
