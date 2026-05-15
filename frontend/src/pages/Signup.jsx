import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  UserPlus, 
  User, 
  Store, 
  Truck, 
  Shield, 
  CheckCircle,
  ArrowRight,
  UserCheck
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

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/users', { name, email, password, role });
      dispatch(setCredentials(data));
      toast.success('Account created successfully!');
      
      if (data.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'customer', title: 'Customer', description: 'Standard shopping account', icon: User },
    { id: 'seller', title: 'Seller', description: 'Business registration', icon: Store },
    { id: 'delivery', title: 'Delivery', description: 'Partner registration', icon: Truck },
    { id: 'admin', title: 'Admin', description: 'Platform management', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden">
      {/* Left side - Visual & Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-600 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700/80 to-slate-950"></div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-black text-white leading-tight mb-6">
              Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent">Future</span> <br />
              of Fashion.
            </h1>
            <p className="text-xl text-primary-100 font-medium leading-relaxed mb-10 opacity-80">
              Create your account today and unlock a world of curated styles and business opportunities.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { count: '50k+', label: 'Active Users' },
                { count: '1.2k+', label: 'Sellers Joined' },
                { count: '24/7', label: 'Support' },
                { count: '100%', label: 'Secure' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white">{stat.count}</p>
                  <p className="text-primary-300 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md z-10 py-12"
        >
          <div className="mb-10">
            <Link to="/" className="text-3xl font-black text-white tracking-tighter inline-block mb-8">
              WEARIFY<span className="text-primary-500">.</span>
            </Link>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-400 font-medium">Select your journey type to get started</p>
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
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

          {/* Conditional Registration Path */}
          {(role === 'seller' || role === 'delivery') ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary-600/10 border border-primary-500/30 p-8 rounded-[2rem] text-center"
            >
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary-900/20">
                {role === 'seller' ? <Store size={32} /> : <Truck size={32} />}
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                {role === 'seller' ? 'Start Your Business' : 'Join Our Fleet'}
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                {role === 'seller' 
                  ? 'Sell your products to thousands of customers across the globe with our professional seller toolkit.'
                  : 'Earn competitive payouts and flexible hours by joining our delivery partner program today.'}
              </p>
              <Link
                to={role === 'seller' ? '/seller/register' : '/delivery/register'}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-primary-900/20 uppercase tracking-widest text-xs"
              >
                <span>Continue Registration</span>
                <ArrowRight size={18} />
              </Link>
              <p className="mt-6 text-xs text-gray-500">
                Requires additional documentation and approval process.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
                      <UserCheck size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-black rounded-2xl text-white bg-primary-600 hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/20 disabled:opacity-70 uppercase tracking-widest"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-white hover:text-primary-400 transition-colors uppercase tracking-widest text-[11px] ml-2">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
