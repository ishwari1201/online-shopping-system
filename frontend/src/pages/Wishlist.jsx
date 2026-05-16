import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const addToCartHandler = (item) => {
    dispatch(addToCart({ ...item, qty: 1 }));
  };

  const removeFromWishlistHandler = (item) => {
    dispatch(toggleWishlist(item));
  };

  const addAllToCartHandler = () => {
    wishlistItems.forEach(item => {
      dispatch(addToCart({ ...item, qty: 1 }));
    });
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f7f5] text-[#212a2f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter">My Wishlist</h1>
          <div className="w-12 h-1 bg-[#212a2f] mx-auto mt-4"></div>
          {wishlistItems.length > 0 && (
            <button
              onClick={addAllToCartHandler}
              className="mt-8 inline-flex items-center gap-3 px-8 py-3 bg-[#212a2f] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#334148] transition-all"
            >
              <ShoppingCart size={16} /> Add All to Cart
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-sm p-16 text-center border border-black/5 shadow-sm max-w-lg mx-auto">
            <div className="flex justify-center mb-8 text-gray-300">
              <Heart size={100} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Wishlist is Empty</h2>
            <p className="text-gray-400 mb-10 max-w-xs mx-auto">Save items you love and come back to them anytime.</p>
            <Link
              to="/shop"
              className="inline-block px-10 py-4 bg-[#212a2f] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#334148] transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {wishlistItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-sm border border-black/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <button
                    onClick={() => removeFromWishlistHandler(item)}
                    className="absolute top-3 right-3 bg-white shadow-sm p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Info */}
                <div className="mt-4 space-y-2">
                  <Link to={`/product/${item._id}`} className="text-[12px] font-black uppercase tracking-tight hover:opacity-70 transition-opacity block">
                    {item.name}
                  </Link>
                  <p className="text-[12px] text-gray-500 font-medium">${item.price}</p>
                  <button
                    onClick={() => addToCartHandler(item)}
                    className="w-full mt-3 py-3 bg-[#212a2f] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#334148] transition-all"
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
