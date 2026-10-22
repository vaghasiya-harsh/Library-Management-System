import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem("library_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const login = (email, password) => {
    // Demo credentials only. Never use hardcoded credentials in production.
    if (email === "vaghasiyah3@gmail.com" && password === "Harsh@123") {
      try {
        localStorage.setItem("library_logged_in", "true");
      } catch {
        return {
          success: false,
          message: "Browser storage is unavailable.",
        };
      }

      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  };

  const logout = () => {
    try {
      localStorage.removeItem("library_logged_in");
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
