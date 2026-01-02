import { userAPI } from '@/services/user.api';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

type RelatedPost = {
  id: number;
  name: string;
  thumbnail: string;
  category_name: string;
};

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioItems, setPortfolioItems] = useState<RelatedPost[]>([]);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const allProducts = await userAPI.getAllProducts();
        setPortfolioItems(allProducts.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <section ref={sectionRef} id="portfolio" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="section-subtitle mb-4">Our Works</p>
          <h2 className="section-title">Portfolio</h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {portfolioItems.map((item, index) => (
            <Link
              key={item?.id}
              to={`/design/${item?.id}`}
              className={`gallery-item group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item?.thumbnail}
                  alt={item?.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-background/80 mb-2">
                    {item?.category_name}
                  </span>
                  <span className="font-serif text-xl text-background text-center">{item?.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a href="/design" className="elegant-button inline-block">
            View All Works
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
