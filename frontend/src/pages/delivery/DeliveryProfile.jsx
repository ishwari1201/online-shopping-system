import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  Camera, 
  Save, 
  Shield,
  CreditCard,
  Building2
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';

const DeliveryProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [name, setName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/users/profile', { name, phone });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Partner Profile</h1>
        <p className="text-gray-400 text-sm">Manage your personal information and vehicle details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl text-center">
            <div className="relative group mx-auto w-32 h-32 mb-6">
              <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                {name.charAt(0)}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2.5 bg-slate-800 text-white rounded-xl border border-white/10 hover:bg-slate-700 transition-all shadow-lg">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="text-white font-bold text-lg">{name}</h3>
            <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center justify-center gap-2">
              <Shield size={10} /> Certified Partner
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl space-y-4">
            <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-4">Vehicle Details</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-white font-bold">
                <Truck size={14} className="text-primary-500" /> 
                Honda Activa 6G
              </div>
              <p className="text-gray-500 text-[10px] ml-7 font-black uppercase">Plate: ABC-1234</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
          >
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <User className="absolute left-4 top-4 text-gray-500" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <input 
                      type="text" required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                    <Phone className="absolute left-4 top-4 text-gray-500" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-white opacity-50 cursor-not-allowed"
                    value={userInfo?.email}
                    disabled
                  />
                  <Mail className="absolute left-4 top-4 text-gray-500" size={18} />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4">
                <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-3">
                  <CreditCard size={18} className="text-primary-500" /> Settlement Info
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bank Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-white opacity-50"
                        placeholder="Global Payout Bank"
                        disabled
                      />
                      <Building2 className="absolute left-4 top-4 text-gray-500" size={18} />
                    </div>
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Account Number</label>
                    <input 
                      type="password" 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white opacity-50"
                      value="********4829"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary-900/40 flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div> : <Save size={16} />}
                Save Profile
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
