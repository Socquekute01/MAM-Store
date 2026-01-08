import { useEffect, useRef, useState } from 'react';

const pricingPackages = [
  {
    id: 1,
    name: 'Nội thất',
    price: '15,000,000',
    description: 'Thiết kế ý tưởng',
    features: [
      'Nội thất tinh tế',
      'Không gian sống đẳng cấp',
      'Tạo dựng không gian nội thất hài hòa',
      'Sang trọng cho ngôi nhà của bạn',
      'Tiện nghi và thoải mái',
    ],
    popular: true,
  },
  {
    id: 2,
    name: 'Kiến trúc',
    price: '25,000,000',
    description: 'Triển khai thi công',
    features: [
      'Kiến trúc độc bản',
      'Giá trị vượt thời gian',
      'Thiết kế kiến trúc độc đáo',
      'Tối ưu ánh sáng tự nhiên',
      'Mang lại cảm giác thư giãn và gần gũi',
    ],
    popular: true,
  },
  {
    id: 3,
    name: 'Thi công',
    price: '40,000,000',
    description: 'Hoàn thiện và bàn giao',
    features: [
      'Thi công chuyên nghiệp',
      'Chất lượng vượt trội',
      'Dịch vụ thi công uy tín',
      'Đảm bảo chất lượng công trình',
      'Bền vững và thẩm mỹ',
    ],
    popular: true,
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
    <section ref={sectionRef} id="pricing" className="py-12 md:py-16 bg-background2">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="section-subtitle mb-4">Đầu tư</p>
          <h2 className="section-title">Dịch vụ</h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPackages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative p-8 border transition-all duration-700 ${
                pkg.popular ? 'border-foreground bg-price-card/20' : 'border-border'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background font-sans text-xs tracking-[0.1em] uppercase px-4 py-1">
                  ★★★★★
                </span>
              )}
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl mb-2">{pkg.name}</h3>
                <p className="font-sans text-xs text-muted-foreground mb-4">{pkg.description}</p>
                {/* <div className="font-serif text-3xl">
                  {pkg.price}
                  <span className="font-sans text-sm text-muted-foreground"> VND</span>
                </div> */}
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
                Liên hệ ngay
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
