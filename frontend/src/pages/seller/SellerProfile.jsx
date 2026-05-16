import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Camera, 
  Save, 
  Building2, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';

const SellerProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [storeName, setStoreName] = useState(userInfo?.sellerProfile?.storeName || '');
  const [description, setDescription] = useState(userInfo?.sellerProfile?.description || '');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/seller/profile', { storeName, description });
      toast.success('Store profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Store Profile</h1>
        <p className="text-gray-400 text-sm">Manage your brand presence and public store details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl text-center">
            <div className="relative group mx-auto w-32 h-32 mb-6">
              <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                {storeName.charAt(0) || userInfo?.name?.charAt(0)}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2.5 bg-slate-800 text-white rounded-xl border border-white/10 hover:bg-slate-700 transition-all shadow-lg">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="text-white font-bold text-lg">{storeName || 'My Store'}</h3>
            <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center justify-center gap-2">
              <CheckCircle size={10} /> Verified Seller
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl space-y-4">
            <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-4">Onboarding Status</h4>
            <div className="flex items-center gap-3 text-xs text-green-500 font-bold">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Account Verified
            </div>
            <div className="flex items-center gap-3 text-xs text-green-500 font-bold">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Bank Info Linked
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              Tax Details (Optional)
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
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Store Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                  <Store className="absolute left-4 top-4 text-gray-500" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Store Description</label>
                <textarea 
                  rows="4"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                  placeholder="Tell customers about your brand..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Public Email</label>
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
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Support Phone</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                    <Phone className="absolute left-4 top-4 text-gray-500" size={18} />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary-900/40 flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div> : <Save size={16} />}
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
