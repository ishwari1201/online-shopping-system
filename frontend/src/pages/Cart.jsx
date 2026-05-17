import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart) || { cartItems: [] };
  const { cartItems = [], itemsPrice = 0, shippingPrice = 0, taxPrice = 0, totalPrice = 0 } = cart;

  const addToCartHandler = (item, qty) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f7f5] text-[#212a2f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Your Cart</h1>
          <div className="w-12 h-1 bg-[#212a2f] mx-auto mt-4"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-sm p-16 text-center border border-black/5 shadow-sm">
            <div className="flex justify-center mb-8 text-gray-300">
              <ShoppingBag size={100} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Cart is Empty</h2>
            <p className="text-gray-500 mb-10 max-w-xs mx-auto">
              Looks like you haven't made your choice yet. Explore our collection.
            </p>
            <Link
              to="/shop"
              className="inline-block px-10 py-4 bg-[#212a2f] text-white font-black uppercase tracking-widest text-[11px] hover:bg-[#334148] transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Cart Items List */}
            <div className="flex-1 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-sm p-6 border border-black/5 flex items-center gap-8"
                >
                  <div className="bg-[#f0efed] rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-[13px] font-black uppercase tracking-tight hover:opacity-70 transition-opacity"
                    >
                      {item.name}
                    </Link>
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="flex gap-4 mt-1 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                        {item.selectedColor && (
                          <span>Color: <span className="text-[#212a2f]">{item.selectedColor}</span></span>
                        )}
                        {item.selectedSize && (
                          <span>Size: <span className="text-[#212a2f]">{item.selectedSize}</span></span>
                        )}
                      </div>
                    )}
                    <p className="text-gray-500 text-[12px] font-medium mt-1.5">₹{item.price}</p>

                    <div className="mt-4 flex items-center gap-6">
                      <div className="flex items-center border border-black/10 rounded-sm">
                        <button
                          onClick={() => addToCartHandler(item, Math.max(1, item.qty - 1))}
                          className="px-3 py-1 hover:bg-[#f8f7f5] text-gray-500"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-[12px] font-bold">{item.qty}</span>
                        <button
                          onClick={() => addToCartHandler(item, Math.min(item.countInStock, item.qty + 1))}
                          className="px-3 py-1 hover:bg-[#f8f7f5] text-gray-500"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCartHandler(item._id)}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[350px]">
              <div className="bg-white rounded-sm p-8 border border-black/5 sticky top-32">
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-8 border-b border-black/5 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold">₹{itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-bold">{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                  </div>
                  <div className="flex justify-between text-sm pb-4 border-b border-black/5">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-bold">₹{taxPrice}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black pt-2">
                    <span className="uppercase tracking-tighter">Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={checkoutHandler}
                  className="w-full px-10 py-5 bg-[#212a2f] text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:bg-[#334148] transition-all"
                >
                  Checkout <ArrowRight size={16} />
                </button>

                <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest leading-loose">
                  Free returns on all orders within 30 days. <br />
                  Secure payment powered by Wearify.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
