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
    <div className="min-h-screen pt-32 pb-20 bg-bg-cream flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white p-10 md:p-16 border border-black/5 shadow-sm"
      >
        <div className="text-center mb-16">
          <div className="inline-flex p-5 bg-primary text-white rounded-sm mb-6 shadow-md">
            <Truck size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-primary">Join the Fleet</h1>
          <div className="w-12 h-1 bg-primary mx-auto mt-6 mb-4"></div>
          <p className="text-muted text-[11px] font-black uppercase tracking-widest">Deliver sustainability with Wearify</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-12">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Personal Details */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary border-b border-black/5 pb-4 flex items-center gap-3">
                <User size={16} /> Personal Identity
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Legal Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="name" type="text" required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="Your full name" value={formData.name} onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="email" type="email" required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="email@example.com" value={formData.email} onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Create Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="password" type="password" required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="••••••••" value={formData.password} onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="phone" type="text" required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="+91 00000 00000" value={formData.phone} onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary border-b border-black/5 pb-4 flex items-center gap-3">
                <Truck size={16} /> Logistics Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Transport Mode</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-4 top-4 text-muted" />
                    <select
                      name="vehicleType"
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-[11px] font-black uppercase tracking-widest appearance-none"
                      value={formData.vehicleType}
                      onChange={onChange}
                    >
                      <option value="Bike">Bike</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Vehicle Number</label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="vehicleNumber" type="text" required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium uppercase"
                      placeholder="MH-01-AB-1234" value={formData.vehicleNumber} onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Driving License URL</label>
                  <div className="relative">
                    <ImageIcon size={16} className="absolute left-4 top-4 text-muted" />
                    <input
                      name="drivingLicense" type="text" required
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-[11px] font-medium"
                      placeholder="Link to your license" value={formData.drivingLicense} onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Base Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-4 text-muted" />
                    <textarea
                      name="address" required rows="2"
                      className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium resize-none"
                      placeholder="Your current address" value={formData.address} onChange={onChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-12 flex flex-col items-center">
            <button
              type="submit" disabled={isLoading}
              className="btn-allbirds w-full max-w-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Register as Partner <ArrowRight size={18} />
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

export default DeliveryRegister;
