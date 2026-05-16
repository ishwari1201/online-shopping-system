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
    whileTap={{ scale: 0.97 }}
    onClick={() => onClick(role)}
    className={`relative flex flex-col p-4 cursor-pointer border transition-all rounded-sm ${
      selected
        ? 'bg-[#212a2f] border-[#212a2f] text-white'
        : 'bg-white border-black/10 text-gray-500 hover:border-[#212a2f]'
    }`}
  >
    <div className={`p-2 rounded-sm w-fit mb-3 ${selected ? 'bg-white/10 text-white' : 'bg-[#f8f7f5] text-gray-400'}`}>
      <Icon size={18} />
    </div>
    <h3 className={`font-black text-[11px] uppercase tracking-widest ${selected ? 'text-white' : 'text-[#212a2f]'}`}>{title}</h3>
    <p className={`text-[10px] mt-1 line-clamp-1 ${selected ? 'text-white/60' : 'text-gray-400'}`}>{description}</p>
    {selected && (
      <div className="absolute top-3 right-3 text-white">
        <CheckCircle size={14} />
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
    <div className="min-h-screen flex bg-[#f8f7f5] overflow-hidden">

      {/* Left Panel — Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-[#212a2f]/60" />
        <div className="relative z-10 flex flex-col justify-end p-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/50 text-[11px] font-black uppercase tracking-[0.3em] mb-6">Welcome Back</p>
            <h1 className="text-5xl font-black text-white leading-none uppercase tracking-tighter mb-6">
              Style starts<br />with purpose.
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Join thousands of shoppers, sellers, and partners building a more sustainable fashion future.
            </p>

            <div className="flex gap-4 mt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#212a2f]"
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="User"
                  />
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-sm font-black">10,000+ Members</p>
                <p className="text-white/50 text-[11px]">Growing every day</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="text-2xl font-black text-[#212a2f] tracking-tighter uppercase inline-block mb-12">
            Wearify
          </Link>

          <h2 className="text-3xl font-black text-[#212a2f] uppercase tracking-tighter mb-2">Sign In</h2>
          <p className="text-gray-400 text-sm mb-10">Select your role and enter your credentials.</p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-10">
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
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-4 bg-white border border-black/10 rounded-sm text-[#212a2f] placeholder-gray-300 focus:outline-none focus:border-[#212a2f] transition-all text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#212a2f] underline underline-offset-4 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-11 pr-12 py-4 bg-white border border-black/10 rounded-sm text-[#212a2f] placeholder-gray-300 focus:outline-none focus:border-[#212a2f] transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-[#212a2f] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#212a2f] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#334148] transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black/5 text-center space-y-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-black text-[#212a2f] hover:opacity-70 transition-opacity uppercase tracking-widest text-[11px] ml-1">
                Join Now
              </Link>
            </p>
            <div className="flex justify-center gap-8">
              <Link to="/seller/register" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#212a2f] underline underline-offset-4 transition-colors">
                Become a Seller
              </Link>
              <Link to="/delivery/register" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#212a2f] underline underline-offset-4 transition-colors">
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
