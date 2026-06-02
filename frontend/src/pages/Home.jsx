import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Heart, ArrowRight, Truck, Shield, RefreshCw, Zap, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import HeroSlider from '../components/home/HeroSlider';
import DiscountSlider from '../components/home/DiscountSlider';
import FeatureBannerSlider from '../components/home/FeatureBannerSlider';
import FashionVideoShowcase from '../components/home/FashionVideoShowcase';

// ─── Fade-Up Variant for stagger animations ──────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] },
  }),
};

// ─── Premium Product Card ────────────────────────────────────────────
const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((x) => x._id === product._id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist({ _id: product._id, name: product.name, price: product.price, image: product.images?.[0] }));
    toast.info(isWishlisted ? 'Removed from Wishlist' : '❤️ Added to Wishlist');
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      custom={index}
      viewport={{ once: true }}
      className="group cursor-pointer bg-white rounded-3xl border border-[#FCE4EC]/50 overflow-hidden flex flex-col"
      style={{ boxShadow: '0 2px 20px rgba(233,30,99,0.06)' }}
      whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(233,30,99,0.14)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FFF7FA]">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'; }}
        />

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all duration-300 ${isWishlisted ? 'bg-[#E91E63] text-white' : 'bg-white/90 text-gray-400 hover:text-[#E91E63]'}`}
        >
          <Heart size={15} className={isWishlisted ? 'fill-current' : ''} />
        </button>

        {/* Discount badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#D81B60] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.discount}% OFF
          </div>
        )}

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); toast.success('🛍️ Added to Cart!'); }}
            className="w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #E91E63 0%, #D81B60 100%)', boxShadow: '0 8px 24px rgba(233,30,99,0.4)' }}
          >
            <ShoppingBag size={13} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-1">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#E91E63]">{product.brand || 'Wearify'}</p>
        <h3 className="text-sm font-semibold text-[#1F1F1F] leading-snug line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className={i < 4 ? 'fill-[#E91E63] text-[#E91E63]' : 'text-gray-200 fill-gray-200'} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(42)</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-[#1F1F1F]" style={{ fontFamily: 'Outfit, sans-serif' }}>₹{product.price}</span>
          {product.discount > 0 && (
            <span className="text-xs text-gray-400 line-through">₹{Math.round(product.price * 100 / (100 - product.discount))}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Trust / Feature Strip ───────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹499' },
  { icon: Shield, label: 'Authentic Products', sub: '100% genuine brands' },
  { icon: RefreshCw, label: 'Easy Returns', sub: '7-day hassle-free' },
  { icon: Zap, label: 'Fast Shipping', sub: 'Delivered in 2–4 days' },
];

const TrustStrip = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="py-14 bg-gradient-to-r from-[#FFF7FA] via-white to-[#FFF7FA] border-y border-[#FCE4EC]/40 relative overflow-hidden">
      {/* Editorial Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[120px] bg-[#FCE4EC]/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[120px] bg-[#FFF0F5]/20 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }, i) => (
            <motion.div
              key={label}
              variants={itemVariants}
              whileHover={{ 
                y: -6, 
                boxShadow: '0 25px 50px -12px rgba(233,30,99,0.1)',
                borderColor: 'rgba(233,30,99,0.2)'
              }}
              className="group relative flex items-center gap-5 p-6 bg-gradient-to-br from-white via-white to-[#FFF5F8] rounded-[28px] border border-[#FCE4EC]/60 transition-all duration-500 cursor-default overflow-hidden"
            >
              {/* Top Accent Color Slider Line */}
              <div 
                className="absolute top-0 inset-x-0 h-[3px] scale-x-50 group-hover:scale-x-100 transition-transform duration-500 rounded-t-[28px] origin-center" 
                style={{ background: `linear-gradient(90deg, transparent, #E91E63, transparent)` }}
              />

              {/* Luxury Catalog Index Number */}
              <span 
                className="absolute top-2 right-4 text-3xl font-black tracking-tighter opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500 font-serif select-none pointer-events-none text-[#E91E63]"
              >
                0{i + 1}
              </span>

              {/* Concentric Dual-Ring Icon Container with Color Inversion */}
              <div 
                className="relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FFF0F4] border border-[#FCE4EC] group-hover:bg-[#E91E63] group-hover:border-[#E91E63] group-hover:shadow-[0_8px_20px_rgba(233,30,99,0.25)] transition-all duration-500 z-10"
              >
                {/* Inner Ring */}
                <div className="absolute inset-1 rounded-full border border-dashed border-[#E91E63]/20 group-hover:border-white/30 transition-colors duration-500" />
                
                <Icon 
                  size={18} 
                  strokeWidth={2.5} 
                  className="text-[#E91E63] group-hover:text-white transition-colors duration-500 relative z-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" 
                />
              </div>
              
              <div className="relative z-10">
                <h4 
                  className="font-black text-sm tracking-tight text-[#1F1F1F] group-hover:text-[#E91E63] transition-colors duration-300" 
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {label}
                </h4>
                <p 
                  className="text-[11px] text-gray-500 font-medium mt-1 leading-none" 
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {sub}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─── Category Card ───────────────────────────────────────────────────
const categories = [
  { name: 'Women', sub: 'Dresses · Tops · Co-ords', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop', query: 'Clothes' },
  { name: 'Men', sub: 'Shirts · Joggers · Jackets', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop', query: 'Clothes' },
  { name: 'Shoes', sub: 'Heels · Sneakers · Flats', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop', query: 'Shoes' },
  { name: 'Bags', sub: 'Totes · Clutches · Backpacks', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop', query: 'Bags' },
  { name: 'Watches', sub: 'Luxury · Smart · Casual', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop', query: 'Watches' },
  { name: 'Accessories', sub: 'Rings · Earrings · Scarves', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', query: 'Accessories' },
];

// ─── Testimonials Data ───────────────────────────────────────────────
// ─── Testimonials Data ───────────────────────────────────────────────
const REVIEWS = [
  { name: 'Ananya R.', role: 'Verified Buyer', text: '"Ordered a jacket and the quality is absolutely premium. Super fast delivery too. This is now my go-to fashion app!"', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', stars: 5 },
  { name: 'Rohan S.', role: 'Verified Buyer', text: '"Best online shopping experience I\'ve had. The UI is beautiful and the products are genuinely authentic. Totally worth it."', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', stars: 5 },
  { name: 'Meera K.', role: 'Verified Buyer', text: '"Love the curated collections! Found exactly what I was looking for. Customer care is super helpful. Will buy again for sure."', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop', stars: 5 },
  { name: 'Kavya P.', role: 'Verified Buyer', text: '"The fit is absolutely perfect! I was skeptical about ordering online but the size chart is spot on. Very happy with my purchase."', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', stars: 5 },
  { name: 'Arjun V.', role: 'Verified Buyer', text: '"Super high-quality materials and very premium presentation. Even the packaging felt like opening a high-end luxury gift."', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', stars: 5 },
  { name: 'Aisha M.', role: 'Verified Buyer', text: '"Customer service went above and beyond when I needed to exchange a size. Fast responses and super helpful. Highly recommend!"', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', stars: 5 },
  { name: 'Priyesh T.', role: 'Verified Buyer', text: '"Amazing curation of products. The design of the site is incredibly clean and fast. Love shopping on Wearify!"', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop', stars: 5 },
  { name: 'Sneha L.', role: 'Verified Buyer', text: '"Hands down the best quality fabrics I\'ve bought online. The colors are exactly as shown in the pictures and the feel is amazing."', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop', stars: 5 },
];

// ─── Testimonials Auto-Slider Component ──────────────────────────────
const TestimonialsSection = () => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Auto-scroll loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by one card's width + gap (approx 380px)
          containerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      
      const timer = setTimeout(checkScroll, 500);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        clearTimeout(timer);
      };
    }
  }, []);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-label">✦ Reviews</span>
            <h2 className="section-heading mt-2">What Our Community Says</h2>
            <p className="text-gray-500 text-sm mt-3">Real reviews from verified Wearify shoppers</p>
            <div className="divider-pink mt-3" />
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-white text-[#E91E63] border border-[#FCE4EC] hover:bg-[#FFF7FA] shadow-sm'
                  : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed opacity-50'
              }`}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-white text-[#E91E63] border border-[#FCE4EC] hover:bg-[#FFF7FA] shadow-sm'
                  : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed opacity-50'
              }`}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="relative overflow-visible">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-6 px-1 scroll-smooth overflow-visible"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {REVIEWS.map(({ name, role, text, avatar, stars }, i) => (
              <motion.div
                key={name}
                className="flex-shrink-0 w-[290px] sm:w-[350px] snap-start p-8 rounded-3xl border border-[#FCE4EC]/60 bg-[#FFF7FA] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                style={{ boxShadow: '0 4px 20px rgba(233,30,99,0.03)' }}
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(stars)].map((_, j) => (
                      <Star key={j} size={14} className="fill-[#E91E63] text-[#E91E63]" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic min-h-[72px]">{text}</p>
                </div>
                
                <div className="flex items-center gap-3 border-t border-[#FCE4EC]/30 pt-4 mt-auto">
                  <img src={avatar} alt={name} className="w-11 h-11 rounded-full object-cover ring-2 ring-[#FCE4EC]" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1F1F1F]">{name}</h4>
                    <p className="text-xs text-[#E91E63] font-medium">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        div::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </section>
  );
};


// ─── Section Header Component ────────────────────────────────────────
const SectionHeader = ({ pill, title, sub, cta, ctaLink }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
    <div>
      <span className="section-label">{pill}</span>
      <h2 className="section-heading mt-2">{title}</h2>
      {sub && <p className="text-sm text-gray-500 mt-2">{sub}</p>}
    </div>
    {cta && (
      <Link
        to={ctaLink || '/shop'}
        className="flex items-center gap-2 text-[#E91E63] font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all flex-shrink-0"
      >
        {cta} <ArrowRight size={16} />
      </Link>
    )}
  </div>
);

// ─── Main Home Component ─────────────────────────────────────────────
const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products?.slice(0, 8) || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#FFF7FA]" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Trust Strip ── */}
      <TrustStrip />

      {/* ── Shop By Category ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          pill="✦ Explore"
          title="Shop By Category"
          sub="Discover the latest trends curated just for you."
          cta="View All"
          ctaLink="/shop"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={idx}
              viewport={{ once: true }}
            >
              <Link to={`/shop?category=${cat.query}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-2xl mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#E91E63]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">Explore →</span>
                  </div>
                </div>
                <p className="text-center font-bold text-sm text-[#1F1F1F]">{cat.name}</p>
                <p className="text-center text-[10px] text-gray-400 mt-0.5 line-clamp-1">{cat.sub}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ── Discount Products Slider ── */}
      <DiscountSlider />

      {/* ── Cinematic Fashion Video (full-width, no text) ── */}
      <FashionVideoShowcase />

      {/* ── Featured Products ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            pill="✦ Handpicked"
            title="Wearify Favorites"
            sub="Trending this week — loved by thousands."
            cta="Shop All"
            ctaLink="/shop"
          />

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden">
                  <div className="aspect-[3/4] animate-shimmer rounded-t-3xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 animate-shimmer rounded-full" />
                    <div className="h-4 w-full animate-shimmer rounded-full" />
                    <div className="h-4 w-2/3 animate-shimmer rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Website Feature Banner (auto-slide) ── */}
      <FeatureBannerSlider />

      {/* ── Testimonials Auto-Slider ── */}
      <TestimonialsSection />

      {/* ── Newsletter ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">✦ Stay Updated</span>
            <h2 className="section-heading mt-2 mb-4">
              Join the Wearify Club
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Get exclusive deals, new arrivals, and style tips delivered to your inbox. No spam, ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 rounded-full border-2 border-[#FCE4EC] bg-white text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
              />
              <button className="btn-allbirds flex-shrink-0">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
