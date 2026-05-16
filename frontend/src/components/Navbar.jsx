import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });
  const { userInfo } = useSelector((state) => state.auth);

  const CATEGORIES = ['Clothes', 'Shoes', 'Watches', 'Bags', 'Accessories'];

  return (
    <nav className="fixed w-full z-50 glass-allbirds transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex items-center">
            <button className="md:hidden text-[#212a2f] hover:opacity-70 mr-4">
              <Menu size={22} />
            </button>
            <Link to="/" className="text-2xl font-black text-[#212a2f] tracking-tighter uppercase">
              Wearify
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 items-center justify-center px-12">
            <div className="w-full max-w-lg relative group">
              <input
                type="text"
                placeholder="Search for clothes, shoes, and more..."
                className="w-full bg-black/5 text-[#212a2f] border border-transparent rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:bg-white focus:border-black/10 transition-all placeholder:text-gray-400 text-sm"
              />
              <Search className="absolute right-5 top-3 text-gray-400 group-focus-within:text-[#212a2f] transition-colors" size={16} />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-8">
            {/* Account */}
            <Link to="/profile" className="text-[#212a2f] hover:opacity-60 transition flex flex-col items-center group">
              <User size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[9px] mt-1 hidden md:block font-black uppercase tracking-widest">Account</span>
            </Link>

            {/* Dashboard */}
            {userInfo && (
              <Link
                to={
                  userInfo.role === 'admin' ? '/admin/dashboard' :
                  userInfo.role === 'seller' ? '/seller/dashboard' :
                  userInfo.role === 'delivery' ? '/delivery/dashboard' : '/profile'
                }
                className="text-[#212a2f] hover:opacity-60 transition flex flex-col items-center group"
              >
                <Menu size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] mt-1 hidden md:block font-black uppercase tracking-widest">Dashboard</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="text-[#212a2f] hover:opacity-60 transition flex flex-col items-center group">
              <div className="relative">
                <Heart size={20} className="group-hover:scale-110 transition-transform" />
                {wishlistItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#212a2f] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              <span className="text-[9px] mt-1 hidden md:block font-black uppercase tracking-widest">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="text-[#212a2f] hover:opacity-60 transition flex flex-col items-center group">
              <div className="relative">
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff4f33] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </div>
              <span className="text-[9px] mt-1 hidden md:block font-black uppercase tracking-widest">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="hidden md:block border-t border-black/5 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-16 py-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${cat}`}
                className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-[#212a2f] transition-all relative group"
              >
                {cat}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#212a2f] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
