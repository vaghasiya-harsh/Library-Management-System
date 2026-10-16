import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6 transition-colors ${
        isDark
          ? "border-gray-700 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-900"
      }`}
    >
      <h1 className="text-xl font-semibold">Library Management System</h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            isDark
              ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
              : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
          }`}
        >
          {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium dark:border-gray-700 dark:text-gray-100"
        >
          Logout
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          A
        </div>

        <div>
          <p className="text-sm font-medium">Admin</p>
          <p
            className={
              isDark ? "text-xs text-gray-300" : "text-xs text-gray-500"
            }
          >
            Administrator
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
