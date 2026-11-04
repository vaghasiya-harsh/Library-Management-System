import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: "USR001",
    name: "Harsh Vaghasiya",
    email: "vaghasiyah3@gmail.com",
    password: "Harsh@123",
    role: "Admin",
    department: "Chief Librarian & Administration",
    memberId: "ADM001",
  },
  {
    id: "USR002",
    name: "Alex Morgan",
    email: "reader@lumina.org",
    password: "Reader@123",
    role: "Reader",
    department: "Computer Science & Engineering",
    memberId: "MEM001",
  },
];

export function AuthProvider({ children }) {
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("library_registered_users");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("library_current_user");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // If logged in flag was true, fallback to default admin
    if (localStorage.getItem("library_logged_in") === "true") {
      return DEFAULT_USERS[0];
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem("library_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const saveUsers = (users) => {
    try {
      localStorage.setItem("library_registered_users", JSON.stringify(users));
      setRegisteredUsers(users);
    } catch {
      // storage error
    }
  };

  const login = (email, password) => {
    // Demo credentials only. Never use hardcoded credentials in production.
    if (email === "admin@library.com" && password === "Admin@123") {
      try {
        localStorage.setItem("library_logged_in", "true");
        localStorage.setItem("library_current_user", JSON.stringify(user));
        if (user.memberId) {
          localStorage.setItem("library_last_reader_id", user.memberId);
        }
      } catch {
        return { success: false, message: "Browser storage is disabled." };
      }

      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    }

    return {
      success: false,
      message: "Invalid email or password. Please check your credentials.",
    };
  };

  const signup = ({ name, email, password, role = "Reader", department = "General Studies" }) => {
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPass = String(password || "").trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      return { success: false, message: "Please fill out all required fields." };
    }

    if (cleanPass.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return {
        success: false,
        message: "An account with this email already exists. Please log in instead.",
      };
    }

    const newMemberId = `MEM${Math.floor(100 + Math.random() * 900)}`;
    const newUser = {
      id: `USR${Date.now().toString().slice(-4)}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: role || "Reader",
      department: department || "General Studies",
      memberId: newMemberId,
    };

    const updated = [...registeredUsers, newUser];
    saveUsers(updated);

    try {
      localStorage.setItem("library_logged_in", "true");
      localStorage.setItem("library_current_user", JSON.stringify(newUser));
      localStorage.setItem("library_last_reader_id", newMemberId);
    } catch {
      // storage error
    }

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
  };

  const logout = () => {
    try {
      localStorage.removeItem("library_logged_in");
      localStorage.removeItem("library_current_user");
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        registeredUsers,
        login,
        signup,
        logout,
      }}
    >
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
