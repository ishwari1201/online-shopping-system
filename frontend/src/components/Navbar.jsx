import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Search, ChevronDown, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './home/SearchBar';
import Logo from './Logo';

const CATEGORIES = ['Clothes', 'Shoes', 'Watches', 'Bags', 'Accessories'];

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });
  const { userInfo } = useSelector((state) => state.auth);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const getDashboardLink = () => {
    if (!userInfo) return '/profile';
    if (userInfo.role === 'admin') return '/admin/dashboard';
    if (userInfo.role === 'seller') return '/seller/dashboard';
    if (userInfo.role === 'delivery') return '/delivery/dashboard';
    return '/profile';
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? 'glass-allbirds' : 'bg-[#FFF7FA]/95 backdrop-blur-sm border-b border-[#FCE4EC]/40'
        }`}
      >
        {/* Top announcement bar */}
        <div className="bg-[#E91E63] text-white text-center py-2 text-[10px] font-bold uppercase tracking-[0.25em]">
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={10} />
            Free Delivery on orders above ₹499 — Use code: WEARIFY10
            <Sparkles size={10} />
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-[#1F1F1F] hover:text-[#E91E63] transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={22} />
              </button>
              <Link to="/" className="flex-shrink-0">
                <Logo size="sm" />
              </Link>
            </div>

            {/* Center: Search bar (desktop) */}
            <div className="hidden md:flex flex-1 items-center justify-center px-10">
              <SearchBar />
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-5">

              {/* Mobile Search */}
              <button
                className="md:hidden text-[#1F1F1F] hover:text-[#E91E63] transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </button>

              {/* Account */}
              <Link
                to="/profile"
                className="flex flex-col items-center gap-0.5 text-[#1F1F1F] hover:text-[#E91E63] transition-colors group"
              >
                <User size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-bold uppercase tracking-widest hidden md:block">Account</span>
              </Link>

              {/* Dashboard */}
              {userInfo && (
                <Link
                  to={getDashboardLink()}
                  className="hidden md:flex flex-col items-center gap-0.5 text-[#1F1F1F] hover:text-[#E91E63] transition-colors group"
                >
                  <ChevronDown size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Dashboard</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex flex-col items-center gap-0.5 text-[#1F1F1F] hover:text-[#E91E63] transition-colors group relative"
              >
                <div className="relative">
                  <Heart size={20} className="group-hover:scale-110 transition-transform" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-[#E91E63] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest hidden md:block">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex flex-col items-center gap-0.5 group relative"
              >
                <div
                  className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all"
                  style={{ background: 'linear-gradient(135deg, #E91E63, #D81B60)' }}
                >
                  <ShoppingCart size={18} className="text-white group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 bg-[#1F1F1F] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#1F1F1F] hidden md:block">Cart</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Nav (desktop) */}
        <div className="hidden md:block border-t border-[#FCE4EC]/50 bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center gap-12 py-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${cat}`}
                  className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 hover:text-[#E91E63] transition-colors group py-1"
                >
                  {cat}
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-[#E91E63] rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (expandable) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-[#FCE4EC]/50 bg-white px-4 py-3"
            >
              <SearchBar />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#FCE4EC]">
                <Logo size="sm" />
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-[#E91E63]">
                  <X size={22} />
                </button>
              </div>

              {/* Drawer Categories */}
              <div className="flex-1 overflow-y-auto p-5">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#E91E63] mb-4">Shop Categories</p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      to={`/shop?category=${cat}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#1F1F1F] hover:bg-[#FFF7FA] hover:text-[#E91E63] transition-all"
                    >
                      {cat}
                      <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                    </Link>
                  ))}
                </div>

                <div className="mt-8 space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#E91E63] mb-4">My Account</p>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#1F1F1F] hover:bg-[#FFF7FA] hover:text-[#E91E63] transition-all">
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#1F1F1F] hover:bg-[#FFF7FA] hover:text-[#E91E63] transition-all">
                    <Heart size={16} /> Wishlist {wishlistCount > 0 && <span className="ml-auto bg-[#E91E63] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                  </Link>
                  <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#1F1F1F] hover:bg-[#FFF7FA] hover:text-[#E91E63] transition-all">
                    <ShoppingCart size={16} /> Cart {cartCount > 0 && <span className="ml-auto bg-[#E91E63] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                  </Link>
                  {userInfo && (
                    <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#1F1F1F] hover:bg-[#FFF7FA] hover:text-[#E91E63] transition-all">
                      <ChevronDown size={16} /> Dashboard
                    </Link>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-[#FCE4EC]">
                <div className="text-center py-3 rounded-2xl text-xs font-bold text-[#E91E63]" style={{ background: 'linear-gradient(135deg, #FCE4EC, #FFF7FA)' }}>
                  🎀 Free delivery on ₹499+
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
