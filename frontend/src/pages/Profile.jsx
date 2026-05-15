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

  const DUMMY_ORDERS = [
    { _id: 'ord_001', date: '2026-05-10', total: 249.98, status: 'Delivered' },
    { _id: 'ord_002', date: '2026-05-12', total: 129.99, status: 'Processing' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 sticky top-28">
              <div className="flex flex-col items-center mb-8">
                <div className="h-24 w-24 bg-primary-500/20 rounded-full flex items-center justify-center border-2 border-primary-500 text-primary-500 mb-4">
                  <User size={40} />
                </div>
                <h2 className="text-xl font-bold text-white">{userInfo?.name}</h2>
                <p className="text-gray-400 text-sm">{userInfo?.email}</p>
                <div className="mt-2 px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase">
                  {userInfo?.role}
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-primary-600 text-white font-medium' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Settings size={20} /> Account Settings
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-primary-600 text-white font-medium' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Package size={20} /> My Orders
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'wishlist' ? 'bg-primary-600 text-white font-medium' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Heart size={20} /> Wishlist
                </button>
                
                {userInfo?.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 hover:bg-slate-800 hover:text-purple-300 transition-all font-medium border border-purple-500/30"
                  >
                    <Settings size={20} /> Admin Dashboard
                  </button>
                )}

                <button 
                  onClick={logoutHandler}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-medium mt-4 border border-red-500/30"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900 rounded-3xl p-8 border border-slate-800"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
                <form onSubmit={submitHandler} className="space-y-6 max-w-xl">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-950 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-950 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-950 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="New Password (Optional)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-950 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                  >
                    Update Profile
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900 rounded-3xl p-8 border border-slate-800"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-gray-400">
                        <th className="pb-4 font-medium">Order ID</th>
                        <th className="pb-4 font-medium">Date</th>
                        <th className="pb-4 font-medium">Total</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {DUMMY_ORDERS.map((order) => (
                        <tr key={order._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 text-primary-400 font-medium">{order._id}</td>
                          <td className="py-4">{order.date}</td>
                          <td className="py-4">${order.total}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-accent/20 text-accent'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-colors text-white">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'wishlist' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900 rounded-3xl p-8 border border-slate-800"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Your Wishlist</h2>
                
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={64} className="mx-auto text-slate-700 mb-4" />
                    <h3 className="text-xl text-white font-medium mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-400">Save items you love to your wishlist to review them later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item._id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
                        <div className="relative h-48 bg-slate-900">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-white font-medium line-clamp-1 mb-2">{item.name}</h3>
                          <p className="text-primary-400 font-bold mb-4">${item.price}</p>
                          <div className="mt-auto grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => {
                                dispatch(toggleWishlist(item));
                                toast.info('Removed from Wishlist');
                              }}
                              className="bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                            >
                              Remove
                            </button>
                            <button 
                              onClick={() => navigate(`/product/${item._id}`)}
                              className="bg-primary-600 hover:bg-primary-500 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
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
