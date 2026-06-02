import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Shield, Truck, RotateCcw, BadgeCheck, Users, CheckCircle2, Zap } from 'lucide-react';

/* ── Testimonial data ── */
const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=b6e3f4',
    text: 'Amazing quality and super fast delivery! Absolutely love it.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    location: 'Delhi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=ffd5dc',
    text: 'Smooth payment and excellent tracking. Best experience ever!',
    rating: 5,
  },
  {
    name: 'Sneha Patil',
    location: 'Pune',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha&backgroundColor=c0aede',
    text: 'Premium UI and genuine products. Will shop again for sure!',
    rating: 5,
  },
];

/* ── Trust Badges data ── */
const badges = [
  { icon: Users, label: '10K+', sub: 'Happy Customers' },
  { icon: Shield, label: 'Secure', sub: 'Payments' },
  { icon: Truck, label: 'Fast', sub: 'Delivery' },
  { icon: RotateCcw, label: 'Easy', sub: 'Returns' },
  { icon: Zap, label: 'Trusted', sub: 'Sellers' },
];

/* ── Star renderer ── */
const StarRow = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={11}
        className={i < count ? 'fill-[#E91E63] text-[#E91E63]' : 'text-white/20'}
      />
    ))}
  </div>
);

/* ── Floating Testimonial Card ── */
const TestimonialCard = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const review = testimonials[idx];

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="hidden lg:block w-72 pointer-events-auto"
    >
      {/* Glass card */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Top accent bar — pink gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-[#F8BBD0] via-[#E91E63] to-[#D81B60]" />

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#E91E63]/30 bg-white/20 flex-shrink-0">
              <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-white font-bold text-sm truncate">{review.name}</p>
                <CheckCircle2 size={13} className="text-[#E91E63] flex-shrink-0" />
              </div>
              <p className="text-white/50 text-[10px]">{review.location}</p>
            </div>
            <div className="flex-shrink-0 bg-[#E91E63]/20 border border-[#E91E63]/30 rounded-full px-2 py-0.5 flex items-center gap-1">
              <BadgeCheck size={9} className="text-[#E91E63]" />
              <span className="text-[#F8BBD0] text-[9px] font-bold">VERIFIED</span>
            </div>
          </div>

          {/* Stars */}
          <StarRow count={review.rating} />

          {/* Quote */}
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-white/85 text-[13px] leading-relaxed mt-3 italic"
            >
              "{review.text}"
            </motion.p>
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex -space-x-2">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 border-white/30 overflow-hidden transition-all duration-300 ${
                    i === idx ? 'ring-2 ring-[#E91E63] ring-offset-1 ring-offset-transparent' : 'opacity-60'
                  }`}
                >
                  <img src={t.avatar} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-white font-black text-sm">4.9<span className="text-white/50">/5</span></p>
              <p className="text-white/40 text-[9px]">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Trust Badges Strip ── */
const TrustBadgesStrip = () => (
  <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start pointer-events-auto">
    {badges.map(({ icon: Icon, label, sub }, i) => (
      <motion.div
        key={label}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-white/20 hover:border-[#E91E63]/40 hover:bg-[#E91E63]/10 transition-all cursor-default"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <Icon size={12} className="text-[#F8BBD0] flex-shrink-0" />
        <div className="flex items-baseline gap-1">
          <span className="text-white font-black text-[11px]">{label}</span>
          <span className="text-white/50 text-[10px]">{sub}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

/* ── Animated Stats ── */
const stats = [
  { value: '10K+', label: 'Customers' },
  { value: '500+', label: 'Products' },
  { value: '4.9★', label: 'Rating' },
];

const StatsRow = () => (
  <div className="hidden sm:flex items-center gap-6 pointer-events-auto">
    {stats.map(({ value, label }, i) => (
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-white font-black text-lg leading-none">{value}</p>
        <p className="text-white/50 text-[10px] mt-0.5 uppercase tracking-widest">{label}</p>
      </motion.div>
    ))}
  </div>
);

/* ── Main Export ── */
const HeroTrustOverlay = () => (
  <div className="absolute inset-0 z-10 pointer-events-none">
    {/* Floating testimonial — bottom-right */}
    <div className="absolute bottom-24 right-8 xl:right-16 flex flex-col items-end gap-4">
      <TestimonialCard />
    </div>

    {/* Trust badges + stats — bottom-left */}
    <div className="absolute bottom-20 left-6 xl:left-12 flex flex-col gap-4">
      <StatsRow />
      <TrustBadgesStrip />
    </div>
  </div>
);

export default HeroTrustOverlay;
