import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Settings, Package, Heart, LogOut } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

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
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        // Mock update profile API
        // const { data } = await axios.put('/api/users/profile', { _id: userInfo._id, name, email, password });
        // dispatch(setCredentials(data));
        toast.success('Profile Updated Successfully');
      } catch (err) {
        toast.error(err?.response?.data?.message || err.error);
      }
    }
  };

  const logoutHandler = async () => {
    try {
      await axios.post('/api/users/logout');
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let interval;
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
    
    if (activeTab === 'orders') {
      fetchOrders();
      interval = setInterval(fetchOrders, 30000);
    }
    
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-cream text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full lg:w-72">
            <div className="bg-white rounded-sm p-8 border border-black/5 sticky top-32 shadow-sm">
              <div className="flex flex-col items-center mb-10">
                <div className="h-20 w-20 bg-primary text-white rounded-sm flex items-center justify-center text-2xl font-black mb-4 uppercase tracking-widest">
                  {userInfo?.name?.charAt(0)}
                </div>
                <h2 className="text-[13px] font-black uppercase tracking-widest text-primary">{userInfo?.name}</h2>
                <p className="text-muted text-[11px] font-medium mt-1">{userInfo?.email}</p>
                <div className="mt-4 px-4 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-[0.2em] border border-black/5">
                  {userInfo?.role}
                </div>
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}
                >
                  Settings
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}
                >
                  My Orders
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'wishlist' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}
                >
                  Wishlist
                </button>
                
                {userInfo?.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest text-accent border border-accent/20 mt-4 hover:bg-accent hover:text-white transition-all"
                  >
                    Admin Panel
                  </button>
                )}

                <button 
                  onClick={logoutHandler}
                  className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest text-muted border border-black/5 mt-4 hover:bg-black hover:text-white transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
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
                      <input
                        type="text"
                        className="w-full px-5 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-3">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-5 py-4 bg-bg-cream border border-black/5 rounded-sm opacity-50 cursor-not-allowed text-sm font-medium"
                        value={email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-3">New Password</label>
                      <input
                        type="password"
                        className="w-full px-5 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-3">Confirm Password</label>
                      <input
                        type="password"
                        className="w-full px-5 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-allbirds"
                  >
                    Save Changes
                  </button>
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
                
                {loadingOrders ? (
                  <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                ) : orders.length === 0 ? (
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
                          <th className="pb-6 px-4 text-center">Tracking</th>
                          <th className="pb-6 pl-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {orders.map((order) => (
                          <tr key={order._id} className="group hover:bg-bg-cream/50 transition-colors">
                            <td className="py-8 pr-4">
                              <span className="font-black text-[11px] text-primary uppercase tracking-tight">#{String(order._id).slice(-6).toUpperCase()}</span>
                            </td>
                            <td className="py-8 px-4 text-[11px] font-medium text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-8 px-4 font-black text-[11px]">${order.totalPrice.toFixed(2)}</td>
                             <td className="py-8 px-4">
                               <div className="flex flex-col items-center gap-3">
                                 <span className={`px-4 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                                   order.deliveryStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                   order.deliveryStatus === 'Out For Delivery' ? 'bg-primary text-white shadow-sm' :
                                   'bg-bg-cream text-muted'
                                 }`}>
                                   {order.deliveryStatus || 'Processing'}
                                 </span>
                                 <div className="w-24 h-0.5 bg-black/5 rounded-full overflow-hidden">
                                   <div 
                                     className={`h-full bg-primary transition-all duration-1000 ${
                                       order.deliveryStatus === 'Delivered' ? 'w-full' :
                                       order.deliveryStatus === 'Out For Delivery' ? 'w-4/5' :
                                       order.deliveryStatus === 'Picked Up' ? 'w-3/5' :
                                       order.deliveryStatus === 'Accepted' ? 'w-2/5' : 'w-1/5'
                                     }`}
                                   ></div>
                                 </div>
                               </div>
                             </td>
                            <td className="py-8 pl-4 text-right">
                              <button 
                                onClick={() => navigate(`/order/${order._id}`)}
                                className="text-[10px] font-black uppercase tracking-widest border border-black/10 px-4 py-2 hover:bg-primary hover:text-white transition-all"
                              >
                                View
                              </button>
                            </td>
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
                        <div className="relative aspect-[3/4] overflow-hidden bg-bg-cream border border-black/5 mb-4">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                          <button 
                            onClick={() => {
                              dispatch(toggleWishlist(item));
                              toast.info('Removed from Wishlist');
                            }}
                            className="absolute top-3 right-3 bg-white p-2 rounded-full text-muted hover:text-red-500 transition-colors shadow-sm"
                          >
                            <Heart size={14} className="fill-current" />
                          </button>
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-tight text-primary mb-1">{item.name}</h3>
                        <p className="text-[11px] font-medium text-muted mb-4">${item.price}</p>
                        <button 
                          onClick={() => navigate(`/product/${item._id}`)}
                          className="w-full text-[10px] font-black uppercase tracking-widest border border-black/10 py-3 hover:bg-primary hover:text-white transition-all"
                        >
                          View Product
                        </button>
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
