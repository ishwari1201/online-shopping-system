import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Store, 
  Phone, 
  Mail, 
  Camera, 
  Save, 
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

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
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Store Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your brand presence and public store details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Quick Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] text-center relative">
              <div className="relative group mx-auto w-32 h-32 mb-6">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold shadow-md border-4 border-white">
                  {storeName.charAt(0) || userInfo?.name?.charAt(0) || 'S'}
                </div>
                <button className="absolute bottom-0 right-0 p-2.5 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="text-gray-900 font-bold text-xl">{storeName || 'My Store'}</h3>
              <p className="text-emerald-600 text-[11px] font-bold uppercase tracking-wider mt-2 flex items-center justify-center gap-1.5 bg-emerald-50 w-fit mx-auto px-2.5 py-1 rounded-md border border-emerald-100">
                <CheckCircle size={14} /> Verified Seller
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] space-y-4">
              <h4 className="text-gray-900 text-sm font-bold border-b border-gray-100 pb-4">Onboarding Status</h4>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Account Verified
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Bank Info Linked
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                Tax Details <span className="text-xs text-gray-400 italic">(Optional)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
              <form onSubmit={submitHandler} className="space-y-6">
                
                <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Basic Information</h3>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Store Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pl-11 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                    <Store className="absolute left-3.5 top-3 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Store Description</label>
                  <textarea 
                    rows="5"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400"
                    placeholder="Tell customers about your brand..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Public Email</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pl-11 text-gray-500 text-sm cursor-not-allowed"
                        value={userInfo?.email}
                        disabled
                      />
                      <Mail className="absolute left-3.5 top-3 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Support Phone</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pl-11 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                      <Phone className="absolute left-3.5 top-3 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-8 flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
