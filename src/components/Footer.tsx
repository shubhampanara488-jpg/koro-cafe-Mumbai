import { Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { CafeConfig, PageRoute } from '../types/cafe';

interface FooterProps {
  config: CafeConfig;
  onNavigate: (route: PageRoute) => void;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function Footer({ config, onNavigate }: FooterProps) {
  const whatsappHref = buildWhatsAppUrl(
    config.whatsappNumber,
    `Hi ${config.name} team, I would like to know more about visiting your Mumbai café.`,
  );

  const quickLinks: { label: string; route: PageRoute }[] = [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about' },
    { label: 'Digital Menu', route: '/menu' },
    { label: 'Gallery', route: '/gallery' },
    { label: 'Reservations', route: '/reservations' },
    { label: 'Contact Us', route: '/contact' },
  ];

  return (
    <>
      <footer className="bg-[#3B241B] text-[#F5EFE6] border-t border-[#3B241B]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F5EFE6]/15">
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-4">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/');
                }}
                className="font-serif text-2xl font-semibold tracking-tight text-[#FFFFFF] inline-block"
              >
                {config.name}
              </a>
              <p className="text-sm text-[#D6BFA5] leading-relaxed max-w-xs">
                {config.tagline}
              </p>
              <p className="text-xs text-[#F5EFE6]/75 leading-relaxed max-w-xs">
                {config.shortIntro}
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#D6BFA5]">
                Explore
              </h3>
              <ul className="space-y-2.5 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.route}>
                    <a
                      href={link.route}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.route);
                      }}
                      className="text-[#F5EFE6]/85 hover:text-[#FFFFFF] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visit & Hours */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#D6BFA5]">
                Visit Us
              </h3>
              <div className="space-y-2 text-sm text-[#F5EFE6]/85">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D6BFA5] shrink-0 mt-0.5" />
                  <span>
                    {config.streetAddress}, {config.city} {config.postalCode}
                  </span>
                </p>
                <p className="text-xs text-[#D6BFA5]/90 pl-6">{config.openingHours}</p>
                <p className="text-xs text-[#D6BFA5]/90 pl-6">{config.weekendHours}</p>
              </div>
            </div>

            {/* Connect */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#D6BFA5]">
                Connect
              </h3>
              <div className="space-y-2.5 text-sm">
                <a
                  href={`tel:${config.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 text-[#F5EFE6]/85 hover:text-[#FFFFFF] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D6BFA5] shrink-0" />
                  <span className="tabular-nums">{config.phone}</span>
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#F5EFE6]/85 hover:text-[#FFFFFF] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#D6BFA5] shrink-0" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#F5EFE6]/85 hover:text-[#FFFFFF] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#D6BFA5] shrink-0" />
                  <span>{config.instagramHandle}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#F5EFE6]/65">
            <p>
              &copy; {new Date().getFullYear()} {config.name}, Mumbai. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <a
                href="/manage"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/manage');
                }}
                className="text-[#D6BFA5] hover:text-[#FFFFFF] underline underline-offset-4 transition-colors"
              >
                Café Team &amp; Pre-Launch Setup
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky WhatsApp Contact Option (<= 44px height, <15% viewport) */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="md:hidden fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 h-11 px-4 rounded-full bg-[#3B241B] text-[#F5EFE6] border border-[#D6BFA5]/40 shadow-lg text-xs font-semibold hover:bg-[#4F3226] transition-colors"
      >
        <MessageCircle className="w-4 h-4 text-[#D6BFA5]" />
        <span>WhatsApp</span>
      </a>
    </>
  );
}
