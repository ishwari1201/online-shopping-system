import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Percent, 
  Tag, 
  ArrowRight, 
  Package, 
  Store, 
  Calendar,
  AlertCircle
} from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axios.get('/api/offers/active');
        setOffers(data || []);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-[#FFF7FA]">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7FA] font-sans pb-24 text-gray-900">
      
      {/* Decorative Top Banner */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-pink-950 text-white py-16 px-4 text-center relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
            <Percent size={12} /> Seasonal Campaigns
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Exclusive Campaigns & Offers
          </h1>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Discover limited-time curated selections direct from our verified sellers, featuring exclusive styles and promotional coupon codes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => {
              const storeName = offer.sellerId?.sellerProfile?.storeName || offer.sellerId?.name || 'Wearify Seller';
              
              return (
                <Link 
                  key={offer._id}
                  to={`/offer/${offer.slug}`}
                  className="group bg-white rounded-3xl border border-[#FCE4EC]/50 overflow-hidden shadow-[0_4px_24px_rgba(233,30,99,0.02)] hover:shadow-[0_20px_48px_rgba(233,30,99,0.08)] transition-all duration-500 transform hover:-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Banner Image */}
                    <div className="aspect-[1200/410] overflow-hidden bg-gray-50 relative border-b border-gray-100">
                      <img 
                        src={offer.bannerImage} 
                        alt={offer.offerName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {offer.couponCode && (
                        <div className="absolute top-4 left-4 bg-gray-900/90 text-white px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                          <Tag size={12} /> {offer.couponCode}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-8 space-y-4">
                      {/* Store Brand / Seller */}
                      <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-widest">
                        <Store size={14} />
                        <span>{storeName}</span>
                      </div>

                      {/* Offer Title */}
                      <h2 
                        className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-pink-600 transition-colors leading-tight" 
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {offer.offerName}
                      </h2>

                      {/* Description */}
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {offer.description || 'Shop this custom collection today for unique styles.'}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer info */}
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                      <span className="flex items-center gap-1">
                        <Package size={14} className="text-gray-300" />
                        {offer.productCount} Products
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-300" />
                        Ends {new Date(offer.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-pink-500 group-hover:gap-2.5 transition-all">
                      Explore Catalog <ArrowRight size={14} />
                    </span>
                  </div>

                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-[#FCE4EC]/50 rounded-3xl shadow-[0_4px_24px_rgba(233,30,99,0.01)] max-w-xl mx-auto px-6">
            <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6 mx-auto">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Promotions</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              Our sellers are currently designing their next big seasonal drops. Keep checking in for the next coupon wave!
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-1.5 bg-gray-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
            >
              Shop All Products <ArrowRight size={14} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Offers;
