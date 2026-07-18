import { api } from './api';
import type { Item, Review, Category, BlogPost } from '@/types';

interface RawItem {
  _id?: string;
  id?: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  price?: number;
  category?: string | { slug?: string; name?: string };
  images?: string[];
  rating?: number;
  reviewCount?: number;
  location?: string;
  author?: string | { name?: string; _id?: string };
  createdAt?: string;
  tags?: string[];
  specifications?: Record<string, string>;
}

interface RawReview {
  _id?: string;
  user?: string | { _id?: string; name?: string; avatar?: string };
  item?: string | { _id?: string };
  rating?: number;
  comment?: string;
  createdAt?: string;
}

interface RawCategory {
  _id?: string;
  name?: string;
  slug?: string;
  icon?: string;
}

interface RawBlogPost {
  _id?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string | { name?: string };
  createdAt?: string;
  images?: string[];
  tags?: string[];
}

function mapItem(raw: RawItem): Item {
  return {
    id: String(raw._id),
    title: raw.title ?? '',
    shortDescription: raw.shortDescription ?? '',
    fullDescription: raw.fullDescription ?? '',
    price: raw.price ?? 0,
    category: typeof raw.category === 'object' ? raw.category?.slug || raw.category?.name || '' : raw.category || '',
    images: raw.images || [],
    rating: raw.rating || 0,
    reviewCount: raw.reviewCount || 0,
    location: raw.location || '',
    seller: typeof raw.author === 'object' ? raw.author?.name || '' : raw.author || '',
    createdAt: raw.createdAt || '',
    tags: raw.tags || [],
    specifications: raw.specifications || {},
  };
}

function mapReview(raw: RawReview): Review {
  return {
    id: String(raw._id),
    userId: typeof raw.user === 'object' ? String(raw.user._id) : String(raw.user),
    userName: typeof raw.user === 'object' ? raw.user.name || '' : '',
    userAvatar: typeof raw.user === 'object' ? raw.user.avatar || '' : '',
    itemId: typeof raw.item === 'object' ? String(raw.item._id) : String(raw.item),
    rating: raw.rating ?? 0,
    comment: raw.comment || '',
    createdAt: raw.createdAt || '',
  };
}

function mapCategory(raw: RawCategory): Category {
  return {
    id: String(raw._id),
    name: raw.name || '',
    slug: raw.slug || '',
    icon: raw.icon || '',
    itemCount: 0,
  };
}

function mapBlogPost(raw: RawBlogPost): BlogPost {
  return {
    id: String(raw._id),
    title: raw.title || '',
    excerpt: raw.excerpt || '',
    content: raw.content || '',
    author: typeof raw.author === 'object' ? raw.author?.name || '' : raw.author || '',
    publishedAt: raw.createdAt || '',
    readTime: Math.max(1, Math.ceil((raw.content || '').split(/\s+/).length / 200)),
    image: raw.images?.[0] || 'https://picsum.photos/seed/blog/800/450',
    tags: raw.tags || [],
  };
}

export const itemsApi = {
  getAll: async (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await api.get<RawItem[]>(`/items${qs}`);
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapItem) : null,
    };
  },

  getById: async (id: string) => {
    const res = await api.get<RawItem>(`/items/${id}`);
    return { ...res, data: res.data ? mapItem(res.data) : null };
  },

  getMyListings: async (page = 1, limit = 20) => {
    const res = await api.get<RawItem[]>(`/items/my/listings?page=${page}&limit=${limit}`);
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapItem) : null,
    };
  },

  create: async (data: Record<string, unknown>) => {
    const res = await api.post<RawItem>('/items', data);
    return { ...res, data: res.data ? mapItem(res.data) : null };
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put<RawItem>(`/items/${id}`, data);
    return { ...res, data: res.data ? mapItem(res.data) : null };
  },

  delete: async (id: string) => {
    return api.delete(`/items/${id}`);
  },
};

export const categoriesApi = {
  getAll: async () => {
    const res = await api.get<RawCategory[]>('/categories');
    return { ...res, data: res.data ? res.data.map(mapCategory) : null };
  },

  create: async (data: Record<string, unknown>) => {
    const res = await api.post<RawCategory>('/categories', data);
    return { ...res, data: res.data ? mapCategory(res.data) : null };
  },
};

export const reviewsApi = {
  getByItem: async (itemId: string, page = 1, limit = 10) => {
    const res = await api.get<RawReview[]>(`/reviews/${itemId}?page=${page}&limit=${limit}`);
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapReview) : null,
    };
  },

  create: async (itemId: string, data: { rating: number; comment?: string }) => {
    const res = await api.post<RawReview>(`/reviews/${itemId}`, data);
    return { ...res, data: res.data ? mapReview(res.data) : null };
  },

  delete: async (id: string) => {
    return api.delete(`/reviews/${id}`);
  },
};

export const blogPostsApi = {
  getAll: async (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await api.get<RawBlogPost[]>(`/blog-posts${qs}`);
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapBlogPost) : null,
    };
  },

  getById: async (id: string) => {
    const res = await api.get<RawBlogPost>(`/blog-posts/${id}`);
    return { ...res, data: res.data ? mapBlogPost(res.data) : null };
  },

  getBySlug: async (slug: string) => {
    const res = await api.get<RawBlogPost>(`/blog-posts/slug/${slug}`);
    return { ...res, data: res.data ? mapBlogPost(res.data) : null };
  },

  create: async (data: Record<string, unknown>) => {
    const res = await api.post<RawBlogPost>('/blog-posts', data);
    return { ...res, data: res.data ? mapBlogPost(res.data) : null };
  },
};

