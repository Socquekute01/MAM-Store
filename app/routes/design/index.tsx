import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ConsultationButton from '@/components/ui/ConsultationButton';
import { userAPI } from '@/services/user.api';

/* =====================
   Types
===================== */
type Category = {
  id: string;
  name: string;
};

type ProductGallery = {
  id: number;
  thumbnail: string;
  category_name: string;
  name: string;
};

/* =====================
   Constants
===================== */
const categoriesDefault: Category[] = [{ id: 'all', name: 'All' }];

/* =====================
   Component
===================== */
const Design = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<Category[]>([]);
  const [galleries, setGalleries] = useState<ProductGallery[]>([]);
  const [loading, setLoading] = useState(true);

  const [filteredGalleries, setFilteredGalleries] = useState<ProductGallery[]>([]);

  useEffect(() => {
    setFilteredGalleries(
      activeCategory === 'All' ? galleries : galleries.filter((g) => g.category_name === activeCategory),
    );
  }, [activeCategory, galleries]);

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        const categoriesData = await userAPI.getCategories();
        const galleriesData = await userAPI.getAllProducts();

        setCategories([categoriesDefault[0], ...categoriesData]);
        setGalleries(galleriesData);
      } catch (error) {
        console.error('Load designs error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDesigns();
  }, []);

  return (
    <div className="pt-32 pb-20">
      <ConsultationButton />

      {/* =====================
          Category Filter
      ===================== */}
      <div className="flex justify-center gap-3 mb-16">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-muted animate-pulse border border-foreground/20" />
            ))
          : categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-5 py-2 text-[10px] tracking-[0.15em] uppercase font-sans border transition-all duration-300 ${
                  activeCategory === cat.name
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-foreground/70 border-foreground/30 hover:border-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
      </div>

      {/* =====================
          Gallery Grid
      ===================== */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  {/* Image Skeleton */}
                  <div className="w-full h-[220px] bg-muted mb-5" />

                  {/* Text Skeleton */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-3 w-24 bg-muted" />
                    <div className="h-4 w-40 bg-muted" />
                  </div>
                </div>
              ))
            : filteredGalleries.map((gallery, index) => (
                <Link
                  key={gallery.id}
                  to={`/design/${gallery.id}`}
                  className="group block opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden mb-5">
                    <img
                      src={gallery.thumbnail}
                      alt={gallery.name}
                      loading="lazy"
                      className="w-full h-full max-h-45 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500">
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 bg-background/90 flex items-center justify-center">
                          <ExternalLink size={16} className="text-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                      {'Design / ' + categories.find((c) => c.name === gallery.category_name)?.name}
                    </p>
                    <h3 className="font-serif text-xs md:text-xl font-light tracking-wide group-hover:text-primary transition-colors duration-300">
                      {gallery.name}
                    </h3>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Design;
