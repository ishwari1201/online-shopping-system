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
      const orderData = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      };

      const { data } = await axios.post('/api/orders', orderData);
      
      toast.success('Order placed successfully!');
      dispatch(clearCartItems());
      navigate(`/order/${data._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-cream text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Review Order</h1>
          <div className="w-12 h-1 bg-primary mt-4 mb-2"></div>
          <p className="text-muted text-[11px] font-black uppercase tracking-widest">
            Step 3 of 3: Final Confirmation
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Order Details */}
          <div className="flex-1 space-y-8">
            
            {/* Shipping Info */}
            <div className="bg-white p-10 border border-black/5 shadow-sm">
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-black/5">
                <h2 className="text-[13px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                  <MapPin size={16} /> Delivery Address
                </h2>
                <Link to="/shipping" className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted hover:text-primary hover:border-primary transition-all pb-1">
                  Change
                </Link>
              </div>
              <div className="text-[13px] font-medium text-muted leading-relaxed">
                <p className="text-primary font-black uppercase tracking-widest mb-2">{userInfo?.name || 'Customer'}</p>
                <p>{cart.shippingAddress.address}</p>
                <p>{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}</p>
                <p className="uppercase tracking-widest text-[10px] pt-1">{cart.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-10 border border-black/5 shadow-sm">
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-black/5">
                <h2 className="text-[13px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                  <CreditCard size={16} /> Payment Choice
                </h2>
                <Link to="/payment" className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted hover:text-primary hover:border-primary transition-all pb-1">
                  Change
                </Link>
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-primary">
                Method: <span className="text-muted">{cart.paymentMethod}</span>
              </p>
            </div>

            {/* Items List */}
            <div className="bg-white p-10 border border-black/5 shadow-sm">
              <h2 className="text-[13px] font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5 flex items-center gap-3">
                <ShoppingBag size={16} /> Bag Items
              </h2>
              {cart.cartItems.length === 0 ? (
                <p className="text-muted text-sm italic">Your bag is empty.</p>
              ) : (
                <div className="space-y-8">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-8 group">
                      <div className="w-20 h-20 bg-bg-cream border border-black/5 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <Link to={`/product/${item._id}`} className="text-[12px] font-black uppercase tracking-tight text-primary hover:opacity-70 transition-opacity mb-1 block">
                          {item.name}
                        </Link>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">
                          {item.qty} Unit{item.qty > 1 ? 's' : ''} · ${item.price}
                        </p>
                      </div>
                      <div className="text-primary font-black text-sm">
                        ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-10 border border-black/5 shadow-sm sticky top-32">
              <h2 className="text-[13px] font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5">Order Summary</h2>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted">
                  <span>Subtotal</span>
                  <span className="text-primary">${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted">
                  <span>Shipping Cost</span>
                  <span className="text-primary">${cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted pb-5 border-b border-black/5">
                  <span>Estimated Tax</span>
                  <span className="text-primary">${cart.taxPrice}</span>
                </div>
                <div className="flex justify-between text-[15px] font-black uppercase tracking-tighter text-primary pt-2">
                  <span>Total Due</span>
                  <span className="text-2xl">${cart.totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={placeOrderHandler}
                disabled={cart.cartItems.length === 0 || loading}
                className="btn-allbirds w-full flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Place Order <CheckCircle size={18} />
                  </>
                )}
              </button>
              
              <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted mt-8">
                Free 30-day returns on all orders.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
