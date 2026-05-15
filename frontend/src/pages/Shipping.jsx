import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, saveAddressToBook } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Plus, Home, Briefcase, CheckCircle2 } from 'lucide-react';

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, savedAddresses = [] } = cart;

  const [showForm, setShowForm] = useState(savedAddresses.length === 0);
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [addressType, setAddressType] = useState('Home');

  // Try to find if currently saved shippingAddress matches any in savedAddresses
  const initialSelectedIndex = savedAddresses.findIndex(
    (addr) => addr.address === shippingAddress?.address && addr.postalCode === shippingAddress?.postalCode
  );

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    initialSelectedIndex >= 0 ? initialSelectedIndex : (savedAddresses.length > 0 ? 0 : null)
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitNewAddress = (e) => {
    e.preventDefault();
    const newAddress = { address, city, postalCode, country, type: addressType };
    dispatch(saveAddressToBook(newAddress));
    dispatch(saveShippingAddress(newAddress));
    navigate('/payment');
  };

  const continueWithSelected = () => {
    if (selectedAddressIndex !== null) {
      dispatch(saveShippingAddress(savedAddresses[selectedAddressIndex]));
      navigate('/payment');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-8 glass-dark p-8 sm:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Delivery Address
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Step 1 of 3: Where should we send your order?
          </p>
        </div>

        {!showForm && savedAddresses.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {savedAddresses.map((addr, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedAddressIndex(index)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddressIndex === index 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedAddressIndex === index ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-gray-400'}`}>
                        {addr.type === 'Work' ? <Briefcase size={20} /> : <Home size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{addr.type || 'Home'}</span>
                          {selectedAddressIndex === index && <CheckCircle2 size={16} className="text-primary-500" />}
                        </div>
                        <p className="text-gray-300 mt-1 text-sm">{addr.address}</p>
                        <p className="text-gray-400 text-sm">{addr.city}, {addr.country} - {addr.postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-gray-400 hover:text-white hover:border-primary-500 hover:bg-primary-500/5 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} /> Add New Address
            </button>

            <button
              onClick={continueWithSelected}
              disabled={selectedAddressIndex === null}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-slate-900 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deliver Here
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}

        {showForm && (
          <form className="mt-8 space-y-6" onSubmit={submitNewAddress}>
            <div className="space-y-4">
              {/* Address Type Selection */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setAddressType('Home')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                    addressType === 'Home' ? 'border-primary-500 bg-primary-500/10 text-primary-400' : 'border-slate-700 text-gray-400 bg-slate-900/50'
                  }`}
                >
                  <Home size={18} /> Home
                </button>
                <button
                  type="button"
                  onClick={() => setAddressType('Work')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                    addressType === 'Work' ? 'border-primary-500 bg-primary-500/10 text-primary-400' : 'border-slate-700 text-gray-400 bg-slate-900/50'
                  }`}
                >
                  <Briefcase size={18} /> Work
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all sm:text-sm"
                  placeholder="Street Address, P.O. box, company name"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  className="block w-full px-4 py-4 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all sm:text-sm"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  required
                  className="block w-full px-4 py-4 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all sm:text-sm"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <input
                type="text"
                required
                className="block w-full px-4 py-4 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all sm:text-sm"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 border border-slate-700 rounded-xl text-white bg-slate-800 hover:bg-slate-700 transition-all font-bold"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-[2] flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-slate-900 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
              >
                Save and Deliver Here
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Shipping;
