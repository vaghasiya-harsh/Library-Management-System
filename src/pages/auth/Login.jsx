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
  KeyRound,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { LibraryContext } from "../../context/LibraryContext";
import ThemeToggle from "../../components/common/ThemeToggle";

function Login() {
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
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("Reader"); // 'Reader' | 'Admin'
  const [signupAdminPasskey, setSignupAdminPasskey] = useState("");
  const [signupDepartment, setSignupDepartment] = useState("Computer Science & Engineering");

  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [infoNotice, setInfoNotice] = useState("");

  // Switch tabs
  const handleTabSwitch = (mode) => {
    setAuthMode(mode);
    setError("");
    setSuccessMsg("");
    setInfoNotice("");
    setSearchParams(mode === "signup" ? { mode: "signup" } : {});
  };

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const result = login(loginEmail.trim(), loginPassword);
    if (!result.success) {
      setError(result.message);
      return;
    }

    const destination =
      location.state?.from || (result.user?.role === "Admin" ? "/dashboard" : "/");
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
      adminPasskey: signupAdminPasskey.trim(),
    });

    if (!signupResult.success) {
      setError(signupResult.message);
      return;
    }

    // Register member in library catalog if signed up as Reader
    if (signupRole === "Reader" && signupResult.user) {
      addMember({
        id: signupResult.user.memberId,
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
    }, 800);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50/70 px-4 py-8 sm:py-12 transition-colors duration-200 dark:bg-transparent overflow-hidden">
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
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-125 w-175 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-cyan-400/20 to-purple-500/15 blur-3xl dark:from-indigo-600/25 dark:via-cyan-500/15" />
      <div className="pointer-events-none absolute bottom-12 right-12 -z-10 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-20 -z-10 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl dark:border-indigo-500/25 dark:bg-[#070b18]/95 dark:shadow-2xl dark:shadow-indigo-950/80 transition-all duration-300">
          {/* Subtle Top Ambient Aurora Glow Line */}
          <div className="pointer-events-none absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/60 dark:via-cyan-400/60 to-transparent" />

          {/* Logo & Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 transition group-hover:scale-105">
                <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            </Link>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Lumina<span className="text-indigo-600 dark:text-cyan-400">Library</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Central Circulation & Identity Management Portal
            </p>
          </div>

          {/* If the User is ALREADY LOGGED IN */}
          {isAuthenticated && currentUser ? (
            <div className="mt-6 space-y-5 animate-in fade-in duration-300">
              <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/70 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white font-black text-sm shadow-xs">
                    {currentUser.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${currentUser.role === "Admin"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-cyan-300"
                        }`}
                      >
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email} • ID: <span className="font-mono">{currentUser.memberId || "MEM001"}</span>
                  </p>
                </div>
              </div>
            </div>

              {/* Status Banner */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              Currently authenticated as <strong>{currentUser.role}</strong> with active privileges.
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 hover:border-slate-400 active:scale-98 transition dark:border-slate-700 dark:bg-[#0c1322] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <span>Public Library</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {currentUser.role === "Admin" ? (
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-100 hover:border-indigo-400 active:scale-98 transition dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-cyan-300 dark:hover:bg-indigo-900/60"
                >
                  <span>Admin Console</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-100 hover:border-rose-400 active:scale-98 transition dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                logout();
                handleTabSwitch("login");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-400 active:scale-98 transition dark:border-slate-700 dark:text-slate-400 dark:hover:text-cyan-300"
            >
              <LogIn className="h-4 w-4" />
              <span>Switch / Sign In with Another Account</span>
            </button>
          </div>
        </div>
        ) : (
        /* Unauthenticated Visitor: Tabs [Log In] & [Sign Up] */
        <div className="mt-6 space-y-5">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-[#0b1021] border border-slate-200/80 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => handleTabSwitch("login")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-all duration-200 ${authMode === "login"
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
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-all duration-200 ${authMode === "signup"
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

      {/* Info Notice */}
      {infoNotice && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-xs font-semibold text-indigo-800 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-cyan-300 animate-in zoom-in-95">
          {infoNotice}
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
                placeholder="e.g. name@university.edu"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-[#0c1322] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-[#0c1322] dark:focus:ring-3 dark:focus:ring-cyan-400/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  setInfoNotice(
                    "Please contact the Central Library circulation desk or system administrator to reset forgotten credentials."
                  )
                }
                className="text-[11px] font-semibold text-indigo-600 hover:underline dark:text-cyan-400"
              >
                Forgot password?
              </button>
            </div>

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
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700"
              />
              <span>Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.98]"
          >
            Sign In & Enter
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have a library account yet?{" "}
              <button
                type="button"
                onClick={() => handleTabSwitch("signup")}
                className="font-bold text-indigo-600 hover:underline dark:text-cyan-400"
              >
                Register Here
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
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Account Type Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Account Type *
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSignupRole("Reader");
                  setSignupAdminPasskey("");
                  setError("");
                }}
                        className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${signupRole === "Reader"
                    ? "border-indigo-600 bg-indigo-50/90 text-indigo-700 shadow-xs ring-1 ring-indigo-500/20 dark:border-cyan-400 dark:bg-indigo-950/60 dark:text-cyan-300"
                    : "border-slate-200 bg-slate-50/80 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0c1322] dark:text-slate-400"
                        }`}
                      >
              <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold">Reader / Member</p>
                <p className="text-[10px] opacity-75">Standard library patron</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSignupRole("Admin");
                setError("");
              }}
                        className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${signupRole === "Admin"
                  ? "border-amber-600 bg-amber-50/90 text-amber-800 shadow-xs ring-1 ring-amber-500/20 dark:border-amber-400 dark:bg-amber-950/60 dark:text-amber-300"
                  : "border-slate-200 bg-slate-50/80 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0c1322] dark:text-slate-400"
                        }`}
                      >
            <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-xs font-bold">Library Staff / Admin</p>
              <p className="text-[10px] opacity-75">Staff key required</p>
            </div>
          </button>
        </div>
                  </div>

  {/* Staff Security Passkey Field (Only shown when Admin role is selected) */ }
  {
    signupRole === "Admin" && (
      <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-3.5 space-y-2.5 dark:border-amber-900/50 dark:bg-amber-950/40 animate-in fade-in duration-200">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
          <KeyRound className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Staff Security Access Code *</span>
        </div>

        <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-400">
          To maintain library privacy and administrative security, enter the authorization code provided by your institution.
        </p>

        <div className="relative group">
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-amber-500" />
          <input
            type={showAdminKey ? "text" : "password"}
            required
            value={signupAdminPasskey}
            onChange={(e) => setSignupAdminPasskey(e.target.value)}
            placeholder="Enter staff security access code"
            className="w-full rounded-xl border border-amber-300 bg-white py-2 pl-9 pr-10 text-xs text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-amber-800 dark:bg-[#070b18] dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowAdminKey(!showAdminKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900 dark:text-amber-300 p-1 transition"
            aria-label="Toggle passkey visibility"
          >
            {showAdminKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    )
  }

  {/* Department / Course */ }
                  <div>
                    <label
                      htmlFor="signup-dept"
                      className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {signupRole === "Admin" ? "Department / Division" : "Department / Course of Study"}
                    </label>
                    <div className="relative group">
                      <Building className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-cyan-400" />
                      <input
                        id="signup-dept"
                        type="text"
                        value={signupDepartment}
                        onChange={(e) => setSignupDepartment(e.target.value)}
                        placeholder={
                          signupRole === "Admin"
                            ? "e.g. Chief Librarian & Circulation Office"
                            : "e.g. Computer Science & Engineering"
                        }
                        className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-[#0c1322] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-[#0c1322] dark:focus:ring-3 dark:focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.98]"
                  >
                    {signupRole === "Admin" ? "Register Staff Account" : "Create Reader Account"}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => handleTabSwitch("login")}
                        className="font-bold text-indigo-600 hover:underline dark:text-cyan-400"
                      >
                        Sign In Here
                      </button>
                    </p>
                  </div>
                </form >
              )
}

{/* Secure Portal Footer */ }
<div className="border-t border-slate-200/80 pt-4 text-center dark:border-slate-800">
  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
    <Shield className="h-3.5 w-3.5 text-slate-400" />
    <span>Institutional Access Portal • Role-Based Authentication</span>
  </div>
</div>
            </div >
          )}
        </div >
      </div >
    </div >
  );
}

export default Login;
