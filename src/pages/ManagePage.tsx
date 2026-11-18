import { useEffect, useState, type FormEvent } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { MENU_CATEGORIES } from '../data/defaultCafeData';
import {
  DietaryType,
  MenuCategory,
  ReservationStatus,
  type CafeConfig,
  type MenuItem,
  type ReservationEnquiry,
  type SiteData,
  type Testimonial,
} from '../types/cafe';

interface ManagePageProps {
  data: SiteData;
  onSiteUpdated: (next: SiteData) => void;
}

type ManageTab = 'branding' | 'menu' | 'reservations' | 'reviews';

export function ManagePage({ data, onSiteUpdated }: ManagePageProps) {
  const [activeTab, setActiveTab] = useState<ManageTab>('branding');
  const [configDraft, setConfigDraft] = useState<CafeConfig>(data.config);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  // Reservations state
  const [reservations, setReservations] = useState<ReservationEnquiry[]>([]);
  const [loadingRes, setLoadingRes] = useState(false);

  // New menu item state
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('180');
  const [newItemCat, setNewItemCat] = useState<MenuCategory>(MenuCategory.HOT_COFFEE);
  const [newItemDietary, setNewItemDietary] = useState<DietaryType>(DietaryType.VEG);
  const [addingItem, setAddingItem] = useState(false);

  // New verified testimonial state
  const [revAuthor, setRevAuthor] = useState('');
  const [revContext, setRevContext] = useState('');
  const [revQuote, setRevQuote] = useState('');
  const [revRating, setRevRating] = useState(5);

  useEffect(() => {
    setConfigDraft(data.config);
  }, [data.config]);

  useEffect(() => {
    if (activeTab !== 'reservations') return;
    setLoadingRes(true);
    fetch('/api/reservations')
      .then((res) => res.json())
      .then((payload) => setReservations(payload.reservations || []))
      .catch(() => {})
      .finally(() => setLoadingRes(false));
  }, [activeTab]);

  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigMessage(null);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configDraft),
      });
      const payload = await res.json();
      if (res.ok && payload.config) {
        onSiteUpdated({ ...data, config: payload.config });
        setConfigMessage('Café details saved across all pages.');
      }
    } finally {
      setSavingConfig(false);
    }
  };

  const handleAddMenuItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setAddingItem(true);
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName.trim(),
          description: newItemDesc.trim(),
          priceInr: Number(newItemPrice) || 150,
          category: newItemCat,
          dietary: newItemDietary,
          available: true,
          featured: false,
        }),
      });
      const payload = await res.json();
      if (res.ok && payload.menu) {
        onSiteUpdated({ ...data, menu: payload.menu });
        setNewItemName('');
        setNewItemDesc('');
      }
    } finally {
      setAddingItem(false);
    }
  };

  const handleToggleItem = async (item: MenuItem, field: 'available' | 'featured') => {
    const res = await fetch(`/api/menu/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !item[field] }),
    });
    const payload = await res.json();
    if (res.ok && payload.menu) {
      onSiteUpdated({ ...data, menu: payload.menu });
    }
  };

  const handleDeleteItem = async (id: string) => {
    const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    const payload = await res.json();
    if (res.ok && payload.menu) {
      onSiteUpdated({ ...data, menu: payload.menu });
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: ReservationStatus) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const payload = await res.json();
    if (res.ok && payload.reservations) {
      setReservations(payload.reservations);
    }
  };

  const handleAddReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revQuote.trim()) return;
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: revAuthor.trim(),
        visitContext: revContext.trim() || 'Café Guest',
        quote: revQuote.trim(),
        rating: revRating,
        source: 'Google Reviews',
      }),
    });
    const payload = await res.json();
    if (res.ok && payload.testimonials) {
      onSiteUpdated({ ...data, testimonials: payload.testimonials as Testimonial[] });
      setRevAuthor('');
      setRevContext('');
      setRevQuote('');
    }
  };

  const handleDeleteReview = async (id: string) => {
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    const payload = await res.json();
    if (res.ok && payload.testimonials) {
      onSiteUpdated({ ...data, testimonials: payload.testimonials });
    }
  };

  return (
    <div className="pb-20">
      <section className="py-12 px-5 sm:px-8 border-b border-[#3B241B]/10">
        <div className="max-w-5xl mx-auto space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              Café Team Workspace
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B241B] mt-1">
              Pre-Launch Setup &amp; Operations
            </h1>
            <p className="text-sm text-[#5C4436] mt-1">
              Update undecided café name, Mumbai address, timings, menu items, and review incoming
              table reservation enquiries.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist">
            {(
              [
                { id: 'branding', label: 'Branding & Location' },
                { id: 'menu', label: `Menu Items (${data.menu.length})` },
                { id: 'reservations', label: 'Reservation Enquiries' },
                { id: 'reviews', label: 'Verified Reviews' },
              ] as { id: ManageTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#3B241B] text-[#F5EFE6] border-[#3B241B]'
                    : 'bg-[#FFFFFF] text-[#5C4436] border-[#3B241B]/12 hover:text-[#3B241B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'branding' && (
            <form
              onSubmit={handleSaveConfig}
              className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#3B241B]/10 space-y-6"
            >
              {configMessage && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#EDF6EE] text-[#2E6B40] text-sm">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{configMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Official Café Name</span>
                  <input
                    type="text"
                    value={configDraft.name}
                    onChange={(e) => setConfigDraft({ ...configDraft, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Tagline</span>
                  <input
                    type="text"
                    value={configDraft.tagline}
                    onChange={(e) => setConfigDraft({ ...configDraft, tagline: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm sm:col-span-2">
                  <span className="font-semibold text-[#3B241B]">Hero Introduction</span>
                  <textarea
                    rows={2}
                    value={configDraft.shortIntro}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, shortIntro: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Mumbai Neighbourhood</span>
                  <input
                    type="text"
                    value={configDraft.neighborhood}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, neighborhood: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Street Address</span>
                  <input
                    type="text"
                    value={configDraft.streetAddress}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, streetAddress: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Landmark</span>
                  <input
                    type="text"
                    value={configDraft.landmark}
                    onChange={(e) => setConfigDraft({ ...configDraft, landmark: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">PIN Code</span>
                  <input
                    type="text"
                    value={configDraft.postalCode}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, postalCode: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40 tabular-nums"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Weekday Hours</span>
                  <input
                    type="text"
                    value={configDraft.openingHours}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, openingHours: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Weekend Hours</span>
                  <input
                    type="text"
                    value={configDraft.weekendHours}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, weekendHours: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Contact Phone</span>
                  <input
                    type="text"
                    value={configDraft.phone}
                    onChange={(e) => setConfigDraft({ ...configDraft, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40 tabular-nums"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">WhatsApp Number (with 91)</span>
                  <input
                    type="text"
                    value={configDraft.whatsappNumber}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, whatsappNumber: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40 tabular-nums"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Instagram Handle</span>
                  <input
                    type="text"
                    value={configDraft.instagramHandle}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, instagramHandle: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>

                <label className="space-y-1.5 text-sm">
                  <span className="font-semibold text-[#3B241B]">Google Maps URL</span>
                  <input
                    type="url"
                    value={configDraft.googleMapsUrl}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, googleMapsUrl: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#3B241B]/18 bg-[#F5EFE6]/40"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={savingConfig}
                className="px-6 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors"
              >
                {savingConfig ? 'Saving...' : 'Save Branding & Location'}
              </button>
            </form>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-8">
              <form
                onSubmit={handleAddMenuItem}
                className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#3B241B]/10 space-y-4"
              >
                <h2 className="font-serif text-xl font-semibold text-[#3B241B]">
                  Add Menu Item
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-[#3B241B]/18 text-sm"
                  />
                  <select
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value as MenuCategory)}
                    className="h-10 px-3 rounded-lg border border-[#3B241B]/18 text-sm"
                  >
                    {MENU_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newItemDietary}
                    onChange={(e) => setNewItemDietary(e.target.value as DietaryType)}
                    className="h-10 px-3 rounded-lg border border-[#3B241B]/18 text-sm"
                  >
                    {Object.values(DietaryType).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={10}
                    required
                    placeholder="Price (₹)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-[#3B241B]/18 text-sm tabular-nums"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Short description"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-[#3B241B]/18 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={addingItem}
                    className="inline-flex items-center justify-center gap-1.5 px-5 h-10 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </form>

              <div className="bg-[#FFFFFF] rounded-2xl border border-[#3B241B]/10 divide-y divide-[#3B241B]/8">
                {data.menu.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs text-[#8A6B4F]">
                        {item.category} · {item.dietary}
                      </p>
                      <p className="font-serif text-base font-semibold text-[#3B241B]">
                        {item.name} — <span className="tabular-nums">₹{item.priceInr}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleItem(item, 'available')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                          item.available
                            ? 'bg-[#EDF6EE] text-[#2E6B40] border-[#2E6B40]/20'
                            : 'bg-[#FDF2F0] text-[#8C3B2B] border-[#8C3B2B]/20'
                        }`}
                      >
                        {item.available ? 'Available' : 'Sold Out'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleItem(item, 'featured')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                          item.featured
                            ? 'bg-[#3B241B] text-[#F5EFE6] border-[#3B241B]'
                            : 'bg-[#F5EFE6] text-[#5C4436] border-[#3B241B]/15'
                        }`}
                      >
                        {item.featured ? 'Featured' : 'Set Featured'}
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-[#8C3B2B] hover:bg-[#FDF2F0] rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#3B241B]/10 p-6 space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#3B241B]">
                Incoming Table Enquiries
              </h2>
              {loadingRes ? (
                <p className="text-sm text-[#5C4436]">Loading enquiries...</p>
              ) : reservations.length === 0 ? (
                <p className="text-sm text-[#5C4436]">
                  No reservation enquiries submitted yet. Requests made on the Reservations page will
                  appear here for team confirmation.
                </p>
              ) : (
                <div className="divide-y divide-[#3B241B]/10">
                  {reservations.map((r) => (
                    <div
                      key={r.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-[#8A6B4F] tabular-nums">
                          {r.referenceCode} · {r.date} · {r.preferredTime} · {r.guests} Guests
                        </p>
                        <p className="font-semibold text-[#3B241B]">
                          {r.fullName} — <span className="tabular-nums">{r.mobile}</span>
                        </p>
                        {r.specialRequests && (
                          <p className="text-xs text-[#5C4436]">Note: {r.specialRequests}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Status for ${r.fullName}`}
                          value={r.status}
                          onChange={(e) =>
                            handleUpdateReservationStatus(r.id, e.target.value as ReservationStatus)
                          }
                          className="h-9 px-3 rounded-lg border border-[#3B241B]/18 text-xs font-semibold bg-[#F5EFE6]"
                        >
                          {Object.values(ReservationStatus).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddReview}
                className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#3B241B]/10 space-y-4"
              >
                <h2 className="font-serif text-xl font-semibold text-[#3B241B]">
                  Add Verified Customer Review
                </h2>
                <p className="text-xs text-[#5C4436]">
                  Only add genuine reviews received from real café guests or Google Reviews.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Guest Name"
                    value={revAuthor}
                    onChange={(e) => setRevAuthor(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-[#3B241B]/18 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Visit context (e.g., Bandra local)"
                    value={revContext}
                    onChange={(e) => setRevContext(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-[#3B241B]/18 text-sm"
                  />
                  <select
                    value={revRating}
                    onChange={(e) => setRevRating(Number(e.target.value))}
                    className="h-10 px-3 rounded-lg border border-[#3B241B]/18 text-sm"
                  >
                    {[5, 4, 3].map((stars) => (
                      <option key={stars} value={stars}>
                        {stars} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Guest review text"
                  value={revQuote}
                  onChange={(e) => setRevQuote(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#3B241B]/18 text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226]"
                >
                  Publish Verified Review
                </button>
              </form>

              {data.testimonials.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#3B241B]/10 divide-y divide-[#3B241B]/8">
                  {data.testimonials.map((t) => (
                    <div key={t.id} className="p-4 sm:px-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#3B241B]">
                          {t.author} · {t.rating}/5
                        </p>
                        <p className="text-sm text-[#5C4436] mt-1">“{t.quote}”</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(t.id)}
                        className="p-2 text-[#8C3B2B] hover:bg-[#FDF2F0] rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
