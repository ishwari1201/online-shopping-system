import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Archive,
  DollarSign,
  Star,
  Store
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import axios from 'axios';

const SellerLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/seller/dashboard' },
    { title: 'My Products', icon: <Package size={20} />, path: '/seller/products' },
    { title: 'Inventory', icon: <Archive size={20} />, path: '/seller/inventory' },
    { title: 'Orders', icon: <ShoppingBag size={20} />, path: '/seller/orders' },
    { title: 'Earnings', icon: <DollarSign size={20} />, path: '/seller/earnings' },
    { title: 'Analytics', icon: <BarChart3 size={20} />, path: '/seller/analytics' },
    { title: 'Reviews', icon: <Star size={20} />, path: '/seller/reviews' },
    { title: 'Store Profile', icon: <Store size={20} />, path: '/seller/profile' },
    { title: 'Notifications', icon: <Bell size={20} />, path: '/seller/notifications' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/seller/settings' },
  ];

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-white/5 transition-all duration-300 fixed h-full z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <Link to="/" className="text-2xl font-black text-white tracking-tighter">
              WEARIFY<span className="text-primary-500">.</span>SELLER
            </Link>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/5 w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="bg-transparent border-none outline-none text-white text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <Link to="/seller/notifications" className="relative text-gray-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-900"></span>
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-bold">{userInfo?.name}</p>
                <p className="text-primary-400 text-xs font-medium uppercase tracking-widest">{userInfo?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {userInfo?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
