export enum MenuCategory {
  HOT_COFFEE = 'Hot Coffee',
  COLD_COFFEE = 'Cold Coffee',
  TEA_BEVERAGES = 'Tea and Other Beverages',
  BREAKFAST = 'Breakfast',
  SANDWICHES_SNACKS = 'Sandwiches and Snacks',
  PASTA_MAINS = 'Pasta and Main Course',
  DESSERTS = 'Desserts',
}

export enum DietaryType {
  VEG = 'Veg',
  NON_VEG = 'Non-Veg',
  EGG = 'Contains Egg',
}

export enum ReservationStatus {
  PENDING = 'Pending Review',
  CONFIRMED = 'Confirmed',
  DECLINED = 'Unavailable',
}

export interface CafeConfig {
  name: string;
  tagline: string;
  shortIntro: string;
  neighborhood: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  landmark: string;
  openingHours: string;
  weekendHours: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  googleMapsUrl: string;
  googleReviewsUrl: string;
  isPreLaunchLocationDraft: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceInr: number;
  category: MenuCategory;
  dietary: DietaryType;
  available: boolean;
  featured: boolean;
  imageUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Interiors' | 'Seating' | 'Coffee & Beverages' | 'Food';
  imageUrl: string;
  alt: string;
  caption: string;
}

export interface Testimonial {
  id: string;
  author: string;
  visitContext: string;
  quote: string;
  rating: number;
  source: string;
  dateLabel: string;
}

export interface ReservationEnquiry {
  id: string;
  referenceCode: string;
  fullName: string;
  mobile: string;
  date: string;
  preferredTime: string;
  guests: number;
  specialRequests: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface SiteData {
  config: CafeConfig;
  menu: MenuItem[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
}

export type PageRoute =
  | '/'
  | '/about'
  | '/menu'
  | '/gallery'
  | '/reservations'
  | '/contact'
  | '/manage';
