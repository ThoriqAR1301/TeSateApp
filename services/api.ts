import { API_CONFIG, ERROR_MESSAGES, STORAGE_KEYS } from '@/constants/Config';

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number | null;
  success: boolean;
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
};

function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function getAuthToken(): Promise<string | null> {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    return null;
  }
}

function parseError(err: unknown, status?: number): string {
  if (err instanceof Error && err.name === 'AbortError') {
    return ERROR_MESSAGES.TIMEOUT;
  }

  if (status !== undefined) {
    if (status === 401) return ERROR_MESSAGES.UNAUTHORIZED;
    if (status === 404) return ERROR_MESSAGES.NOT_FOUND;
    if (status >= 500) return ERROR_MESSAGES.SERVER;
  }

  if (err instanceof TypeError && err.message === 'Network request failed') {
    return ERROR_MESSAGES.NETWORK;
  }

  return ERROR_MESSAGES.UNKNOWN;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, timeout = API_CONFIG.TIMEOUT } = options;

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const token = await getAuthToken();

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const requestInit: RequestInit = {
    method,
    headers: finalHeaders,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const response = await fetchWithTimeout(url, requestInit, timeout);

    let json: T | null = null;
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      json = (await response.json()) as T;
    }

    if (!response.ok) {
      return {
        data: null,
        error: parseError(null, response.status),
        status: response.status,
        success: false,
      };
    }

    return {
      data: json,
      error: null,
      status: response.status,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: parseError(err),
      status: null,
      success: false,
    };
  }
}

const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: Record<string, unknown>, options?: Omit<RequestOptions, 'method'>) => request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body: Record<string, unknown>, options?: Omit<RequestOptions, 'method'>) => request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body: Record<string, unknown>, options?: Omit<RequestOptions, 'method'>) => request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
