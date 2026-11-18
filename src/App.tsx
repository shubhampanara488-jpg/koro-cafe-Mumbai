import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { DEFAULT_SITE_DATA } from './data/defaultCafeData';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { ManagePage } from './pages/ManagePage';
import { MenuPage } from './pages/MenuPage';
import { ReservationsPage } from './pages/ReservationsPage';
import type { PageRoute, SiteData } from './types/cafe';

const VALID_ROUTES: PageRoute[] = [
  '/',
  '/about',
  '/menu',
  '/gallery',
  '/reservations',
  '/contact',
  '/manage',
];

function parseRoute(pathname: string): PageRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return VALID_ROUTES.includes(normalized as PageRoute)
    ? (normalized as PageRoute)
    : '/';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() =>
    parseRoute(window.location.pathname),
  );
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA);

  useEffect(() => {
    fetch('/api/site')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload && payload.config && Array.isArray(payload.menu)) {
          setSiteData(payload);
        }
      })
      .catch(() => {
        // Keep seeded default data if backend is offline during static preview
      });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Update per-page SEO title & meta description
  useEffect(() => {
    const name = siteData.config.name;
    const seoMap: Record<PageRoute, { title: string; desc: string }> = {
      '/': {
        title: `${name} — Modern Aesthetic Café in Mumbai`,
        desc: `${siteData.config.tagline} Discover ${name} in ${siteData.config.neighborhood} for specialty coffee, fresh food, and budget-friendly prices.`,
      },
      '/about': {
        title: `About Us — ${name} Mumbai`,
        desc: `Read the story, vision, and coffee philosophy behind ${name}, a welcoming neighbourhood café in Mumbai.`,
      },
      '/menu': {
        title: `Digital Menu (INR) — ${name} Mumbai`,
        desc: `Browse hot coffee, cold brew, chai, breakfast plates, sandwiches, pastas, and desserts at ${name}.`,
      },
      '/gallery': {
        title: `Gallery — ${name} Mumbai`,
        desc: `Explore interior spaces, seating nooks, specialty coffee, and fresh food at ${name}.`,
      },
      '/reservations': {
        title: `Book a Table — ${name} Mumbai`,
        desc: `Submit a table reservation enquiry for ${name} in Mumbai.`,
      },
      '/contact': {
        title: `Contact & Directions — ${name} Mumbai`,
        desc: `Find ${name}'s address, opening hours, WhatsApp contact, and Google Maps directions in Mumbai.`,
      },
      '/manage': {
        title: `Café Setup & Enquiries — ${name}`,
        desc: `Manage café branding, Mumbai location, menu items, and reservation enquiries.`,
      },
    };

    const meta = seoMap[currentRoute];
    document.title = meta.title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', meta.desc);
    }
  }, [currentRoute, siteData.config]);

  const navigate = (route: PageRoute) => {
    if (route !== currentRoute) {
      window.history.pushState({}, '', route);
      setCurrentRoute(route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFE6] text-[#3B241B]">
      <Navbar
        cafeName={siteData.config.name}
        currentRoute={currentRoute}
        onNavigate={navigate}
      />

      <main className="flex-1">
        {currentRoute === '/' && <HomePage data={siteData} onNavigate={navigate} />}
        {currentRoute === '/about' && (
          <AboutPage config={siteData.config} onNavigate={navigate} />
        )}
        {currentRoute === '/menu' && (
          <MenuPage
            menu={siteData.menu}
            cafeName={siteData.config.name}
            onNavigate={navigate}
          />
        )}
        {currentRoute === '/gallery' && (
          <GalleryPage gallery={siteData.gallery} cafeName={siteData.config.name} />
        )}
        {currentRoute === '/reservations' && (
          <ReservationsPage config={siteData.config} />
        )}
        {currentRoute === '/contact' && <ContactPage config={siteData.config} />}
        {currentRoute === '/manage' && (
          <ManagePage data={siteData} onSiteUpdated={setSiteData} />
        )}
      </main>

      <Footer config={siteData.config} onNavigate={navigate} />
      <Analytics />
    </div>
  );
}
