import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Tag,
  Calendar,
  Store,
  Copy,
  Check,
  ArrowLeft,
  Package,
  Star,
  ShoppingBag,
  Heart,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const OfferDetails = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const { data } = await axios.get(`/api/offers/slug/${slug}`);
        setData(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load this promotional campaign");
      } finally {
        setLoading(false);
      }
    };
    fetchOfferDetails();
  }, [slug]);

  // Live Countdown timer calculation
  useEffect(() => {
    if (!data?.offer?.endDate) return;

    const calculateTime = () => {
      const difference = new Date(data.offer.endDate) - new Date();
      if (difference <= 0) {
        setTimeLeft("Campaign Ended");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 100) % 60);

      if (days > 0) {
        setTimeLeft(`Offer Ends In: ${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`Offer Ends In: ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [data]);

  const copyCouponToClipboard = () => {
    if (!data?.offer?.couponCode) return;
    navigator.clipboard.writeText(data.offer.couponCode);
    setCopied(true);
    toast.success("🏷️ Coupon code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-[#FFF7FA]">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.offer) {
    return (
      <div className="min-h-screen bg-[#FFF7FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Campaign Not Found
        </h2>
        <p className="text-sm text-gray-400 max-w-xs mb-6">
          The requested promotion is either expired, inactive, or removed.
        </p>
        <Link
          to="/offers"
          className="text-xs font-black uppercase tracking-widest bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
        >
          Browse Active Offers
        </Link>
      </div>
    );
  }

  const { offer, products } = data;
  const storeName =
    offer.sellerId?.sellerProfile?.storeName ||
    offer.sellerId?.name ||
    "Wearify Seller";

  return (
    <div className="min-h-screen bg-[#FFF7FA] font-sans pb-24 text-gray-900">
      {/* Dynamic Header Banner Image (Strict 1200x410 Ratio Aspect Layout) */}
      <div className="relative w-full max-w-7xl mx-auto md:mt-6 overflow-hidden md:rounded-3xl border border-[#FCE4EC]/55 bg-neutral-900 shadow-md">
        <div className="aspect-[1200/410] w-full">
          <img
            src={offer.bannerImage}
            alt={offer.offerName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10 z-10">
          <div className="text-white space-y-2 md:space-y-3">
            <Link
              to="/offers"
              className="inline-flex items-center gap-1.5 text-xs text-pink-300 font-bold hover:text-white transition-colors mb-2"
            >
              <ArrowLeft size={14} /> Back to Offers
            </Link>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-pink-400 uppercase tracking-widest">
              <Store size={14} />
              <span>{storeName} Collection</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {offer.offerName}
            </h1>
          </div>
        </div>
        <div className="absolute inset-0 bg-neutral-900/10 z-0" />
      </div>

      {/* Campaign Details Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Details block */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#FCE4EC]/50 p-6 sm:p-8 shadow-[0_4px_24px_rgba(233,30,99,0.02)]">
              <h2
                className="text-xl font-black text-gray-900 mb-4"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                About this Campaign
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {offer.description ||
                  "Welcome to our exclusive campaign directory. This curation features modern selections and handpicked seasonal highlights from our store. Use our active coupon code for discount rates during checkout."}
              </p>

              {/* Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-6 mt-6 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      Start Date
                    </p>
                    <p className="mt-0.5">
                      {new Date(offer.startDate).toLocaleDateString()} · 12:00
                      AM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      Expiration Date
                    </p>
                    <p className="mt-0.5">
                      {new Date(offer.endDate).toLocaleDateString()} · 11:59 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Block (Coupon & Countdown) */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-3xl border border-neutral-800 p-6 sm:p-8 shadow-lg space-y-6">
              {/* Active Timer badge */}
              <div className="space-y-1.5 text-center">
                <span className="text-[10px] font-black tracking-[0.2em] text-pink-500 uppercase">
                  Live Promotion Window
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-200">
                  {timeLeft}
                </h3>
              </div>

              {/* Coupon card layout */}
              {offer.couponCode && (
                <div className="border border-neutral-800 bg-neutral-850/50 p-5 rounded-2xl space-y-4 text-center">
                  <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase block">
                    Extra Savings Coupon
                  </span>

                  <div className="bg-neutral-900 border border-dashed border-pink-500/30 py-3 rounded-xl flex items-center justify-center gap-2 font-mono text-xl font-black text-pink-400 tracking-wider">
                    {offer.couponCode}
                  </div>

                  <button
                    onClick={copyCouponToClipboard}
                    className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-pink-600 active:scale-95 transition-all shadow-md shadow-pink-500/20 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={14} strokeWidth={3} /> Code Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Code
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Total listings counter */}
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 border-t border-neutral-800/80 pt-4 px-1">
                <span>Total Attached items:</span>
                <span className="flex items-center gap-1 font-bold text-white">
                  <Package size={14} className="text-pink-500" />
                  {products.length} Items Found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attached Products Grid */}
        <div className="mt-16">
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#FCE4EC]/50">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-pink-600">
                Promotion Catalog
              </span>
              <h2
                className="text-2xl font-black text-gray-900 mt-1"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Featured Under Offer
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-semibold">
              {products.length} items active
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p, idx) => {
                const discountedPrice = p.discount
                  ? (p.price * (1 - p.discount / 100)).toFixed(2)
                  : p.price;
                return (
                  <motion.div
                    key={p._id}
                    className="group cursor-pointer bg-white rounded-3xl border border-[#FCE4EC]/50 overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(233,30,99,0.03)]"
                    whileHover={{
                      y: -6,
                      boxShadow: "0 20px 48px rgba(233,30,99,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  >
                    {/* Image Area */}
                    <Link
                      to={`/product/${p._id}`}
                      className="relative aspect-[3/4] overflow-hidden bg-[#FFF7FA] block"
                    >
                      <img
                        src={
                          p.images?.[0] ||
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {p.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-[#D81B60] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {p.discount}% OFF
                        </div>
                      )}
                    </Link>

                    {/* Information Area */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#E91E63]">
                          {p.brand || storeName}
                        </p>
                        <Link to={`/product/${p._id}`} className="block">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#E91E63] transition-colors leading-snug">
                            {p.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Ratings stars */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={
                                i < Math.round(p.rating || 4)
                                  ? "fill-pink-500 text-pink-500"
                                  : "text-gray-200 fill-gray-150"
                              }
                            />
                          ))}
                          <span className="text-[9px] text-gray-400 font-semibold ml-1">
                            ({p.numReviews || 12})
                          </span>
                        </div>

                        {/* Prices */}
                        <div className="flex items-baseline gap-2">
                          <span
                            className="font-extrabold text-sm text-gray-900"
                            style={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            ₹{discountedPrice}
                          </span>
                          {p.discount > 0 && (
                            <span className="text-[10px] text-gray-400 line-through font-semibold">
                              ₹{p.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-white border border-[#FCE4EC]/50 rounded-3xl max-w-xl mx-auto px-6">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6 mx-auto">
                <AlertCircle size={28} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                No Active Catalog Listings
              </h2>
              <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
                The seller has attached products, but they are either out of
                stock or currently undergoing system moderation reviews.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
