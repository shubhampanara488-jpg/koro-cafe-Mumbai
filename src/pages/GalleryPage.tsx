import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import type { GalleryItem } from '../types/cafe';

interface GalleryPageProps {
  gallery: GalleryItem[];
  cafeName: string;
}

type GalleryCategory = 'All' | GalleryItem['category'];

const GALLERY_FILTERS: GalleryCategory[] = [
  'All',
  'Interiors',
  'Seating',
  'Coffee & Beverages',
  'Food',
];

export function GalleryPage({ gallery, cafeName }: GalleryPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<GalleryCategory>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visiblePhotos = useMemo(() => {
    if (selectedFilter === 'All') return gallery;
    return gallery.filter((g) => g.category === selectedFilter);
  }, [gallery, selectedFilter]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % visiblePhotos.length,
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + visiblePhotos.length) % visiblePhotos.length,
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, visiblePhotos.length]);

  const activePhoto = activeIndex !== null ? visiblePhotos[activeIndex] : null;

  return (
    <div className="pb-20">
      <section className="py-12 sm:py-16 px-5 sm:px-8 border-b border-[#3B241B]/10">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              Visual Showcase
            </p>
            <h1 className="font-serif text-[clamp(2.25rem,4vw,3.25rem)] font-semibold text-[#3B241B]">
              Inside {cafeName}
            </h1>
            <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed">
              Explore our sunlit seating corners, fresh kitchen plates, and espresso counter. Click
              any photograph to view full size.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Gallery categories">
            {GALLERY_FILTERS.map((cat) => {
              const isActive = selectedFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setSelectedFilter(cat);
                    setActiveIndex(null);
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#3B241B] text-[#F5EFE6] border-[#3B241B]'
                      : 'bg-[#FFFFFF] text-[#5C4436] border-[#3B241B]/12 hover:border-[#3B241B]/30 hover:text-[#3B241B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visiblePhotos.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="group text-left bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#3B241B]/10 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#EDE4D7]">
                <SafeImage
                  src={item.imageUrl}
                  alt={item.alt}
                  fallbackTitle={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <p className="text-xs text-[#8A6B4F]">{item.category}</p>
                <h2 className="font-serif text-xl font-semibold text-[#3B241B]">{item.title}</h2>
                <p className="text-sm text-[#5C4436] leading-relaxed">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activePhoto && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 bg-[#1B100C]/92 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#F5EFE6] rounded-2xl overflow-hidden shadow-2xl border border-[#D6BFA5]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#3B241B]/10">
              <div>
                <p className="text-xs text-[#8A6B4F]">
                  {activePhoto.category} · {activeIndex + 1} / {visiblePhotos.length}
                </p>
                <h3 className="font-serif text-lg font-semibold text-[#3B241B]">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close lightbox"
                onClick={() => setActiveIndex(null)}
                className="w-10 h-10 rounded-lg inline-flex items-center justify-center text-[#3B241B] hover:bg-[#3B241B]/8 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-[#24150F] aspect-[16/10] sm:aspect-[16/9]">
              <SafeImage
                src={activePhoto.imageUrl}
                alt={activePhoto.alt}
                loading="eager"
                fallbackTitle={activePhoto.title}
                className="w-full h-full object-contain"
              />
              {visiblePhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setActiveIndex(
                        (activeIndex - 1 + visiblePhotos.length) % visiblePhotos.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#F5EFE6]/90 text-[#3B241B] flex items-center justify-center shadow hover:bg-[#FFFFFF] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() =>
                      setActiveIndex((activeIndex + 1) % visiblePhotos.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#F5EFE6]/90 text-[#3B241B] flex items-center justify-center shadow hover:bg-[#FFFFFF] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-4 bg-[#F5EFE6]">
              <p className="text-sm text-[#5C4436]">{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
