import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  // In a real app, listen to scroll event
  return (
    <nav className="fixed w-full z-50 glass-dark border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center">
            <button className="md:hidden text-gray-300 hover:text-white mr-4">
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent">
              Wearify
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <div className="w-full max-w-lg relative">
              <input 
                type="text" 
                placeholder="Search for products, brands and more..." 
                className="w-full bg-slate-800/50 text-white border border-slate-700 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            <Link to="/profile" className="text-gray-300 hover:text-white transition flex flex-col items-center group">
              <User size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] mt-1 hidden md:block">Profile</span>
            </Link>
            <Link to="/wishlist" className="text-gray-300 hover:text-white transition flex flex-col items-center group">
              <div className="relative">
                <Heart size={20} className="group-hover:scale-110 transition-transform" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{wishlistItems.length}</span>
                )}
              </div>
              <span className="text-[10px] mt-1 hidden md:block">Wishlist</span>
            </Link>
            <Link to="/cart" className="text-gray-300 hover:text-white transition flex flex-col items-center group">
              <div className="relative">
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                )}
              </div>
              <span className="text-[10px] mt-1 hidden md:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Categories Nav (Desktop) */}
      <div className="hidden md:block border-t border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-2 text-sm text-gray-300">
            <Link to="/category/men" className="hover:text-primary-400 transition-colors">Men</Link>
            <Link to="/category/women" className="hover:text-primary-400 transition-colors">Women</Link>
            <Link to="/category/kids" className="hover:text-primary-400 transition-colors">Kids</Link>
            <Link to="/category/accessories" className="hover:text-primary-400 transition-colors">Accessories</Link>
            <Link to="/category/new" className="text-accent hover:text-accent/80 transition-colors font-medium">New Arrivals</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
