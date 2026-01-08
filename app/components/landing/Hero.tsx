import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  'https://mamvietnam.vn/wp-content/uploads/2025/07/home-slider-1.webp',
  'https://mamvietnam.vn/wp-content/uploads/2025/07/home-slider-2.webp',
  'https://mamvietnam.vn/wp-content/uploads/2025/08/Hero-section.jpg',
];

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  // Text animation (giữ logic cũ)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Slider interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // 5s đẹp hơn cho ảnh cưới

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden">
      {/* ===== BACKGROUND CINEMATIC SLIDER ===== */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt="Fine art wedding photography"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{
              opacity: 0,
              scale: 1.12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.05,
            }}
            transition={{
              duration: 1.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 text-left px-6 container mx-auto">
        <p
          className={`section-subtitle mb-6 text-foreground/80 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          THIẾT KẾ & THI CÔNG NỘI THẤT m.a.m
        </p>

        <h1
          className={`font-serif text-4xl md:leading-20 md:text-6xl lg:text-7xl font-light tracking-wide mb-6 text-foreground transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Hiện đại, Neo Classic Luxury
          <br />
          <span className="">Luxury, Luxury, Tân cổ</span>
        </h1>

        <p
          className={`font-sans text-sm md:text-base text-foreground/70 mb-8 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Là những gì chúng tôi mang lại cho khách hàng
        </p>

        <a
          href="#portfolio"
          className={`elegant-button inline-block transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Xem Portfolio
        </a>
      </div>

      {/* ===== SCROLL INDICATOR ===== */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-sans text-xs tracking-widest uppercase text-foreground/50">Scroll</span>
        <div className="w-px h-12 bg-foreground/30 animate-pulse" />
      </div> */}
    </section>
  );
};

export default Hero;
