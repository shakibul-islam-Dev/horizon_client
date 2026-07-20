import { api } from "./api";
import type { AboutData } from "@/types";
import {
  mapItem, mapReview, mapCategory, mapBlogPost,
  type RawItem, type RawReview, type RawCategory, type RawBlogPost,
} from "./mappers";

export const itemsApi = {
  getAll: async (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
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
    const res = await api.get<RawItem[]>(
      `/items/my?page=${page}&limit=${limit}`,
    );
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapItem) : null,
    };
  },

  create: async (data: Record<string, unknown>) => {
    const res = await api.post<RawItem>("/items", data);
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
    const res = await api.get<RawCategory[]>("/categories");
    return { ...res, data: res.data ? res.data.map(mapCategory) : null };
  },

  create: async (data: Record<string, unknown>) => {
    const res = await api.post<RawCategory>("/categories", data);
    return { ...res, data: res.data ? mapCategory(res.data) : null };
  },
};

export const reviewsApi = {
  getAll: async (page = 1, limit = 12) => {
    const res = await api.get<RawReview[]>(
      `/reviews?page=${page}&limit=${limit}`,
    );
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapReview) : null,
    };
  },

  getMy: async (page = 1, limit = 10) => {
    const res = await api.get<RawReview[]>(
      `/reviews/my?page=${page}&limit=${limit}`,
    );
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapReview) : null,
    };
  },

  getByItem: async (itemId: string, page = 1, limit = 10) => {
    const res = await api.get<RawReview[]>(
      `/reviews/item/${itemId}?page=${page}&limit=${limit}`,
    );
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapReview) : null,
    };
  },

  getStats: async (itemId: string) => {
    return api.get<{ averageRating: number; totalReviews: number; distribution: Record<number, number> }>(
      `/reviews/stats/${itemId}`,
    );
  },

  create: async (
    itemId: string,
    data: { rating: number; comment?: string },
  ) => {
    const res = await api.post<RawReview>("/reviews", { ...data, item: itemId });
    return { ...res, data: res.data ? mapReview(res.data) : null };
  },

  update: async (id: string, data: { rating?: number; comment?: string }) => {
    const res = await api.put<RawReview>(`/reviews/${id}`, data);
    return { ...res, data: res.data ? mapReview(res.data) : null };
  },

  delete: async (id: string) => {
    return api.delete(`/reviews/${id}`);
  },
};

export const blogPostsApi = {
  getAll: async (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await api.get<RawBlogPost[]>(`/blogposts${qs}`);
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapBlogPost) : null,
    };
  },

  getById: async (id: string) => {
    const res = await api.get<RawBlogPost>(`/blogposts/${id}`);
    return { ...res, data: res.data ? mapBlogPost(res.data) : null };
  },

  getBySlug: async (slug: string) => {
    const res = await api.get<RawBlogPost>(`/blogposts/slug/${slug}`);
    return { ...res, data: res.data ? mapBlogPost(res.data) : null };
  },

  getMyPosts: async (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await api.get<RawBlogPost[]>(`/blogposts/my${qs}`);
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapBlogPost) : null,
    };
  },

  create: async (data: Record<string, unknown>) => {
    const res = await api.post<RawBlogPost>("/blogposts", data);
    return { ...res, data: res.data ? mapBlogPost(res.data) : null };
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put<RawBlogPost>(`/blogposts/${id}`, data);
    return { ...res, data: res.data ? mapBlogPost(res.data) : null };
  },

  remove: async (id: string) => {
    return api.delete(`/blogposts/${id}`);
  },

  like: async (id: string) => {
    const res = await api.post<RawBlogPost>(`/blogposts/${id}/like`);
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

  create: async (data: {
    content: string;
    item?: string;
    blogPost?: string;
    parentComment?: string;
  }) => {
    return api.post("/comments", data);
  },

  update: async (id: string, content: string) => {
    return api.put(`/comments/${id}`, { content });
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
    return api.get("/carts");
  },

  addItem: async (itemId: string, quantity = 1) => {
    return api.post("/carts/add", { item: itemId, quantity });
  },

  updateItem: async (itemId: string, quantity: number) => {
    return api.put("/carts/update", { item: itemId, quantity });
  },

  removeItem: async (itemId: string) => {
    return api.delete(`/carts/remove/${itemId}`);
  },

  clear: async () => {
    return api.delete("/carts/clear");
  },

  getTotal: async () => {
    return api.get("/carts/total");
  },
};

export const wishlistApi = {
  get: async (page = 1, limit = 20) => {
    return api.get(`/wishlists?page=${page}&limit=${limit}`);
  },

  add: async (itemId: string) => {
    return api.post("/wishlists", { item: itemId });
  },

  remove: async (itemId: string) => {
    return api.delete(`/wishlists/${itemId}`);
  },

  check: async (itemId: string) => {
    return api.get(`/wishlists/check/${itemId}`);
  },

  clear: async () => {
    return api.delete("/wishlists");
  },
};

export const paymentsApi = {
  getConfig: async () => {
    return api.get<{ publishableKey: string }>("/payments/config");
  },

  createPaymentIntent: async (itemId: string) => {
    return api.post<{ clientSecret: string; paymentIntentId: string }>(
      "/payments/create-payment-intent",
      { itemId },
    );
  },

  getMyPayments: async (page = 1, limit = 10) => {
    return api.get(`/payments/my?page=${page}&limit=${limit}`);
  },

  getById: async (id: string) => {
    return api.get(`/payments/${id}`);
  },

  getByItem: async (itemId: string, page = 1, limit = 10) => {
    return api.get(`/payments/item/${itemId}?page=${page}&limit=${limit}`);
  },

  create: async (data: {
    item: string;
    amount: number;
    paymentMethod: string;
    currency?: string;
  }) => {
    return api.post("/payments", data);
  },

  updateStatus: async (id: string, status: string) => {
    return api.patch(`/payments/${id}/status`, { status });
  },
};

