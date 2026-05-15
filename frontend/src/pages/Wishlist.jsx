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
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <button 
              onClick={addAllToCartHandler}
              className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
            >
              <ShoppingCart size={20} />
              Add All to Cart
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800">
            <div className="flex justify-center mb-6 text-slate-700">
              <Heart size={80} />
            </div>
            <h2 className="text-2xl text-white font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8">Save items you love to your wishlist.</p>
            <Link to="/shop" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-medium inline-block transition-colors">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col relative group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square mb-4 bg-slate-800">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button 
                    onClick={() => removeFromWishlistHandler(item)}
                    className="absolute top-3 right-3 bg-white/10 hover:bg-red-500/80 backdrop-blur-md p-2 rounded-full text-white transition-colors z-10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <Link to={`/product/${item._id}`} className="text-lg font-semibold text-white hover:text-primary-400 transition-colors line-clamp-1 mb-1">
                    {item.name}
                  </Link>
                  <p className="text-primary-500 font-bold mb-4">${item.price}</p>
                  
                  <button 
                    onClick={() => addToCartHandler(item)}
                    className="mt-auto w-full bg-slate-800 hover:bg-primary-600 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
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