export const commentsApi = {
  getByItem: async (itemId: string, page = 1, limit = 20) => {
    return api.get(`/comments/item/${itemId}?page=${page}&limit=${limit}`);
  },

  getByBlogPost: async (blogPostId: string, page = 1, limit = 20) => {
    return api.get(`/comments/blog/${blogPostId}?page=${page}&limit=${limit}`);
  },

  create: async (data: { content: string; item?: string; blogPost?: string; parentComment?: string }) => {
    return api.post('/comments', data);
  },

  delete: async (id: string) => {
    return api.delete(`/comments/${id}`);
  },

  toggleLike: async (id: string) => {
    return api.post(`/comments/${id}/like`);
  },
};

export const cartApi = {
  get: async () => {
    return api.get('/cart');
  },

  addItem: async (itemId: string, quantity = 1) => {
    return api.post('/cart', { item: itemId, quantity });
  },

  updateItem: async (itemId: string, quantity: number) => {
    return api.put(`/cart/${itemId}`, { quantity });
  },

  removeItem: async (itemId: string) => {
    return api.delete(`/cart/${itemId}`);
  },

  clear: async () => {
    return api.delete('/cart');
  },

  getTotal: async () => {
    return api.get('/cart/total');
  },
};

export const wishlistApi = {
  get: async (page = 1, limit = 20) => {
    return api.get(`/wishlist?page=${page}&limit=${limit}`);
  },

  add: async (itemId: string) => {
    return api.post('/wishlist', { item: itemId });
  },

  remove: async (itemId: string) => {
    return api.delete(`/wishlist/${itemId}`);
  },

  check: async (itemId: string) => {
    return api.get(`/wishlist/check/${itemId}`);
  },

  clear: async () => {
    return api.delete('/wishlist');
  },
};

export const paymentsApi = {
  getMyPayments: async (page = 1, limit = 10) => {
    return api.get(`/payments/my?page=${page}&limit=${limit}`);
  },

  create: async (data: { item: string; amount: number; paymentMethod: string; currency?: string }) => {
    return api.post('/payments', data);
  },

  updateStatus: async (id: string, status: string) => {
    return api.patch(`/payments/${id}/status`, { status });
  },
};

export const transactionsApi = {
  getMyPurchases: async (page = 1, limit = 10) => {
    return api.get(`/transactions/purchases?page=${page}&limit=${limit}`);
  },

  getMySales: async (page = 1, limit = 10) => {
    return api.get(`/transactions/sales?page=${page}&limit=${limit}`);
  },

  create: async (data: { item: string; payment: string; amount: number }) => {
    return api.post('/transactions', data);
  },

  updateStatus: async (id: string, status: string) => {
    return api.patch(`/transactions/${id}/status`, { status });
  },
};

export interface AIContentRequest {
  type: 'blog' | 'product_desc' | 'social_post' | 'documentation';
  topic: string;
  keywords?: string[];
  length: 'short' | 'medium' | 'long';
  tone?: string;
  additionalContext?: string;
}

export interface AIRecommendationRequest {
  categoryId?: string;
  priceRange?: { min?: number; max?: number };
  limit?: number;
}

export const aiApi = {
  generateContent: async (data: AIContentRequest) => {
    return api.post<{ content: string; title?: string }>('/ai/generate-content', data);
  },

  regenerateContent: async (data: AIContentRequest & { previousContent?: string }) => {
    return api.post<{ content: string; title?: string }>('/ai/regenerate-content', data);
  },

  getRecommendations: async (data: AIRecommendationRequest) => {
    return api.post<{ recommendations: Record<string, unknown>[]; reason?: string; userProfile?: Record<string, unknown> }>('/ai/recommendations', data);
  },

  trackInteraction: async (itemId: string, interactionType: 'view' | 'favorite' | 'purchase' | 'rating', rating?: number) => {
    return api.post('/ai/track-interaction', { itemId, interactionType, rating });
  },

  classify: async (title: string, description: string) => {
    return api.post<{ suggestedCategory: string; tags: string[]; keywords: string[]; confidence: number }>('/ai/classify', { title, description });
  },
};

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
  testimonials: { name: string; role: string; quote: string; avatar: string }[];
  homepageFaq: { question: string; answer: string }[];
  pricingPlans: {
    name: string;
    price: { monthly: number; yearly: number };
    description: string;
    features: { text: string; included: boolean }[];
    cta: string;
    popular: boolean;
  }[];
  pricingComparisons: { feature: string; free: string; pro: string; business: string }[];
  pricingFaq: { q: string; a: string }[];
  helpTopics: { title: string; description: string; details: string[] }[];
  helpFaq: { question: string; answer: string }[];
}

export const aboutApi = {
  get: async () => {
    return api.get<AboutData>('/about');
  },

  update: async (data: Record<string, unknown>) => {
    return api.put<AboutData>('/about', data);
  },
};
