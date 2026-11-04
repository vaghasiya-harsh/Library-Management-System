import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ShieldCheck, LayoutDashboard, Menu, X, BookmarkCheck, UserPlus, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../common/ThemeToggle";

const HomeNavbar = ({ onOpenMyBooks }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isDark = theme === "dark";

  // Dynamic Scroll & Reading Progress Listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 25);

          const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
          setScrollProgress(Math.min(100, Math.max(0, scrolled)));

          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-3 sm:top-4.5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-auto">
      <div
        className={`mx-auto max-w-6xl relative overflow-hidden rounded-2xl sm:rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "border border-indigo-400/60 bg-white/95 shadow-2xl shadow-slate-900/12 backdrop-blur-xl dark:border-cyan-400/40 dark:bg-[#070b18]/95 dark:shadow-2xl dark:shadow-indigo-950/70 scale-[0.995]"
            : "border border-slate-300/80 bg-white/90 shadow-lg shadow-slate-900/5 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#070b18]/85 dark:shadow-none scale-100"
        }`}
      >
        {/* Subtle Top Ambient Aurora Glow Line */}
        <div className="pointer-events-none absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-indigo-500/60 dark:via-cyan-400/60 to-transparent" />

        {/* Dynamic Reading / Scroll Progress Bar at the bottom of the floating pill */}
        <div
          className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="flex h-15 sm:h-16 items-center justify-between px-4 sm:px-6 flex-nowrap">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent dark:from-white dark:via-indigo-200 dark:to-cyan-200 font-display">
                Lumina<span className="text-indigo-600 dark:text-cyan-400">Library</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - only visible on lg+ screens to prevent wrapping when buttons are expanded */}
          <nav className="hidden lg:flex items-center gap-6 text-xs xl:text-sm font-bold shrink-0">
            <a
              href="#explore-books"
              className="text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              Explore Books
            </a>
            <a
              href="#categories"
              className="text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              Categories
            </a>
            <a
              href="#featured-spotlight"
              className="text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              Featured
            </a>
            <a
              href="#library-features"
              className="text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              Features
            </a>
          </nav>

          {/* Right Action Controls - Perfectly aligned with uniform sizing */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-nowrap">
            {/* Dynamic Modern Theme Toggle */}
            <ThemeToggle size="md" />

            {/* Authenticated State */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 shrink-0 flex-nowrap">
                {/* Admin Mode Controls */}
                {currentUser?.role === "Admin" ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex h-9.5 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-3.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:brightness-110 hover:scale-105 active:scale-95 shrink-0"
                      title="Access Library Administration Console"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>

                    {/* Admin Profile Pill */}
                    <div className="flex h-9.5 items-center gap-2 rounded-xl border border-slate-300/80 bg-white px-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80 shrink-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-[10px]">
                        {currentUser?.name?.charAt(0) || "A"}
                      </div>
                      <span className="hidden sm:inline-block max-w-[80px] truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                        {currentUser?.name?.split(" ")[0] || "Admin"}
                      </span>
                      <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
                        Admin
                      </span>
                    </div>
                  </>
                ) : (
                  /* Reader Mode Controls */
                  <>
                    <button
                      type="button"
                      onClick={onOpenMyBooks}
                      className="flex h-9.5 items-center gap-1.5 rounded-xl border border-indigo-200/90 bg-indigo-50/80 px-3 text-xs font-bold text-indigo-700 shadow-2xs hover:border-indigo-400 hover:bg-indigo-100 hover:scale-102 active:scale-95 transition dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-cyan-300 dark:hover:bg-indigo-900/60 shrink-0"
                      title="View your borrowed books and return due dates"
                    >
                      <BookmarkCheck className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
                      <span className="hidden sm:inline">My Borrowed Books</span>
                      <span className="sm:hidden">My Books</span>
                    </button>

                    {/* Reader Profile Pill */}
                    <div className="flex h-9.5 items-center gap-2 rounded-xl border border-slate-300/80 bg-white px-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80 shrink-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-[10px]">
                        {currentUser?.name?.charAt(0) || "U"}
                      </div>
                      <span className="hidden sm:inline-block max-w-[80px] truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                        {currentUser?.name?.split(" ")[0] || "User"}
                      </span>
                      <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-indigo-700 dark:bg-indigo-950 dark:text-cyan-300">
                        Reader
                      </span>
                    </div>
                  </>
                )}

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl border border-rose-200/90 bg-rose-50/80 text-rose-600 shadow-2xs hover:bg-rose-100 hover:border-rose-400 active:scale-95 transition dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
                  title="Sign out of current account"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              /* Unauthenticated Visitor */
              <Link
                to="/login"
                className="flex h-9.5 items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700 hover:shadow-lg hover:scale-105 shrink-0"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Log In / Sign Up</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="flex lg:hidden h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 active:scale-95 transition dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/90 bg-white/95 px-5 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 space-y-3 rounded-b-2xl">
            {/* My Borrowed Books on Mobile */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyBooks?.();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl border border-indigo-200/90 bg-indigo-100/60 px-3.5 py-2.5 text-xs font-bold text-indigo-800 transition hover:bg-indigo-200/70 dark:border-indigo-800 dark:bg-indigo-950/70 dark:text-cyan-300"
            >
              <BookmarkCheck className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
              <span>My Borrowed Books & Returns</span>
            </button>

            <a
              href="#explore-books"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Explore Books
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Categories
            </a>
            <a
              href="#featured-spotlight"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Featured Titles
            </a>
            <a
              href="#library-features"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Why Lumina Library
            </a>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-[10px]">
                        {currentUser?.name?.charAt(0) || "U"}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {currentUser?.name || "Active Member"}
                      </span>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        currentUser?.role === "Admin"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-cyan-300"
                      }`}
                    >
                      {currentUser?.role || "Reader"}
                    </span>
                  </div>

                  {currentUser?.role === "Admin" && (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-xs"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Go to Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    to="/login?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white py-2.5 text-xs font-bold text-indigo-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-cyan-300"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>+ Register / Sign Up New User</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Log In / Sign Up</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HomeNavbar;
