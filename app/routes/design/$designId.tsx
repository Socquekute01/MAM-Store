import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ConsultationButton from '@/components/ui/ConsultationButton';
import { useEffect, useState } from 'react';
import { userAPI } from '@/services/user.api';

type GalleryImage = {
  image_url: string;
  is_thumbnail: number;
  id: number;
  sort_order: number;
};

type GalleryData = {
  name: string;
  category_name: string;
  heroImage: string;
  images: GalleryImage[];
};

type RelatedPost = {
  id: number;
  name: string;
  thumbnail: string;
};

const DesignDetail = () => {
  const { designId } = useParams<{ designId: string }>();

  const [gallery, setGallery] = useState<GalleryData | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!designId) return;

    const loadData = async () => {
      try {
        setIsLoading(true);

        const detail = await userAPI.getProductDetail(Number(designId));
        detail.heroImage = detail.images.find((img: GalleryImage) => img.is_thumbnail === 1)?.image_url || '';

        const allProducts = await userAPI.getAllProducts();

        setGallery(detail);
        setRelated(allProducts.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [designId]);

  /* ================== SKELETON ================== */
  if (isLoading) {
    return (
      <>
        <ConsultationButton />

        {/* Hero Skeleton */}
        <div className="w-full h-[60vh] md:h-[80vh] bg-slate-200 animate-pulse" />

        {/* Title Skeleton */}
        <div className="py-12 text-center space-y-4">
          <div className="h-3 w-40 bg-slate-200 mx-auto animate-pulse" />
          <div className="h-10 w-96 bg-slate-200 mx-auto animate-pulse" />
        </div>

        {/* Gallery Skeleton */}
        <div className="px-4 md:px-8 lg:px-16 pb-24">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="mb-6 break-inside-avoid">
                <div className="w-full h-64 bg-slate-200 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ================== CONTENT ================== */
  if (!gallery) return null;

  return (
    <>
      <ConsultationButton />

      {/* Hero */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <img src={gallery.heroImage} alt={gallery.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {/* Title */}
      <section className="py-12 md:py-16 text-center">
        <Link
          to="/design"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          Design / {gallery.category_name}
        </Link>
        <h1 className="font-cormorant text-3xl md:text-5xl lg:text-6xl tracking-wide">{gallery.name}</h1>
      </section>

      {/* Gallery */}
      <section className="px-4 md:px-8 lg:px-16 pb-16 md:pb-24">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {gallery.images.map((img, index) => (
            <div key={img.id} className="break-inside-avoid mb-6 overflow-hidden group">
              <img
                src={img.image_url}
                alt={`${gallery.name} ${index + 1}`}
                className="w-full transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 border-t">
          <div className="container mx-auto px-4">
            <h2 className="font-cormorant text-2xl md:text-3xl text-center mb-12">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((post) => (
                <Link key={post.id} to={`/design/${post.id}`} className="group relative overflow-hidden aspect-[4/5]">
                  <img
                    src={post.thumbnail}
                    alt={post.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-cormorant text-xl">{post.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back */}
      <section className="py-8 text-center border-t">
        <Link
          to="/design"
          className="inline-flex items-center gap-2 text-sm uppercase text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>
      </section>
    </>
  );
};

export default DesignDetail;
