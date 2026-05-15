import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Image as ImageIcon,
  Save,
  ShieldCheck,
  Building
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SellerProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    storeLogo: '',
    storeBanner: '',
    ownerName: '',
    phone: '',
    address: '',
    gstNumber: ''
  });

  useEffect(() => {
    if (userInfo && userInfo.role === 'seller') {
      setFormData({
        storeName: userInfo.sellerProfile?.storeName || '',
        description: userInfo.sellerProfile?.description || '',
        storeLogo: userInfo.sellerProfile?.storeLogo || '',
        storeBanner: userInfo.sellerProfile?.storeBanner || '',
        ownerName: userInfo.sellerProfile?.ownerName || userInfo.name,
        phone: userInfo.sellerProfile?.phone || '',
        address: userInfo.sellerProfile?.address || '',
        gstNumber: userInfo.sellerProfile?.gstNumber || ''
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
      const { data } = await axios.put('/api/seller/profile', formData);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Store Profile</h1>
        <p className="text-gray-400 text-sm">Manage your public store information and business details</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-8">
        {/* Banner and Logo Section */}
        <div className="relative group">
          <div className="h-64 w-full rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 relative">
            <img 
              src={formData.storeBanner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop'} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-xl text-sm font-bold border border-white/10">
                Change Banner
              </button>
            </div>
          </div>
          
          <div className="absolute -bottom-8 left-12 group/logo">
            <div className="w-32 h-32 rounded-[2rem] bg-slate-800 border-4 border-slate-950 overflow-hidden relative">
              <img 
                src={formData.storeLogo || `https://ui-avatars.com/api/?name=${formData.storeName}&background=random`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer">
                <ImageIcon size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pt-10">
          <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <Store size={20} className="text-primary-400" /> General Store Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Store Name</label>
                  <input
                    name="storeName"
                    type="text"
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.storeName}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contact Email</label>
                  <input
                    name="email"
                    type="email"
                    readOnly
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
                    value={userInfo?.email}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Store Description</label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Tell customers about your brand..."
                  value={formData.description}
                  onChange={onChange}
                ></textarea>
              </div>
            </div>

            {/* Business Verification */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <ShieldCheck size={20} className="text-accent" /> Business Verification
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">GST Number</label>
                  <input
                    name="gstNumber"
                    type="text"
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.gstNumber}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                  <input
                    name="phone"
                    type="text"
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.phone}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Business Address</label>
                <textarea
                  name="address"
                  rows="2"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  value={formData.address}
                  onChange={onChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Owner Profile */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white">Owner Information</h3>
              <div className="flex flex-col items-center py-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-4">
                  {formData.ownerName?.charAt(0)}
                </div>
                <input
                  name="ownerName"
                  type="text"
                  className="text-center bg-transparent border-none text-white font-bold text-xl outline-none w-full"
                  value={formData.ownerName}
                  onChange={onChange}
                />
                <p className="text-gray-500 text-sm">Registered Owner</p>
              </div>
            </div>

            {/* Payout Bank Info (Partial) */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building size={20} className="text-purple-400" /> Bank Details
              </h3>
              <div className="p-4 bg-slate-800 rounded-2xl border border-dashed border-slate-700 text-center">
                <p className="text-gray-400 text-xs mb-2">Payouts are sent to</p>
                <p className="text-white font-black">HDFC Bank • • • • 4829</p>
                <button type="button" className="mt-4 text-primary-400 text-xs font-bold hover:underline">Update Account</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              <Save size={20} /> {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SellerProfile;
