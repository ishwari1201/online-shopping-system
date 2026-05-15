import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  const addToCartHandler = (item, qty) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800">
            <div className="flex justify-center mb-6 text-slate-700">
              <ShoppingBag size={80} />
            </div>
            <h2 className="text-2xl text-white font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-medium inline-block transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 space-y-4">
              {cartItems.map((item) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 relative"
                >
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/product/${item._id}`} className="text-lg font-semibold text-white hover:text-primary-400 transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-primary-500 font-bold mt-1">${item.price}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => addToCartHandler(item, Math.max(1, item.qty - 1))}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-white text-sm">{item.qty}</span>
                      <button 
                        onClick={() => addToCartHandler(item, Math.min(item.countInStock, item.qty + 1))}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCartHandler(item._id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 sticky top-28">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                    <span className="text-white">${itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white">${shippingPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 pb-4 border-b border-white/10">
                    <span>Tax</span>
                    <span className="text-white">${taxPrice}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white pt-2">
                    <span>Total</span>
                    <span className="text-primary-500">${totalPrice}</span>
                  </div>
                </div>

                <button 
                  onClick={checkoutHandler}
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-1"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>
                
                <div className="mt-6 flex justify-center gap-2">
                  <div className="h-8 w-12 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-xs text-gray-500 font-bold">VISA</div>
                  <div className="h-8 w-12 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-xs text-gray-500 font-bold">MC</div>
                  <div className="h-8 w-12 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-xs text-gray-500 font-bold">AMEX</div>
                  <div className="h-8 w-12 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-xs text-gray-500 font-bold">PAYPAL</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
