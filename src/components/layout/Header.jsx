import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import AlertModal from "../common/AlertModal";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isDark = theme === "dark";

  // Confirm karne par logout hoga
  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6 ${
          isDark
            ? "border-gray-700 bg-gray-900 text-white"
            : "border-gray-200 bg-white text-gray-900"
        }`}
      >
        <h1 className="text-xl font-semibold">
          Library Management System
        </h1>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              isDark
                ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Admin Profile */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium">Admin</p>
            <p
              className={`text-xs ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Administrator
            </p>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <AlertModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Are you sure?"
        message="Are you sure you want to logout from your library account?"
        type="warning"
        buttonText="Yes, Logout"
        showCancel={true}
        cancelText="Cancel"
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Header;