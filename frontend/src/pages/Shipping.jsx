import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, saveAddressToBook } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Plus, Home, Briefcase, CheckCircle } from 'lucide-react';

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, savedAddresses = [] } = cart;

  const [showForm, setShowForm] = useState(savedAddresses.length === 0);
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [addressType, setAddressType] = useState('Home');

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
    <div className="min-h-screen pt-32 pb-20 bg-bg-cream flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white p-10 border border-black/5 shadow-sm"
      >
        <div className="mb-12 text-center">
          <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-primary">Delivery Details</h2>
          <div className="w-10 h-0.5 bg-primary mx-auto mt-4 mb-2"></div>
          <p className="text-muted text-[10px] font-black uppercase tracking-widest">
            Step 1 of 3: Shipping Address
          </p>
        </div>

        {!showForm && savedAddresses.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {savedAddresses.map((addr, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedAddressIndex(index)}
                  className={`p-6 border cursor-pointer transition-all ${
                    selectedAddressIndex === index 
                    ? 'border-primary bg-bg-cream shadow-inner' 
                    : 'border-black/5 bg-white hover:border-black/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-sm ${selectedAddressIndex === index ? 'bg-primary text-white' : 'bg-bg-cream text-muted'}`}>
                        {addr.type === 'Work' ? <Briefcase size={16} /> : <Home size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-widest text-primary">{addr.type || 'Home'}</span>
                          {selectedAddressIndex === index && <CheckCircle size={14} className="text-primary" />}
                        </div>
                        <p className="text-muted mt-1 text-[12px] font-medium leading-relaxed">{addr.address}</p>
                        <p className="text-muted text-[11px] font-medium uppercase tracking-tight">{addr.city}, {addr.country} · {addr.postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full py-4 border border-dashed border-black/10 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add New Address
            </button>

            <button
              onClick={continueWithSelected}
              disabled={selectedAddressIndex === null}
              className="btn-allbirds w-full flex items-center justify-center gap-2"
            >
              Continue to Payment <ArrowRight size={16} />
            </button>
          </div>
        )}

        {showForm && (
          <form className="space-y-6" onSubmit={submitNewAddress}>
            {/* Address Type Selection */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAddressType('Home')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  addressType === 'Home' ? 'border-primary bg-primary text-white' : 'border-black/5 text-muted bg-bg-cream/50'
                }`}
              >
                <Home size={14} /> Home
              </button>
              <button
                type="button"
                onClick={() => setAddressType('Work')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  addressType === 'Work' ? 'border-primary bg-primary text-white' : 'border-black/5 text-muted bg-bg-cream/50'
                }`}
              >
                <Briefcase size={14} /> Work
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Street Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-4 text-muted" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                    placeholder="Enter your street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">City</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Postal Code</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                    placeholder="ZIP Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted block mb-2">Country</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-4 bg-bg-cream border border-black/5 rounded-sm focus:outline-none focus:border-primary text-sm font-medium"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 border border-black/10 text-[10px] font-black uppercase tracking-widest text-muted hover:bg-bg-cream transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn-allbirds flex-[2] flex items-center justify-center gap-2"
              >
                Save and Continue <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Shipping;
