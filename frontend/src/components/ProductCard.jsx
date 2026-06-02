import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ProductCard – reusable card component for product listings.
 * Features:
 *  • Glassmorphism background matching the luxury pink palette.
 *  • Subtle elevate lift on hover with image zoom.
 *  • Animated add‑to‑cart and wishlist icons.
 *  • Displays discount badge and rating stars.
 */
const ProductCard = ({ product }) => {
  const { _id, name, price, images, rating, discount, isNew } = product;

  const discountedPrice = discount ? (price * (1 - discount / 100)).toFixed(2) : price;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative w-full max-w-sm p-2 pointer-events-auto"
    >
      {/* Glass container */}
      <div
        className="rounded-2xl overflow-hidden border border-white/20 shadow-xl"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Image wrapper – zoom on hover */}
        <div className="relative w-full pt-[100%] overflow-hidden">
          <img
            src={images?.[0]}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110"
          />
          {/* Discount / New badge */}
          {discount && (
            <div className="absolute top-2 left-2 bg-[#E91E63]/80 text-white text-xs font-bold px-2 py-0.5 rounded">
              -{discount}%
            </div>
          )}
          {isNew && (
            <div className="absolute top-2 right-2 bg-[#F8BBD0]/80 text-white text-xs font-bold px-2 py-0.5 rounded">
              NEW
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <Link to={`/product/${_id}`} className="block">
            <h3 className="font-semibold text-white text-sm line-clamp-2 hover:text-[#E91E63] transition-colors">
              {name}
            </h3>
          </Link>

          {/* Rating stars */}
          <div className="flex items-center mt-1.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < rating ? 'text-[#E91E63]' : 'text-white/20'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.363 1.118l1.287 3.965c.3.922-.755 1.688-1.54 1.118l-3.381-2.455a1 1 0 00-1.175 0l-3.381 2.455c-.784.57-1.838-.196-1.539-1.118l1.286-3.965a1 1 0 00-.363-1.118L2.34 9.393c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.966z" />
              </svg>
            ))}
          </div>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            {discount && (
              <span className="text-white/60 line-through text-xs">${price}</span>
            )}
            <span className="text-white font-bold text-sm">${discountedPrice}</span>
          </div>

          {/* Action icons */}
          <div className="flex items-center justify-between mt-3">
            <button
              className="flex items-center gap-1 text-[#E91E63] hover:text-[#F8BBD0] transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={16} className="stroke-current" />
            </button>
            <button
              className="flex items-center gap-1 text-[#F8BBD0] hover:text-[#E91E63] transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} className="stroke-current" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
