import { useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  BookmarkCheck,
  Calendar,
  Building2,
  Hash,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import BookCoverImage from "../../components/common/BookCoverImage";
import UserBorrowModal from "../../components/books/UserBorrowModal";
import MyBorrowedBooksModal from "../../components/home/MyBorrowedBooksModal";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import ThemeToggle from "../../components/common/ThemeToggle";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isAdmin = isAuthenticated && currentUser?.role === "Admin";

  const { books, members, transactions } = useContext(LibraryContext);

  // Modals state
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [myBooksOpen, setMyBooksOpen] = useState(false);
  const [myBooksInitialMemberId, setMyBooksInitialMemberId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50/60 dark:bg-transparent text-slate-900 dark:text-white">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Book Not Found
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            No catalog entry found with ID: <span className="font-mono">{id}</span>
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  const available = Number(book.availableCopies || 0);
  const total = Number(book.totalCopies || 0);
  const isAvailable = available > 0;
  const availabilityPercent = total > 0 ? Math.round((available / total) * 100) : 0;

  // Find all transactions relating to this book
  const bookTransactions = transactions.filter((t) => t.bookId === book.id);
  const activeLoans = bookTransactions.filter((t) =>
    ["Issued", "Overdue"].includes(t.status)
  );

  // Main Page Content Component
  const pageContent = (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header / Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition group"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200/90 shadow-2xs group-hover:border-indigo-400 dark:bg-slate-800 dark:border-slate-700">
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Reader Borrow CTA */}
          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => setBorrowModalOpen(true)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm active:scale-95 ${
              isAvailable
                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/25"
                : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
            }`}
          >
            <BookmarkCheck className="h-4 w-4" />
            <span>{isAvailable ? "Borrow This Book" : "Out of Stock"}</span>
          </button>

          {/* Reader My Books Button */}
          <button
            type="button"
            onClick={() => setMyBooksOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200/90 bg-indigo-50/80 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-100 hover:border-indigo-400 transition dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-cyan-300 dark:hover:bg-indigo-900/60 dark:hover:border-indigo-600/50"
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
            <span>My Borrowed Books</span>
          </button>

          {/* Admin Edit Controls if logged in as Admin */}
          {isAdmin && (
            <Link
              to={`/books/${book.id}/edit`}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-slate-600 transition"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit (Admin)</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Details Hero Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
        {/* Ambient Top Glow Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
          {/* Cover & Quick Availability Column */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative aspect-3/4 w-full max-w-[280px] overflow-hidden rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800">
              <BookCoverImage book={book} alt={book.title} />

              <div className="absolute top-3 left-3 z-20">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md shadow-md text-white ${
                    isAvailable ? "bg-emerald-600/95" : "bg-rose-600/95"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  {isAvailable ? `${available} Copies Ready` : "All Checked Out"}
                </span>
              </div>
            </div>

            {/* Copies Meter Bar */}
            <div className="mt-6 w-full max-w-[280px] rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Library Stock</span>
                <span
                  className={
                    isAvailable
                      ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                      : "text-rose-600 font-extrabold"
                  }
                >
                  {available} of {total} copies ({availabilityPercent}%)
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isAvailable
                      ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${availabilityPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Action Button Under Cover */}
            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => setBorrowModalOpen(true)}
              className={`mt-4 w-full max-w-[280px] flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition shadow-md active:scale-95 ${
                isAvailable
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/25"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
              }`}
            >
              <BookmarkCheck className="h-4 w-4" />
              <span>{isAvailable ? "Borrow / Issue This Book" : "Currently Unavailable"}</span>
            </button>
          </div>

          {/* Book Information Details Column */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-indigo-50 border border-indigo-200/80 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-cyan-300">
                  {book.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Central Collection
                </span>
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 ml-auto">
                  Catalog ID: {book.id}
                </span>
              </div>

              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                {book.title}
              </h1>

              <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                Authored by{" "}
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {book.author}
                </span>
              </p>

              {/* Synopsis & Overview */}
              <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Synopsis & Overview
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  A foundational masterwork in our library's collection under the{" "}
                  <span className="font-bold text-indigo-600 dark:text-cyan-400">
                    {book.category}
                  </span>{" "}
                  division. Officially published by {book.publisher} in {book.publishedYear}.
                  This title is preserved for campus circulation, academic research, and reading pleasure.
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/60 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400 shrink-0">
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Publisher
                    </span>
                    <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white truncate">
                      {book.publisher || "Central Press"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/60 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-slate-700 dark:text-cyan-400 shrink-0">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Published
                    </span>
                    <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                      {book.publishedYear}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/60 flex items-center gap-3 col-span-2 sm:col-span-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-slate-700 dark:text-amber-400 shrink-0">
                    <Hash className="h-4.5 w-4.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      ISBN-13
                    </span>
                    <p className="mt-0.5 font-mono text-xs font-bold text-slate-900 dark:text-white truncate">
                      {book.isbn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Circulation Stats */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Total Circulation History:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {bookTransactions.length} times
                </strong>
              </span>
              <span>
                Currently Loaned Out:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {activeLoans.length} copies
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Circulation Log Section: Full view for Admin, Reader Friendly Summary for Visitors */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="border-b border-slate-200/90 p-6 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isAdmin
                ? "Admin Circulation Log & Active Borrowers"
                : "Circulation Activity & Availability"}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isAdmin
                ? "Internal transaction ledger for library staff administration"
                : "Recent lending status and return records for this title"}
            </p>
          </div>

          {!isAdmin && (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-cyan-400"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Staff View</span>
            </Link>
          )}
        </div>

        {bookTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No circulation records for this title yet. Click "Borrow / Issue This Book" to start the first checkout.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200/90 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Slip #</th>
                  <th className="px-6 py-3.5">
                    {isAdmin ? "Borrower Member" : "Borrower Code"}
                  </th>
                  <th className="px-6 py-3.5">Issue Date</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {bookTransactions.map((trx) => {
                  const member = members.find((m) => m.id === trx.memberId);
                  const isReturned = trx.status === "Returned";
                  return (
                    <tr
                      key={trx.id}
                      className="text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-3.5 font-mono font-medium">{trx.id}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                        {isAdmin
                          ? `${member?.name || "Reader"} (${trx.memberId})`
                          : `Reader ***${trx.memberId.slice(-3)}`}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">{trx.issueDate}</td>
                      <td className="px-6 py-3.5 text-slate-500">{trx.dueDate}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isReturned
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          }`}
                        >
                          {isReturned && <CheckCircle2 className="h-3 w-3" />}
                          <span>{trx.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Borrow Modal */}
      {borrowModalOpen && (
        <UserBorrowModal
          book={book}
          isOpen={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          onOpenMyBooks={(memberId) => {
            setBorrowModalOpen(false);
            setMyBooksInitialMemberId(memberId);
            setMyBooksOpen(true);
          }}
        />
      )}

      {/* My Borrowed Books Modal */}
      <MyBorrowedBooksModal
        isOpen={myBooksOpen}
        onClose={() => setMyBooksOpen(false)}
        initialMemberId={myBooksInitialMemberId}
      />
    </div>
  );

  // If visitor is authenticated as admin, render with Admin Layout
  if (isAdmin) {
    return (
      <div
        className={`min-h-screen transition-colors duration-200 ${
          isDark ? "bg-transparent text-slate-100" : "bg-slate-50/60 text-slate-900"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-h-screen transition-all duration-300 lg:ml-68">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="min-h-[calc(100vh-4.5rem)] p-4 sm:p-6 lg:p-8">
            {pageContent}
          </main>
        </div>
      </div>
    );
  }

  // Otherwise, render Public Reader Page with Clean Reader Header
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Reader Public Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#070b18]/90 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/25 transition group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent dark:from-white dark:via-indigo-200 dark:to-cyan-200 font-display">
              Lumina<span className="text-indigo-600 dark:text-cyan-400">Library</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400 hidden sm:inline-block px-3 py-1.5"
            >
              Browse Catalog
            </Link>

            <button
              type="button"
              onClick={() => setMyBooksOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200/90 bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-100 hover:border-indigo-400 dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-cyan-300 dark:hover:bg-indigo-900/60 dark:hover:border-indigo-600/50"
            >
              <BookmarkCheck className="h-3.5 w-3.5" />
              <span>My Borrowed Books</span>
            </button>

            {/* Dynamic Modern Theme Toggle */}
            <ThemeToggle size="sm" />

            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Log In / Sign Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Reader Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">{pageContent}</main>
    </div>
  );
};

export default BookDetails;
