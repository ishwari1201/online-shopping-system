import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sliderData } from '../../data/sliderData';
import SlideCard from './SlideCard';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % sliderData.length);
  }, []);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  }, []);

  // Auto-sliding logic
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(slideNext, 5000);
    return () => clearInterval(timer);
  }, [slideNext, isPaused]);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          <SlideCard 
            slide={sliderData[currentIndex]} 
            isActive={true} 
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-6 z-20 pointer-events-none">
        <button 
          onClick={slidePrev}
          className="p-4 rounded-full border border-white/10 bg-black/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all pointer-events-auto group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={slideNext}
          className="p-4 rounded-full border border-white/10 bg-black/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all pointer-events-auto group"
        >
          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        {sliderData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className="group relative h-12 w-2 flex items-center justify-center"
          >
            <div 
              className={`w-1 transition-all duration-500 rounded-full ${
                idx === currentIndex ? "h-8 bg-accent" : "h-4 bg-white/30 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Progress Bar (Visual indicator of auto-slide) */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full z-20 overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-accent/50"
        />
      </div>
    </section>
  );
};

export default HeroSlider;
