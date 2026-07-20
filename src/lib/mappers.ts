import type { Item, Review, Category, BlogPost } from "@/types";

export interface RawItem {
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

export interface RawReview {
  _id?: string;
  user?: string | { _id?: string; name?: string; avatar?: string };
  item?: string | { _id?: string };
  rating?: number;
  comment?: string;
  createdAt?: string;
}

export interface RawCategory {
  _id?: string;
  name?: string;
  slug?: string;
  icon?: string;
}

export interface RawBlogPost {
  _id?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string | { name?: string };
  createdAt?: string;
  images?: string[];
  tags?: string[];
}

export function mapItem(raw: RawItem): Item {
  return {
    id: String(raw._id),
    title: raw.title ?? "",
    shortDescription: raw.shortDescription ?? "",
    fullDescription: raw.fullDescription ?? "",
    price: raw.price ?? 0,
    category:
      typeof raw.category === "object"
        ? raw.category?.slug || raw.category?.name || ""
        : raw.category || "",
    images: raw.images || [],
    rating: raw.rating || 0,
    reviewCount: raw.reviewCount || 0,
    location: raw.location || "",
    seller:
      typeof raw.author === "object"
        ? raw.author?.name || ""
        : raw.author || "",
    createdAt: raw.createdAt || "",
    tags: raw.tags || [],
    specifications: raw.specifications || {},
  };
}

export function mapReview(raw: RawReview): Review {
  return {
    id: String(raw._id),
    userId:
      typeof raw.user === "object" ? String(raw.user._id) : String(raw.user),
    userName: typeof raw.user === "object" ? raw.user.name || "" : "",
    userAvatar: typeof raw.user === "object" ? raw.user.avatar || "" : "",
    itemId:
      typeof raw.item === "object" ? String(raw.item._id) : String(raw.item),
    rating: raw.rating ?? 0,
    comment: raw.comment || "",
    createdAt: raw.createdAt || "",
  };
}

export function mapCategory(raw: RawCategory): Category {
  return {
    id: String(raw._id),
    name: raw.name || "",
    slug: raw.slug || "",
    icon: raw.icon || "",
    itemCount: 0,
  };
}

export function mapBlogPost(raw: RawBlogPost): BlogPost {
  return {
    id: String(raw._id),
    title: raw.title || "",
    excerpt: raw.excerpt || "",
    content: raw.content || "",
    author:
      typeof raw.author === "object"
        ? raw.author?.name || ""
        : raw.author || "",
    publishedAt: raw.createdAt || "",
    readTime: Math.max(
      1,
      Math.ceil((raw.content || "").split(/\s+/).length / 200),
    ),
    image: raw.images?.[0] || "https://picsum.photos/seed/blog/800/450",
    tags: raw.tags || [],
  };
}

export function mapCartItem(raw: unknown): Item {
  const rawItem = (raw as Record<string, unknown> | undefined);
  if (!rawItem) {
    return {
      id: "", title: "", shortDescription: "", fullDescription: "",
      price: 0, category: "", images: [], rating: 0, reviewCount: 0,
      location: "", seller: "", createdAt: "", tags: [], specifications: {},
    };
  }
  return {
    id: String(rawItem._id ?? ""),
    title: String(rawItem.title ?? ""),
    shortDescription: String(rawItem.shortDescription ?? ""),
    fullDescription: String(rawItem.fullDescription ?? ""),
    price: Number(rawItem.price ?? 0),
    category: (() => {
      const cat = rawItem.category;
      if (cat && typeof cat === "object") return String((cat as Record<string, unknown>).slug || (cat as Record<string, unknown>).name || "");
      return String(cat ?? "");
    })(),
    images: (rawItem.images as string[]) || [],
    rating: Number(rawItem.rating ?? 0),
    reviewCount: Number(rawItem.reviewCount ?? 0),
    location: String(rawItem.location ?? ""),
    seller: typeof rawItem.author === "object"
      ? String((rawItem.author as Record<string, unknown>)?.name ?? "")
      : String(rawItem.author ?? ""),
    createdAt: String(rawItem.createdAt ?? ""),
    tags: (rawItem.tags as string[]) || [],
    specifications: (rawItem.specifications as Record<string, string>) || {},
  };
}
