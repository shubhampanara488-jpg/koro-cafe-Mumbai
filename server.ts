import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_SITE_DATA } from './src/data/defaultCafeData.ts';
import {
  ReservationStatus,
  type CafeConfig,
  type MenuItem,
  type ReservationEnquiry,
  type SiteData,
  type Testimonial,
} from './src/types/cafe.ts';

interface PersistedStore {
  site: SiteData;
  reservations: ReservationEnquiry[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'cafe-store.json');

function ensureStore(): PersistedStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial: PersistedStore = {
      site: DEFAULT_SITE_DATA,
      reservations: [],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<PersistedStore>;
    return {
      site: {
        config: { ...DEFAULT_SITE_DATA.config, ...(parsed.site?.config || {}) },
        menu: Array.isArray(parsed.site?.menu) ? parsed.site.menu : DEFAULT_SITE_DATA.menu,
        gallery: Array.isArray(parsed.site?.gallery) ? parsed.site.gallery : DEFAULT_SITE_DATA.gallery,
        testimonials: Array.isArray(parsed.site?.testimonials) ? parsed.site.testimonials : [],
      },
      reservations: Array.isArray(parsed.reservations) ? parsed.reservations : [],
    };
  } catch {
    const fallback: PersistedStore = {
      site: DEFAULT_SITE_DATA,
      reservations: [],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveStore(store: PersistedStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

// Simple in-memory rate limit map for reservation spam protection
const reservationRateLimit = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const recent = (reservationRateLimit.get(ip) || []).filter((ts) => now - ts < windowMs);
  if (recent.length >= 6) {
    reservationRateLimit.set(ip, recent);
    return true;
  }
  recent.push(now);
  reservationRateLimit.set(ip, recent);
  return false;
}

function normalizePhoneDigits(mobile: string): string {
  return mobile.replace(/\D/g, '');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Public site data (config, menu, gallery, verified testimonials)
  app.get('/api/site', (_req, res) => {
    const store = ensureStore();
    res.json(store.site);
  });

  // Update flexible pre-launch café branding & location config
  app.put('/api/config', (req, res) => {
    const store = ensureStore();
    const incoming = req.body as Partial<CafeConfig>;
    if (!incoming || typeof incoming !== 'object') {
      res.status(400).json({ error: 'Invalid configuration payload.' });
      return;
    }

    const updated: CafeConfig = {
      ...store.site.config,
      ...incoming,
      name: (incoming.name ?? store.site.config.name).trim() || store.site.config.name,
      tagline: (incoming.tagline ?? store.site.config.tagline).trim() || store.site.config.tagline,
    };

    store.site.config = updated;
    saveStore(store);
    res.json({ config: updated });
  });

  // Menu management (FR-12)
  app.post('/api/menu', (req, res) => {
    const store = ensureStore();
    const item = req.body as Partial<MenuItem>;
    if (!item.name?.trim() || !item.category || typeof item.priceInr !== 'number' || item.priceInr <= 0) {
      res.status(400).json({ error: 'Name, category, and a valid INR price are required.' });
      return;
    }

    const created: MenuItem = {
      id: `item-${Date.now()}`,
      name: item.name.trim(),
      description: (item.description || '').trim(),
      priceInr: Math.round(item.priceInr),
      category: item.category,
      dietary: item.dietary || DEFAULT_SITE_DATA.menu[0].dietary,
      available: item.available ?? true,
      featured: item.featured ?? false,
      imageUrl: item.imageUrl?.trim() || undefined,
    };

    store.site.menu.unshift(created);
    saveStore(store);
    res.status(201).json({ item: created, menu: store.site.menu });
  });

  app.put('/api/menu/:id', (req, res) => {
    const store = ensureStore();
    const { id } = req.params;
    const idx = store.site.menu.findIndex((m) => m.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Menu item not found.' });
      return;
    }
    const patch = req.body as Partial<MenuItem>;
    const updated: MenuItem = {
      ...store.site.menu[idx],
      ...patch,
      id,
      priceInr:
        typeof patch.priceInr === 'number' && patch.priceInr > 0
          ? Math.round(patch.priceInr)
          : store.site.menu[idx].priceInr,
    };
    store.site.menu[idx] = updated;
    saveStore(store);
    res.json({ item: updated, menu: store.site.menu });
  });

  app.delete('/api/menu/:id', (req, res) => {
    const store = ensureStore();
    const { id } = req.params;
    const before = store.site.menu.length;
    store.site.menu = store.site.menu.filter((m) => m.id !== id);
    if (store.site.menu.length === before) {
      res.status(404).json({ error: 'Menu item not found.' });
      return;
    }
    saveStore(store);
    res.json({ menu: store.site.menu });
  });

  // Testimonials management (so only real verified guest reviews are added)
  app.post('/api/testimonials', (req, res) => {
    const store = ensureStore();
    const body = req.body as Partial<Testimonial>;
    if (!body.author?.trim() || !body.quote?.trim()) {
      res.status(400).json({ error: 'Author name and review quote are required.' });
      return;
    }
    const created: Testimonial = {
      id: `rev-${Date.now()}`,
      author: body.author.trim(),
      visitContext: (body.visitContext || 'Café Guest').trim(),
      quote: body.quote.trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      source: (body.source || 'Google Reviews').trim(),
      dateLabel: (body.dateLabel || new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })).trim(),
    };
    store.site.testimonials.unshift(created);
    saveStore(store);
    res.status(201).json({ testimonial: created, testimonials: store.site.testimonials });
  });

  app.delete('/api/testimonials/:id', (req, res) => {
    const store = ensureStore();
    store.site.testimonials = store.site.testimonials.filter((t) => t.id !== req.params.id);
    saveStore(store);
    res.json({ testimonials: store.site.testimonials });
  });

  // Table reservation enquiry submission & team management (FR-07)
  app.get('/api/reservations', (_req, res) => {
    const store = ensureStore();
    res.json({ reservations: store.reservations });
  });

  app.post('/api/reservations', (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        error: 'Too many reservation requests in a short time. Please wait a minute or contact us on WhatsApp.',
      });
      return;
    }

