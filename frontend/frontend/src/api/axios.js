import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://financial-life-app.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // ✅ INCREASED to 30 seconds (was 15 seconds)
});

// ✅ REQUEST INTERCEPTOR - Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server is taking too long');
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - server may be down');
    }
    
    // Handle 500 errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response?.data?.message || 'Internal server error');
    }
    
    return Promise.reject(error);
  }
);

export default api;