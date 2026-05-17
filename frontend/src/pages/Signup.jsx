import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Store,
  Truck,
  Shield,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Phone
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

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      const { data } = await axios.post('/api/users', { name, email, password, role, phone });
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
    <div className="min-h-screen flex bg-[#f8f7f5] overflow-hidden">

      {/* Left Panel — Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-[#212a2f]/60" />
        <div className="relative z-10 flex flex-col justify-end p-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/50 text-[11px] font-black uppercase tracking-[0.3em] mb-6">Join Wearify</p>
            <h1 className="text-5xl font-black text-white leading-none uppercase tracking-tighter mb-6">
              Join the<br />future of<br />fashion.
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Create your account and unlock a world of curated styles, business tools, and delivery opportunities.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10 max-w-xs">
              {[
                { count: '50k+', label: 'Active Users' },
                { count: '1.2k+', label: 'Sellers' },
                { count: '24/7', label: 'Support' },
                { count: '100%', label: 'Secure' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 p-4 rounded-sm">
                  <p className="text-xl font-black text-white">{stat.count}</p>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
        >
          {/* Logo */}
          <Link to="/" className="text-2xl font-black text-[#212a2f] tracking-tighter uppercase inline-block mb-12">
            Wearify
          </Link>

          <h2 className="text-3xl font-black text-[#212a2f] uppercase tracking-tighter mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm mb-10">Select your role and fill in your details.</p>

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

          {/* Seller/Delivery Special CTA */}
          {(role === 'seller' || role === 'delivery') ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-black/5 rounded-sm p-10 text-center"
            >
              <div className="w-16 h-16 bg-[#212a2f] rounded-sm flex items-center justify-center text-white mx-auto mb-6">
                {role === 'seller' ? <Store size={28} /> : <Truck size={28} />}
              </div>
              <h3 className="text-xl font-black text-[#212a2f] uppercase tracking-tighter mb-3">
                {role === 'seller' ? 'Start Your Business' : 'Join Our Fleet'}
              </h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                {role === 'seller'
                  ? 'Sell to thousands of customers with our professional seller toolkit.'
                  : 'Earn with flexible hours by joining our delivery partner program.'}
              </p>
              <Link
                to={role === 'seller' ? '/seller/register' : '/delivery/register'}
                className="inline-flex items-center gap-3 bg-[#212a2f] text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 hover:bg-[#334148] transition-all"
              >
                Continue Registration <ArrowRight size={16} />
              </Link>
              <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest">
                Requires additional documents & approval.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-white border border-black/10 rounded-sm text-[#212a2f] placeholder-gray-300 focus:outline-none focus:border-[#212a2f] transition-all text-sm"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-white border border-black/10 rounded-sm text-[#212a2f] placeholder-gray-300 focus:outline-none focus:border-[#212a2f] transition-all text-sm"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-white border border-black/10 rounded-sm text-[#212a2f] placeholder-gray-300 focus:outline-none focus:border-[#212a2f] transition-all text-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Confirm</label>
                  <div className="relative">
                    <UserCheck size={16} className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-white border border-black/10 rounded-sm text-[#212a2f] placeholder-gray-300 focus:outline-none focus:border-[#212a2f] transition-all text-sm"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
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
                    Creating Account...
                  </>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-black/5 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-[#212a2f] hover:opacity-70 transition-opacity uppercase tracking-widest text-[11px] ml-1">
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
