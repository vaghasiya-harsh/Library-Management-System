import { useState, useMemo, useContext, useRef } from "react";
import {
  Search,
  ArrowUpDown,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import HomeNavbar from "../../components/home/HomeNavbar";
import HeroBanner from "../../components/home/HeroBanner";
import FeaturedBooksSpotlight from "../../components/home/FeaturedBooksSpotlight";
import BookCard from "../../components/home/BookCard";
import BookQuickViewModal from "../../components/home/BookQuickViewModal";
import UserBorrowModal from "../../components/books/UserBorrowModal";
import MyBorrowedBooksModal from "../../components/home/MyBorrowedBooksModal";
import HomeFooter from "../../components/home/HomeFooter";

const PAGE_SIZE = 12;

const Home = () => {
  const { books, members, transactions } = useContext(LibraryContext);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [quickViewBook, setQuickViewBook] = useState(null);
  const [borrowBook, setBorrowBook] = useState(null);
  const [myBooksOpen, setMyBooksOpen] = useState(false);
  const [myBooksInitialMemberId, setMyBooksInitialMemberId] = useState("");

  const searchInputRef = useRef(null);

  // Calculate live library statistics
  const totalBooks = books.length;
  const availableCopies = books.reduce(
    (total, book) => total + Number(book.availableCopies || 0),
    0
  );
  const totalMembers = members.length;
  const activeTransactions = transactions.filter((t) =>
    ["Issued", "Overdue"].includes(t.status)
  );
  const issuedCount = activeTransactions.length;

  // Extract unique categories and counts
  const categoryStats = useMemo(() => {
    const map = {};
    books.forEach((b) => {
      if (b.category) {
        map[b.category] = (map[b.category] || 0) + 1;
      }
    });
    const list = Object.keys(map).sort();
    return { list, map };
  }, [books]);

  // 4 Iconic Masterpieces across 4 distinct categories for the Hero Spotlight
  const featuredBooks = useMemo(() => {
    const picks = [
      books.find((b) => b.id === "BK0001") || books[0], // Fiction: The Great Gatsby
      books.find((b) => b.id === "BK0021") || books[20], // Technology: Clean Code
      books.find((b) => b.id === "BK0011") || books[10], // Science: A Brief History of Time
      books.find((b) => b.id === "BK0081") || books[80], // Philosophy: Meditations
    ].filter(Boolean);
    return picks;
  }, [books]);

  const featuredIds = useMemo(
    () => new Set(featuredBooks.map((b) => b.id)),
    [featuredBooks]
  );

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = books.filter((book) => {
      const matchesSearch =
        !query ||
        [book.title, book.author, book.isbn, book.id, book.category].some(
          (field) => String(field || "").toLowerCase().includes(query)
        );

      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      const copies = Number(book.availableCopies || 0);
      const matchesAvailability =
        availability === "All" ||
        (availability === "Available" && copies > 0) ||
        (availability === "Unavailable" && copies <= 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    // Eliminate duplicates: When in default catalog view (All categories, no search query),
    // exclude the featured spotlight titles so that NO book/image ever appears a second time!
    if (selectedCategory === "All" && !query) {
      result = result.filter((b) => !featuredIds.has(b.id));
    }

    // Interleaving for visual diversity across categories:
    if (sortBy === "popular" && selectedCategory === "All" && !query) {
      const byCat = {};
      result.forEach((b) => {
        if (!byCat[b.category]) byCat[b.category] = [];
        byCat[b.category].push(b);
      });

      const catKeys = Object.keys(byCat);
      const interleaved = [];
      const maxLen = Math.max(0, ...catKeys.map((c) => byCat[c].length));

      for (let round = 0; round < maxLen; round++) {
        for (const cat of catKeys) {
          if (byCat[cat][round]) {
            interleaved.push(byCat[cat][round]);
          }
        }
      }
      return interleaved;
    }

    // Standard sorting for custom filters or sort options
    result.sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "year-newest":
          return Number(b.publishedYear || 0) - Number(a.publishedYear || 0);
        case "year-oldest":
          return Number(a.publishedYear || 0) - Number(b.publishedYear || 0);
        case "popular":
        default:
          return Number(b.totalCopies || 0) - Number(a.totalCopies || 0);
      }
    });

    return result;
  }, [books, search, selectedCategory, availability, sortBy, featuredIds]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };


  return (
    <div className="relative min-h-screen bg-slate-50/60 text-slate-900 transition-colors duration-200 dark:bg-transparent dark:text-slate-100 overflow-x-hidden">
      {/* Top Navigation */}
      <HomeNavbar onOpenMyBooks={() => setMyBooksOpen(true)} />

      {/* Hero Section */}
      <HeroBanner
        searchQuery={search}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        categories={categoryStats.list}
        totalBooks={totalBooks}
        availableCopies={availableCopies}
        totalMembers={totalMembers}
        issuedCount={issuedCount}
        searchInputRef={searchInputRef}
      />

      {/* Featured Spotlight Section */}
      <FeaturedBooksSpotlight
        books={books}
        featuredBooks={featuredBooks}
        onQuickView={(b) => setQuickViewBook(b)}
        onBorrow={(b) => setBorrowBook(b)}
      />

      {/* Main Catalog & Exploration Section */}
      <main id="explore-books" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        {/* Ambient Subtle Glow Orbs */}
        <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Section Header */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200/60 bg-cyan-50/80 px-3.5 py-1 text-xs font-bold text-cyan-700 backdrop-blur-xs dark:border-cyan-800/40 dark:bg-cyan-950/60 dark:text-cyan-300">
              <BookOpen className="h-3.5 w-3.5" />
              Complete Catalog
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Browse Books Collection
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-extrabold text-slate-900 dark:text-cyan-300">{filteredBooks.length}</span> titles matching your filters
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 backdrop-blur-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="relative rounded-3xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 mb-10 space-y-4">
          {/* Categories Pill Bar */}
          <div id="categories" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleCategorySelect("All")}
              className={`flex items-center gap-1.5 shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30"
                  : "bg-white border border-slate-200/90 text-slate-800 shadow-2xs hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300 dark:hover:border-cyan-500/40"
              }`}
            >
              <span>All Books</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                selectedCategory === "All" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-transparent"
              }`}>
                {totalBooks}
              </span>
            </button>

            {categoryStats.list.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex items-center gap-1.5 shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30"
                      : "bg-white border border-slate-200/90 text-slate-800 shadow-2xs hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300 dark:hover:border-cyan-500/40"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-transparent"
                  }`}>
                    {categoryStats.map[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            {/* Availability pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Status:</span>
              {["All", "Available", "Unavailable"].map((status) => {
                const isActive = availability === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setAvailability(status);
                      setPage(1);
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm dark:bg-gradient-to-r dark:from-indigo-600 dark:to-cyan-600 dark:text-white"
                        : "bg-white border border-slate-200/90 text-slate-700 shadow-2xs hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300 dark:hover:border-cyan-500/40"
                    }`}
                  >
                    {status === "Available" ? "🟢 In Stock" : status === "Unavailable" ? "🔴 Checked Out" : "All Status"}
                  </button>
                );
              })}
            </div>

            {/* Sort by dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="h-3.5 w-3.5 text-indigo-500" />
              <label htmlFor="home-sort" className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Sort:
              </label>
              <select
                id="home-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs outline-none transition hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:focus:ring-indigo-900/40 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
                <option value="year-newest">Published: Newest</option>
                <option value="year-oldest">Published: Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Cards Grid */}
        {paginatedBooks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-12 text-center backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No matching books found
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We couldn't find any books matching "{search}" in this category. Try adjusting your search query or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setAvailability("All");
              }}
              className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition active:scale-95 hover:opacity-95"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onQuickView={(b) => setQuickViewBook(b)}
                onBorrow={(b) => setBorrowBook(b)}
              />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-6 dark:border-slate-800/80">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {Math.min(startIndex + PAGE_SIZE, filteredBooks.length)}
              </span>{" "}
              of <span className="font-bold text-slate-900 dark:text-white">{filteredBooks.length}</span> titles
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-cyan-300 dark:hover:border-cyan-500/40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`h-9 w-9 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-cyan-300 dark:hover:border-cyan-500/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-cyan-300 dark:hover:border-cyan-500/40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Features / Why Lumina Section */}
        <section id="library-features" className="relative mt-24 pt-16 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-700 backdrop-blur-xs dark:border-indigo-800/40 dark:bg-indigo-950/60 dark:text-indigo-300">
              Modern Advantages
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Smart Library System Features
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Built with cutting-edge tools to streamline book inventory, reader tracking, and circulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="interactive-card card-sheen relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white font-display">
                Instant Circulation
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Issue and return books in seconds with automated due date tracking, overdue detection, and copy count updates.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-cyan-400">
                <span>Real-time availability sync</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="interactive-card card-sheen relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white font-display">
                Circulation Analytics
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Visual charts depicting category breakdowns, monthly transaction flow, and real-time return rate percentages.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                <span>Interactive live metrics</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="interactive-card card-sheen relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white font-display">
                Secured Member Directory
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Maintain accurate student and member records, course enrollments, active statuses, and detailed borrowing logs.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span>Enterprise grade records</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      {quickViewBook && (
        <BookQuickViewModal
          book={quickViewBook}
          onClose={() => setQuickViewBook(null)}
          onBorrow={(b) => {
            setQuickViewBook(null);
            setBorrowBook(b);
          }}
        />
      )}

      {/* User Side Real Library Borrow / Issue Modal */}
      {borrowBook && (
        <UserBorrowModal
          book={borrowBook}
          isOpen={!!borrowBook}
          onClose={() => setBorrowBook(null)}
          onOpenMyBooks={(memberId) => {
            setBorrowBook(null);
            setMyBooksInitialMemberId(memberId);
            setMyBooksOpen(true);
          }}
        />
      )}

      {/* Reader Hub: My Borrowed Books & Returns Modal */}
      <MyBorrowedBooksModal
        isOpen={myBooksOpen}
        onClose={() => setMyBooksOpen(false)}
        initialMemberId={myBooksInitialMemberId}
        onBorrowMore={() => {
          setMyBooksOpen(false);
          const el = document.getElementById("explore-books");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default Home;
