import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Archive,
  DollarSign,
  Star,
  Store,
  ChevronLeft,
  ChevronRight
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
    <div className="min-h-screen bg-[#fafafa] flex font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-50 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {isSidebarOpen && (
            <Link to="/seller/dashboard" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 pl-2">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-black text-sm">
                W
              </div>
              Wearify
            </Link>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors mx-auto"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith('/seller/edit-product') && item.path === '/seller/products');
            return (
              <Link
                key={item.title}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
                }`}
                title={!isSidebarOpen ? item.title : ''}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="text-sm">{item.title}</span>}
                
                {isActive && isSidebarOpen && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors group"
            title={!isSidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="text-gray-400 group-hover:text-red-500 flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders, products, or settings..." 
                className="w-full bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-lg py-2 pl-9 pr-4 text-sm text-gray-900 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/seller/notifications" className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">{userInfo?.name || 'Seller'}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Store Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white">
                {userInfo?.name?.charAt(0) || 'S'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
