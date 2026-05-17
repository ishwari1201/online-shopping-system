import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Star, Shield, Truck, RefreshCw, Search, Heart, ArrowRight, Leaf, Droplets, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import HeroSlider from '../components/home/HeroSlider';

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
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
          }}
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
        <p className="text-[12px] text-muted font-medium">₹{product.price}</p>
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
        setProducts(data.products.slice(0, 8));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Clothes', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop' },
    { name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop' },
    { name: 'Watches', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop' },
    { name: 'Bags', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop' }
  ];

  return (
    <div className="bg-bg-cream">
      {/* Hero Slider Section */}
      <HeroSlider />


      {/* Category Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">Shop By Category</h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden cursor-pointer group"
            >
              <Link to={`/shop?category=${cat.name}`}>
                <div className="aspect-[4/5] overflow-hidden bg-gray-200 rounded-sm">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute bottom-10 left-10">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{cat.name}</h3>
                    <div className="mt-2 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      Explore Now <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">Our Favorites</h2>
              <p className="text-muted text-sm mt-2">The best of Wearify, chosen for you.</p>
            </div>
            <Link to="/shop" className="text-[11px] font-black uppercase tracking-widest border-b-2 border-primary pb-1">
              Shop All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
