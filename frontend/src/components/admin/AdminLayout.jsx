import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag,
  Menu,
  X,
  Settings,
  LogOut,
  Archive,
  Tags,
  Ticket,
  Star,
  BarChart2,
  Store,
  Truck,
  Shield,
  Bell
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Inventory', href: '/admin/inventory', icon: Archive },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    { name: 'Sellers', href: '/admin/sellers', icon: Store },
    { name: 'Delivery', href: '/admin/delivery', icon: Truck },
    { name: 'Moderation', href: '/admin/products/pending', icon: Shield },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/admin/dashboard" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-black text-sm">
              W
            </div>
            Admin Hub
          </Link>
          <button className="md:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-1 rounded-lg" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                  isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
                }`}
              >
                <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center">
            <button 
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-lg md:hidden mr-4 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              View Store
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
