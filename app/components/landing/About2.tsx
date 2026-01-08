import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  // Close modal when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  return (
    <>
      {/* block for about 1 */}
      <section ref={sectionRef} id="about" className="py-12 md:py-32 bg-secondary grid gap-12 md:gap-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div
              className={`md:order-2 relative transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <div className="relative overflow-hidden w-full md:h-auto group cursor-pointer">
                <video id="mamVideo" autoPlay muted loop playsInline className="w-full">
                  <source
                    src="https://mamvietnam.vn/wp-content/uploads/2025/08/Video-1-Gioi-Thieu-Tong-The-Nha-May-Mam-Viet-Nam.mp4"
                    type="video/mp4"
                  />
                </video>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 transition-all duration-500 group-hover:bg-black/40" />

                {/* Text Overlay & Play Button */}
                <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 text-white container mx-auto">
                  <h3 className="font-serif text-xl font-light max-w-2xl leading-tight">
                    Nhà máy sản xuất tại Việt Nam
                  </h3>
                  <p className="font-light mb-4 max-w-xl"> Cùng xem quy trình hoạt động của nhà máy MAM</p>

                  {/* Play Button */}
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-3 group/btn transition-all duration-300"
                    aria-label="Play video"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300 group-hover/btn:bg-white group-hover/btn:scale-110">
                      <Play
                        className="w-6 h-6 md:w-8 md:h-8 fill-white transition-all duration-300 group-hover/btn:fill-[#1a1410] ml-1"
                        strokeWidth={0}
                      />
                    </div>
                    <span className="text-sm md:text-base uppercase tracking-[0.2em] font-medium">Xem Video</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className={`md:order-1 transition-all duration-1000 delay-300 ${
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
          {/* Image */}
        </div>

        {/* Video Section with Play Button */}
      </section>

      {/* YouTube Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#d4a574] transition-colors duration-300 group"
              aria-label="Close video"
            >
              <X className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" />
            </button>

            {/* YouTube Embed */}
            <iframe
              className="w-full h-full rounded-lg shadow-2xl"
              src="https://www.youtube.com/embed/Op_ngiZKbxY?autoplay=1&rel=0"
              title="M.A.M Vietnam Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default About;
