import { useState } from 'react';
import { 
  Lock, 
  Bell, 
  Shield, 
  Smartphone,
  Save,
  Moon,
  Sun,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const DeliverySettings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'preferences', label: 'App Settings', icon: Smartphone },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Partner Settings</h1>
        <p className="text-gray-400 text-sm">Configure your app experience and security credentials</p>
      </div>

      <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl"
      >
        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <Shield size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Password & Access</h3>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-500 hover:text-white">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
              </div>
              <button type="button" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary-900/20">
                Change Password
              </button>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                <Bell size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Push Notifications</h3>
            </div>
            
            {[
              { id: 'orders', label: 'New Order Assignment', desc: 'Alert when a new order is assigned to you.' },
              { id: 'status', label: 'Order Status Changes', desc: 'Updates when sellers pack or ship items.' },
              { id: 'payout', label: 'Earnings & Payouts', desc: 'Notifications for successful bank transfers.' },
              { id: 'system', label: 'System Announcements', desc: 'Important updates from the platform admin.' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                <div>
                  <p className="text-white font-bold text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
                <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                <Smartphone size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">App Preferences</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white font-bold text-sm">Theme Mode</p>
                  <Sun size={18} className="text-orange-500" />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-slate-900 border border-primary-500/50 text-white rounded-xl text-xs font-black uppercase tracking-widest">Dark</button>
                  <button className="flex-1 py-3 bg-slate-800 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest">Light</button>
                </div>
              </div>
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white font-bold text-sm">Map Provider</p>
                  <Navigation size={18} className="text-blue-500" />
                </div>
                <select className="w-full bg-slate-900 border border-white/10 text-white rounded-xl py-3 px-4 text-xs font-bold focus:outline-none">
                  <option>Google Maps (Default)</option>
                  <option>Apple Maps</option>
                  <option>Waze</option>
                </select>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h4 className="text-red-500 font-bold text-sm mb-2">Danger Zone</h4>
              <p className="text-gray-500 text-xs mb-6">These actions are permanent and cannot be undone.</p>
              <button className="px-6 py-3 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/5 transition-all">
                Deactivate Account
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DeliverySettings;
