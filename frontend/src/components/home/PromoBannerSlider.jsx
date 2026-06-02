// PromoBannerSlider.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

/* ─── 3 High-Quality Balanced E-Commerce Landscape Banners ─────────────────── */
const SLIDES = [
  {
    id: 1,
    image:
      "https://i.pinimg.com/1200x/7a/9f/00/7a9f00bfb50f485f75fe5edcd4917402.jpg", // Fashion Apparel Promo Banner
    fallbackBg: "#fbcfe8",
    accentColor: "#db2777",
  },
  {
    id: 2,
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/002/006/774/small_2x/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-backgroud-for-banner-market-ecommerce-free-vector.jpg", // Gold Flash/Super Sale Banner
    fallbackBg: "#1e1b4b",
    accentColor: "#eab308",
  },
  {
    id: 3,
    image:
      "https://i.pinimg.com/736x/8f/bc/68/8fbc68df38ad2b413d4fb445eeddf121.jpg", // Your New Black Friday / E-commerce Sale Banner
    fallbackBg: "#0f172a",
    accentColor: "#38bdf8", // Cyber blue accent to match the neon theme
  },
];

const AUTO_MS = 3000;

const PromoBannerSlider = () => {
  const [slides, setSlides] = useState(SLIDES);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch active approved offers
  useEffect(() => {
    const fetchActiveOffers = async () => {
      try {
        const { data } = await axios.get("/api/offers/active");
        if (Array.isArray(data) && data.length > 0) {
          const dynamicSlides = data.map((offer, idx) => ({
            id: offer._id,
            image: offer.bannerImage,
            slug: offer.slug,
            fallbackBg: idx % 3 === 0 ? "#fbcfe8" : idx % 3 === 1 ? "#1e1b4b" : "#0f172a",
            accentColor: idx % 3 === 0 ? "#db2777" : idx % 3 === 1 ? "#eab308" : "#38bdf8",
            isDynamic: true
          }));
          setSlides(dynamicSlides);
        }
      } catch (error) {
        console.error("Failed to load active promotions:", error);
      }
    };
    fetchActiveOffers();
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setActive((a) => (a + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((a) => (a - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, AUTO_MS);
    return () => clearInterval(timer);
  }, [paused, next, slides.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchStartX.current - touchEndX.current > swipeThreshold) next();
    if (touchEndX.current - touchStartX.current > swipeThreshold) prev();
  };

  const bannerVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir > 0 ? "100%" : "-100%",
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? "-100%" : "100%",
      transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
    }),
  };

  return (
    <div
      className="relative w-full max-w-[1600px] mx-auto px-2 md:px-8 mb-6 group select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Premium Panoramic Banner Tracker"
    >
      {/* Horizontal Frame container. 
        Maintains an aspect-[16/4] view on mobile layout and upgrades into a broad aspect-[24/4] ribbon on desktop viewports.
      */}
      <div className="relative w-full overflow-hidden rounded-xl md:rounded-[20px] aspect-[16/4] sm:aspect-[20/4] md:aspect-[24/4] shadow-sm bg-neutral-950 cursor-pointer">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <Link
            key={slides[active].id}
            to={slides[active].isDynamic ? `/offer/${slides[active].slug}` : "/offers"}
            className="absolute inset-0 w-full h-full block"
          >
            <motion.div
              custom={direction}
              variants={bannerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
              style={{ backgroundColor: slides[active].fallbackBg }}
            >
              {/* Object-cover scales your image sets cleanly into position without skewing text details */}
              <img
                src={slides[active].image}
                alt={`Promotional offer display ${slides[active].id}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />
            </motion.div>
          </Link>
        </AnimatePresence>
      </div>

      {/* ── Side Chevron Controls ── */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white text-neutral-800 shadow-md border border-neutral-100/80 flex items-center justify-center hover:bg-neutral-50 active:scale-90 opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="Previous banner slide"
      >
        <ChevronLeft size={16} strokeWidth={3} />
      </button>

      <button
        type="button"
        onClick={next}
        className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white text-neutral-800 shadow-md border border-neutral-100/80 flex items-center justify-center hover:bg-neutral-50 active:scale-90 opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="Next banner slide"
      >
        <ChevronRight size={16} strokeWidth={3} />
      </button>

      {/* ── Lower Dot Tracking Navigation Bar ── */}
      <div className="flex justify-center items-center gap-1.5 mt-3">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => {
              setDirection(i > active ? 1 : -1);
              setActive(i);
            }}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === active ? "18px" : "5px",
              backgroundColor:
                i === active ? slides[active].accentColor : "#E5E7EB",
            }}
            aria-label={`Jump directly to panel ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBannerSlider;
