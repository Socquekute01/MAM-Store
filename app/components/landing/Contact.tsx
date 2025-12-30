import { useEffect, useRef, useState } from 'react';

const Contact = () => {
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
    <section ref={sectionRef} id="contact" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="section-subtitle mb-4">Get in Touch</p>
          <h2 className="section-title mb-8">
            Let's Work <span className="italic">Together</span>
          </h2>
          <p className="font-sans text-muted-foreground mb-12 leading-relaxed">
            We're really happy and thank you so much for coming here and considering us to document your wedding day!
            We'd love to hear about your story and how we can help capture your precious moments.
          </p>

          {/* Contact Form */}
          <form className="space-y-6 text-left">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Your Name</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Wedding Date</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Location</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Wedding location"
                />
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs tracking-[0.15em] uppercase mb-3">Your Message</label>
              <textarea
                rows={4}
                className="w-full bg-transparent border-b border-foreground/30 py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                placeholder="Tell us about your story..."
              />
            </div>
            <div className="text-center pt-4">
              <button type="submit" className="elegant-button">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