    const body = req.body as {
      fullName?: string;
      mobile?: string;
      date?: string;
      preferredTime?: string;
      guests?: number;
      specialRequests?: string;
      website?: string; // honeypot
    };

    // Honeypot spam check
    if (body.website && body.website.trim().length > 0) {
      res.status(400).json({ error: 'Unable to process submission.' });
      return;
    }

    const fullName = (body.fullName || '').trim();
    const mobile = (body.mobile || '').trim();
    const date = (body.date || '').trim();
    const preferredTime = (body.preferredTime || '').trim();
    const guests = Number(body.guests);
    const specialRequests = (body.specialRequests || '').trim().slice(0, 400);

    if (fullName.length < 2) {
      res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
      return;
    }

    const digits = normalizePhoneDigits(mobile);
    if (digits.length < 10 || digits.length > 13) {
      res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'Please choose a valid reservation date.' });
      return;
    }

    // Prevent past dates using IST / local date string comparison
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    if (date < todayStr) {
      res.status(400).json({ error: 'Past dates cannot be selected. Please pick today or an upcoming date.' });
      return;
    }

    if (!preferredTime) {
      res.status(400).json({ error: 'Please select a preferred time slot.' });
      return;
    }

    if (!Number.isFinite(guests) || guests < 1 || guests > 20) {
      res.status(400).json({ error: 'Number of guests must be between 1 and 20.' });
      return;
    }

    const store = ensureStore();
    const refNumber = Math.floor(1000 + Math.random() * 9000);
    const created: ReservationEnquiry = {
      id: `res-${Date.now()}`,
      referenceCode: `KC-${refNumber}`,
      fullName,
      mobile,
      date,
      preferredTime,
      guests,
      specialRequests,
      status: ReservationStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    store.reservations.unshift(created);
    saveStore(store);

    res.status(201).json({
      enquiry: created,
      message:
        'Your reservation enquiry has been received. Please note that submitting this request does not guarantee a confirmed table until our café team confirms availability.',
    });
  });

  app.patch('/api/reservations/:id', (req, res) => {
    const store = ensureStore();
    const { id } = req.params;
    const { status } = req.body as { status?: ReservationStatus };
    const idx = store.reservations.findIndex((r) => r.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Reservation enquiry not found.' });
      return;
    }
    if (!status || !Object.values(ReservationStatus).includes(status)) {
      res.status(400).json({ error: 'Invalid reservation status.' });
      return;
    }
    store.reservations[idx].status = status;
    saveStore(store);
    res.json({ enquiry: store.reservations[idx], reservations: store.reservations });
  });

  // Technical SEO: dynamic sitemap.xml & robots.txt (PRD Section 10)
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /manage\nSitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml\n`,
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const routes = ['/', '/about', '/menu', '/gallery', '/reservations', '/contact'];
    const urls = routes
      .map(
        (route) =>
          `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
      )
      .join('\n');

    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
  });

  // Vite middleware in dev, static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
