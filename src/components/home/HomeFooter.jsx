import { Link } from "react-router-dom";
import { BookOpen, Shield, Clock } from "lucide-react";

const HomeFooter = () => {
  return (
    <footer className="relative mt-24 border-t border-slate-200/80 bg-white/60 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
      {/* Subtle Bottom Aurora Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent dark:from-white dark:via-cyan-100 dark:to-cyan-400 font-display">
                Lumina<span className="text-indigo-600 dark:text-cyan-400">Library</span>
              </span>
            </Link>

            <p className="max-w-md text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A state-of-the-art digital and physical library management system.
              Empowering readers, researchers, and administrators with intelligent book discovery, instant issue tracking, and comprehensive circulation analytics.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900/60">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>Open Mon - Sat: 8:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </p>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#explore-books" className="hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors">
                  Explore Books
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors">
                  Browse Categories
                </a>
              </li>
              <li>
                <a href="#featured-spotlight" className="hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors">
                  Featured Spotlight
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors">
                  Management Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Staff Portal
            </p>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/login" className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors">
                  <Shield className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Admin Sign In</span>
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors">
                  Book Inventory
                </Link>
              </li>
              <li>
                <Link to="/members" className="hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors">
                  Member Directory
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors">
                  Circulation Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Lumina Library System. All rights reserved.</p>
          <p className="text-slate-400 dark:text-slate-500">Smart Circulation & Catalog Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
