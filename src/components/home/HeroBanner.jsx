import { Search, Sparkles, BookCheck, Users, Library, Flame, ArrowRight } from "lucide-react";

const HeroBanner = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  totalBooks,
  availableCopies,
  totalMembers,
  issuedCount,
  searchInputRef,
}) => {
  return (
    <section className="relative overflow-hidden pt-24 pb-14 sm:pt-28 md:pt-32 md:pb-20 bg-grid-mesh">
      {/* Dynamic Background Glow Blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[750px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/25 via-cyan-400/20 to-purple-500/20 blur-3xl dark:from-indigo-600/30 dark:via-cyan-500/20 dark:to-purple-600/25 animate-aurora-drift" />
      <div className="pointer-events-none absolute top-40 -left-20 -z-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/15 animate-pulse-glow" />
      <div className="pointer-events-none absolute top-32 -right-20 -z-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-600/15 animate-pulse-glow" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Shimmer Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/90 bg-white/90 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-md dark:border-indigo-800/80 dark:bg-indigo-950/70 dark:text-cyan-300 shimmer-badge transition-transform hover:scale-105">
          <Sparkles className="h-4 w-4 text-amber-500 animate-spin-slow" />
          <span>Interactive Library Management & Live Catalog</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 beacon-emerald animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white font-display">
          Discover, Borrow & Expand <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-cyan-300 dark:to-cyan-400">
            Your Reading World
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
          Explore over 100+ curated titles across Fiction, Computer Science, Philosophy, and Science.
          Track live physical availability and manage circulation seamlessly.
        </p>

        {/* Interactive Search Bar in Hero */}
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="relative flex flex-col sm:flex-row items-center rounded-2xl border border-slate-300/90 bg-white p-2 shadow-xl shadow-slate-900/5 backdrop-blur-md transition-all focus-within:border-indigo-500 focus-within:shadow-2xl focus-within:shadow-indigo-500/10 focus-within:ring-4 focus-within:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none dark:focus-within:border-cyan-500/60 dark:focus-within:ring-indigo-950/60">
            {/* Search Input */}
            <div className="flex flex-1 items-center gap-3 px-3 py-2 w-full">
              <Search className="h-5 w-5 text-indigo-500/80 dark:text-cyan-400/80" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by book title, author, or ISBN (e.g. Gatsby, Orwell, AI)..."
                className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Select Dropdown */}
            <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-300/80 px-3 py-2 dark:border-slate-800">
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="w-full sm:w-44 bg-transparent text-xs font-bold text-slate-800 outline-none dark:text-slate-200 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Jump Button */}
            <a
              href="#explore-books"
              className="mt-2 sm:mt-0 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:opacity-95 hover:shadow-lg active:scale-95"
            >
              <span>Explore</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Quick Filter Tags with Interactive Chip Styling */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
              <Flame className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              Popular:
            </span>
            {["Fiction", "Computer Science", "Science", "Philosophy"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "bg-white text-slate-800 border border-slate-300/90 shadow-2xs hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-cyan-500/40 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Live Library Metric Counters - Elevated Interactive Sheen Cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
          <div className="interactive-card card-sheen rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400 beacon-indigo">
              <Library className="h-5 w-5" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {totalBooks}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Book Titles
              </p>
            </div>
          </div>

          <div className="interactive-card card-sheen rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-400 beacon-emerald">
              <BookCheck className="h-5 w-5" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
              {availableCopies}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 beacon-emerald animate-pulse" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Available Copies
              </p>
            </div>
          </div>

          <div className="interactive-card card-sheen rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 shadow-xs dark:bg-cyan-950/60 dark:text-cyan-400 beacon-cyan">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {totalMembers}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Registered Members
              </p>
            </div>
          </div>

          <div className="interactive-card card-sheen rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-xs dark:bg-purple-950/60 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
              {issuedCount}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Active Circulations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
