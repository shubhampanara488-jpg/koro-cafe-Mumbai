import { ArrowRight, Clock, ExternalLink, MapPin, MessageCircle, Navigation, Star } from 'lucide-react';
import { DietaryMark } from '../components/DietaryMark';
import { buildWhatsAppUrl } from '../components/Footer';
import { LocationMapPreview } from '../components/LocationMapPreview';
import { SafeImage } from '../components/SafeImage';
import type { PageRoute, SiteData } from '../types/cafe';

interface HomePageProps {
  data: SiteData;
  onNavigate: (route: PageRoute) => void;
}

const WHY_VISIT_ITEMS = [
  {
    index: '01.',
    title: 'Budget-Friendly Everyday Pricing',
    detail:
      'Specialty filter kaapi from ₹110, artisanal sandwiches from ₹220, and comforting pasta bowls under ₹300 — designed so great coffee fits daily routines.',
  },
  {
    index: '02.',
    title: 'Freshly Prepared Food',
    detail:
      'Sourdough toasts, stone-ground basil pesto, and morning croissants prepared fresh in small batches without frozen shortcuts.',
  },
  {
    index: '03.',
    title: 'Quality Indian Beverages',
    detail:
      'Single-estate Chikmagalur Arabica espresso, 18-hour cold brew, and house-steeped Bombay adrak elaichi chai crafted to order.',
  },
  {
    index: '04.',
    title: 'Comfortable, Welcoming Atmosphere',
    detail:
      'Warm daylight seating, dependable Wi-Fi, and accessible plug points built equally for solo focus, catch-ups with friends, and family meals.',
  },
];

