import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const VIDEO_SRC = '/videos/fashion-showcase.mp4';

const FashionVideoShowcase = () => {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    const onReady = () => {
      setReady(true);
      tryPlay();
    };

    if (video.readyState >= 2) onReady();

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);

    return () => {
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black" aria-hidden>
      <div className="relative w-full h-[52vh] min-h-[300px] sm:h-[58vh] sm:min-h-[360px] md:h-[65vh] md:min-h-[420px] lg:h-[70vh] lg:max-h-[720px]">
        {!ready && (
          <div className="absolute inset-0 z-20 bg-[#121212] animate-pulse" />
        )}

        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={VIDEO_SRC}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            onLoadedData={() => setReady(true)}
            onCanPlay={() => {
              setReady(true);
              videoRef.current?.play().catch(() => {});
            }}
          />
        </motion.div>

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.35) 100%)',
          }}
        />
        <div className="absolute inset-0 z-10 pointer-events-none bg-black/5 mix-blend-multiply" />
      </div>
    </section>
  );
};

export default FashionVideoShowcase;
