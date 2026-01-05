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
      {/* block for about 2 */}
      <section ref={sectionRef} id="about2" className="py-12 md:py-16 bg-color grid gap-12 md:gap-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div
              className={`relative md:order-2 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* <img src={photographerImage} alt="Lacy - Wedding Photographer" className="w-full h-full object-cover" /> */}
                <video id="mamVideo" autoPlay muted loop playsInline className="w-full h-full object-cover">
                  <source
                    src="https://mamvietnam.vn/wp-content/uploads/2025/08/Video-1-Gioi-Thieu-Tong-The-Nha-May-Mam-Viet-Nam.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-foreground/20" /> */}
            </div>

            {/* Content */}
            <div
              className={`transition-all duration-1000 md:order-1 delay-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <p className="section-subtitle mb-4">Nhà máy sản xuất tại Việt Nam</p>
              <h2 className="section-title mb-8">
                <span className="italic">M.A.M</span>
              </h2>
              <div className="space-y-6 text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
                <p>
                  Hệ thống máy móc tiên tiến với độ chính xác cao, với dây chuyền sản xuất khép kín. Đi đôi là chất
                  lượng hoàn thiện thẩm mỹ tinh xảo.
                </p>
                <p>Đội ngũ kỹ thuật với nhiều năm kinh ngiệm, luôn tạo ra những sản phẩm hoàn hảo bậc nhất</p>
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
