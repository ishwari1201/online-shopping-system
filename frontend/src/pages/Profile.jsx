import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Settings, Package, Heart, LogOut, ShoppingBag, Star, TrendingUp, ArrowRight, Leaf } from 'lucide-react';
import { logout, setCredentials } from '../redux/slices/authSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone || '');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/my-orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoadingOrders(false);
      }
    };
    
    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const shuffled = data.sort(() => 0.5 - Math.random());
        setRecommendedProducts(shuffled.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch recommendations');
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchOrders();
    fetchRecommendations();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/api/users/profile', {
        name,
        phone,
      });
      dispatch(setCredentials({ ...data }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logoutHandler = async () => {
    try {
      await axios.post('/api/users/logout');
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const topPurchases = orders
    .flatMap(order => order.orderItems)
    .reduce((acc, item) => {
      const existing = acc.find(i => i._id === item._id);
      if (existing) {
        existing.qty += item.qty;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, [])
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 3);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-cream text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NEW ATTRACTIVE WELCOME BOX */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[300px] mb-16 rounded-sm overflow-hidden shadow-2xl group border border-black/5"
        >
          {/* Background Image */}
          <img 
            src="/customer_dashboard_welcome_banner_1778959063754.png" 
            alt="Welcome Banner" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-10 md:px-16 text-white max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-accent"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Member Exclusive</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
                Hello, <br /> {userInfo?.name.split(' ')[0]}<span className="text-accent">.</span>
              </h1>
              <p className="text-gray-300 text-sm font-medium mb-8 max-w-sm leading-relaxed">
                Thank you for being part of the movement. Your choices today shape a better world for tomorrow.
              </p>
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[18px] font-black">{orders.length}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Orders</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex flex-col">
                  <span className="text-[18px] font-black">{wishlistItems.length}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Wishlist</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex flex-col">
                  <span className="text-[18px] font-black text-green-400">PRO</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Tier</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full lg:w-72">
            <div className="bg-white rounded-sm p-8 border border-black/5 sticky top-32 shadow-sm">
              <div className="space-y-1">
                {[
                  { id: 'overview', label: 'Dashboard', icon: TrendingUp },
                  { id: 'orders', label: 'My Orders', icon: Package },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'profile', label: 'Settings', icon: Settings },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-black/10' : 'text-muted hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
                
                {userInfo?.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center gap-4 px-4 py-4 text-[11px] font-black uppercase tracking-widest text-accent border border-accent/20 mt-8 hover:bg-accent hover:text-white transition-all"
                  >
                    <Star size={16} />
                    Admin Panel
                  </button>
                )}

                <button 
                  onClick={logoutHandler}
                  className="w-full flex items-center gap-4 px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted border border-black/5 mt-4 hover:bg-black hover:text-white transition-all"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {activeTab === 'overview' && (
              <div className="space-y-12">
                
                {/* Stats Summary Small cards removed for a cleaner look since they are in the banner now */}



                {/* Recommendations */}
                <div className="space-y-8">
                  <div className="flex justify-between items-end px-2">
                    <div>
                      <h2 className="text-[13px] font-black uppercase tracking-[0.3em]">Recommended For You</h2>
                      <p className="text-muted text-[10px] font-medium mt-1">Curated sustainable picks</p>
                    </div>
                    <button onClick={() => navigate('/shop')} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                      Explore All <ArrowRight size={14} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loadingRecs ? (
                      [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-white animate-pulse border border-black/5"></div>)
                    ) : (
                      recommendedProducts.map((product) => (
                        <motion.div 
                          key={product._id} 
                          whileHover={{ y: -5 }}
                          className="bg-white border border-black/5 group cursor-pointer overflow-hidden rounded-sm"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-bg-cream">
                            <img 
                              src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
                              }}
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="text-[10px] font-black uppercase tracking-tight text-primary truncate mb-1">{product.name}</h3>
                            <p className="text-[12px] font-black text-primary">₹{product.price}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Other tabs logic remains the same */}
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-sm p-10 border border-black/5 shadow-sm"
              >
                <h2 className="text-[13px] font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5">Account Security</h2>
                <form onSubmit={submitHandler} className="space-y-8 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-3">Full Name</label>
                      <input type="text" className="w-full px-5 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-3">Email Address</label>
                      <input type="email" className="w-full px-5 py-4 bg-bg-cream border border-black/5 rounded-sm opacity-50 cursor-not-allowed text-sm font-medium" value={email} disabled />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-3">Phone Number</label>
                      <input type="text" className="w-full px-5 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
                    </div>
                  </div>
                  <button type="submit" className="btn-allbirds">Save Changes</button>
                </form>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-sm p-10 border border-black/5 shadow-sm"
              >
                <div className="flex justify-between items-end mb-10 pb-4 border-b border-black/5">
                  <h2 className="text-[13px] font-black uppercase tracking-[0.3em]">Purchase History</h2>
                  <div className="text-[10px] font-black text-muted uppercase tracking-widest">{orders.length} Total Orders</div>
                </div>
                {orders.length === 0 ? (
                  <div className="text-center py-24 bg-bg-cream rounded-sm border border-black/5">
                    <Package size={60} strokeWidth={1} className="mx-auto text-muted/30 mb-6" />
                    <p className="text-[13px] font-black uppercase tracking-tighter mb-8">No orders found</p>
                    <button onClick={() => navigate('/shop')} className="text-[11px] font-black uppercase tracking-widest border-b-2 border-primary pb-1">Start Shopping</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-muted text-[10px] font-black uppercase tracking-widest">
                          <th className="pb-6 pr-4">Order ID</th>
                          <th className="pb-6 px-4">Date</th>
                          <th className="pb-6 px-4">Amount</th>
                          <th className="pb-6 px-4 text-center">Status</th>
                          <th className="pb-6 pl-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {orders.map((order) => (
                          <tr key={order._id} className="group hover:bg-bg-cream/50 transition-colors">
                            <td className="py-8 pr-4"><span className="font-black text-[11px] text-primary uppercase tracking-tight">#{String(order._id).slice(-6).toUpperCase()}</span></td>
                            <td className="py-8 px-4 text-[11px] font-medium text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-8 px-4 font-black text-[11px]">₹{order.totalPrice.toFixed(2)}</td>
                            <td className="py-8 px-4 text-center"><span className="px-4 py-1 bg-bg-cream text-[9px] font-black uppercase tracking-widest">{order.deliveryStatus || 'Processing'}</span></td>
                            <td className="py-8 pl-4 text-right"><button onClick={() => navigate(`/order/${order._id}`)} className="text-[10px] font-black uppercase tracking-widest border border-black/10 px-4 py-2 hover:bg-primary hover:text-white transition-all">View</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-sm p-10 border border-black/5 shadow-sm"
              >
                <div className="flex justify-between items-end mb-10 pb-4 border-b border-black/5">
                  <h2 className="text-[13px] font-black uppercase tracking-[0.3em]">Saved Items</h2>
                  <div className="text-[10px] font-black text-muted uppercase tracking-widest">{wishlistItems.length} Products</div>
                </div>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-24 bg-bg-cream rounded-sm border border-black/5">
                    <Heart size={60} strokeWidth={1} className="mx-auto text-muted/30 mb-6" />
                    <p className="text-[13px] font-black uppercase tracking-tighter mb-8">Wishlist is empty</p>
                    <button onClick={() => navigate('/shop')} className="text-[11px] font-black uppercase tracking-widest border-b-2 border-primary pb-1">Explore Shop</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlistItems.map((item) => (
                      <div key={item._id} className="group">
                        <div className="relative aspect-[3/4] overflow-hidden bg-bg-cream border border-black/5 mb-4 rounded-sm">
                          <img 
                            src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
                            }}
                          />
                          <button onClick={() => dispatch(toggleWishlist(item))} className="absolute top-3 right-3 bg-white p-2 rounded-full text-muted hover:text-red-500 transition-colors shadow-sm"><Heart size={14} className="fill-current" /></button>
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-tight text-primary mb-1">{item.name}</h3>
                        <p className="text-[11px] font-medium text-muted mb-4">₹{item.price}</p>
                        <button onClick={() => navigate(`/product/${item._id}`)} className="w-full text-[10px] font-black uppercase tracking-widest border border-black/10 py-3 hover:bg-primary hover:text-white transition-all">View Product</button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
