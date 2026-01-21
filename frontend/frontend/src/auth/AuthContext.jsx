import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { useSWRConfig } from "swr";
import api from "../api/axios";

// ============================================
// AUTH STATE TYPES
// ============================================
// State machine: idle -> loading -> authenticated | unauthenticated
const AUTH_STATUS = {
  IDLE: "idle",           // Initial state before any check
  LOADING: "loading",     // Checking authentication
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

// ============================================
// CONTEXT
// ============================================
export const AuthContext = createContext(null);

// ============================================
// TOKEN UTILITIES
// ============================================
const TOKEN_KEY = "token";

const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

// ============================================
// PROVIDER
// ============================================
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(AUTH_STATUS.IDLE);
  const [error, setError] = useState(null);
  const { mutate } = useSWRConfig();

  // Derive loading state from status
  const isLoading = status === AUTH_STATUS.IDLE || status === AUTH_STATUS.LOADING;
  const isAuthenticated = status === AUTH_STATUS.AUTHENTICATED;

  // ============================================
  // VERIFY TOKEN & FETCH USER
  // ============================================
  const verifyAuth = useCallback(async () => {
    const token = tokenStorage.get();
    
    if (!token) {
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
      setUser(null);
      return;
    }

    setStatus(AUTH_STATUS.LOADING);
    setError(null);

    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
      setStatus(AUTH_STATUS.AUTHENTICATED);
    } catch (err) {
      // Token is invalid or expired
      tokenStorage.remove();
      setUser(null);
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
      
      // Only set error for non-401 failures (401 is expected for invalid tokens)
      if (err.response?.status !== 401) {
        setError(err);
      }
    }
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = useCallback((token, userData = null) => {
    tokenStorage.set(token);
    setError(null);
    
    if (userData) {
      // If user data is provided (from login response), use it directly
      setUser(userData);
      setStatus(AUTH_STATUS.AUTHENTICATED);
    } else {
      // Otherwise verify the token to get user data
      verifyAuth();
    }
  }, [verifyAuth]);

  // ============================================
  // LOGOUT
  // ============================================
  const logout = useCallback(async () => {
    // Clear token first to prevent any in-flight requests from using it
    tokenStorage.remove();
    
    // Clear auth state
    setUser(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
    setError(null);
    
    // Clear all SWR cache to prevent stale authenticated data
    // This is safer than selective clearing
    await mutate(
      () => true, // Match all keys
      undefined,  // Set all to undefined
      { revalidate: false }
    );
  }, [mutate]);

  // ============================================
  // INITIAL AUTH CHECK
  // ============================================
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // ============================================
  // CROSS-TAB SYNC
  // ============================================
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== TOKEN_KEY) return;
      
      if (e.newValue) {
        // Token added in another tab - verify it
        verifyAuth();
      } else {
        // Token removed in another tab - logout locally
        setUser(null);
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
        mutate(() => true, undefined, { revalidate: false });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [verifyAuth, mutate]);

  // ============================================
  // CONTEXT VALUE (memoized to prevent unnecessary re-renders)
  // ============================================
  const value = useMemo(
    () => ({
      user,
      error,
      status,
      isLoading,
      isAuthenticated,
      login,
      logout,
      // Expose for edge cases where manual refresh is needed
      refreshAuth: verifyAuth,
    }),
    [user, error, status, isLoading, isAuthenticated, login, logout, verifyAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
