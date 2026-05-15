import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Truck, 
  CreditCard, 
  Image as ImageIcon,
  Save,
  ShieldCheck,
  Star,
  Award,
  Navigation
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const DeliveryProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    vehicleType: '',
    vehicleNumber: '',
    drivingLicense: ''
  });

  useEffect(() => {
    if (userInfo && userInfo.role === 'delivery') {
      setFormData({
        name: userInfo.name || '',
        phone: userInfo.deliveryProfile?.phone || '',
        address: userInfo.deliveryProfile?.address || '',
        vehicleType: userInfo.deliveryProfile?.vehicleType || '',
        vehicleNumber: userInfo.deliveryProfile?.vehicleNumber || '',
        drivingLicense: userInfo.deliveryProfile?.drivingLicense || ''
      });
    }
  }, [userInfo]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/delivery/profile', formData);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Partner Profile</h1>
          <p className="text-gray-400 text-sm">Manage your personal and vehicle information</p>
        </div>
      </div>

      <form onSubmit={submitHandler} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Info */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <User size={20} className="text-primary-400" /> Identity Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input
                    name="name" type="text"
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.name} onChange={onChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input
                    type="email" readOnly
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-gray-500 cursor-not-allowed outline-none"
                    value={userInfo?.email}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input
                    name="phone" type="text"
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.phone} onChange={onChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input
                    name="address" type="text"
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.address} onChange={onChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Truck size={20} className="text-accent" /> Vehicle & Documentation
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vehicle Type</label>
                <select
                  name="vehicleType"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                  value={formData.vehicleType} onChange={onChange}
                >
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vehicle Number</label>
                <input
                  name="vehicleNumber" type="text"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.vehicleNumber} onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Driving License (Document Link)</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input
                  name="drivingLicense" type="text"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.drivingLicense} onChange={onChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Badge / Stats Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-primary-900/40">
                <Navigation size={40} />
              </div>
              <h3 className="text-xl font-black text-white">{userInfo?.name}</h3>
              <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mt-1">Verified Partner</p>
              
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                <div>
                  <p className="text-2xl font-black text-white">{userInfo?.deliveryProfile?.totalDeliveries || 0}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Deliveries</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">4.9</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent"><Award size={24} /></div>
            <div>
              <p className="text-white font-bold text-sm">Platinum Driver</p>
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Top 5% in city</p>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 uppercase tracking-widest text-xs"
          >
            <Save size={20} /> {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryProfile;
