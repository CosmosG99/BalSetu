const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken() {
  // Demo credentials are deliberately limited to local Vite development. Deployments
  // must provide a Firebase/session token through VITE_API_TOKEN or a future auth flow.
  return import.meta.env.VITE_API_TOKEN || (import.meta.env.DEV ? 'demo-superadmin' : undefined);
}

export async function request<T>(path: string, options: RequestInit = {}, authenticated = false): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  if (authenticated) {
    const token = getToken();
    if (!token) throw new ApiError(401, 'Sign in is required to access responder data.', 'UNAUTHORIZED');
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, 'Unable to reach the Rakshak backend. Check that it is running.', 'NETWORK_ERROR');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = payload?.error;
    throw new ApiError(response.status, error?.message || `Request failed (${response.status})`, error?.code);
  }
  return payload as T;
}

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}
