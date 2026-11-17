import { useState, useContext } from "react";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Building,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { LibraryContext } from "../../context/LibraryContext";
import ThemeToggle from "../../components/common/ThemeToggle";

function Login() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const { isAuthenticated, currentUser, login, signup, logout } = useAuth();
  const { addMember } = useContext(LibraryContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab: 'login' | 'signup'
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [authMode, setAuthMode] = useState(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("Reader"); // 'Reader' | 'Admin'
  const [signupDepartment, setSignupDepartment] = useState("Computer Science & Engineering");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Switch tabs
  const handleTabSwitch = (mode) => {
    setAuthMode(mode);
    setError("");
    setSuccessMsg("");
    setSearchParams(mode === "signup" ? { mode: "signup" } : {});
  };

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login(loginEmail.trim(), loginPassword);
    if (!result.success) {
      setError(result.message);
      return;
    }

    const destination = location.state?.from || (result.user?.role === "Admin" ? "/dashboard" : "/");
    navigate(destination, { replace: true });
  };

  // Handle Sign-Up submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const signupResult = signup({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      role: signupRole,
      department: signupDepartment.trim(),
    });

    if (!signupResult.success) {
      setError(signupResult.message);
      return;
    }

    // Also register member in library catalog if it's a reader
    if (signupRole === "Reader") {
      addMember({
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: "+91 98765 43210",
        course: signupDepartment.trim() || "General Studies",
        joiningDate: new Date().toISOString().split("T")[0],
        status: "Active",
      });
    }

    setSuccessMsg("Account successfully created! Redirecting to library...");
    setTimeout(() => {
      const destination = signupRole === "Admin" ? "/dashboard" : "/";
      navigate(destination, { replace: true });
    }, 900);
  };

  // Guest explore handler
  const handleGuestExplore = () => {
    login("reader@lumina.org", "Reader@123");
    navigate("/", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50/60 px-4 py-8 sm:py-12 transition-colors duration-200 dark:bg-transparent overflow-hidden">
      {/* Top Floating Controls: Back to Home & Theme Toggle */}
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

      {/* Dynamic Background Aurora Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-125 w-175 -translate-x-1/2 rounded-full `bg-gradient-to-r` from-indigo-500/20 via-cyan-400/20 to-purple-500/15 blur-3xl dark:from-indigo-600/25 dark:via-cyan-500/15" />
      <div className="pointer-events-none absolute bottom-12 right-12 -z-10 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-20 -z-10 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl dark:border-indigo-500/25 dark:bg-[#070b18]/95 dark:shadow-2xl dark:shadow-indigo-950/80 transition-all duration-300">
          {/* Subtle Top Ambient Aurora Glow Line */}
          <div className="pointer-events-none absolute top-0 left-8 right-8 h-px `bg-gradient-to-r` from-transparent via-indigo-500/60 dark:via-cyan-400/60 to-transparent" />

          {/* Logo & Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl `bg-gradient-to-r` from-indigo-500 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 transition group-hover:scale-105">
                <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            </Link>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Lumina<span className="text-indigo-600 dark:text-cyan-400">Library</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Smart Central Library Management & Reader Circulation Portal
            </p>
          </div>

          {/* If the User is ALREADY LOGGED IN: Give immediate Sign-Up Option or Continue */}
          {isAuthenticated && currentUser ? (
            <div className="mt-6 space-y-5 animate-in fade-in duration-300">
              <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/70 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full `bg-gradient-to-r` from-indigo-600 to-cyan-600 text-white font-black text-sm shadow-xs">
                    {currentUser.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </span>
                      <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-cyan-300">
                        {currentUser.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>You are currently authenticated with active privileges.</span>
              </div>

              {/* Already Logged-in User Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    handleTabSwitch("signup");
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl `bg-gradient-to-r` from-indigo-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 active:scale-98 transition"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up / Register Another Account</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-98 transition dark:border-slate-700 dark:bg-[#0c1322] dark:text-slate-300"
                  >
                    <span>Go to Library</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {currentUser.role === "Admin" ? (
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-100 active:scale-98 transition dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-cyan-300"
                    >
                      <span>Admin Dashboard</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-100 active:scale-98 transition dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Unauthenticated Visitor: Dynamic Tabs [Log In] and [Sign Up] */
            <div className="mt-6 space-y-5">
              {/* Animated Mode Switcher Tabs */}
              <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-[#0b1021] border border-slate-200/80 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-all duration-200 ${
                    authMode === "login"
                      ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800/95 dark:text-cyan-300 dark:border dark:border-slate-700/60 scale-[1.01]"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Log In (Sign In)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabSwitch("signup")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-all duration-200 ${
                    authMode === "signup"
                      ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800/95 dark:text-cyan-300 dark:border dark:border-slate-700/60 scale-[1.01]"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Sign Up (Register)</span>
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 animate-in shake"
                >
                  {error}
                </div>
              )}

              {/* Success Alert */}
              {successMsg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in zoom-in-95">
                  {successMsg}
                </div>
              )}

              {/* Tab 1: Log In Form */}
              {authMode === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-200">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-cyan-400" />
                      <input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="your.email@university.edu"
                        required
                        autoComplete="username"
                        className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-[#0c1322] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-[#0c1322] dark:focus:ring-3 dark:focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-cyan-400" />
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-[#0c1322] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-[#0c1322] dark:focus:ring-3 dark:focus:ring-cyan-400/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl `bg-gradient-to-r` from-indigo-600 via-indigo-500 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.98]"
                  >
                    Sign In & Enter Library
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Don't have a library account yet?{" "}
                      <button
                        type="button"
                        onClick={() => handleTabSwitch("signup")}
                        className="font-bold text-indigo-600 hover:underline dark:text-cyan-400"
                      >
                        Sign Up Here
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Tab 2: Sign Up Form */}
              {authMode === "signup" && (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Full Name *
                    </label>
                    <div className="relative group">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-cyan-400" />
                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-[#0c1322] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-[#0c1322] dark:focus:ring-3 dark:focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Email Address *
                    </label>
                    <div className="relative group">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-cyan-400" />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="john.doe@university.edu"
                        className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-[#0c1322] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-[#0c1322] dark:focus:ring-3 dark:focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Create Password (min. 6 characters) *
                    </label>
                    <div className="relative group">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-cyan-400" />
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-[#0c1322] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-[#0c1322] dark:focus:ring-3 dark:focus:ring-cyan-400/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <span className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Account Type / Role
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSignupRole("Reader")}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${
                          signupRole === "Reader"
                            ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs dark:border-cyan-400 dark:bg-indigo-950/60 dark:text-cyan-300"
                            : "border-slate-200 bg-slate-50/80 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0c1322] dark:text-slate-400 dark:hover:border-slate-700"
                        }`}
                      >
                        <BookOpen className="h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-xs font-bold">Reader / Student</p>
                          <p className="text-[10px] opacity-75">Borrow books & passes</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignupRole("Admin")}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${
                          signupRole === "Admin"
                            ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs dark:border-cyan-400 dark:bg-indigo-950/60 dark:text-cyan-300"
                            : "border-slate-200 bg-slate-50/80 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0c1322] dark:text-slate-400 dark:hover:border-slate-700"
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-xs font-bold">Librarian / Admin</p>
                          <p className="text-[10px] opacity-75">Manage circulation</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Department / Course */}
                  <div>
                    <label
                      htmlFor="signup-dept"
                      className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Department / Course
                    </label>
                    <div className="relative group">
                      <Building className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-cyan-400" />
                      <input
                        id="signup-dept"
                        type="text"
                        value={signupDepartment}
                        onChange={(e) => setSignupDepartment(e.target.value)}
                        placeholder="e.g. Computer Science & Engineering"
                        className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-[#0c1322] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-[#0c1322] dark:focus:ring-3 dark:focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl `bg-gradient-to-r` from-indigo-600 via-indigo-500 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.98]"
                  >
                    Create Account & Enter
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => handleTabSwitch("login")}
                        className="font-bold text-indigo-600 hover:underline dark:text-cyan-400"
                      >
                        Log In Instead
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Guest Explore Link */}
              <div className="border-t border-slate-200/80 pt-4 text-center dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleGuestExplore}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-300 transition inline-flex items-center gap-1.5"
                >
                  <span>Or continue to browse in Guest Preview mode</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
