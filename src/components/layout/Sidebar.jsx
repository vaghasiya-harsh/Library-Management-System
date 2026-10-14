import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Sidebar = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sidebarClass = isDark
    ? "bg-gray-900 text-white border-gray-800"
    : "bg-white text-gray-900 border-gray-200";

  const inactiveLinkClass = isDark
    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen w-64 border-r transition-colors ${sidebarClass}`}
    >
      <div
        className={`border-b px-6 py-6 ${
          isDark ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <h2 className="text-2xl font-bold">Library</h2>

        <p className={isDark ? "mt-1 text-xs text-gray-400" : "mt-1 text-xs text-gray-500"}>
          Management System
        </p>
      </div>

      <nav className="space-y-2 px-4 py-6">
        {[
          { to: "/dashboard", label: "Dashboard" },
          { to: "/books", label: "Books" },
          { to: "/members", label: "Members" },
          { to: "/transactions", label: "Transactions" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : inactiveLinkClass
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
