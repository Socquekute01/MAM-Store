import { useEffect, useRef, useState } from 'react';

const pricingPackages = [
  {
    id: 1,
    name: 'Essential',
    price: '15,000,000',
    description: 'Perfect for intimate ceremonies',
    features: ['4 hours coverage', '1 photographer', '150+ edited photos', 'Online gallery', 'Print-ready files'],
  },
  {
    id: 2,
    name: 'Signature',
    price: '25,000,000',
    description: 'Our most popular package',
    features: [
      '8 hours coverage',
      '2 photographers',
      '350+ edited photos',
      'Engagement session',
      'Premium album',
      'Online gallery',
    ],
    popular: true,
  },
  {
    id: 3,
    name: 'Luxury',
    price: '40,000,000',
    description: 'Complete wedding documentation',
    features: [
      'Full day coverage',
      '2 photographers',
      '500+ edited photos',
      'Engagement session',
      'Premium album',
      'Wedding film',
      'Fine art prints',
    ],
  },
];

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="section-subtitle mb-4">Investment</p>
          <h2 className="section-title">Pricing</h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPackages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative p-8 border transition-all duration-700 ${
                pkg.popular ? 'border-foreground bg-secondary/20' : 'border-border'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background font-sans text-xs tracking-[0.1em] uppercase px-4 py-1">
                  Popular
                </span>
              )}
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl mb-2">{pkg.name}</h3>
                <p className="font-sans text-xs text-muted-foreground mb-4">{pkg.description}</p>
                <div className="font-serif text-3xl">
                  {pkg.price}
                  <span className="font-sans text-sm text-muted-foreground"> VND</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="font-sans text-sm text-muted-foreground flex items-center gap-3">
                    <span className="w-1 h-1 bg-foreground/50 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block text-center font-sans text-xs tracking-[0.15em] uppercase py-3 border transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-foreground text-background border-foreground hover:bg-transparent hover:text-foreground'
                    : 'border-foreground/30 hover:bg-foreground hover:text-background hover:border-foreground'
                }`}
              >
                Inquire Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
