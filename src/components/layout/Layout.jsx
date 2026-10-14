import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Header />

        <main
          className={`min-h-[calc(100vh-4rem)] p-6 transition-colors ${
            isDark ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
