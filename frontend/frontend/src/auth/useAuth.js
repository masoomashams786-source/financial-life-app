import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Custom hook to access auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
      "Wrap your component tree with <AuthProvider>."
    );
  }
  
  return context;
}