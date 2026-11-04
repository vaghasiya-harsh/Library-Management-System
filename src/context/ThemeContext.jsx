import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("library_theme");
      if (saved === "dark" || saved === "light") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  // Apply dark class and synchronize storage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("library_theme", theme);
    } catch {
      // Ignore storage errors in restricted iframe/browser modes
    }
  }, [theme]);

  /**
   * Dynamic Modern Theme Toggle:
   * Uses the native View Transitions API with circular ripple wave originating
   * from the trigger button (or screen center) for an ultra modern experience.
   * Gracefully falls back to a smooth CSS transition if unsupported.
   */
  const toggleTheme = useCallback((event) => {
    const nextTheme = theme === "light" ? "dark" : "light";

    // Check if View Transitions API is supported & user has not requested reduced motion
    const canUseViewTransition =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUseViewTransition) {
      // Smooth fallback with transition class
      document.documentElement.classList.add("theme-transitioning");
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      setTheme(nextTheme);
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 450);
      return;
    }

    // Determine circular wave origin coordinates from click or center
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event && typeof event.clientX === "number" && typeof event.clientY === "number" && (event.clientX !== 0 || event.clientY !== 0)) {
      x = event.clientX;
      y = event.clientY;
    } else if (event?.target && typeof event.target.getBoundingClientRect === "function") {
      const rect = event.target.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    // Maximum distance from origin to the furthest viewport corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    try {
      const transition = document.startViewTransition(() => {
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        setTheme(nextTheme);
      });

      transition.ready
        .then(() => {
          const isNextDark = nextTheme === "dark";
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

          document.documentElement.animate(
            {
              clipPath: isNextDark ? clipPath : [...clipPath].reverse(),
            },
            {
              duration: 480,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              pseudoElement: isNextDark
                ? "::view-transition-new(root)"
                : "::view-transition-old(root)",
            }
          );
        })
        .catch(() => {
          // If animation fails, update state safely
          document.documentElement.classList.toggle("dark", nextTheme === "dark");
          setTheme(nextTheme);
        });
    } catch {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      setTheme(nextTheme);
    }
  }, [theme]);

  // Global Keyboard Shortcut: Alt + T to toggle theme anywhere
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
