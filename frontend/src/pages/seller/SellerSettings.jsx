import { useState } from 'react';
import { 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Smartphone,
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SellerSettings = () => {
  const [activeTab, setActiveTab] = useState('security');

  const tabs = [
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payouts', label: 'Payout Settings', icon: CreditCard },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Seller Settings</h1>
        <p className="text-gray-400 text-sm">Configure your account security, notifications, and financial preferences</p>
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
              <h3 className="text-white font-bold text-lg">Account Security</h3>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
              </div>
              <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary-900/20">
                Update Security
              </button>
            </form>

            <div className="pt-8 border-t border-white/5">
              <h4 className="text-white font-bold text-sm mb-4">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <Smartphone className="text-gray-400" />
                  <div>
                    <p className="text-white font-bold text-sm">SMS Authentication</p>
                    <p className="text-gray-500 text-xs mt-1">Add an extra layer of security to your seller account.</p>
                  </div>
                </div>
                <button className="text-primary-500 text-xs font-black uppercase tracking-widest hover:underline">Enable</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                <Bell size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Notification Preferences</h3>
            </div>
            
            {[
              { id: 'orders', label: 'New Order Alerts', desc: 'Get notified as soon as a customer buys your product.' },
              { id: 'stock', label: 'Low Stock Warnings', desc: 'Alerts when your inventory drops below 5 units.' },
              { id: 'approval', label: 'Product Moderation Updates', desc: 'Notifications when your products are approved or rejected.' },
              { id: 'payout', label: 'Financial Updates', desc: 'Get notified when payouts are processed or completed.' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                <div>
                  <p className="text-white font-bold text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
                <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                <CreditCard size={20} />
              </div>
              <h3 className="text-white font-bold text-lg">Payout Settings</h3>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2rem] border border-white/10 shadow-xl relative overflow-hidden group">
              <div className="absolute -bottom-12 -right-12 opacity-5 group-hover:scale-110 transition-transform">
                <Building2 size={200} />
              </div>
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Linked Bank Account</p>
                  <p className="text-white font-black text-xl italic tracking-tighter uppercase">Global Commerce Bank</p>
                </div>
                <CreditCard className="text-white opacity-20" size={32} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Account Holder</p>
                  <p className="text-white font-bold tracking-widest">SELLER - {userInfo?.name.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Account Ending In</p>
                  <p className="text-white font-bold font-mono tracking-[0.2em]">**** 4829</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-2xl flex gap-4 items-start">
              <AlertTriangle className="text-orange-500 flex-shrink-0" size={20} />
              <p className="text-orange-200/80 text-xs leading-relaxed font-medium">
                Changing your payout account will temporarily suspend payouts for 24 hours for security verification. 
                Please contact support for large revenue accounts.
              </p>
            </div>

            <button className="w-full py-4 border border-white/10 rounded-2xl text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
              Change Payout Account
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SellerSettings;
