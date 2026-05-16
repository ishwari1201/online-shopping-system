import { Link } from 'react-router-dom';
import { Mail, Globe, X, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#212a2f] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Wearify</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Made with better materials, designed with purpose, and crafted for a better future. Wearify is your destination for sustainable style.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors"><Globe size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><X size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-8">Shop</h3>
            <ul className="space-y-4">
              {['Clothes', 'Shoes', 'Watches', 'Bags', 'Accessories'].map((cat) => (
                <li key={cat}>
                  <Link to={`/shop?category=${cat}`} className="text-gray-400 hover:text-white text-[13px] font-medium transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-8">Company</h3>
            <ul className="space-y-4 text-gray-400 text-[13px] font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors">Find a Store</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-8">Keep In Touch</h3>
            <p className="text-gray-400 text-[13px] mb-6">Sign up for early access to new arrivals and sustainable fashion news.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-all rounded-sm"
              />
              <button className="absolute right-2 top-2 text-white hover:text-accent transition-colors">
                <Mail size={20} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/returns" className="hover:text-white transition-colors">Return Policy</Link>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            © 2026 Wearify. Nature-made style.
          </p>
          <div className="flex items-center gap-2 text-gray-500">
            <Globe size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Global / English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
