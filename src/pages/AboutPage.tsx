import { ArrowRight } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import type { CafeConfig, PageRoute } from '../types/cafe';

interface AboutPageProps {
  config: CafeConfig;
  onNavigate: (route: PageRoute) => void;
}

const AUDIENCE_SPACES = [
  {
    group: 'Students & Readers',
    note: 'Affordable espresso, filter coffee, and snack plates starting at ₹95, with calm corners to study.',
  },
  {
    group: 'Working Professionals',
    note: 'Reliable high-speed Wi-Fi, ergonomic table heights, and plug points at window seating.',
  },
  {
    group: 'Couples & Friends',
    note: 'Warm pendant lighting, unhurried music, and shareable platters built for long conversations.',
  },
  {
    group: 'Families',
    note: 'Freshly prepared non-spicy and comforting pasta, toast, and dessert options welcoming all ages.',
  },
];

export function AboutPage({ config, onNavigate }: AboutPageProps) {
  return (
    <div className="pb-20">
      {/* Editorial Header */}
      <section className="py-14 sm:py-20 px-5 sm:px-8 border-b border-[#3B241B]/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              About {config.name}
            </p>
            <h1 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-[#3B241B] leading-[1.1]">
              Crafted for Mumbai’s everyday coffee moments.
            </h1>
            <p className="text-base sm:text-lg text-[#5C4436] leading-relaxed max-w-2xl">
              {config.name} started with a simple observation: Mumbai loves café culture, yet most
              aesthetically thoughtful spaces price out regular neighbourhood visits. We wanted to
              build a café where warm architecture, sincere hospitality, and fair INR pricing live
              side by side.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#EDE4D7]">
              <SafeImage
                src="/src/assets/images/about_pour_over_1794969898682.jpg"
                alt="Barista pouring latte art at our Mumbai coffee bar"
                loading="eager"
                fallbackTitle="Our Coffee Counter"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story, Vision & Mission */}
      <section className="py-16 sm:py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#3B241B]/10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              Brand Story
            </p>
            <h2 className="font-serif text-2xl font-semibold text-[#3B241B]">
              Warmth Over Pretension
            </h2>
            <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed">
              Instead of intimidating coffee jargon or inflated fine-dining menus, we focus on
              comforting flavours—single-estate Indian roasts, crisp sourdough paninis, and fresh
              homestyle pastas.
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#3B241B]/10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              Our Vision
            </p>
            <h2 className="font-serif text-2xl font-semibold text-[#3B241B]">
              A Third Place for Everyone
            </h2>
            <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed">
              To become Mumbai’s most approachable neighbourhood café—where quality interiors,
              wholesome food, and accessible pricing welcome every generation.
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#3B241B]/10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              Our Mission
            </p>
            <h2 className="font-serif text-2xl font-semibold text-[#3B241B]">
              Honest Ingredients Daily
            </h2>
            <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed">
              Source sustainably grown Chikmagalur beans, bake pastries fresh each morning, and keep
              every visit warm, quick, and unpretentious.
            </p>
          </div>
        </div>
      </section>

      {/* Food Philosophy & Interior Atmosphere */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 bg-[#EDE4D7]/55 border-y border-[#3B241B]/8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] rounded-2xl overflow-hidden bg-[#D6BFA5]">
              <SafeImage
                src="/src/assets/images/gallery_seating_nook_1794969901138.jpg"
                alt="Rattan chairs and sunlit bistro table inside our café"
                fallbackTitle="Café Atmosphere"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
                Food &amp; Atmosphere Philosophy
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B241B]">
                Designed around how Mumbai gathers.
              </h2>
              <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed">
                Natural timber tables, soft linen seating, indoor greenery, and gentle daylight set
                an easy rhythm from 8:00 AM breakfast through late evening coffee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {AUDIENCE_SPACES.map((space) => (
                <div key={space.group} className="space-y-1">
                  <h3 className="font-serif text-lg font-semibold text-[#3B241B]">{space.group}</h3>
                  <p className="text-sm text-[#5C4436] leading-relaxed">{space.note}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/menu')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors whitespace-nowrap"
              >
                <span>Browse the Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/reservations')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#3B241B] bg-[#FFFFFF] border border-[#3B241B]/15 rounded-lg hover:bg-[#F5EFE6] transition-colors whitespace-nowrap"
              >
                <span>Book a Table</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
