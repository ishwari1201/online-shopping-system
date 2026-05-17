import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SlideCard = ({ slide, isActive }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Zoom Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: isActive ? 1 : 1.1 }}
        transition={{ duration: 5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img 
          src={slide.image} 
          alt={slide.heading} 
          className="w-full h-full object-cover"
        />
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40"></div>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-6 rounded-full">
            New Arrival 2026
          </span>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            {slide.heading.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 1 ? "text-accent" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          <p className="text-gray-300 text-sm md:text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed">
            {slide.subheading}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to={slide.btn1Link}
              className="group relative px-10 py-4 bg-white text-primary font-black uppercase tracking-widest text-[11px] overflow-hidden transition-all hover:bg-bg-cream shadow-2xl"
            >
              <span className="relative z-10">{slide.btn1}</span>
              <motion.div 
                className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              />
            </Link>
            
            <Link 
              to={slide.btn2Link}
              className="px-10 py-4 border-2 border-white/50 text-white font-black uppercase tracking-widest text-[11px] backdrop-blur-sm hover:bg-white hover:text-primary transition-all shadow-2xl"
            >
              {slide.btn2}
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-20 left-10 hidden lg:block text-white/20 text-[100px] font-black tracking-tighter select-none">
        FASHION
      </div>
    </div>
  );
};

export default SlideCard;
