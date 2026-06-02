import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, Shield, Truck, Gem, Check } from 'lucide-react';

const AUTO_MS = 2500;
const TICK_MS = 50;

const FEATURE_SLIDES = [
  {
    id: 'luxe',
    icon: Crown,
    label: 'Wearify Luxe',
    line1: 'Exclusive',
    line2: 'Collections',
    description:
      "Handcrafted luxury from India's finest designers. Limited edition drops you won't find anywhere else.",
    highlights: ['Designer Pieces', 'Limited Drops', 'Premium Quality'],
    cta: 'Discover Luxe',
    ctaIcon: Sparkles,
    link: '/shop',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Luxury fashion collection',
    bg: 'linear-gradient(125deg, #FFF7FA 0%, #FCE4EC 45%, #F8BBD0 100%)',
    blob: 'rgba(233,30,99,0.12)',
  },
  {
    id: 'authentic',
    icon: Shield,
    label: 'Wearify Promise',
    line1: '100% Authentic',
    line2: 'Every Product',
    description:
      'Every item is verified for authenticity. Shop genuine brands with full confidence and peace of mind.',
    highlights: ['Verified Brands', 'Quality Checked', 'Genuine Only'],
    cta: 'Shop Authentic',
    ctaIcon: Gem,
    link: '/shop',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Authentic branded fashion products',
    bg: 'linear-gradient(125deg, #FFF5F8 0%, #FCE4EC 50%, #F8BBD0 85%)',
    blob: 'rgba(216,27,96,0.1)',
  },
  {
    id: 'delivery',
    icon: Truck,
    label: 'Wearify Perks',
    line1: 'Free Delivery',
    line2: 'Above ₹499',
    description:
      'Fast doorstep delivery across India with premium packaging and real-time order tracking.',
    highlights: ['2–4 Day Delivery', 'Track Your Order', 'Free Above ₹499'],
    cta: 'Start Shopping',
    ctaIcon: Sparkles,
    link: '/shop',
    image:
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Fast delivery shopping experience',
    bg: 'linear-gradient(125deg, #FFF7FA 0%, #FFF0F5 40%, #FCE4EC 100%)',
    blob: 'rgba(248,187,208,0.2)',
  },
];

const slideVariants = {
  enter: { opacity: 0, x: 32 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -28,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const FeatureSlide = ({ slide }) => {
  const Icon = slide.icon;
  const CtaIcon = slide.ctaIcon;

  return (
    <div
      className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 items-center min-h-[340px] sm:min-h-[360px] p-5 sm:p-8 md:p-10"
      style={{ background: slide.bg }}
    >
      {/* Soft decorative blobs */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none -translate-y-1/3 translate-x-1/4 blur-3xl"
        style={{ background: slide.blob }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4 blur-2xl opacity-60"
        style={{ background: 'rgba(233,30,99,0.08)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
        <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-2 rounded-full bg-white/80 border border-[#FCE4EC] shadow-sm backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E91E63] to-[#D81B60] flex items-center justify-center shadow-md shadow-[#E91E63]/25">
            <Icon size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#E91E63]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {slide.label}
          </span>
        </div>

        <h2
          className="text-3xl sm:text-4xl md:text-[2.75rem] font-black leading-[1.08] tracking-tight mb-3"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <span className="block text-[#1F1F1F]">{slide.line1}</span>
          <span className="block bg-gradient-to-r from-[#E91E63] to-[#D81B60] bg-clip-text text-transparent">
            {slide.line2}
          </span>
        </h2>

        <p
          className="text-sm text-gray-600 max-w-md leading-relaxed mb-5"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {slide.description}
        </p>

        {/* Feature highlights */}
        <ul className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
          {slide.highlights.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-[#FCE4EC] text-[11px] font-semibold text-[#1F1F1F] shadow-sm"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Check size={12} className="text-[#E91E63] shrink-0" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>

        <Link
          to={slide.link}
          className="feature-banner-cta group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.16em] text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          <CtaIcon size={15} className="group-hover:rotate-12 transition-transform duration-200" />
          {slide.cta}
        </Link>
      </div>

      {/* Image */}
      <div className="relative z-10 order-1 md:order-2 flex items-center justify-center md:justify-end">
        <div className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-none aspect-[4/3] md:aspect-auto md:h-[280px]">
          <div
            className="absolute -inset-3 rounded-[1.75rem] opacity-70 blur-sm pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(233,30,99,0.15) 0%, rgba(248,187,208,0.3) 100%)',
            }}
          />
          <div className="relative h-full w-full rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-[0_16px_48px_rgba(233,30,99,0.18)]">
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#E91E63]/10 via-transparent to-white/20 pointer-events-none" />
          </div>

          {/* Floating badge on image */}
          <div className="absolute -bottom-2 left-4 sm:left-6 md:left-4 px-3 py-2 rounded-xl bg-white/95 border border-[#FCE4EC] shadow-lg backdrop-blur-sm flex items-center gap-2">
            <Icon size={14} className="text-[#E91E63]" />
            <span className="text-[10px] font-bold text-[#1F1F1F] uppercase tracking-wider">
              {slide.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureBannerSlider = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index) => {
    setActive(index);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    setActive((a) => (a + 1) % FEATURE_SLIDES.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (AUTO_MS / TICK_MS);
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [paused, next]);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="feature-banner-shell relative rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-[#FFF7FA] border border-[#FCE4EC]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="absolute top-0 inset-x-0 h-1 z-20"
            style={{
              background: 'linear-gradient(90deg, #FCE4EC, #E91E63, #F8BBD0, #E91E63, #FCE4EC)',
            }}
          />

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={FEATURE_SLIDES[active].id}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <FeatureSlide slide={FEATURE_SLIDES[active]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-2.5 py-5 bg-white/50 border-t border-[#FCE4EC]/60 backdrop-blur-sm">
            {FEATURE_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                className="group relative"
                aria-label={`View ${slide.label}`}
              >
                <span className="relative block w-10 sm:w-12 h-1.5 rounded-full overflow-hidden bg-[#FCE4EC] group-hover:bg-[#F8BBD0] transition-colors">
                  {i === active && (
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#E91E63] to-[#D81B60]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: TICK_MS / 1000, ease: 'linear' }}
                    />
                  )}
                  {i < active && (
                    <span className="absolute inset-0 rounded-full bg-[#E91E63]/40" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .feature-banner-shell {
          box-shadow:
            0 20px 50px rgba(233, 30, 99, 0.1),
            0 8px 24px rgba(233, 30, 99, 0.06);
        }
        .feature-banner-cta {
          background: linear-gradient(135deg, #E91E63 0%, #D81B60 100%);
          box-shadow: 0 6px 24px rgba(233, 30, 99, 0.35);
        }
        .feature-banner-cta:hover {
          box-shadow: 0 10px 32px rgba(233, 30, 99, 0.45);
        }
      `}</style>
    </section>
  );
};

export default FeatureBannerSlider;
