import axios from "axios";

const apiBaseUrl = String(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const api = axios.create({
  baseURL: apiBaseUrl
});

// Automatically inject JWT token into requests
api.interceptors.request.use(
  (config) => {
    if (config.baseURL && typeof config.url === 'string' && config.url.startsWith('/')) {
      // Preserve the configured baseURL path segment (for example /api)
      // when callers use leading-slash paths like `/banners` or `/categories`.
      config.url = config.url.replace(/^\/+/, '');
    }

    // Prefer token from localStorage, fall back to sessionStorage
    const rawToken = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
    const token = typeof rawToken === 'string' ? rawToken.trim() : "";
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
      // Some backend consumers also check this header
      config.headers['x-access-token'] = token;
      // Also include the user's user_id so backend can record created_by/updated_by
      try {
        const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user') || '';
        const user = rawUser ? JSON.parse(rawUser) : null;
        if (user && user.user_id) {
          config.headers['x-user-id'] = user.user_id;
        }
      } catch (e) {
        // ignore JSON errors
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't redirect if the 401 came from the login endpoints themselves
      // (wrong password etc.) — only redirect for authenticated route failures
      const isAuthEndpoint =
        url.includes('/auth/login') || url.includes('/auth/google-login');

      if (!isAuthEndpoint) {
        console.error('API request unauthorized:', url, 'token present:', !!(localStorage.getItem('token') || sessionStorage.getItem('token')));
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        try {
          const current = window.location.pathname || '/';
          if (!current.includes('/login')) {
            window.location.href = '/login';
          }
        } catch (e) {
          // ignore navigation errors in non-browser environments
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;