import { useState } from 'react';
import { 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const SellerSettings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const { userInfo } = useSelector((state) => state.auth);

  const tabs = [
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payouts', label: 'Payout Settings', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Seller Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your account security, notifications, and financial preferences.</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 shadow-[0_2px_8px_rgb(0,0,0,0.04)]"
        >
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Shield size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Account Security</h3>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                </div>
                <button type="button" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm">
                  Update Password
                </button>
              </form>

              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-gray-900 font-bold text-base mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-sm">SMS Authentication</p>
                      <p className="text-gray-500 text-sm mt-0.5">Add an extra layer of security to your seller account.</p>
                    </div>
                  </div>
                  <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-blue-100">Enable</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Bell size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Notification Preferences</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'orders', label: 'New Order Alerts', desc: 'Get notified as soon as a customer buys your product.', active: true },
                  { id: 'stock', label: 'Low Stock Warnings', desc: 'Alerts when your inventory drops below 5 units.', active: true },
                  { id: 'approval', label: 'Product Moderation Updates', desc: 'Notifications when your products are approved or rejected.', active: false },
                  { id: 'payout', label: 'Financial Updates', desc: 'Get notified when payouts are processed or completed.', active: true },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors cursor-pointer">
                    <div>
                      <p className="text-gray-900 font-bold text-sm">{item.label}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full relative transition-colors ${item.active ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${item.active ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CreditCard size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Payout Settings</h3>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 opacity-10 text-white group-hover:scale-110 transition-transform">
                  <Building2 size={160} />
                </div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Linked Bank Account</p>
                    <p className="text-white font-bold text-xl tracking-tight">Global Commerce Bank</p>
                  </div>
                  <CreditCard className="text-white opacity-50" size={32} />
                </div>
                <div className="flex items-end justify-between relative z-10">
                  <div>
                    <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">Account Holder</p>
                    <p className="text-white font-bold text-sm">SELLER - {userInfo?.name?.toUpperCase() || 'ADMIN'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">Account Ending In</p>
                    <p className="text-white font-bold font-mono tracking-widest text-sm">**** 4829</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl flex gap-4 items-start">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-amber-800 text-sm font-medium leading-relaxed">
                  Changing your payout account will temporarily suspend payouts for 24 hours for security verification. 
                  Please contact support for large revenue accounts.
                </p>
              </div>

              <button className="w-full py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                Change Payout Account
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SellerSettings;
