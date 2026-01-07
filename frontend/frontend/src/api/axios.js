import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Reduced from 15s to 10s
});

// REQUEST INTERCEPTOR - Optimized
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Don't log in production
    if (import.meta.env.DEV) {
      console.error("Request interceptor error:", error);
    }
    return Promise.reject(error);
  }
);

//  RESPONSE INTERCEPTOR - Optimized with debouncing
let redirectTimeout = null;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized with debouncing to prevent multiple redirects
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      
      // Debounce redirect to prevent race conditions
      if (!redirectTimeout) {
        redirectTimeout = setTimeout(() => {
          window.location.href = "/login";
          redirectTimeout = null;
        }, 100);
      }
    }
    
    // Only log detailed errors in development
    if (import.meta.env.DEV) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
      }
      
      if (!error.response) {
        console.error('Network error - server may be down');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;