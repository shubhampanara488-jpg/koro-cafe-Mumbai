// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

// src/types/cafe.ts
var ReservationStatus = /* @__PURE__ */ ((ReservationStatus2) => {
  ReservationStatus2["PENDING"] = "Pending Review";
  ReservationStatus2["CONFIRMED"] = "Confirmed";
  ReservationStatus2["DECLINED"] = "Unavailable";
  return ReservationStatus2;
})(ReservationStatus || {});

// src/data/defaultCafeData.ts
var MENU_CATEGORIES = [
  "Hot Coffee" /* HOT_COFFEE */,
  "Cold Coffee" /* COLD_COFFEE */,
  "Tea and Other Beverages" /* TEA_BEVERAGES */,
  "Breakfast" /* BREAKFAST */,
  "Sandwiches and Snacks" /* SANDWICHES_SNACKS */,
  "Pasta and Main Course" /* PASTA_MAINS */,
  "Desserts" /* DESSERTS */
];
var DEFAULT_SITE_DATA = {
  config: {
    name: "Kora Caf\xE9",
    tagline: "Good Coffee. Great Food. Better Moments.",
    shortIntro: "A sunlit neighborhood caf\xE9 in Mumbai crafted for unhurried mornings, comforting plates, and honest, everyday pricing.",
    neighborhood: "Bandra West (Draft Location)",
    streetAddress: "14th Road, Off Linking Road, Bandra West",
    city: "Mumbai, Maharashtra",
    postalCode: "400050",
    landmark: "Near National College & Pali Hill Corner",
    openingHours: "Mon \u2013 Fri \xB7 8:00 AM \u2013 10:30 PM",
    weekendHours: "Sat \u2013 Sun \xB7 8:00 AM \u2013 11:30 PM",
    phone: "+91 98200 12345",
    whatsappNumber: "919820012345",
    email: "hello@koracafemumbai.in",
    instagramHandle: "@koracafe.mumbai",
    instagramUrl: "https://instagram.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=14th+Road+Bandra+West+Mumbai+400050",
    googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=cafes+Bandra+West+Mumbai",
    isPreLaunchLocationDraft: true
  },
  menu: [
    // Hot Coffee
    {
      id: "hc-1",
      name: "House Classic Cappuccino",
      description: "Double-shot Chikmagalur Arabica espresso topped with velvety steamed milk microfoam.",
      priceInr: 150,
      category: "Hot Coffee" /* HOT_COFFEE */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: true,
      imageUrl: "/src/assets/images/about_pour_over_1794969898682.jpg"
    },
    {
      id: "hc-2",
      name: "South Indian Filter Kaapi",
      description: "Slow-dripped peaberry decoction frothed with farm milk and light jaggery sweetness.",
      priceInr: 110,
      category: "Hot Coffee" /* HOT_COFFEE */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    {
      id: "hc-3",
      name: "Cinnamon Hazelnut Latte",
      description: "Smooth double espresso steamed with roasted hazelnut syrup and a warm Ceylon cinnamon finish.",
      priceInr: 180,
      category: "Hot Coffee" /* HOT_COFFEE */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    {
      id: "hc-4",
      name: "Manual V60 Pour Over",
      description: "Single-estate Bababudangiri light roast brewed clean to highlight cocoa and citrus notes.",
      priceInr: 160,
      category: "Hot Coffee" /* HOT_COFFEE */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    // Cold Coffee
    {
      id: "cc-1",
      name: "Signature Iced Cold Brew Latte",
      description: "18-hour steeped estate cold brew layered over ice with silky milk and raw cane syrup.",
      priceInr: 185,
      category: "Cold Coffee" /* COLD_COFFEE */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: true,
      imageUrl: "/src/assets/images/menu_iced_coffee_1794969898616.jpg"
    },
    {
      id: "cc-2",
      name: "Mumbai Classic Frappe",
      description: "Chilled espresso blended thick with Belgian cocoa, cream, and roasted coffee nibs.",
      priceInr: 195,
      category: "Cold Coffee" /* COLD_COFFEE */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    {
      id: "cc-3",
      name: "Espresso Orange Tonic",
      description: "Crisp chilled tonic water, fresh Nagpur orange zest, and a double shot of espresso.",
      priceInr: 190,
      category: "Cold Coffee" /* COLD_COFFEE */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    // Tea and Other Beverages
    {
      id: "tb-1",
      name: "Bombay Adrak Elaichi Chai",
      description: "Assam CTC brewed slow with crushed ginger, green cardamom, and whole milk.",
      priceInr: 95,
      category: "Tea and Other Beverages" /* TEA_BEVERAGES */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    {
      id: "tb-2",
      name: "Peach & Mint Iced Tea",
      description: "House-brewed Nilgiri black tea shaken cold with ripe peach pur\xE9e and fresh garden mint.",
      priceInr: 140,
      category: "Tea and Other Beverages" /* TEA_BEVERAGES */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    {
      id: "tb-3",
      name: "Spiced Dark Hot Chocolate",
      description: "55% dark couverture melted into steamed milk with a pinch of nutmeg and sea salt.",
      priceInr: 175,
      category: "Tea and Other Beverages" /* TEA_BEVERAGES */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    // Breakfast
    {
      id: "br-1",
      name: "Smashed Avocado & Poached Egg Toast",
      description: "Country sourdough layered with lime-herbed avocado, soft poached egg, toasted sesame, and chilli flakes.",
      priceInr: 260,
      category: "Breakfast" /* BREAKFAST */,
      dietary: "Contains Egg" /* EGG */,
      available: true,
      featured: true,
      imageUrl: "/src/assets/images/menu_avocado_toast_1794969899609.jpg"
    },
    {
      id: "br-2",
      name: "Bun Maska & Berry Jam Platter",
      description: "Warm toasted Irani-style milk bun generously whipped with cultured butter and house strawberry compote.",
      priceInr: 120,
      category: "Breakfast" /* BREAKFAST */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    {
      id: "br-3",
      name: "Masala Omelette & Herbed Hash",
      description: "Three-egg fluffy omelette with onions, coriander, and green chillies, served with sourdough toast.",
      priceInr: 195,
      category: "Breakfast" /* BREAKFAST */,
      dietary: "Contains Egg" /* EGG */,
      available: true,
      featured: false
    },
    // Sandwiches and Snacks
    {
      id: "ss-1",
      name: "Bombay Pesto & Mozzarella Panini",
      description: "Crisp grilled sourdough stuffed with fresh basil-coriander chutney pesto, mozzarella, and vine tomato.",
      priceInr: 220,
      category: "Sandwiches and Snacks" /* SANDWICHES_SNACKS */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: true,
      imageUrl: "/src/assets/images/gallery_breakfast_spread_1794969900705.jpg"
    },
    {
      id: "ss-2",
      name: "Smoked Chicken & Garlic Aioli Club",
      description: "Pulled herb-roasted chicken, caramelised onions, crunchy lettuce, and house garlic mayo on multigrain.",
      priceInr: 255,
      category: "Sandwiches and Snacks" /* SANDWICHES_SNACKS */,
      dietary: "Non-Veg" /* NON_VEG */,
      available: true,
      featured: false
    },
    {
      id: "ss-3",
      name: "Truffle & Rosemary Peri Fries",
      description: "Hand-cut crispy skin-on fries tossed with roasted garlic salt and warm parmesan dip.",
      priceInr: 165,
      category: "Sandwiches and Snacks" /* SANDWICHES_SNACKS */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    // Pasta and Main Course
    {
      id: "pm-1",
      name: "Creamy Basil Pesto Penne",
      description: "Al dente penne tossed in stone-ground basil pesto, blistered cherry tomatoes, toasted pine nuts, and parmesan.",
      priceInr: 295,
      category: "Pasta and Main Course" /* PASTA_MAINS */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: true,
      imageUrl: "/src/assets/images/menu_pasta_pesto_1794969900758.jpg"
    },
    {
      id: "pm-2",
      name: "Slow-Simmered Arrabbiata Spaghetti",
      description: "San Marzano style tomato sauce with roasted garlic, basil oil, olives, and toasted garlic bread.",
      priceInr: 270,
      category: "Pasta and Main Course" /* PASTA_MAINS */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    {
      id: "pm-3",
      name: "Herb Grilled Chicken Rice Bowl",
      description: "Paprika-marinated chicken breast over buttered garlic rice, saut\xE9ed greens, and lemon pepper jus.",
      priceInr: 330,
      category: "Pasta and Main Course" /* PASTA_MAINS */,
      dietary: "Non-Veg" /* NON_VEG */,
      available: true,
      featured: false
    },
    // Desserts
    {
      id: "ds-1",
      name: "Espresso Tiramisu",
      description: "Savoiardi biscuits soaked in our house espresso, layered with whipped mascarpone and dark cocoa dust.",
      priceInr: 230,
      category: "Desserts" /* DESSERTS */,
      dietary: "Contains Egg" /* EGG */,
      available: true,
      featured: true,
      imageUrl: "/src/assets/images/menu_tiramisu_dessert_1794969900110.jpg"
    },
    {
      id: "ds-2",
      name: "French Butter Croissant",
      description: "Flaky 27-layer laminated pastry baked golden every morning, served warm with sea-salt butter.",
      priceInr: 135,
      category: "Desserts" /* DESSERTS */,
      dietary: "Veg" /* VEG */,
      available: true,
      featured: false
    },
    {
      id: "ds-3",
      name: "Warm Belgian Walnut Brownie",
      description: "Fudgy dark chocolate brownie studded with roasted Kashmir walnuts; add vanilla gelato for \u20B950.",
      priceInr: 160,
      category: "Desserts" /* DESSERTS */,
      dietary: "Veg" /* VEG */,
      available: false,
      featured: false
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Sunlit Main Dining Room",
      category: "Interiors",
      imageUrl: "/src/assets/images/hero_cafe_interior_1794969898583.jpg",
      alt: "Sunlit Mumbai caf\xE9 interior with arched windows, indoor plants, and warm wood dining tables",
      caption: "Morning light through arched windows \u2014 calm seating for work, study, and unhurried conversations."
    },
    {
      id: "gal-2",
      title: "Rattan Reading & Work Nook",
      category: "Seating",
      imageUrl: "/src/assets/images/gallery_seating_nook_1794969901138.jpg",
      alt: "Cozy corner seating with woven rattan armchairs and marble bistro table beside sunlit window",
      caption: "Comfortable rattan corners equipped with power outlets and natural daylight."
    },
    {
      id: "gal-3",
      title: "Morning Pour & Latte Craft",
      category: "Coffee & Beverages",
      imageUrl: "/src/assets/images/about_pour_over_1794969898682.jpg",
      alt: "Barista pouring steamed microfoam latte art into a handmade stoneware cup on walnut counter",
      caption: "Single-estate Indian Arabica dialled in fresh every morning at the espresso bar."
    },
    {
      id: "gal-4",
      title: "Iced Cold Brew Swirl",
      category: "Coffee & Beverages",
      imageUrl: "/src/assets/images/menu_iced_coffee_1794969898616.jpg",
      alt: "Iced cold brew coffee in fluted glass with cream swirl on travertine coaster",
      caption: "18-hour cold brew built for warm Mumbai afternoons."
    },
    {
      id: "gal-5",
      title: "All-Day Table Spread",
      category: "Food",
      imageUrl: "/src/assets/images/gallery_breakfast_spread_1794969900705.jpg",
      alt: "Overhead spread of tulip cappuccino, spiced chai, grilled panini sandwich, and butter croissants",
      caption: "Chai, cappuccino, flaky croissants, and grilled paninis meant to be shared."
    },
    {
      id: "gal-6",
      title: "Sourdough Avocado Toast",
      category: "Food",
      imageUrl: "/src/assets/images/menu_avocado_toast_1794969899609.jpg",
      alt: "Crispy sourdough toast topped with smashed avocado, poached egg, and toasted sesame seeds",
      caption: "Fresh kitchen breakfast plates prepared to order from 8:00 AM."
    },
    {
      id: "gal-7",
      title: "Stone-Ground Basil Pesto Penne",
      category: "Food",
      imageUrl: "/src/assets/images/menu_pasta_pesto_1794969900758.jpg",
      alt: "Bowl of creamy basil pesto penne pasta with roasted cherry tomatoes and pine nuts",
      caption: "Comforting lunch & dinner bowls priced fairly for everyday visits."
    },
    {
      id: "gal-8",
      title: "Espresso Tiramisu & Croissant",
      category: "Food",
      imageUrl: "/src/assets/images/menu_tiramisu_dessert_1794969900110.jpg",
      alt: "Espresso-soaked tiramisu dusted with cocoa alongside a freshly baked butter croissant",
      caption: "Fresh bakes and house-made desserts every afternoon."
    }
  ],
  testimonials: []
};

// server.ts
var DATA_DIR = path.resolve(process.cwd(), "data");
var STORE_PATH = path.join(DATA_DIR, "cafe-store.json");
function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial = {
      site: DEFAULT_SITE_DATA,
      reservations: []
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      site: {
        config: { ...DEFAULT_SITE_DATA.config, ...parsed.site?.config || {} },
        menu: Array.isArray(parsed.site?.menu) ? parsed.site.menu : DEFAULT_SITE_DATA.menu,
        gallery: Array.isArray(parsed.site?.gallery) ? parsed.site.gallery : DEFAULT_SITE_DATA.gallery,
        testimonials: Array.isArray(parsed.site?.testimonials) ? parsed.site.testimonials : []
      },
      reservations: Array.isArray(parsed.reservations) ? parsed.reservations : []
    };
  } catch {
    const fallback = {
      site: DEFAULT_SITE_DATA,
      reservations: []
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}
function saveStore(store) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}
var reservationRateLimit = /* @__PURE__ */ new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 6e4;
  const recent = (reservationRateLimit.get(ip) || []).filter((ts) => now - ts < windowMs);
  if (recent.length >= 6) {
    reservationRateLimit.set(ip, recent);
    return true;
  }
  recent.push(now);
  reservationRateLimit.set(ip, recent);
  return false;
}
function normalizePhoneDigits(mobile) {
  return mobile.replace(/\D/g, "");
}
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.get("/api/site", (_req, res) => {
    const store = ensureStore();
    res.json(store.site);
  });
  app.put("/api/config", (req, res) => {
    const store = ensureStore();
    const incoming = req.body;
    if (!incoming || typeof incoming !== "object") {
      res.status(400).json({ error: "Invalid configuration payload." });
      return;
    }
    const updated = {
      ...store.site.config,
      ...incoming,
      name: (incoming.name ?? store.site.config.name).trim() || store.site.config.name,
      tagline: (incoming.tagline ?? store.site.config.tagline).trim() || store.site.config.tagline
    };
    store.site.config = updated;
    saveStore(store);
    res.json({ config: updated });
  });
  app.post("/api/menu", (req, res) => {
    const store = ensureStore();
    const item = req.body;
    if (!item.name?.trim() || !item.category || typeof item.priceInr !== "number" || item.priceInr <= 0) {
      res.status(400).json({ error: "Name, category, and a valid INR price are required." });
      return;
    }
    const created = {
      id: `item-${Date.now()}`,
      name: item.name.trim(),
      description: (item.description || "").trim(),
      priceInr: Math.round(item.priceInr),
      category: item.category,
      dietary: item.dietary || DEFAULT_SITE_DATA.menu[0].dietary,
      available: item.available ?? true,
      featured: item.featured ?? false,
      imageUrl: item.imageUrl?.trim() || void 0
    };
    store.site.menu.unshift(created);
    saveStore(store);
    res.status(201).json({ item: created, menu: store.site.menu });
  });
  app.put("/api/menu/:id", (req, res) => {
    const store = ensureStore();
    const { id } = req.params;
    const idx = store.site.menu.findIndex((m) => m.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Menu item not found." });
      return;
    }
    const patch = req.body;
    const updated = {
      ...store.site.menu[idx],
      ...patch,
      id,
      priceInr: typeof patch.priceInr === "number" && patch.priceInr > 0 ? Math.round(patch.priceInr) : store.site.menu[idx].priceInr
    };
    store.site.menu[idx] = updated;
    saveStore(store);
    res.json({ item: updated, menu: store.site.menu });
  });
  app.delete("/api/menu/:id", (req, res) => {
    const store = ensureStore();
    const { id } = req.params;
    const before = store.site.menu.length;
    store.site.menu = store.site.menu.filter((m) => m.id !== id);
    if (store.site.menu.length === before) {
      res.status(404).json({ error: "Menu item not found." });
      return;
    }
    saveStore(store);
    res.json({ menu: store.site.menu });
  });
  app.post("/api/testimonials", (req, res) => {
    const store = ensureStore();
    const body = req.body;
    if (!body.author?.trim() || !body.quote?.trim()) {
      res.status(400).json({ error: "Author name and review quote are required." });
      return;
    }
    const created = {
      id: `rev-${Date.now()}`,
      author: body.author.trim(),
      visitContext: (body.visitContext || "Caf\xE9 Guest").trim(),
      quote: body.quote.trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      source: (body.source || "Google Reviews").trim(),
      dateLabel: (body.dateLabel || (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { month: "short", year: "numeric" })).trim()
    };
    store.site.testimonials.unshift(created);
    saveStore(store);
    res.status(201).json({ testimonial: created, testimonials: store.site.testimonials });
  });
  app.delete("/api/testimonials/:id", (req, res) => {
    const store = ensureStore();
    store.site.testimonials = store.site.testimonials.filter((t) => t.id !== req.params.id);
    saveStore(store);
    res.json({ testimonials: store.site.testimonials });
  });
  app.get("/api/reservations", (_req, res) => {
    const store = ensureStore();
    res.json({ reservations: store.reservations });
  });
  app.post("/api/reservations", (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        error: "Too many reservation requests in a short time. Please wait a minute or contact us on WhatsApp."
      });
      return;
    }
    const body = req.body;
    if (body.website && body.website.trim().length > 0) {
      res.status(400).json({ error: "Unable to process submission." });
      return;
    }
    const fullName = (body.fullName || "").trim();
    const mobile = (body.mobile || "").trim();
    const date = (body.date || "").trim();
    const preferredTime = (body.preferredTime || "").trim();
    const guests = Number(body.guests);
    const specialRequests = (body.specialRequests || "").trim().slice(0, 400);
    if (fullName.length < 2) {
      res.status(400).json({ error: "Please enter your full name (at least 2 characters)." });
      return;
    }
    const digits = normalizePhoneDigits(mobile);
    if (digits.length < 10 || digits.length > 13) {
      res.status(400).json({ error: "Please enter a valid 10-digit Indian mobile number." });
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "Please choose a valid reservation date." });
      return;
    }
    const todayStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    if (date < todayStr) {
      res.status(400).json({ error: "Past dates cannot be selected. Please pick today or an upcoming date." });
      return;
    }
    if (!preferredTime) {
      res.status(400).json({ error: "Please select a preferred time slot." });
      return;
    }
    if (!Number.isFinite(guests) || guests < 1 || guests > 20) {
      res.status(400).json({ error: "Number of guests must be between 1 and 20." });
      return;
    }
    const store = ensureStore();
    const refNumber = Math.floor(1e3 + Math.random() * 9e3);
    const created = {
      id: `res-${Date.now()}`,
      referenceCode: `KC-${refNumber}`,
      fullName,
      mobile,
      date,
      preferredTime,
      guests,
      specialRequests,
      status: "Pending Review" /* PENDING */,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    store.reservations.unshift(created);
    saveStore(store);
    res.status(201).json({
      enquiry: created,
      message: "Your reservation enquiry has been received. Please note that submitting this request does not guarantee a confirmed table until our caf\xE9 team confirms availability."
    });
  });
  app.patch("/api/reservations/:id", (req, res) => {
    const store = ensureStore();
    const { id } = req.params;
    const { status } = req.body;
    const idx = store.reservations.findIndex((r) => r.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Reservation enquiry not found." });
      return;
    }
    if (!status || !Object.values(ReservationStatus).includes(status)) {
      res.status(400).json({ error: "Invalid reservation status." });
      return;
    }
    store.reservations[idx].status = status;
    saveStore(store);
    res.json({ enquiry: store.reservations[idx], reservations: store.reservations });
  });
  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    res.type("text/plain").send(
      `User-agent: *
Allow: /
Disallow: /manage
Sitemap: ${baseUrl.replace(/\/$/, "")}/sitemap.xml
`
    );
  });
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
    const routes = ["/", "/about", "/menu", "/gallery", "/reservations", "/contact"];
    const urls = routes.map(
      (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    ).join("\n");
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
    );
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }
  const port = Number(process.env.PORT) || 3e3;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}
startServer();
