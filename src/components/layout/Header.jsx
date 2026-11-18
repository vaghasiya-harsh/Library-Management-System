import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, Home, ShieldCheck } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import AlertModal from "../common/AlertModal";
import ThemeToggle from "../common/ThemeToggle";

const Header = ({ onMenuClick }) => {
  const { theme } = useTheme();
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isDark = theme === "dark";

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 flex h-18 items-center justify-between border-b px-4 sm:px-7 glass-nav transition-colors duration-200 ${
          isDark
            ? "border-slate-800/80 bg-[#060913]/90 text-white"
            : "border-slate-200/90 bg-white/90 text-slate-900"
        }`}
      >
        {/* Left: Mobile Menu & Current Area Heading */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open Sidebar Menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 shadow-2xs transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/40 dark:hover:text-cyan-300 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight font-display truncate">
                Library Console
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-cyan-300 border border-indigo-100 dark:border-indigo-900/50">
                <ShieldCheck className="h-3 w-3" />
                Live Management
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Circulation Desk, Book Catalog & Member Management
            </p>
          </div>
        </div>

        {/* Right Action Icons & Profile - Perfectly Arranged with uniform h-10 sizing */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Public Home Link */}
          <Link
            to="/"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-300/80 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/40 dark:hover:text-cyan-300"
            title="Go to Public Books Portal"
          >
            <Home className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Books Home</span>
          </Link>

          {/* Dynamic Modern Theme Toggle */}
          <ThemeToggle size="md" />

          {/* User Profile Pill */}
          <div className="flex h-10 items-center gap-2.5 rounded-xl border border-slate-300/80 bg-white px-2.5 sm:px-3 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
            <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-xs font-black text-white shadow-xs">
              {currentUser?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-extrabold leading-tight text-slate-900 dark:text-white truncate max-w-[120px]">
                {currentUser?.name || "Admin"}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold leading-tight dark:text-slate-400">
                {currentUser?.role || "Librarian"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-rose-300/80 bg-rose-50 px-3 text-xs font-bold text-rose-700 shadow-2xs transition hover:bg-rose-100 hover:border-rose-400 hover:text-rose-800 active:scale-95 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 dark:hover:border-rose-700/60 dark:hover:text-rose-200"
            title="Sign out of console"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <AlertModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out Confirmation"
        message="Are you sure you want to end your current library administrator session?"
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