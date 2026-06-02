import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Store,
  Truck,
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const RoleCard = ({ selected, onClick, role, icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: selected ? '0 12px 28px rgba(233,30,99,0.25)' : '0 8px 20px rgba(233,30,99,0.06)' }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(role)}
    className={`relative flex flex-col p-4.5 cursor-pointer border transition-all duration-300 rounded-3xl ${
      selected
        ? 'border-transparent text-white shadow-[0_8px_24px_rgba(233,30,99,0.2)]'
        : 'bg-white border-[#FCE4EC] text-gray-500 hover:border-[#E91E63] hover:bg-[#FFF7FA]/50'
    }`}
    style={{
      background: selected ? 'linear-gradient(135deg, #E91E63 0%, #D81B60 100%)' : 'white'
    }}
  >
    <div className={`p-2.5 rounded-2xl w-fit mb-3 transition-colors duration-300 ${selected ? 'bg-white/20 text-white' : 'bg-[#FFF0F4] text-[#E91E63]'}`}>
      <Icon size={16} />
    </div>
    <h3 
      className={`font-bold text-[11px] uppercase tracking-wider transition-colors duration-300 ${selected ? 'text-white' : 'text-[#1F1F1F]'}`}
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      {title}
    </h3>
    <p 
      className={`text-[10px] mt-1 line-clamp-1 transition-colors duration-300 ${selected ? 'text-white/70' : 'text-gray-400'}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {description}
    </p>
    {selected && (
      <div className="absolute top-4 right-4 text-white">
        <CheckCircle size={14} className="fill-current text-white/20" />
      </div>
    )}
  </motion.div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') navigate('/admin/dashboard');
      else if (userInfo.role === 'seller') navigate('/seller/dashboard');
      else if (userInfo.role === 'delivery') navigate('/delivery/dashboard');
      else navigate(redirect);
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/users/login', { email, password });

      if (role !== data.role) {
        toast.error(`Account role mismatch. This account is registered as "${data.role}".`);
        setIsLoading(false);
        return;
      }

      dispatch(setCredentials(data));
      toast.success('Welcome back!');

      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'seller') navigate('/seller/dashboard');
      else if (data.role === 'delivery') navigate('/delivery/dashboard');
      else navigate(redirect);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'customer', title: 'Customer', description: 'Shop & track orders', icon: User },
    { id: 'seller', title: 'Seller', description: 'Manage your store', icon: Store },
    { id: 'delivery', title: 'Delivery', description: 'Manage deliveries', icon: Truck },
    { id: 'admin', title: 'Admin', description: 'Platform control', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex bg-[#FFF7FA] overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Left Panel — Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E91E63]/90 via-[#880E4F]/75 to-[#1F1F1F]/65" />
        
        {/* Subtle Decorative Editorial Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#FFF0F5]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#E91E63]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-end p-16 pb-20 w-full h-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-4">
              ✦ Welcome Back
            </span>
            <h1 
              className="text-5xl font-black text-white leading-tight uppercase tracking-tight mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Style starts<br />with purpose.
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm font-medium">
              Join thousands of shoppers, sellers, and partners building a more sustainable fashion future.
            </p>

            <div className="flex gap-4 mt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#E91E63]/60 object-cover ring-2 ring-[#FFF7FA]/20"
                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?auto=format&fit=crop&w=150&h=150`}
                    alt="User"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://i.pravatar.cc/150?u=${i}`;
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-sm font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>10,000+ Members</p>
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Growing every day</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white border border-[#FCE4EC]/50 rounded-[32px] p-8 sm:p-10"
          style={{ boxShadow: '0 10px 40px rgba(233,30,99,0.03)' }}
        >
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-black text-[#1F1F1F] tracking-tighter uppercase inline-flex items-center gap-1.5 mb-8 hover:text-[#E91E63] transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <span className="text-[#E91E63]">✦</span> Wearify
          </Link>

          <h2 
            className="text-3xl font-black text-[#1F1F1F] uppercase tracking-tight mb-1.5"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Sign In
          </h2>
          <p className="text-gray-400 text-xs mb-8">Select your role and enter your credentials.</p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.map((r) => (
              <RoleCard
                key={r.id}
                role={r.id}
                title={r.title}
                description={r.description}
                icon={r.icon}
                selected={role === r.id}
                onClick={setRole}
              />
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label 
                className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-4.5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#FCE4EC] rounded-2xl text-[#1F1F1F] placeholder-gray-300 focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/30 transition-all text-sm font-medium"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label 
                  className="text-[10px] font-bold uppercase tracking-wider text-gray-400"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#E91E63] underline underline-offset-4 transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-4.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white border border-[#FCE4EC] rounded-2xl text-[#1F1F1F] placeholder-gray-300 focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/30 transition-all text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-[#E91E63] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-[0_8px_24px_rgba(233,30,99,0.3)] hover:shadow-[0_12px_32px_rgba(233,30,99,0.45)] transition-all duration-300 disabled:opacity-60 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #E91E63 0%, #D81B60 100%)' }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={14} className="ml-1" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#FCE4EC]/50 text-center space-y-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-bold text-[#E91E63] hover:text-[#D81B60] transition-colors uppercase tracking-widest text-[11px] ml-1"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Join Now
              </Link>
            </p>
            <div className="flex justify-center gap-6">
              <Link 
                to="/seller/register" 
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#E91E63] underline underline-offset-4 transition-colors"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Become a Seller
              </Link>
              <Link 
                to="/delivery/register" 
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#E91E63] underline underline-offset-4 transition-colors"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Delivery Partner
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
