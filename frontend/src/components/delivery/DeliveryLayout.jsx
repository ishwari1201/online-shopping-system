import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  History,
  Navigation,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import axios from 'axios';

const DeliveryLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/delivery/dashboard' },
    { title: 'Assigned Orders', icon: <Navigation size={20} />, path: '/delivery/orders' },
    { title: 'Delivery History', icon: <History size={20} />, path: '/delivery/history' },
    { title: 'My Earnings', icon: <DollarSign size={20} />, path: '/delivery/earnings' },
    { title: 'Profile', icon: <User size={20} />, path: '/delivery/profile' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/delivery/settings' },
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
            <Link to="/" className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
              <Navigation className="text-primary-500" size={24} />
              <span>DELIVERY<span className="text-primary-500">.</span>PRO</span>
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
              {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-wider">{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <div className={`mb-4 p-4 rounded-2xl bg-slate-800/50 border border-white/5 ${!isSidebarOpen && 'hidden'}`}>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Status</p>
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold uppercase">Online & Active</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-wider">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-white font-bold text-lg hidden md:block">
            {menuItems.find(item => item.path === location.pathname)?.title || 'Delivery Portal'}
          </h2>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-bold">{userInfo?.name}</p>
                <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest">Delivery Partner</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-black shadow-lg">
                {userInfo?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DeliveryLayout;
