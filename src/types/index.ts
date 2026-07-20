export interface Item {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
  location: string;
  seller: string;
  createdAt: string;
  tags: string[];
  specifications: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
  joinDate: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  itemId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
}

export interface CartItem {
  item: Item;
  quantity: number;
}

export interface FilterOptions {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  location: string;
  sortBy: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;
}

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  values: { title: string; description: string }[];
  timeline: { year: string; event: string }[];
  statistics: { label: string; value: string; suffix?: string }[];
  team: { name: string; role: string; image: string }[];
  socialLinks: { platform: string; url: string }[];
  contact: { email: string; phone: string; address: string; hours: string };
  images: { hero: string; team: string[] };
  heroSlides: { title: string; subtitle: string; cta: string; href: string }[];
  features: { icon: string; title: string; description: string }[];
  highlights: {
    icon: string;
    title: string;
    description: string;
    stat: string;
    statLabel: string;
  }[];
  testimonials: { name: string; role: string; quote: string; avatar: string }[];
  partners: { name: string; initials: string }[];
  homepageFaq: { question: string; answer: string }[];
  pricingPlans: {
    name: string;
    price: { monthly: number; yearly: number };
    description: string;
    features: { text: string; included: boolean }[];
    cta: string;
    popular: boolean;
  }[];
  pricingComparisons: {
    feature: string;
    free: string;
    pro: string;
    business: string;
  }[];
  pricingFaq: { q: string; a: string }[];
  helpTopics: { title: string; description: string; details: string[] }[];
  helpFaq: { question: string; answer: string }[];
}
