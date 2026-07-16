import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

// Automatically inject JWT token into requests
api.interceptors.request.use(
  (config) => {
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
      console.error('API request unauthorized:', error.config?.url, 'token present:', !!(localStorage.getItem('token') || sessionStorage.getItem('token')));
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      // Redirect to login so user can re-authenticate
      try {
        const current = window.location.pathname || '/';
        // If already on login page, do nothing
        if (!current.includes('/login')) {
          window.location.href = '/login';
        }
      } catch (e) {
        // ignore navigation errors in non-browser environments
      }
    }
    return Promise.reject(error);
  }
);

export default api;