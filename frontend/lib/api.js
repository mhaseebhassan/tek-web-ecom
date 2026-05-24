import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

async function fetchWithInterceptor(endpoint, options = {}) {
  // Setup headers
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach access token if available
  const token = Cookies.get('accessToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Configuration for native fetch
  const config = {
    ...options,
    headers,
    credentials: 'include', // Ensure HTTP-only cookies (refresh token) are sent
  };

  const url = `${baseURL}${endpoint}`;

  try {
    let response = await fetch(url, config);

    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && !config._retry) {
      config._retry = true;

      try {
        const refreshResponse = await fetch(`${baseURL}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh failed');
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.accessToken;
        
        if (newAccessToken) {
          Cookies.set('accessToken', newAccessToken, { secure: false, sameSite: 'lax' });
          headers.set('Authorization', `Bearer ${newAccessToken}`);
          
          // Re-create the request with new headers
          const retryConfig = { ...config, headers };
          
          // Retry the original request
          response = await fetch(url, retryConfig);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (refreshError) {
        Cookies.remove('accessToken');
        // Reject in an Axios-like error structure
        return Promise.reject({
          response: { data: { message: 'Session expired. Please log in again.' } }
        });
      }
    }

    // Process the final response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Mimic Axios error structure for components
      return Promise.reject({ response: { data, status: response.status } });
    }

    // Mimic Axios success structure
    return { data, status: response.status };

  } catch (err) {
    if (err.response) {
      return Promise.reject(err);
    }
    // Network or other error
    return Promise.reject({
      response: { data: { message: err.message || 'An unknown network error occurred.' } }
    });
  }
}

const api = {
  get: (endpoint, options = {}) => fetchWithInterceptor(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => fetchWithInterceptor(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => fetchWithInterceptor(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => fetchWithInterceptor(endpoint, { ...options, method: 'DELETE' })
};

export default api;
