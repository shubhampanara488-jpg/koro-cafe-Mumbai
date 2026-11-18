import { Clock, Instagram, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { buildWhatsAppUrl } from '../components/Footer';
import { LocationMapPreview } from '../components/LocationMapPreview';
import type { CafeConfig } from '../types/cafe';

interface ContactPageProps {
  config: CafeConfig;
}

export function ContactPage({ config }: ContactPageProps) {
  const whatsappHref = buildWhatsAppUrl(
    config.whatsappNumber,
    `Hi ${config.name} team, I have a quick question about visiting the café.`,
  );

  return (
    <div className="pb-20">
      <section className="py-12 sm:py-16 px-5 sm:px-8 border-b border-[#3B241B]/10">
        <div className="max-w-6xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
            Reach Out &amp; Visit
          </p>
          <h1 className="font-serif text-[clamp(2.25rem,4vw,3.25rem)] font-semibold text-[#3B241B]">
            Contact {config.name}
          </h1>
          <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed max-w-2xl">
            Have a question about our daily menu, group seating, or directions? Message us on
            WhatsApp, call directly, or drop by our Mumbai café.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#3B241B]/10 space-y-5">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#8A6B4F] shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#3B241B]">Address</h2>
                  <p className="text-sm text-[#5C4436] mt-1">
                    {config.streetAddress}
                    <br />
                    {config.city} {config.postalCode}
                  </p>
                  <p className="text-xs text-[#8A6B4F] mt-1">{config.landmark}</p>
                </div>
              </div>

              <div className="border-t border-[#3B241B]/8 pt-5 flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#8A6B4F] shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#3B241B]">Opening Hours</h2>
                  <p className="text-sm text-[#5C4436] mt-1">{config.openingHours}</p>
                  <p className="text-sm text-[#5C4436]">{config.weekendHours}</p>
                </div>
              </div>

              <div className="border-t border-[#3B241B]/8 pt-5 flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#8A6B4F] shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#3B241B]">Phone</h2>
                  <a
                    href={`tel:${config.phone.replace(/\s+/g, '')}`}
                    className="text-sm text-[#5C4436] hover:text-[#3B241B] tabular-nums mt-1 inline-block"
                  >
                    {config.phone}
                  </a>
                </div>
              </div>

              {config.email && (
                <div className="border-t border-[#3B241B]/8 pt-5 flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#8A6B4F] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-[#3B241B]">Email</h2>
                    <a
                      href={`mailto:${config.email}`}
                      className="text-sm text-[#5C4436] hover:text-[#3B241B] mt-1 inline-block"
                    >
                      {config.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="border-t border-[#3B241B]/8 pt-5 flex items-start gap-3.5">
                <Instagram className="w-5 h-5 text-[#8A6B4F] shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#3B241B]">Instagram</h2>
                  <a
                    href={config.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#5C4436] hover:text-[#3B241B] mt-1 inline-block"
                  >
                    {config.instagramHandle}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#3B241B] bg-[#FFFFFF] border border-[#3B241B]/15 rounded-lg hover:bg-[#EDE4D7]/60 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Map Integration */}
          <div className="lg:col-span-7 space-y-4">
            <LocationMapPreview config={config} />
          </div>
        </div>
      </section>
    </div>
  );
}
