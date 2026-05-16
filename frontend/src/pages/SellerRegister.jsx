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
    <div className="min-h-screen pt-32 pb-20 bg-bg-cream flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white p-10 md:p-16 border border-black/5 shadow-sm"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-primary">Partner with Wearify</h1>
          <div className="w-12 h-1 bg-primary mx-auto mt-6 mb-4"></div>
          <p className="text-muted text-[11px] font-black uppercase tracking-widest">Start your sustainable business journey</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-12">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Account Info */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary border-b border-black/5 pb-4">
                Personal Credentials
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Secure Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Contact Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="phone"
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary border-b border-black/5 pb-4">
                Storefront Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Marketplace Name</label>
                  <div className="relative">
                    <Store size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="storeName"
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="e.g. EcoStyles Store"
                      value={formData.storeName}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">GST Identification</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="gstNumber"
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium uppercase"
                      placeholder="GSTIN Number"
                      value={formData.gstNumber}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Physical Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-4 text-muted" />
                    <textarea
                      name="address"
                      required
                      rows="3"
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium resize-none"
                      placeholder="Official store address"
                      value={formData.address}
                      onChange={onChange}
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Logo URL</label>
                    <input
                      name="storeLogo"
                      type="text"
                      className="w-full px-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-[11px] font-medium"
                      placeholder="https://..."
                      value={formData.storeLogo}
                      onChange={onChange}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Banner URL</label>
                    <input
                      name="storeBanner"
                      type="text"
                      className="w-full px-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-[11px] font-medium"
                      placeholder="https://..."
                      value={formData.storeBanner}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-12 flex flex-col items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-allbirds w-full max-w-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Application <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="mt-8 text-[11px] font-black uppercase tracking-widest text-muted">
              Already a partner? <Link to="/login" className="text-primary border-b border-primary pb-0.5 ml-2">Sign In</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SellerRegister;
