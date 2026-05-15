import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, Package, ShoppingCart, TrendingUp, Activity, DollarSign, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
    }
  }, [navigate, userInfo]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your store, products, and users.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white mt-1">$45,231.89</h3>
              </div>
              <div className="p-3 bg-green-500/20 text-green-500 rounded-xl">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="flex items-center text-green-500 text-sm font-medium">
              <TrendingUp size={16} className="mr-1" /> +20.1% from last month
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold text-white mt-1">+2,350</h3>
              </div>
              <div className="p-3 bg-primary-500/20 text-primary-500 rounded-xl">
                <ShoppingCart size={24} />
              </div>
            </div>
            <div className="flex items-center text-green-500 text-sm font-medium">
              <TrendingUp size={16} className="mr-1" /> +15.3% from last month
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-white mt-1">12,234</h3>
              </div>
              <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl">
                <Users size={24} />
              </div>
            </div>
            <div className="flex items-center text-green-500 text-sm font-medium">
              <TrendingUp size={16} className="mr-1" /> +10.2% from last month
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Now</p>
                <h3 className="text-2xl font-bold text-white mt-1">573</h3>
              </div>
              <div className="p-3 bg-accent/20 text-accent rounded-xl">
                <Activity size={24} />
              </div>
            </div>
            <div className="flex items-center text-gray-400 text-sm font-medium">
              Active users on site right now
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'dashboard' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'users' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <Users size={18} /> Manage Users
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'products' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <Package size={18} /> Manage Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'orders' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <ShoppingCart size={18} /> Manage Orders
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center">
                          <ShoppingCart size={18} />
                        </div>
                        <div>
                          <p className="text-white font-medium">New Order #ORD-{2024 + i}</p>
                          <p className="text-sm text-gray-400">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="text-primary-400 font-bold">$129.99</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {(activeTab === 'users' || activeTab === 'products' || activeTab === 'orders') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mb-6 border border-slate-700">
                  {activeTab === 'users' ? <Users size={32} /> : activeTab === 'products' ? <Package size={32} /> : <ShoppingCart size={32} />}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 capitalize">{activeTab} Management</h2>
                <p className="text-gray-400 max-w-md">
                  This section would typically display a data table populated from the backend `/api/{activeTab}` endpoint with full CRUD capabilities.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
