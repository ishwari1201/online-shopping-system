import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Heart, X, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import FilterSidebar from '../components/home/FilterSidebar';

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
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
      onClick={() => navigate(`/product/${product._id}`)}
      whileHover={{ y: -4 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img 
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
          }}
        />
        {/* Wishlist Button */}
        <div 
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md bg-white/80 shadow-sm transition-all hover:bg-white ${isWishlisted ? 'text-[#E91E63]' : 'text-gray-400'}`} 
          onClick={handleWishlist}
        >
          <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
        </div>
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-[#D81B60] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">
            {product.discount}% OFF
          </div>
        )}
        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="w-full bg-white/90 backdrop-blur-sm text-primary text-xs font-bold py-2.5 rounded-xl hover:bg-[#E91E63] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic would go here
              toast.success('Added to Cart!');
            }}
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">{product.brand || 'Premium'}</p>
          <h3 className="text-sm font-bold text-primary line-clamp-2">{product.name}</h3>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-black text-primary">₹{product.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedGender, setSelectedGender] = useState('');
  const [sortBy, setSortBy] = useState('Newest First');

  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  useEffect(() => {
    if (searchParam) {
      setKeyword(searchParam);
      setActiveCategory('All');
    } else if (categoryParam) {
      setActiveCategory(categoryParam);
      setKeyword('');
    } else {
      setActiveCategory('All');
      setKeyword('');
    }
  }, [categoryParam, searchParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products');
        let allProducts = data.products || [];
        
        // Fetch remaining pages if any
        if (data.pages > 1) {
          const promises = [];
          for (let i = 2; i <= data.pages; i++) {
             promises.push(axios.get(`/api/products?pageNumber=${i}`));
          }
          const responses = await Promise.all(promises);
          responses.forEach(res => {
             if (res.data && res.data.products) {
               allProducts = [...allProducts, ...res.data.products];
             }
          });
        }
        
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Comprehensive Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = !keyword || 
      (p.name && p.name.toLowerCase().includes(keyword.toLowerCase())) || 
      (p.category && p.category.toLowerCase().includes(keyword.toLowerCase()));
      
    const matchesCategory = activeCategory === 'All' || (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    const matchesPrice = p.price <= priceRange;
    const matchesBrand = !selectedBrand || 
      (p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()) || 
      (p.name && p.name.toLowerCase().includes(selectedBrand.toLowerCase()));
    const matchesRating = !minRating || (p.rating || 4.5) >= minRating;
    const matchesGender = !selectedGender || 
      (p.subcategory && p.subcategory.toLowerCase() === selectedGender.toLowerCase()) || 
      (p.name && p.name.toLowerCase().includes(selectedGender.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(selectedGender.toLowerCase()));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesRating && matchesGender;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Best Rating') return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const resetFilters = () => {
    setSearchParams({});
    setKeyword('');
    setActiveCategory('All');
    setPriceRange(10000);
    setSelectedBrand('');
    setMinRating(0);
    setSelectedGender('');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-left">
            <h1 className="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
              {activeCategory !== 'All' ? activeCategory : 'The Collection'}
            </h1>
            <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em] mt-4">
              Curated Sustainable Excellence ({filteredProducts.length})
            </p>
          </div>
          
          <div className="flex flex-1 max-w-xl w-full relative group">
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white text-primary border border-black/5 rounded-sm py-5 px-10 focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm pr-16 text-sm font-medium"
            />
            {keyword && (
              <button onClick={() => setKeyword('')} className="absolute right-14 top-5 text-muted hover:text-primary">
                <X size={18} />
              </button>
            )}
            <Search className="absolute right-6 top-5 text-muted" size={18} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Advanced Filter Sidebar */}
          <FilterSidebar 
            activeCategory={activeCategory}
            setActiveCategory={(cat) => {
              setActiveCategory(cat);
              setSearchParams(cat === 'All' ? {} : { category: cat });
            }}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            minRating={minRating}
            setMinRating={setMinRating}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            onReset={resetFilters}
          />

          {/* Main Product Area */}
          <div className="flex-1">
            
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-black/5">
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={14} className="text-muted" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Sorted By</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[11px] font-black uppercase tracking-widest text-primary focus:outline-none cursor-pointer"
                >
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Rating</option>
                </select>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted">
                Showing {filteredProducts.length} Results
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-white border border-black/5 mb-4"></div>
                    <div className="h-4 bg-white w-2/3 mb-2"></div>
                    <div className="h-4 bg-white w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 bg-white border border-black/5 rounded-sm"
              >
                <div className="max-w-xs mx-auto">
                  <Search size={64} strokeWidth={1} className="mx-auto text-muted/20 mb-8" />
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4">No results found</h3>
                  <p className="text-muted text-sm leading-relaxed mb-10">
                    We couldn't find anything matching your current filters. Try adjusting your price range or clearing the brand selection.
                  </p>
                  <button 
                    onClick={resetFilters} 
                    className="btn-allbirds w-full"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shop;
