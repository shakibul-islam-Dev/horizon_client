const API_BASE = (process.env.NEXT_PUBLIC_URL || 'https://horizon-server-1m7m.onrender.com').trim();

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getJwtToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    if (cachedToken && tokenExpiresAt > Date.now()) {
      return cachedToken;
    }
    try {
      const res = await fetch("/api/auth/jwt");
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.token) {
          cachedToken = body.token;
          tokenExpiresAt = Date.now() + 45 * 60 * 1000; // 45 minutes
          return cachedToken;
        }
      }
    } catch (e) {
      console.error("Failed to fetch JWT token", e);
    }
  }
  return null;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = 15000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await getJwtToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(`${this.baseUrl}/api${endpoint}`, {
        ...options,
        credentials: 'include',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        const message = errorBody?.message || `Request failed with status ${res.status}`;
        throw new Error(message);
      }

      if (res.status === 204) {
        return { success: true, message: 'Success', data: null };
      }

      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }
}

export const api = new ApiClient(API_BASE);
