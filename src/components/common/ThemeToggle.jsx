import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Modern Dynamic Theme Toggle Button
 * Features:
 * - Fluid Sun / Moon morphing animation with 360-degree rotation and scale physics
 * - Ambient radial glow aura (Warm Amber in light mode, Luminous Cyan-Indigo in dark mode)
 * - Coordinates-aware View Transition ripple trigger
 * - Micro-interaction scale bounce on click
 * - Accessible ARIA labels and tooltip
 */
const ThemeToggle = ({
  className = "",
  size = "md", // "sm" | "md" | "lg"
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-9.5 w-9.5 text-xs sm:h-10 sm:w-10",
    lg: "h-11 w-11 text-sm",
  }[size] || "h-10 w-10 text-xs";

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4.5 w-4.5",
    lg: "h-5 w-5",
  }[size] || "h-4.5 w-4.5";

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e)}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode (Alt+T)" : "Switch to Dark Mode (Alt+T)"}
      className={`group relative flex items-center justify-center rounded-xl border transition-all duration-300 active:scale-90 ${sizeClasses} ${
        isDark
          ? "border-slate-800 bg-slate-900/90 text-amber-300 hover:border-amber-400/50 hover:bg-slate-800 hover:text-amber-200 hover:shadow-lg hover:shadow-amber-500/15"
          : "border-slate-300/80 bg-white/95 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/80 hover:text-indigo-700 hover:shadow-lg hover:shadow-indigo-500/15"
      } shadow-2xs backdrop-blur-md cursor-pointer ${className}`}
    >
      {/* Ambient Pulsing Glow Aura */}
      <span
        className={`pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
          isDark
            ? "bg-radial from-amber-400/20 via-transparent to-transparent blur-sm"
            : "bg-radial from-indigo-500/15 via-transparent to-transparent blur-sm"
        }`}
      />

      {/* Sun / Moon Animated Morphing Container */}
      <span className="relative flex items-center justify-center">
        {isDark ? (
          <span className="flex items-center justify-center animate-in zoom-in-75 spin-in-180 duration-300">
            <Sun className={`${iconSizes} text-amber-400 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110`} />
          </span>
        ) : (
          <span className="flex items-center justify-center animate-in zoom-in-75 -spin-in-180 duration-300">
            <Moon className={`${iconSizes} text-indigo-600 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110`} />
          </span>
        )}
      </span>

      {showLabel && (
        <span className="ml-2 font-bold text-xs">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;

