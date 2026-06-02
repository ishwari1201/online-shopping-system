import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PromoBannerSlider from './PromoBannerSlider';

/* ─── Nykaa-Style Ellipse Disk Card ────────────────────────── */
const DiscountProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Helper to randomize the discount prefix style (MIN vs UP TO)
  const isUpTo = product.discount % 2 === 0;
  const prefix = isUpTo ? 'UP TO' : 'MIN';

  // Format category display (e.g. Bestselling Clothes)
  const subtitle = `Bestselling ${product.category || 'Beauty'}`;

  return (
    <motion.div
      onClick={() => navigate(`/product/${product._id}`)}
      className="flex-shrink-0 w-[180px] md:w-[200px] snap-start group cursor-pointer flex flex-col items-center text-center select-none overflow-visible pt-4 pb-2"
    >
      {/* ── Tilted Gradient Disk + Floating Product Image with multiply blend mode ── */}
      <div className="relative w-full aspect-square flex items-center justify-center overflow-visible bg-transparent mb-3">
        
        {/* The Tilted Ellipse Disk Backdrop */}
        <div 
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-[32%] rounded-[50%] rotate-[-12deg] opacity-90 transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-[-6deg] group-hover:opacity-100 z-0"
          style={{
            background: 'linear-gradient(135deg, #FF69B4 0%, #FFD3A5 50%, #FF8DA1 100%)',
            boxShadow: '0 10px 24px rgba(255,105,180,0.3)',
          }}
        />

        {/* Floating Product Image with mix-blend-multiply to remove white backgrounds */}
        <img
          src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'}
          alt={product.name}
          className="relative z-10 w-[72%] h-[82%] object-contain mix-blend-multiply transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-3"
          loading="lazy"
        />
      </div>

      {/* ── Nykaa-Style Typography Labels ── */}
      <div className="flex flex-col items-center mt-2 px-2">
        <h3 
          className="font-black text-sm md:text-[15px] text-[#1F1F1F] uppercase tracking-wide leading-none" 
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {prefix} {product.discount}% OFF
        </h3>
        
        <p 
          className="text-xs text-gray-500 font-semibold mt-1.5 leading-tight line-clamp-1 max-w-[170px]" 
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

/* ─── Discount Slider Component ─────────────────────────────────────── */
const DiscountSlider = () => {
  const containerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch discounted products
  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // Filter products with a valid discount greater than 0
        const discounted = data.products?.filter((p) => p.discount > 0) || [];
        setProducts(discounted);
      } catch (error) {
        console.error('Error fetching discounted products:', error);
      }
    };
    fetchDiscountedProducts();
  }, []);

  // Update button visibility based on scroll position
  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
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
  }, [products]);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative group/slider overflow-visible">
      <PromoBannerSlider />

      {products.length === 0 ? null : (
        <>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 border-b border-[#FCE4EC]/30 pb-4">
        <div>
          <span className="section-label flex items-center gap-1.5 text-[#E91E63] font-bold">
            <Flame size={12} className="animate-pulse" />
            ✦ FLASH SALE
          </span>
          <h2 className="section-heading mt-1 text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Flash Sale Specials
          </h2>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              canScrollLeft
                ? 'bg-white text-[#E91E63] border border-[#FCE4EC] hover:bg-[#FFF7FA] shadow-sm hover:scale-105'
                : 'bg-gray-100 text-gray-300 border border-gray-100 cursor-not-allowed opacity-50'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              canScrollRight
                ? 'bg-white text-[#E91E63] border border-[#FCE4EC] hover:bg-[#FFF7FA] shadow-sm hover:scale-105'
                : 'bg-gray-100 text-gray-300 border border-gray-100 cursor-not-allowed opacity-50'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row Container */}
      <div className="relative overflow-visible">
        <div
          ref={containerRef}
          className="flex gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-6 pt-2 px-2 scroll-smooth overflow-visible"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          {products.map((product) => (
            <DiscountProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Extra style to hide scrollbar on Webkit browsers */}
      <style>{`
        div::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
        </>
      )}
    </section>
  );
};

export default DiscountSlider;
