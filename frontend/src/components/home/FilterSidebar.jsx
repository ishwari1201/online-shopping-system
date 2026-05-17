import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, Filter, RotateCcw } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/5 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full group"
      >
        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
          {title}
        </h3>
        <ChevronDown 
          size={14} 
          className={`text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSidebar = ({ 
  activeCategory, 
  setActiveCategory, 
  priceRange, 
  setPriceRange,
  selectedBrand,
  setSelectedBrand,
  minRating,
  setMinRating,
  selectedGender,
  setSelectedGender,
  onReset
}) => {
  const categories = ['All', 'Clothes', 'Shoes', 'Watches', 'Bags', 'Accessories'];
  const brands = ['Wearify', 'EcoFashion', 'UrbanStyle', 'Minimalist', 'LuxeLine'];

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-32 bg-white rounded-sm p-8 border border-black/5 shadow-sm">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-primary" />
            <span className="text-[11px] font-black uppercase tracking-widest">Filters</span>
          </div>
          <button 
            onClick={onReset}
            className="text-[9px] font-black uppercase tracking-widest text-muted hover:text-accent flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={10} /> Reset
          </button>
        </div>

        {/* Categories Section */}
        <FilterSection title="Categories">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center justify-between w-full text-[12px] group transition-all ${
                activeCategory === cat ? 'text-primary font-black' : 'text-muted hover:text-primary'
              }`}
            >
              <span>{cat}</span>
              {activeCategory === cat && <motion.div layoutId="activeCat" className="w-1 h-1 bg-primary rounded-full" />}
            </button>
          ))}
        </FilterSection>

        {/* Gender Filter (Only for Clothes) */}
        <AnimatePresence>
          {activeCategory === 'Clothes' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <FilterSection title="Gender">
                {['Men', 'Women', 'Kids', 'Unisex'].map(gender => (
                  <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedGender === gender}
                      onChange={() => setSelectedGender(selectedGender === gender ? '' : gender)}
                      className="w-4 h-4 border-2 border-black/5 rounded-sm checked:bg-primary accent-primary"
                    />
                    <span className="text-[12px] text-muted group-hover:text-primary transition-colors">{gender}</span>
                  </label>
                ))}
              </FilterSection>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Range Section */}
        <FilterSection title="Price Range">
          <div className="px-2">
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-4">
              <span className="text-[10px] font-black text-muted">₹0</span>
              <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-sm border border-primary/10">Under ₹{priceRange}</span>
            </div>
          </div>
        </FilterSection>

        {/* Brands Section */}
        <FilterSection title="Brand">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedBrand === brand}
                onChange={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                className="w-4 h-4 border-2 border-black/5 rounded-sm checked:bg-primary accent-primary"
              />
              <span className="text-[12px] text-muted group-hover:text-primary transition-colors">{brand}</span>
            </label>
          ))}
        </FilterSection>

        {/* Rating Section */}
        <FilterSection title="Customer Rating">
          {[4, 3, 2].map(rating => (
            <button 
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`flex items-center gap-2 w-full text-[12px] transition-all ${
                minRating === rating ? 'text-primary font-black' : 'text-muted hover:text-primary'
              }`}
            >
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < rating ? "currentColor" : "none"} />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked />
            <span className="text-[12px] text-muted group-hover:text-primary transition-colors">In Stock</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group opacity-50">
            <input type="checkbox" className="w-4 h-4 accent-primary" disabled />
            <span className="text-[12px] text-muted group-hover:text-primary transition-colors">Out of Stock</span>
          </label>
        </FilterSection>

      </div>
    </div>
  );
};

export default FilterSidebar;
