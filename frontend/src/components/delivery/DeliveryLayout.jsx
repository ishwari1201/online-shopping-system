import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Truck, 
  History, 
  DollarSign, 
  User, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  MapPin,
  Clock
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
    { title: 'Active Orders', icon: <Truck size={20} />, path: '/delivery/orders' },
    { title: 'History', icon: <History size={20} />, path: '/delivery/history' },
    { title: 'Earnings', icon: <DollarSign size={20} />, path: '/delivery/earnings' },
    { title: 'Profile', icon: <User size={20} />, path: '/delivery/profile' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/delivery/settings' },
    { title: 'Notifications', icon: <Bell size={20} />, path: '/delivery/notifications' },
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
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-white/5 sticky top-0 z-[60]">
        <span className="text-xl font-black text-white tracking-tighter">DELIVERY<span className="text-primary-500">.</span>HUB</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 h-screen w-64 bg-slate-900 border-r border-white/5 transition-transform duration-300 z-50 overflow-y-auto`}
      >
        <div className="p-8 hidden md:block">
          <Link to="/" className="text-2xl font-black text-white tracking-tighter block text-center">
            WEARIFY<span className="text-primary-500">.</span>HUB
          </Link>
          <div className="mt-2 py-1 px-3 bg-primary-500/10 text-primary-500 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto">
            Delivery Partner
          </div>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="font-bold text-sm">{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
                {userInfo?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-bold truncate">{userInfo?.name}</p>
                <p className="text-gray-500 text-[10px] font-medium truncate uppercase tracking-widest">Online</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default DeliveryLayout;
