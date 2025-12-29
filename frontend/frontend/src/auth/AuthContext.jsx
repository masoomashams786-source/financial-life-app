import { createContext, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "../api/fetcher";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  const { data: user, error } = useSWR(
    token ? "/auth/me" : null, 
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      onError: (err) => {
        // If 401, clear the invalid token
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }
  );

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    mutate("/auth/me");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    mutate("/auth/me", null, false);
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}