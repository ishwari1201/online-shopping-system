import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartItems } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      // Typically you'd send an API request here:
      // const { data } = await axios.post('/api/orders', {
      //   orderItems: cart.cartItems,
      //   shippingAddress: cart.shippingAddress,
      //   paymentMethod: cart.paymentMethod,
      //   itemsPrice: cart.itemsPrice,
      //   shippingPrice: cart.shippingPrice,
      //   taxPrice: cart.taxPrice,
      //   totalPrice: cart.totalPrice,
      // });
      
      toast.success('Order placed successfully!');
      dispatch(clearCartItems());
      navigate('/'); // Or navigate to order details page
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-8">Review Your Order</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Order Details */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="text-primary-500" /> Shipping Information
                </h2>
                <Link to="/shipping" className="text-primary-500 hover:text-primary-400 text-sm font-medium transition-colors">
                  Change
                </Link>
              </div>
              <div className="text-gray-400">
                <p><strong className="text-white">Name: </strong> {userInfo?.name || 'Guest'}</p>
                <p className="mt-1"><strong className="text-white">Address: </strong> 
                  {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="text-primary-500" /> Payment Method
                </h2>
                <Link to="/payment" className="text-primary-500 hover:text-primary-400 text-sm font-medium transition-colors">
                  Change
                </Link>
              </div>
              <p className="text-gray-400">
                <strong className="text-white">Method: </strong> {cart.paymentMethod}
              </p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="text-primary-500" /> Order Items
              </h2>
              {cart.cartItems.length === 0 ? (
                <p className="text-gray-400">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <Link to={`/product/${item._id}`} className="text-white hover:text-primary-400 font-medium line-clamp-1">
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-gray-400 font-medium">
                        {item.qty} x ${item.price} = <span className="text-white">${(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 sticky top-28">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Items</span>
                  <span className="text-white">${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">${cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-400 pb-4 border-b border-white/10">
                  <span>Tax</span>
                  <span className="text-white">${cart.taxPrice}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-2">
                  <span>Total</span>
                  <span className="text-primary-500">${cart.totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={placeOrderHandler}
                disabled={cart.cartItems === 0 || loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? 'Processing...' : 'Place Order'} <CheckCircle size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
