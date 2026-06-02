import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Eye, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductRecommendationSlider = ({
  badge,
  title,
  subtitle,
  products = [],
  loading = false,
  emptyTitle = 'No products found',
  emptySubtitle = 'Check back soon for more picks',
  autoScroll = true,
}) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    if (!autoScroll || products.length === 0) return;
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [products, autoScroll]);

  useEffect(() => {
    const el = sliderRef.current;
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
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-28 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-black/5 pb-6">
        <div>
          {badge && (
            <div className="flex items-center gap-2">
              <span className="text-[#E91E63] font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                <Flame size={12} className="animate-pulse" /> {badge}
              </span>
            </div>
          )}
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#212a2f] mt-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {title}
          </h2>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>

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

      {loading ? (
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[240px] sm:w-[280px] flex-shrink-0 animate-pulse">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-100 rounded-3xl mb-4" />
              <div className="h-3 bg-gray-200 rounded-full w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#FFF7FA] to-white border border-dashed border-[#FCE4EC]/60 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-[#FFF7FA] flex items-center justify-center mb-4 border border-[#FCE4EC]/30">
            <ShoppingBag size={28} className="text-[#E91E63]/30" />
          </div>
          <p className="text-gray-400 font-semibold text-sm">{emptyTitle}</p>
          <p className="text-gray-300 text-xs mt-1">{emptySubtitle}</p>
        </div>
      ) : (
        <div className="relative overflow-visible">
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-6 px-1 scroll-smooth overflow-visible"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((prod, idx) => {
              const originalPrice = prod.discount > 0 ? Math.round(prod.price / (1 - prod.discount / 100)) : prod.price;
              const itemWishlisted = wishlistItems.some((w) => w._id === prod._id);

              return (
                <motion.div
                  key={prod._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="group flex-shrink-0 w-[240px] sm:w-[280px] snap-start relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-pink-200/50 hover:shadow-[0_12px_32px_rgba(233,30,99,0.06)] transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f8f7f5] rounded-t-3xl">
                    <Link to={`/product/${prod._id}`} onClick={() => window.scrollTo(0, 0)}>
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                    </Link>

                    {prod.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-[#E91E63] to-[#FF69B4] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl shadow-md">
                        -{prod.discount}% OFF
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(toggleWishlist({ _id: prod._id, name: prod.name, price: prod.price, image: prod.images?.[0] }));
                          toast.info(itemWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
                        }}
                        className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-colors ${
                          itemWishlisted
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-white text-gray-500 hover:text-[#E91E63] hover:bg-[#FFF7FA]'
                        }`}
                      >
                        <Heart size={14} className={itemWishlisted ? 'fill-current' : ''} />
                      </button>
                      <Link
                        to={`/product/${prod._id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#212a2f] transition-all"
                      >
                        <Eye size={14} />
                      </Link>
                    </div>

                    {prod.countInStock > 0 && (
                      <button
                        onClick={() => {
                          dispatch(addToCart({ ...prod, qty: 1, image: prod.images?.[0] }));
                          toast.success(`${prod.name.slice(0, 18)}... added to cart!`);
                        }}
                        className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-widest py-3.5 rounded-2xl shadow-lg translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#E91E63] hover:text-white z-20"
                      >
                        Quick Add +
                      </button>
                    )}

                    {prod.countInStock === 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/90 px-3.5 py-2 rounded-xl shadow">Sold Out</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E91E63]/80 mb-1.5">{prod.brand || 'Wearify'}</p>
                    <Link to={`/product/${prod._id}`} onClick={() => window.scrollTo(0, 0)}>
                      <h3 className="text-xs font-bold text-[#212a2f] leading-relaxed mb-2 line-clamp-1 group-hover:text-[#E91E63] transition-colors">{prod.name}</h3>
                    </Link>

                    <div className="flex items-center gap-1.5 mb-3.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i < Math.floor(prod.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-gray-400">({prod.numReviews})</span>
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-sm font-black text-[#212a2f]">₹{prod.price}</span>
                      {prod.discount > 0 && (
                        <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendationSlider;
