import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  LogIn, 
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
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(role)}
    className={`relative flex flex-col p-4 rounded-2xl cursor-pointer border transition-all ${
      selected 
        ? 'bg-primary-600/10 border-primary-500 shadow-lg shadow-primary-900/20' 
        : 'bg-slate-900/50 border-white/5 hover:border-white/10'
    }`}
  >
    <div className={`p-2 rounded-xl w-fit mb-3 ${selected ? 'bg-primary-500 text-white' : 'bg-slate-800 text-gray-400'}`}>
      <Icon size={20} />
    </div>
    <h3 className={`font-bold text-sm ${selected ? 'text-white' : 'text-gray-400'}`}>{title}</h3>
    <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{description}</p>
    {selected && (
      <div className="absolute top-4 right-4 text-primary-500">
        <CheckCircle size={16} />
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

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') navigate('/admin/dashboard');
      else if (userInfo.role === 'seller') navigate('/seller/dashboard');
      else if (userInfo.role === 'delivery') navigate('/delivery/dashboard');
      else navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      
      if (role !== data.role) {
        toast.error(`You are trying to login as ${role}, but this account is registered as ${data.role}`);
        setIsLoading(false);
        return;
      }

      dispatch(setCredentials(data));
      toast.success('Welcome back!');
      
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'seller') navigate('/seller/dashboard');
      else if (data.role === 'delivery') navigate('/delivery/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'customer', title: 'Customer', description: 'Shop latest trends', icon: User },
    { id: 'seller', title: 'Seller', description: 'Grow your business', icon: Store },
    { id: 'delivery', title: 'Delivery', description: 'Join the fleet', icon: Truck },
    { id: 'admin', title: 'Admin', description: 'Manage platform', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden pt-16">
      {/* Left side - Visual & Brand (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-600 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700/80 to-slate-950"></div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-black text-white leading-tight mb-6">
              Experience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent">Seamless</span> <br />
              Commerce.
            </h1>
            <p className="text-xl text-primary-100 font-medium leading-relaxed mb-10 opacity-80">
              Join thousands of users who trust Wearify for their daily shopping and business growth.
            </p>
            
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i} 
                    className="w-12 h-12 rounded-full border-4 border-primary-600" 
                    src={`https://i.pravatar.cc/150?u=${i}`} 
                    alt="User" 
                  />
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white font-bold">10k+ Community</p>
                <p className="text-primary-300 text-xs font-medium">Join our growing ecosystem</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md z-10"
        >
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="text-3xl font-black text-white tracking-tighter inline-block mb-8">
              WEARIFY<span className="text-primary-500">.</span>
            </Link>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Welcome back</h2>
            <p className="text-gray-400 font-medium">Select your role to access your workspace</p>
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
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

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-black rounded-2xl text-white bg-primary-600 hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/20 disabled:opacity-70 uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="font-black text-white hover:text-primary-400 transition-colors uppercase tracking-widest text-[11px] ml-2">
                Join Now
              </Link>
            </p>
            <div className="flex justify-center gap-6 pt-2 border-t border-white/5">
              <Link to="/seller/register" className="text-[10px] font-bold text-gray-500 hover:text-primary-400 transition-colors uppercase tracking-widest">Register as Seller</Link>
              <Link to="/delivery/register" className="text-[10px] font-bold text-gray-500 hover:text-primary-400 transition-colors uppercase tracking-widest">Register as Partner</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
