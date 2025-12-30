import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from '@/assets/hero-1.jpg';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Fine art wedding photography" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p
          className={`section-subtitle mb-6 text-foreground/80 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Fine Art Wedding Photographer
        </p>
        <h1
          className={`font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-wide mb-6 text-foreground transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Capturing Timeless
          <br />
          <span className="italic">Moments of Love</span>
        </h1>
        <p
          className={`font-sans text-sm md:text-base text-foreground/70 mb-8 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Based in Hanoi and travel around Vietnam
        </p>
        <a
          href="#portfolio"
          className={`elegant-button inline-block transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          View Portfolio
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-sans text-xs tracking-widest uppercase text-foreground/50">Scroll</span>
        <div className="w-px h-12 bg-foreground/30 animate-pulse" />
      </div>
    </section>
  );
};

export default Hero;
