import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 350);

  // Fetch from backend when query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products?keyword=${debouncedQuery}`);
        setResults(data.products?.slice(0, 6) || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const handleProductClick = (productId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search clothes, shoes, watches..."
          className="w-full bg-black/5 text-[#212a2f] border border-transparent rounded-full py-2.5 pl-6 pr-20 focus:outline-none focus:bg-white focus:border-black/10 transition-all placeholder:text-gray-400 text-sm font-medium"
          autoComplete="off"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={15} />
          </button>
        )}

        {/* Search Icon / Spinner */}
        <button type="submit" className="absolute right-4 top-2.5">
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search size={16} className="text-gray-400 group-focus-within:text-[#212a2f] transition-colors" />
          )}
        </button>
      </form>

      {/* Live Dropdown Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white rounded-sm shadow-2xl border border-black/5 overflow-hidden z-[999]"
          >
            {results.length > 0 ? (
              <>
                <div className="px-5 py-3 border-b border-black/5 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted">
                    {results.length} results for "{query}"
                  </span>
                </div>

                <ul>
                  {results.map((product) => (
                    <li key={product._id}>
                      <button
                        onClick={() => handleProductClick(product._id)}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-bg-cream transition-colors group/item text-left"
                      >
                        <div className="w-12 h-14 bg-bg-cream overflow-hidden flex-shrink-0 rounded-sm border border-black/5">
                          <img
                            src={product.images?.[0] || ''}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-black text-primary uppercase tracking-tight truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Tag size={10} className="text-muted flex-shrink-0" />
                            <p className="text-[10px] text-muted font-black uppercase tracking-widest">
                              {product.category}
                            </p>
                          </div>
                        </div>
                        <span className="text-[13px] font-black text-primary flex-shrink-0">
                          ₹{product.price}
                        </span>
                        <ArrowRight size={14} className="text-muted opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
                    setQuery('');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 border-t border-black/5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all group/all"
                >
                  See all results for "{query}"
                  <ArrowRight size={12} className="group-hover/all:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              !loading && query.length >= 2 && (
                <div className="px-5 py-8 text-center">
                  <Search size={32} strokeWidth={1} className="mx-auto text-muted/30 mb-3" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-muted">
                    No results for "{query}"
                  </p>
                  <p className="text-[10px] text-muted mt-1">Try a different keyword</p>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
