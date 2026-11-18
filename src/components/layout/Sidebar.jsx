import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  Home,
  ChevronRight,
  Library,
  X,
} from "lucide-react";
import { useContext } from "react";
import { useTheme } from "../../context/ThemeContext";
import { LibraryContext } from "../../context/LibraryContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { books, members, transactions } = useContext(LibraryContext);
  const isDark = theme === "dark";

  const activeTransactions = transactions.filter((t) =>
    ["Issued", "Overdue"].includes(t.status)
  ).length;

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: "/books",
      label: "Books Catalog",
      icon: BookOpen,
      badge: books.length,
    },
    {
      to: "/members",
      label: "Members",
      icon: Users,
      badge: members.length,
    },
    {
      to: "/transactions",
      label: "Transactions",
      icon: ArrowLeftRight,
      badge: activeTransactions > 0 ? `${activeTransactions} active` : null,
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-68 flex-col border-r transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "border-slate-800/80 bg-[#080d1a]/95 backdrop-blur-xl text-white shadow-xl"
            : "border-slate-200/90 bg-white/95 backdrop-blur-xl text-slate-800"
        }`}
      >
        {/* Sidebar Header Brand */}
        <div className="flex h-18 items-center justify-between border-b px-6 border-slate-200/80 dark:border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent dark:from-white dark:to-cyan-200">
                Lumina<span className="text-indigo-600 dark:text-cyan-400">Lib</span>
              </h2>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Management Console
              </p>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Public Homepage Banner Shortcut */}
        <div className="p-4">
          <Link
            to="/"
            className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100/90 hover:border-indigo-200 hover:text-indigo-800 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-cyan-300 dark:hover:bg-indigo-900/40 dark:hover:text-cyan-200 dark:hover:border-cyan-500/40"
          >
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
              <span>Public Books Portal</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Main Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 hover:brightness-105 dark:from-indigo-600 dark:to-cyan-600"
                      : isDark
                        ? "text-slate-300 hover:bg-slate-800/80 hover:text-cyan-300"
                        : "text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${
                          isActive
                            ? "text-white"
                            : isDark
                              ? "text-slate-400 group-hover:text-cyan-400"
                              : "text-slate-400 group-hover:text-indigo-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeColor ||
                              (isDark
                                ? "bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-cyan-200"
                                : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700")
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                System Active
              </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              Athena Core v2.4 • Offline/Local Sync
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
