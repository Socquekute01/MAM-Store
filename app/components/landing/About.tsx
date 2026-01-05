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
    <>
      {/* block for about 1 */}
      <section ref={sectionRef} id="about" className="py-12 md:py-16 bg-background grid gap-12 md:gap-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div
              className={`relative transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* <img src={photographerImage} alt="Lacy - Wedding Photographer" className="w-full h-full object-cover" /> */}
                <video id="mamVideo" autoPlay muted loop playsInline className="w-full h-full object-cover">
                  <source
                    src="https://mamvietnam.vn/wp-content/uploads/2025/08/MAM-VIET-NAM-TRAO-GIA-TRI-TIEM-CAN-DEN-SU-HOAN-MY.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-foreground/20" /> */}
            </div>

            {/* Content */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <p className="section-subtitle mb-4">Về chúng tôi</p>
              <h2 className="section-title mb-8">
                Hello, I'm <span className="italic">M.A.M</span>
              </h2>
              <div className="space-y-6 text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
                <p>
                  Tự hào là đơn vị tiên phong trong thiết kế và thi công nội thất M.A.M Việt Nam đã kiến tạo hơn 3.000
                  không gian sống đẳng cấp trên khắp cả nước.
                </p>
                <p>
                  Với triết lý 𝑪𝒖𝒔𝒕𝒐𝒎𝒆𝒓 𝑶𝒃𝒔𝒆𝒔𝒔𝒊𝒐𝒏” – Sự say mê khách hàng, chúng tôi không ngừng mang đến những giá trị
                  khác biệt, chạm đến sự hài lòng và vượt trên mong đợi của khách hàng.
                </p>
                <p>M.A.M Việt Nam – “Độc bản tương lai, kiến tạo đẳng cấp.”</p>
              </div>
              <a href="#contact" className="elegant-button inline-block mt-8">
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
