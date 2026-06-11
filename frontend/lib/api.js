import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.response = { data, status };
  }
}

const getPayload = (json) => json?.data ?? json;

async function fetchWithAuth(endpoint, options = {}, retry = false) {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = Cookies.get('accessToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  const url = `${baseURL}${endpoint}`;
  let response = await fetch(url, config);

  if (response.status === 401 && !retry && !endpoint.includes('/auth/refresh-token') && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    const refreshResponse = await fetch(`${baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      const refreshJson = await refreshResponse.json();
      const payload = getPayload(refreshJson);
      const newAccessToken = payload?.accessToken;

      if (newAccessToken) {
        Cookies.set('accessToken', newAccessToken, {
          secure: false, // Minikube uses HTTP, so secure must be false
          sameSite: 'lax',
        });
        return fetchWithAuth(endpoint, options, true);
      }
    }

    Cookies.remove('accessToken');
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
      window.location.href = '/auth/login';
    }
    throw new ApiError('Session expired. Please log in again.', 401, { message: 'Session expired' });
  }

  const contentType = response.headers.get('content-type');
  const json = contentType?.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(json?.message || 'Request failed', response.status, json);
  }

  return {
    data: json,
    payload: getPayload(json),
    status: response.status,
  };
}

const api = {
  get: (endpoint, options = {}) => fetchWithAuth(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) =>
    fetchWithAuth(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body, options = {}) =>
    fetchWithAuth(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (endpoint, body, options = {}) =>
    fetchWithAuth(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint, options = {}) => fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
export { ApiError, getPayload };
