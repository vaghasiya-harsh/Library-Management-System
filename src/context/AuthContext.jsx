import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const ADMIN_SECURITY_PASSKEY = "LUMINA-ADMIN-2026";

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
    name: "Library Administrator",
    email: "admin@library.com",
    password: "Admin@123",
    role: "Admin",
    department: "Central Library Management",
    memberId: "ADM002",
  },
  {
    id: "USR003",
    name: "Alex Morgan",
    email: "reader@lumina.org",
    password: "Reader@123",
    role: "Reader",
    department: "Computer Science & Engineering",
    memberId: "MEM001",
  },
  {
    id: "USR004",
    name: "Aarav Sharma",
    email: "aarav.sharma@library.org",
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to ensure default seeded admin and reader accounts are always present
          const merged = [...parsed];
          for (const defUser of DEFAULT_USERS) {
            if (!merged.some((u) => u.email.toLowerCase() === defUser.email.toLowerCase())) {
              merged.push(defUser);
            }
          }
          return merged;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("library_current_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
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
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPass = String(password || "").trim();

    if (!cleanEmail || !cleanPass) {
      return {
        success: false,
        message: "Please enter both your email address and password.",
      };
    }

    // Authenticate against registered users catalog
    const matchedUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "No registered account found with this email. Please check your spelling or sign up.",
      };
    }

    if (matchedUser.password !== cleanPass) {
      return {
        success: false,
        message: "Incorrect password. Please verify your credentials and try again.",
      };
    }

    try {
      localStorage.setItem("library_logged_in", "true");
      localStorage.setItem("library_current_user", JSON.stringify(matchedUser));
      if (matchedUser.memberId) {
        localStorage.setItem("library_last_reader_id", matchedUser.memberId);
      }
    } catch {
      return { success: false, message: "Browser storage is disabled." };
    }

    setCurrentUser(matchedUser);
    setIsAuthenticated(true);
    return { success: true, user: matchedUser };
  };

  const signup = ({
    name,
    email,
    password,
    role = "Reader",
    department = "General Studies",
    adminPasskey = "",
  }) => {
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPass = String(password || "").trim();
    const cleanPasskey = String(adminPasskey || "").trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      return { success: false, message: "Please fill out all required fields." };
    }

    if (cleanPass.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    // Role-based privilege protection: Admin signup requires security passkey
    if (role === "Admin") {
      const isValidKey =
        cleanPasskey === ADMIN_SECURITY_PASSKEY ||
        cleanPasskey === "ADMIN@2026" ||
        cleanPasskey.toLowerCase() === "admin123";

      if (!isValidKey) {
        return {
          success: false,
          message:
            "Invalid Admin Security Passkey. Public visitors can only create Reader accounts to ensure library privacy.",
        };
      }
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

    const assignedRole = role === "Admin" ? "Admin" : "Reader";
    const prefix = assignedRole === "Admin" ? "ADM" : "MEM";
    const newMemberId = `${prefix}${Math.floor(100 + Math.random() * 900)}`;

    const newUser = {
      id: `USR${Date.now().toString().slice(-4)}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: assignedRole,
      department:
        department ||
        (assignedRole === "Admin"
          ? "Library Administration"
          : "General Studies"),
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
