import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Store, User, Mail, Lock, Phone, FileText, MapPin, Image as ImageIcon, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    ownerName: '',
    phone: '',
    gstNumber: '',
    address: '',
    storeLogo: '',
    storeBanner: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (userInfo.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/users/seller-register', formData);
      dispatch(setCredentials(data));
      toast.success('Registration successful! Waiting for admin approval.');
      navigate('/seller/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">Become a Seller</h1>
          <p className="text-gray-400">Join our marketplace and start selling to millions of customers</p>
        </div>

        <form onSubmit={submitHandler} className="glass-dark p-8 lg:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Account Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-primary-400 flex items-center gap-2 mb-4">
                <User size={20} /> Account Information
              </h3>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Password"
                  value={formData.password}
                  onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Phone size={18} />
                </div>
                <input
                  name="phone"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* Store Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-accent flex items-center gap-2 mb-4">
                <Store size={20} /> Store Information
              </h3>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Store size={18} />
                </div>
                <input
                  name="storeName"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Store Name"
                  value={formData.storeName}
                  onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <FileText size={18} />
                </div>
                <input
                  name="gstNumber"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="GST Number"
                  value={formData.gstNumber}
                  onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 pt-4 flex items-start pointer-events-none text-gray-500">
                  <MapPin size={18} />
                </div>
                <textarea
                  name="address"
                  required
                  rows="3"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  placeholder="Store Address"
                  value={formData.address}
                  onChange={onChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <ImageIcon size={18} />
                  </div>
                  <input
                    name="storeLogo"
                    type="text"
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Logo URL"
                    value={formData.storeLogo}
                    onChange={onChange}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <ImageIcon size={18} />
                  </div>
                  <input
                    name="storeBanner"
                    type="text"
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Banner URL"
                    value={formData.storeBanner}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full max-w-md flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-xl shadow-primary-900/20 disabled:opacity-70"
            >
              {isLoading ? 'Processing Registration...' : 'Register as Seller'}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Already have a seller account? <Link to="/login" className="text-primary-400 hover:underline">Login here</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SellerRegister;
