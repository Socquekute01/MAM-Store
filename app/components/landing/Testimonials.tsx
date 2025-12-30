import { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote:
      "Lacy captured our love story in the most beautiful and authentic way. Every photo feels like a piece of art that we'll treasure forever.",
    author: 'Mie & Minh',
    location: 'Hanoi Wedding',
  },
  {
    id: 2,
    quote:
      'Working with Lacy Studio was an absolute dream. She has an incredible eye for detail and made us feel so comfortable throughout the entire process.',
    author: 'Khanh & Anh',
    location: 'Da Lat Engagement',
  },
  {
    id: 3,
    quote:
      "The photos exceeded all our expectations. Lacy's minimalist approach perfectly captured the emotion and beauty of our special day.",
    author: 'Trang & Hieu',
    location: 'Saigon Wedding',
  },
];

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="section-subtitle mb-4">Kind Words</p>
          <h2 className="section-title">Testimonials</h2>
        </div>

        {/* Testimonial Slider */}
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Quote className="w-10 h-10 mx-auto mb-8 text-foreground/20" />

          <div className="relative h-48 md:h-40">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 ${
                  index === activeIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <p className="font-serif text-xl md:text-2xl italic text-foreground/80 mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="font-sans text-sm tracking-[0.15em] uppercase">{testimonial.author}</p>
                <p className="font-sans text-xs text-muted-foreground mt-1">{testimonial.location}</p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-foreground w-6' : 'bg-foreground/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
