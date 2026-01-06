import { createContext, useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "../api/fetcher";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const isLoggingOut = useRef(false);  //  Prevent race condition
  
  const { data: user, error, isLoading } = useSWR(
    token && !isLoggingOut.current ? "/auth/me" : null,  // Don't fetch during logout
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,  // Prevent duplicate requests
      onSuccess: () => {
        setIsAuthenticating(false);
      },
      onError: (err) => {
        setIsAuthenticating(false);
        //  Only clear token on 401, and only if we have a token
        if (err.response?.status === 401 && token && !isLoggingOut.current) {
          console.warn("Token invalid or expired, clearing...");
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }
  );

  // Use useCallback to prevent function recreation
  const login = useCallback((newToken) => {
    isLoggingOut.current = false;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticating(false);
    mutate("/auth/me");
  }, []);

  const logout = useCallback(() => {
    isLoggingOut.current = true;  //  Prevent auth check during logout
    localStorage.removeItem("token");
    setToken(null);
    mutate("/auth/me", null, false);
    
    // Reset after a brief delay
    setTimeout(() => {
      isLoggingOut.current = false;
    }, 100);
  }, []);

  //  Sync localStorage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          setToken(e.newValue);
          mutate("/auth/me");
        } else {
          setToken(null);
          mutate("/auth/me", null, false);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        error, 
        login, 
        logout, 
        isLoading: isAuthenticating || isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}