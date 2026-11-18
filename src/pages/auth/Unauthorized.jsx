import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Home,
  AlertOctagon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/common/ThemeToggle";

function Unauthorized() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const attemptedPath = location.state?.attemptedPath || "/dashboard";
  const userRole = currentUser?.role || "Reader";

  const handleSwitchAccount = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50/70 px-4 py-8 sm:py-12 transition-colors duration-200 dark:bg-transparent overflow-hidden">
      {/* Top Floating Controls */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between px-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Library Portal</span>
        </Link>

        <ThemeToggle size="sm" />
      </div>

      {/* Ambient Aurora Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-125 w-175 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500/15 via-amber-400/10 to-indigo-500/15 blur-3xl dark:from-rose-600/20 dark:via-amber-500/10" />
      <div className="pointer-events-none absolute bottom-12 right-12 -z-10 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="w-full max-w-lg">
        {/* Main 403 Card */}
        <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 bg-white/95 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl dark:border-rose-500/25 dark:bg-[#070b18]/95 dark:shadow-2xl dark:shadow-rose-950/60 transition-all duration-300">
          {/* Subtle Top Red Accent Line */}
          <div className="pointer-events-none absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-rose-500/70 to-transparent" />

          {/* Icon & Error Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-lg shadow-rose-500/20 dark:bg-rose-950/50 dark:border-rose-900/50 dark:text-rose-400 animate-in zoom-in-95">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 border border-rose-200 px-3 py-1 text-[11px] font-black tracking-wider uppercase text-rose-700 dark:bg-rose-950/80 dark:border-rose-900/60 dark:text-rose-300">
              <AlertOctagon className="h-3.5 w-3.5" />
              <span>403 • Access Restricted</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Administrator Privileges Required
            </h1>

            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              The requested section (<code className="font-mono text-indigo-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">{attemptedPath}</code>) is restricted to library administrative staff only.
            </p>
          </div>

          {/* Current User Session Status Card */}
          <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-sm font-black text-white shadow-xs">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || "Active Reader"}
                  </p>
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/80 dark:text-cyan-300">
                    {userRole}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || "reader@lumina.org"}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Why was access blocked?</span> In accordance with data privacy guidelines, readers and students cannot view other patrons' records, edit catalog metadata, or manage library circulation logs.
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 space-y-3">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.98]"
            >
              <Home className="h-4 w-4" />
              <span>Return to Public Library Catalog</span>
            </Link>

            <button
              type="button"
              onClick={handleSwitchAccount}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 active:scale-98 transition dark:border-slate-700 dark:bg-[#0c1322] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4 text-slate-400" />
              <span>Switch / Sign In with Administrator Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