export const transactionsApi = {
  getMyPurchases: async (page = 1, limit = 10) => {
    return api.get(`/transactions/buyer?page=${page}&limit=${limit}`);
  },

  getMySales: async (page = 1, limit = 10) => {
    return api.get(`/transactions/seller?page=${page}&limit=${limit}`);
  },

  getById: async (id: string) => {
    return api.get(`/transactions/${id}`);
  },

  create: async (data: { item: string; payment: string; amount: number }) => {
    return api.post("/transactions", data);
  },

  updateStatus: async (id: string, status: string) => {
    return api.patch(`/transactions/${id}/status`, { status });
  },
};

export interface AIContentRequest {
  type: "blog" | "product_desc" | "social_post" | "documentation";
  topic: string;
  keywords?: string[];
  length: "short" | "medium" | "long";
  tone?: string;
  additionalContext?: string;
}

export const aiApi = {
  generateContent: async (data: AIContentRequest) => {
    return api.post<{ content: string; title?: string }>(
      "/ai/generate-content",
      data,
    );
  },

  regenerateContent: async (
    data: AIContentRequest & { previousContent?: string },
  ) => {
    return api.post<{ content: string; title?: string }>(
      "/ai/regenerate-content",
      data,
    );
  },

  getRecommendations: async (data: {
    categoryId?: string;
    priceRange?: { min?: number; max?: number };
    limit?: number;
  }) => {
    return api.post<{
      recommendations: Record<string, unknown>[];
      reason?: string;
      userProfile?: Record<string, unknown>;
    }>("/ai/recommendations", data);
  },

  trackInteraction: async (
    itemId: string,
    interactionType: "view" | "favorite" | "purchase" | "rating",
    rating?: number,
  ) => {
    return api.post("/ai/track-interaction", {
      itemId,
      interactionType,
      rating,
    });
  },

  classify: async (title: string, description: string) => {
    return api.post<{
      suggestedCategory: string;
      tags: string[];
      keywords: string[];
      confidence: number;
    }>("/ai/classify", { title, description });
  },
};

function mapConversation(raw: Record<string, unknown>): {
  id: string; title: string; model: string; status: string; lastMessage: string; messageCount: number;
} {
  return {
    id: String(raw._id ?? raw.id ?? ""),
    title: String(raw.title ?? ""),
    model: String(raw.model ?? ""),
    status: String(raw.status ?? ""),
    lastMessage: String(raw.lastMessage ?? ""),
    messageCount: Number(raw.messageCount ?? 0),
  };
}

function mapConversationDetail(raw: Record<string, unknown>) {
  const base = mapConversation(raw);
  return {
    ...base,
    user: String(raw.user ?? ""),
    messages: Array.isArray(raw.messages)
      ? (raw.messages as { role: "user" | "assistant" | "system"; content: string; createdAt: string }[])
      : [],
  };
}

export const chatApi = {
  sendMessage: async (
    messages: { role: "user" | "assistant"; content: string }[],
    conversationId?: string,
  ) => {
    return api.post<{ reply: string; conversationId: string; title: string }>(
      "/ai/chat",
      { messages, conversationId },
    );
  },

  createConversation: async () => {
    const res = await api.post<Record<string, unknown>>("/ai/chat", { messages: [] });
    return { ...res, data: res.data ? mapConversation(res.data) : null };
  },

  getConversations: async (
    page = 1,
    limit = 20,
    status: "active" | "archived" = "active",
  ) => {
    const res = await api.get<Record<string, unknown>[]>(
      `/ai/conversations?page=${page}&limit=${limit}&status=${status}`,
    );
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(mapConversation) : null,
    };
  },

  getConversation: async (id: string) => {
    const res = await api.get<Record<string, unknown>>(
      `/ai/conversations/${id}`,
    );
    return { ...res, data: res.data ? mapConversationDetail(res.data) : null };
  },

  renameConversation: async (id: string, title: string) => {
    return api.put(`/ai/conversations/${id}`, { title });
  },

  deleteConversation: async (id: string) => {
    return api.delete(`/ai/conversations/${id}`);
  },

  deleteAllConversations: async () => {
    return api.delete("/ai/conversations");
  },
};

export const userApi = {
  getProfile: async () => {
    return api.get<unknown>("/users/me");
  },

  updateProfile: async (data: Record<string, unknown>) => {
    return api.put<unknown>("/users/me", data);
  },

  getPublicProfile: async (id: string) => {
    return api.get<unknown>(`/users/${id}`);
  },
};

export const categoryApi = {
  ...categoriesApi,

  update: async (id: string, data: Record<string, unknown>) => {
    return api.put<RawCategory>(`/categories/${id}`, data);
  },

  remove: async (id: string) => {
    return api.delete(`/categories/${id}`);
  },
};

export const interestTagsApi = {
  getAll: async () => {
    const res = await api.get<string[]>("/items/tags");
    return { ...res, data: Array.isArray(res.data) ? res.data : [] };
  },
};

export const aboutApi = {
  get: async () => {
    return api.get<AboutData>("/abouts");
  },

  update: async (data: Record<string, unknown>) => {
    return api.put<AboutData>("/abouts", data);
  },
};

export interface CheckoutLineItem {
  title: string;
  price: number;
  quantity: number;
}

export const checkoutApi = {
  createSession: async (items: CheckoutLineItem[]) => {
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    return res.json() as Promise<{ success: boolean; message: string; data: { url: string } | null; error: string | null }>;
  },
};


