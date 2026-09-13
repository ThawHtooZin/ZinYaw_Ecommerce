import axios from 'axios';

// 1. Create a custom Axios instance with defaults
const api = axios.create({
  // Points to your Laravel API root
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// 2. Request Interceptor: Injects token into outgoing headers
api.interceptors.request.use(
  (config) => {
    // Read the stored Sanctum token
    const token = localStorage.getItem('zinyaw_token');
    
    // Attach header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Formats responses and handles auth expiration
api.interceptors.response.use(
  (response) => {
    // Laravel wraps returns in { success: true, data: { ... } }
    // Unpacking response.data avoids writing res.data.data everywhere in components
    return response.data;
  },
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Clearing stored token.');
      localStorage.removeItem('zinyaw_token');
      // Redirect unauthenticated requests to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Extract custom Laravel exception messages or validation errors
    const customMessage = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected network error occurred.';

    return Promise.reject(new Error(customMessage));
  }
);

export default api;