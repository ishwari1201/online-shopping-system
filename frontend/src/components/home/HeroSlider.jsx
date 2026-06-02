// PremiumHeroSlider.jsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/* ─── Static Fallback Slide Data ──────────────────────────────────────── */
const fallbackSlides = [
  {
    id: "f1",
    tag: "New Collection 2026",
    heading: ["Redefine", "Your Style"],
    sub: "Luxury fashion for every moment — elegance meets modern confidence.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1800&auto=format&fit=crop",
    cta1: { label: "Shop Women", link: "/shop?category=Clothes" },
    cta2: { label: "Explore", link: "/shop" },
    accent: "#E91E63",
    objectPosition: "center 15%",
  },
  {
    id: "f2",
    tag: "Men's Edit",
    heading: ["Modern", "Gentleman"],
    sub: "Urban sophistication — tailored fits, premium fabrics, effortless style.",
    image:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1800&auto=format&fit=crop",
    cta1: { label: "Shop Men", link: "/shop?category=Clothes" },
    cta2: { label: "View Lookbook", link: "/shop" },
    accent: "#7C4DFF",
    objectPosition: "center 18%",
  },
  {
    id: "f3",
    tag: "Streetwear Drop",
    heading: ["Street", "Culture"],
    sub: "Gen-Z approved — oversized fits, bold sneakers, limitless attitude.",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1800&auto=format&fit=crop",
    cta1: { label: "Shop Streetwear", link: "/shop?category=Shoes" },
    cta2: { label: "New Drops", link: "/shop" },
    accent: "#FF6D00",
    objectPosition: "center 15%",
  },
  {
    id: "f4",
    tag: "Season Sale — Up to 50% Off",
    heading: ["Fashion", "Festival"],
    sub: "Limited-time markdowns on 500+ styles. Your wardrobe refresh starts here.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1800&auto=format&fit=crop",
    cta1: { label: "Shop Sale", link: "/shop" },
    accent: "#D81B60",
    objectPosition: "center 10%",
  },
];

const SLIDE_DURATION = 5000; // Auto slide every 5 seconds
const UPDATE_INTERVAL = 20;  // Smoothing progress loop timer

const PremiumHeroSlider = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState(fallbackSlides);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Swipe Gestures state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(1);
    setActive((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(-1);
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goTo = useCallback(
    (index) => {
      if (index === active) return;
      setDirection(index > active ? 1 : -1);
      setActive(index);
      setProgress(0);
    },
    [active],
  );

  // Swipe event handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Unified Slide Progress Bar Timer
  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const startTime = Date.now() - (progress / 100) * SLIDE_DURATION;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);

      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        next();
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [paused, progress, next, slides.length]);

  // Keyboard navigation controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const handleSlideClick = (e) => {
    // Prevent redirecting if user clicks CTA buttons directly
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }
    navigate("/offers"); // Customer clicks any banner -> Redirects to /offers
  };

  const slideVariants = {
    enter: (dir) => ({
      opacity: 0,
      scale: 1.05,
      x: dir > 0 ? "100%" : "-100%",
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] },
    },
    exit: (dir) => ({
      opacity: 0,
      scale: 0.95,
      x: dir > 0 ? "-100%" : "100%",
      transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] },
    }),
  };

  return (
    <section
      className="relative w-full h-[65vh] md:h-screen overflow-hidden bg-neutral-950 select-none cursor-pointer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleSlideClick}
      aria-label="Wearify hero promotions slider"
    >
      {/* ── Slides Carousel Viewport ── */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex items-center justify-center w-full h-full bg-cover"
            style={{
              backgroundImage: `url(${slides[active].image})`,
              backgroundPosition: slides[active].objectPosition || "center",
            }}
          >
            {/* Soft high-end color overlay tint */}
            <div className="absolute inset-0 bg-neutral-900/35 mix-blend-multiply z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35 z-0" />

            {/* Horizontal Text Content Area */}
            <div className="text-center max-w-3xl px-6 space-y-4 md:space-y-6 z-10 filter drop-shadow-xl">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] bg-white/15 text-white rounded-full backdrop-blur-xl border border-white/20 shadow-sm animate-fade-in">
                {slides[active].isDynamic ? `🏷️ Brand: ${slides[active].tag}` : slides[active].tag}
              </span>

              <h1
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[0.95]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {Array.isArray(slides[active].heading)
                  ? slides[active].heading.join(" ")
                  : slides[active].heading}
              </h1>

              <p
                className="text-xs md:text-lg text-white/85 font-normal max-w-xl mx-auto leading-relaxed tracking-wide"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {slides[active].sub}
              </p>

              {slides[active].coupon && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/80 text-white rounded-lg text-xs font-black tracking-wider uppercase border border-pink-400">
                  <Tag size={12} /> Use Code: {slides[active].coupon}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 md:pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={slides[active].cta1.link}
                  className="px-6 py-3 md:px-8 md:py-4 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] bg-white text-black hover:bg-neutral-100 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl"
                >
                  {slides[active].cta1.label}
                </Link>
                {slides[active].cta2 && (
                  <Link
                    to={slides[active].cta2.link}
                    className="px-6 py-3 md:px-8 md:py-4 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] bg-white/10 text-white border border-white/25 hover:bg-white/20 transform hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-md"
                  >
                    {slides[active].cta2.label}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation Arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-black/15 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 active:scale-90 text-white transition-all duration-200 group cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft
              size={20}
              className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
            />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-black/15 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 active:scale-90 text-white transition-all duration-200 group cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight
              size={20}
              className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
            />
          </button>
        </>
      )}

      {/* ── Bottom Bar: Dots + Progress ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className="relative w-10 md:w-14 h-1 rounded-full bg-white/25 overflow-hidden transition-all duration-300 hover:bg-white/40 cursor-pointer"
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === active && (
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: slides[active].accent || "#E91E63" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.02, ease: "linear" }}
                />
              )}
              {i < active && <div className="absolute inset-0 bg-white/80" />}
            </button>
          ))}
        </div>
      )}

      {/* ── Slide Counter ── */}
      <div
        className="absolute top-6 md:top-10 right-6 md:right-10 z-30 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-white/70 text-[10px] md:text-xs font-bold tracking-[0.25em]"
        style={{
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span className="text-white font-black">
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="mx-1.5 opacity-40">/</span>
        <span className="opacity-60">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
};

export default PremiumHeroSlider;
