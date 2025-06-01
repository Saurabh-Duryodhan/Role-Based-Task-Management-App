import { authService } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8091';

export class HttpError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class HttpClient {
  private static instance: HttpClient;

  private constructor() {}

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;

    // Add auth header if not skipped
    if (!skipAuth) {
      const token = authService.getAccessToken();
      if (!token) {
        throw new HttpError(401, 'No access token available');
      }
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      // Handle token refresh
      if (response.status === 401 && !skipAuth) {
        try {
          await authService.refreshToken();
          // Retry the request with new token
          return this.request(endpoint, options);
        } catch (error) {
          // If refresh fails, clear auth state
          await authService.logout();
          throw new HttpError(401, 'Session expired');
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new HttpError(
          response.status,
          data.message || 'An error occurred',
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, 'Network error');
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = HttpClient.getInstance(); 