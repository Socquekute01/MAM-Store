import ConsultationButton from '@/components/ui/ConsultationButton';
import { adminApi } from '@/services/admin.api';
import { Play, X, Film, Award, Video } from 'lucide-react';
import { useEffect, useState } from 'react';

const galleries = [
  {
    id: 1,
    image: 'https://mamvietnam.vn/wp-content/uploads/2025/08/BetterImage_1754474710143-708x400.jpeg',
    completedDate: '6 Tháng 8 2025',
    title: 'Toàn cảnh biệt thự tân cổ Bắc Ninh',
    videoUrl: 'https://www.youtube.com/embed/0Szxy2jfi6g?si=hqdWka2cuMWbxFcR',
  },
];
type Gallery = (typeof galleries)[0];

const Construction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>();

  useEffect(() => {
     const loadConstructions = async () => {
        const data = await adminApi.getConstructions();
        const res = data.map((item:any) => ({...item, videoUrl: item.video_url, completedDate: item.completed_date })); // Map video_url to videoUrl
        setFilteredGalleries(res);
      };
      loadConstructions();
  }, []);

  const openModal = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedGallery(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <ConsultationButton />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={'https://mamvietnam.vn/wp-content/uploads/2025/08/z5705744161238_e4f60ddfd2e952ab80accd2ddc56231f.jpg'}
            alt="Fine art wedding photography"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-background/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Film size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Thi công thực tế</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6 animate-fade-up">
            Khám Phá Không Gian
            <br />
            <span className="text-primary">Qua Video Tour Chuyên Nghiệp</span>
          </h1>
          <p
            className={`font-sans text-sm md:text-base text-foreground/70 mb-8 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Based in Hanoi and travel around Vietnam
          </p>
          <a
            href="#construction"
            className={`elegant-button inline-block transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Xem thi công
          </a>
        </div>
      </section>

      {/* Original Gallery Grid */}
      <div className="py-12" id="construction">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredGalleries?.map((gallery, index) => (
              <div
                key={gallery.id}
                onClick={() => openModal(gallery)}
                className="group block opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards', cursor: 'pointer' }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden mb-5 rounded-lg">
                  <img
                    src={gallery.image}
                    alt={gallery.title}
                    className="w-full h-full max-h-45 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Hover Overlay with Icon */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500">
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 bg-background/90 rounded-full flex items-center justify-center">
                        <Play size={16} className="text-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    {gallery.completedDate}
                  </p>
                  <h3 className="font-serif text-xs md:text-xl font-light tracking-wide group-hover:text-primary transition-colors duration-300">
                    {gallery.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedGallery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-5xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors rounded-full"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Video Title */}
            <div className="mb-4 text-center">
              <h3 className="text-white text-xl md:text-2xl font-light tracking-wide">{selectedGallery.title}</h3>
              <p className="text-white/60 text-sm mt-1 tracking-wider">{selectedGallery.completedDate}</p>
            </div>

            {/* Video Container */}
            <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={selectedGallery.videoUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedGallery.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Construction;
