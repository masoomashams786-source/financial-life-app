import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// REQUEST INTERCEPTOR - Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR - Handle errors globally
// NOTE: 401 handling is delegated to AuthContext to avoid conflicts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network/timeout errors for debugging
    if (error.code === "ECONNABORTED") {
      console.error("[API] Request timeout - server is taking too long");
    } else if (!error.response) {
      console.error("[API] Network error - server may be down");
    } else if (error.response.status >= 500) {
      console.error("[API] Server error:", error.response?.data?.message || "Internal server error");
    }
    
    // Always reject - let calling code decide how to handle
    return Promise.reject(error);
  }
);

export default api;
