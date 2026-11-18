import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { PageRoute } from '../types/cafe';

interface NavbarProps {
  cafeName: string;
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

const NAV_LINKS: { label: string; route: PageRoute }[] = [
  { label: 'Home', route: '/' },
  { label: 'About', route: '/about' },
  { label: 'Menu', route: '/menu' },
  { label: 'Gallery', route: '/gallery' },
  { label: 'Contact', route: '/contact' },
];

export function Navbar({ cafeName, currentRoute, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (route: PageRoute) => {
    setMobileOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F5EFE6]/95 backdrop-blur-sm border-b border-[#3B241B]/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#3B241B] whitespace-nowrap shrink-0"
        >
          {cafeName}
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <a
                key={link.route}
                href={link.route}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.route);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#3B241B]'
                    : 'text-[#6B5344] hover:text-[#3B241B]'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#3B241B] transition-transform duration-150 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single primary CTA + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('/reservations')}
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Book a Table
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#3B241B] hover:bg-[#3B241B]/5 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#3B241B]/10 bg-[#F5EFE6] px-5 py-5 space-y-1">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <a
                  key={link.route}
                  href={link.route}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.route);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EDE4D7] text-[#3B241B]'
                      : 'text-[#5C4436] hover:bg-[#EDE4D7]/60 hover:text-[#3B241B]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="pt-3">
            <button
              type="button"
              onClick={() => handleLinkClick('/reservations')}
              className="w-full py-3 px-5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors"
            >
              Book a Table
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
