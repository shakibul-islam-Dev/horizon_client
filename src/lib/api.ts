const API_BASE = (process.env.NEXT_PUBLIC_URL || 'http://localhost:5000').trim();

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const res = await fetch(`${this.baseUrl}/api${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      const message = errorBody?.message || `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    if (res.status === 204) {
      return { success: true, message: 'Success', data: null };
    }

    return res.json();
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
}

export const api = new ApiClient(API_BASE);
