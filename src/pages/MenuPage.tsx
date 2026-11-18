import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { DietaryMark } from '../components/DietaryMark';
import { SafeImage } from '../components/SafeImage';
import { MENU_CATEGORIES } from '../data/defaultCafeData';
import { DietaryType, MenuCategory, type MenuItem, type PageRoute } from '../types/cafe';

interface MenuPageProps {
  menu: MenuItem[];
  cafeName: string;
  onNavigate: (route: PageRoute) => void;
}

type CategoryFilter = 'All' | MenuCategory;
type DietaryFilter = 'All' | 'Veg Only';

export function MenuPage({ menu, cafeName, onNavigate }: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return menu.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (dietaryFilter === 'Veg Only' && item.dietary !== DietaryType.VEG) return false;
      if (query) {
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [menu, selectedCategory, dietaryFilter, searchQuery]);

  const groupedSections = useMemo(() => {
    const categoriesToShow =
      selectedCategory === 'All' ? MENU_CATEGORIES : [selectedCategory];
    return categoriesToShow
      .map((category) => ({
        category,
        items: filteredItems.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredItems, selectedCategory]);

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="py-12 sm:py-16 px-5 sm:px-8 border-b border-[#3B241B]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
              Digital Menu · INR (₹)
            </p>
            <h1 className="font-serif text-[clamp(2.25rem,4vw,3.25rem)] font-semibold text-[#3B241B]">
              {cafeName} Menu
            </h1>
            <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed">
              Freshly brewed coffee, homestyle breakfast, toasted paninis, pastas, and bakery treats
              at honest neighbourhood prices. All prices exclude applicable GST.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/reservations')}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors self-start md:self-auto whitespace-nowrap shrink-0"
          >
            Reserve a Table
          </button>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section className="sticky top-16 sm:top-18 z-30 bg-[#F5EFE6]/95 backdrop-blur-sm border-b border-[#3B241B]/10 px-5 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8A6B4F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee, sourdough, pasta, tiramisu..."
                aria-label="Search menu items"
                className="w-full h-10 pl-10 pr-9 rounded-lg bg-[#FFFFFF] border border-[#3B241B]/15 text-sm text-[#3B241B] placeholder:text-[#8A6B4F]/75 focus:border-[#8A6B4F] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A6B4F] hover:text-[#3B241B] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dietary Segmented Control */}
            <div
              role="group"
              aria-label="Dietary preference"
              className="inline-flex items-center p-1 bg-[#EDE4D7] rounded-lg self-start"
            >
              {(['All', 'Veg Only'] as DietaryFilter[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDietaryFilter(option)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    dietaryFilter === option
                      ? 'bg-[#FFFFFF] text-[#3B241B] shadow-sm'
                      : 'text-[#6B5344] hover:text-[#3B241B]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Menu categories"
            className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
          >
            {(['All', ...MENU_CATEGORIES] as CategoryFilter[]).map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#3B241B] text-[#F5EFE6] border-[#3B241B]'
                      : 'bg-[#FFFFFF] text-[#5C4436] border-[#3B241B]/12 hover:border-[#3B241B]/30 hover:text-[#3B241B]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="py-10 sm:py-14 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-14">
          {groupedSections.length === 0 ? (
            <div className="bg-[#FFFFFF] rounded-2xl p-10 text-center border border-[#3B241B]/10 space-y-3">
              <h2 className="font-serif text-2xl font-semibold text-[#3B241B]">
                No menu items match your filter
              </h2>
              <p className="text-sm text-[#5C4436]">
                Try clearing your search or switching back to all categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setDietaryFilter('All');
                  setSearchQuery('');
                }}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            groupedSections.map((group) => (
              <div key={group.category} className="space-y-6">
                <div className="flex items-baseline justify-between border-b border-[#3B241B]/12 pb-3">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3B241B]">
                    {group.category}
                  </h2>
                  <span className="text-xs font-medium text-[#8A6B4F] tabular-nums">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {group.items.map((item) => (
                    <article
                      key={item.id}
                      className={`bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#3B241B]/10 flex gap-4 sm:gap-5 items-start transition-opacity ${
                        item.available ? '' : 'opacity-70'
                      }`}
                    >
                      {item.imageUrl && (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#EDE4D7] shrink-0">
                          <SafeImage
                            src={item.imageUrl}
                            alt={item.name}
                            fallbackTitle={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <DietaryMark dietary={item.dietary} />
                              {!item.available && (
                                <span className="text-xs text-[#8C3B2B] font-medium">
                                  · Sold out today
                                </span>
                              )}
                            </div>
                            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#3B241B] leading-snug">
                              {item.name}
                            </h3>
                          </div>
                          <span className="text-base sm:text-lg font-semibold text-[#3B241B] tabular-nums shrink-0">
                            ₹{item.priceInr}
                          </span>
                        </div>
                        <p className="text-sm text-[#5C4436] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
