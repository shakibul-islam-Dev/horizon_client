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