export function HomePage({ data, onNavigate }: HomePageProps) {
  const { config, menu, gallery, testimonials } = data;
  const featuredMenu = menu.filter((item) => item.featured).slice(0, 6);
  const galleryPreview = gallery.slice(0, 4);
  const whatsappHref = buildWhatsAppUrl(
    config.whatsappNumber,
    `Hi ${config.name}, I'd like to enquire about visiting your café.`,
  );

  return (
    <div>
      {/* Section 2: Hero Banner */}
      <section className="relative min-h-[540px] lg:min-h-[620px] flex items-end overflow-hidden bg-[#3B241B]">
        <SafeImage
          src="/src/assets/images/hero_cafe_interior_1794969898583.jpg"
          alt={`${config.name} sunlit modern café interior in Mumbai`}
          loading="eager"
          fallbackTitle={config.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#24150F]/92 via-[#24150F]/55 to-[#24150F]/25"
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-8 py-14 sm:py-20">
          <div className="max-w-2xl space-y-5">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#D6BFA5]">
              {config.neighborhood} · {config.city}
            </p>
            <h1 className="font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight text-[#FFFFFF]">
              {config.tagline}
            </h1>
            <p className="text-base sm:text-lg text-[#F5EFE6]/90 leading-relaxed max-w-xl">
              {config.shortIntro}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('/menu')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#3B241B] bg-[#F5EFE6] rounded-lg hover:bg-[#FFFFFF] transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/reservations')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#FFFFFF] bg-[#3B241B]/80 border border-[#D6BFA5]/50 rounded-lg hover:bg-[#3B241B] transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                <span>Book a Table</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Introduction */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6">
            <div className="h-full min-h-[300px] rounded-2xl overflow-hidden bg-[#EDE4D7]">
              <SafeImage
                src="/src/assets/images/about_pour_over_1794969898682.jpg"
                alt="Barista pouring velvety microfoam latte art on a walnut wood counter"
                fallbackTitle="Specialty Coffee Craft"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              Our Concept
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B241B] leading-tight">
              A warm Mumbai neighbourhood café without the luxury markup.
            </h2>
            <p className="text-base text-[#5C4436] leading-relaxed">
              At {config.name}, we believe an inviting café table shouldn’t feel reserved for special
              occasions. Whether you are a student grabbing filter coffee between lectures, a
              remote professional settling in for the afternoon, or a family sharing weekend
              pasta, everything on our counter is priced honestly and made fresh to order.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Popular Menu */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 bg-[#EDE4D7]/55 border-y border-[#3B241B]/8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div className="space-y-2 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
                Kitchen &amp; Espresso Bar
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B241B]">
                Popular on the Menu
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/menu')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#3B241B] bg-[#FFFFFF] border border-[#3B241B]/15 rounded-lg hover:bg-[#F5EFE6] transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredMenu.map((item) => (
              <article
                key={item.id}
                className="group bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#3B241B]/10 flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#EDE4D7]">
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.name}
                    fallbackTitle={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-xs text-[#8A6B4F]">
                      <span>{item.category}</span>
                      <DietaryMark dietary={item.dietary} showLabel={false} />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#3B241B] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#5C4436] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#3B241B]/8 flex items-center justify-between">
                    <span className="text-base font-semibold text-[#3B241B] tabular-nums">
                      ₹{item.priceInr}
                    </span>
                    <span className="text-xs text-[#6B5344]">
                      {item.available ? 'Available today' : 'Currently unavailable'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Why Visit Us */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl space-y-2 mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              What Matters Here
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B241B]">
              Why Visit {config.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-t border-[#3B241B]/12 pt-10">
            {WHY_VISIT_ITEMS.map((item) => (
              <div key={item.index} className="space-y-2.5">
                <p className="font-serif text-lg font-semibold text-[#8A6B4F] tabular-nums">
                  {item.index}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-[#3B241B]">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Gallery Preview */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 bg-[#FFFFFF] border-y border-[#3B241B]/8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
                Inside the Space
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B241B]">
                Atmosphere, Coffee &amp; Plates
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/gallery')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
            >
              <span>View Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryPreview.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onNavigate('/gallery')}
                className={`group text-left rounded-2xl overflow-hidden bg-[#EDE4D7] border border-[#3B241B]/10 ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <SafeImage
                    src={photo.imageUrl}
                    alt={photo.alt}
                    fallbackTitle={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 bg-[#F5EFE6]">
                  <p className="text-xs text-[#8A6B4F]">{photo.category}</p>
                  <p className="font-serif text-base font-semibold text-[#3B241B] mt-0.5">
                    {photo.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Customer Reviews (Strictly Genuine — No Fake Reviews) */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
                Community &amp; Feedback
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B241B]">
                Customer Reviews
              </h2>
            </div>
            <a
              href={config.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#3B241B] bg-[#FFFFFF] border border-[#3B241B]/15 rounded-lg hover:bg-[#EDE4D7]/50 transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
            >
              <span>Google Reviews</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((review) => (
                <blockquote
                  key={review.id}
                  className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#3B241B]/10 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#8A6B4F]" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-[#8A6B4F] text-[#8A6B4F]" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-[#3B241B] leading-relaxed">
                      “{review.quote}”
                    </p>
                  </div>
                  <footer className="pt-4 border-t border-[#3B241B]/8 text-xs text-[#6B5344]">
                    <p className="font-semibold text-[#3B241B]">{review.author}</p>
                    <p className="mt-0.5">
                      {review.visitContext} · {review.source} · {review.dateLabel}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-10 border border-[#3B241B]/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <h3 className="font-serif text-2xl font-semibold text-[#3B241B]">
                  Verified guest reviews go live at launch
                </h3>
                <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed">
                  We never publish fabricated ratings or placeholder testimonials. Once our Mumbai
                  doors open, verified guest reviews from Google Business Profile will appear right
                  here—or our team can add real guest feedback directly in Café Setup.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <a
                  href={config.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors whitespace-nowrap"
                >
                  <span>Visit Google Reviews</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 8: Location and Timings */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 bg-[#EDE4D7]/55 border-t border-[#3B241B]/8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
                Plan Your Visit
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B241B]">
                Location &amp; Timings
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#5C4436]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8A6B4F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#3B241B]">{config.streetAddress}</p>
                  <p>
                    {config.city} {config.postalCode}
                  </p>
                  <p className="text-xs text-[#6B5344] mt-1">{config.landmark}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#8A6B4F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#3B241B]">{config.openingHours}</p>
                  <p>{config.weekendHours}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors whitespace-nowrap"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#3B241B] bg-[#FFFFFF] border border-[#3B241B]/15 rounded-lg hover:bg-[#F5EFE6] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <LocationMapPreview config={config} />
          </div>
        </div>
      </section>
    </div>
  );
}
