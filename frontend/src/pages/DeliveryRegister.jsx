import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Truck, User, Mail, Lock, Phone, MapPin, CreditCard, Image as ImageIcon, ArrowRight, Shield } from 'lucide-react';
import axios from 'axios';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const DeliveryRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    vehicleType: 'Bike',
    vehicleNumber: '',
    drivingLicense: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'delivery') {
        navigate('/delivery/dashboard');
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
      const { data } = await axios.post('/api/users/delivery-register', formData);
      dispatch(setCredentials(data));
      toast.success('Registration successful! Waiting for admin approval.');
      navigate('/delivery/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-primary-500/10 rounded-3xl text-primary-400 mb-6 border border-primary-500/20">
            <Truck size={40} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Delivery Partner</h1>
          <p className="text-gray-400">Join our delivery fleet and start earning on every delivery</p>
        </div>

        <form onSubmit={submitHandler} className="bg-slate-900/50 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Personal Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <User size={20} className="text-primary-400" /> Personal Details
              </h3>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><User size={18} /></div>
                <input
                  name="name" type="text" required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Full Name" value={formData.name} onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Mail size={18} /></div>
                <input
                  name="email" type="email" required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Email Address" value={formData.email} onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Lock size={18} /></div>
                <input
                  name="password" type="password" required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Create Password" value={formData.password} onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Phone size={18} /></div>
                <input
                  name="phone" type="text" required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Phone Number" value={formData.phone} onChange={onChange}
                />
              </div>
            </div>

            {/* Vehicle & Work Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Truck size={20} className="text-accent" /> Vehicle Details
              </h3>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Shield size={18} /></div>
                <select
                  name="vehicleType"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                  value={formData.vehicleType}
                  onChange={onChange}
                >
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><CreditCard size={18} /></div>
                <input
                  name="vehicleNumber" type="text" required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Vehicle Number (e.g. NY-4829)" value={formData.vehicleNumber} onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><ImageIcon size={18} /></div>
                <input
                  name="drivingLicense" type="text" required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Driving License URL" value={formData.drivingLicense} onChange={onChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 pt-4 flex items-start pointer-events-none text-gray-500"><MapPin size={18} /></div>
                <textarea
                  name="address" required rows="2"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Residential Address" value={formData.address} onChange={onChange}
                ></textarea>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-center">
            <button
              type="submit" disabled={isLoading}
              className="group relative w-full max-w-md flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-primary-600 hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/20"
            >
              {isLoading ? 'Processing...' : 'Register as Partner'}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Already a partner? <Link to="/login" className="text-primary-400 hover:underline">Login here</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DeliveryRegister;
