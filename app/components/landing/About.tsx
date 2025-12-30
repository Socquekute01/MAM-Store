import { useEffect, useRef, useState } from 'react';
import photographerImage from '@/assets/photographer.jpg';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img src={photographerImage} alt="Lacy - Wedding Photographer" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-foreground/20" />
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <p className="section-subtitle mb-4">About Us</p>
            <h2 className="section-title mb-8">
              Hello, I'm <span className="italic">Lacy</span>
            </h2>
            <div className="space-y-6 text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
              <p>
                Welcome to Lacy Studio, where minimalism meets the art of storytelling, and every frame captures the
                essence of love. Our philosophy is rooted in the belief that true beauty lies in simplicity.
              </p>
              <p>
                We focus on the raw emotions and authentic moments that make each love story unique. With a keen eye for
                detail and a passion for capturing fleeting moments, I create timeless images that you'll treasure
                forever.
              </p>
              <p>
                Based in Hanoi, I travel throughout Vietnam and beyond to document your most precious moments with
                artistic vision and heartfelt dedication.
              </p>
            </div>
            <a href="#contact" className="elegant-button inline-block mt-8">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
