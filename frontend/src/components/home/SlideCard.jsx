import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SlideCard = ({ slide, isActive }) => {
  return (
    <div className="relative h-screen w-full flex items-center md:items-center overflow-hidden group bg-black">

      {/* ── Background Image with Ultra-Smooth Ken Burns ── */}
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ 
          scale: isActive ? 1 : 1.2, 
          opacity: isActive ? 1 : 0 
        }}
        transition={{ 
          scale: { duration: 10, ease: 'easeOut' },
          opacity: { duration: 1.5, ease: 'easeInOut' }
        }}
        className="absolute inset-0"
      >
        <img
          src={slide.image}
          alt="Fashion Model Showcase"
          className="w-full h-full object-cover"
          style={{ objectPosition: slide.objectPosition || 'center 15%' }}
        />
      </motion.div>

      {/* ── Rich Vignette & Editorial Gradient Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent md:w-[65%] z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none z-10" /> 
      
      {/* ── Accent Color Ambient Glow ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.35 : 0 }}
        transition={{ duration: 3, delay: 0.8 }}
        className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full blur-[140px] pointer-events-none z-10"
        style={{ background: `radial-gradient(circle, ${slide.accent || '#E91E63'} 0%, transparent 70%)` }}
      />

      {/* ── Slide Text Content (Offset down to clear headers) ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-24 pt-44 md:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 60 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -40 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-[1.5px] w-8" style={{ backgroundColor: slide.accent || '#E91E63' }} />
            <span
              className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-white/95"
            >
              {slide.tag}
            </span>
          </motion.div>

          {/* Headline (Feminine outline overlay) */}
          <div className="flex flex-col gap-1.5 mb-8">
            {slide.heading.map((line, i) => (
              <div key={i} className="overflow-hidden py-1">
                <motion.h1 
                  initial={{ y: '110%', rotate: 1.5 }}
                  animate={{ y: isActive ? '0%' : '110%', rotate: isActive ? 0 : 1.5 }}
                  transition={{ duration: 1.2, delay: 0.5 + (i * 0.15), ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-7xl lg:text-[98px] font-black leading-[0.9] text-white tracking-tighter" 
                  style={{ 
                    fontFamily: 'Outfit, sans-serif',
                    color: i === 1 ? 'transparent' : 'white',
                    WebkitTextStroke: i === 1 ? '1.5px white' : 'none'
                  }}
                >
                  {line}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-gray-200 text-sm md:text-base font-medium max-w-xl mb-12 leading-relaxed tracking-wide opacity-90"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {slide.sub}
          </motion.p>

          {/* Actions (CTA) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
            transition={{ duration: 1.2, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row flex-wrap gap-5 items-start sm:items-center"
          >
            <Link
              to={slide.cta1.link}
              className="group relative inline-flex items-center gap-4 px-10 py-4.5 text-white font-bold text-xs uppercase tracking-[0.25em] rounded-full overflow-hidden transition-all w-full sm:w-auto justify-center"
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: slide.accent || '#E91E63' }} />
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <span className="relative z-10">{slide.cta1.label}</span>
              <ArrowRight size={15} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-500" />
            </Link>

            <Link
              to={slide.cta2.link}
              className="group relative inline-flex items-center justify-center gap-2 px-10 py-4.5 text-white font-bold text-xs uppercase tracking-[0.25em] rounded-full transition-all w-full sm:w-auto overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.35)' }}
            >
              <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              <span className="relative z-10 group-hover:text-black transition-colors duration-500 delay-100">{slide.cta2.label}</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Luxury Watermark Background Details ── */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isActive ? 0.05 : 0, x: isActive ? 0 : 50 }}
        transition={{ duration: 2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 rotate-90 origin-right text-white font-black text-[100px] md:text-[150px] select-none hidden lg:block tracking-tighter mix-blend-overlay z-10"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        WEARIFY
      </motion.div>

    </div>
  );
};

export default SlideCard;
