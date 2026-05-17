import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  CreditCard,
  Save,
  Camera,
  Mail,
  Smartphone
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.success('Profile updated (Demo)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 text-sm">Manage your administrator profile and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { label: 'Profile Info', icon: User, active: true },
            { label: 'Security', icon: Lock },
            { label: 'Notifications', icon: Bell },
            { label: 'General Settings', icon: Globe },
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                item.active 
                  ? 'bg-gray-100 text-gray-900 border border-gray-200/50 shadow-sm font-bold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Form Area */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-md">
                   {name.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-white text-gray-500 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-lg">{name}</h3>
                <p className="text-primary-600 text-xs font-black uppercase tracking-widest">Platform Administrator</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <User className="absolute left-4 top-4 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bio / Role Details</label>
                <textarea 
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none shadow-sm"
                  placeholder="Tell us about your responsibilities..."
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-sm"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
                <Shield size={20} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">Danger Zone</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">Delete your account or transfer ownership. This action is irreversible.</p>
            <button className="text-red-600 font-black text-xs uppercase tracking-widest hover:underline px-2">
              Transfer Ownership
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
