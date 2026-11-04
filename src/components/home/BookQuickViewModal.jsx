import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Calendar, Building2, Hash, ArrowRight, Sparkles, BookmarkCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BookCoverImage from "../common/BookCoverImage";

const BookQuickViewModal = ({ book, onClose, onBorrow }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  const available = Number(book.availableCopies || 0);
  const total = Number(book.totalCopies || 0);
  const isAvailable = available > 0;
  const availabilityPercent = total > 0 ? Math.round((available / total) * 100) : 0;

  const handleIssueClick = () => {
    onClose();
    if (onBorrow) {
      onBorrow(book);
    } else if (!isAuthenticated) {
      navigate("/login", { state: { from: "/transactions" } });
    } else {
      navigate(`/transactions?bookId=${book.id}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-1 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/95 sm:p-2">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/80 text-slate-500 backdrop-blur-xs transition hover:bg-indigo-50 hover:text-indigo-600 hover:rotate-90 active:scale-90 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-cyan-300"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 p-6 md:p-8 gap-6 md:gap-8">
          {/* Cover Column */}
          <div className="md:col-span-2 flex flex-col items-center">
            <div className="relative aspect-3/4 w-full max-w-[210px] overflow-hidden rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 group">
              <BookCoverImage book={book} alt={book.title} />

              <div className="absolute top-2.5 left-2.5 z-20">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-md text-white ${
                    isAvailable ? "bg-emerald-600/90" : "bg-rose-600/90"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAvailable ? "beacon-emerald bg-white" : "beacon-rose bg-white"
                    }`}
                  />
                  {isAvailable ? "Available" : "Checked Out"}
                </span>
              </div>
            </div>

            <div className="mt-4 w-full text-center">
              <span className="inline-block rounded-xl bg-indigo-50/80 px-3 py-1 font-mono text-xs font-bold text-indigo-700 border border-indigo-100/60 dark:border-indigo-900/40 dark:bg-indigo-950/60 dark:text-indigo-300">
                ID: {book.id}
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-indigo-100/80 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {book.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Popular Title
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                {book.title}
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                By <span className="font-semibold text-slate-900 dark:text-slate-200">{book.author}</span>
              </p>

              {/* Availability Progress */}
              <div className="mt-5 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-400">Inventory Status</span>
                  <span className={isAvailable ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-rose-600 font-bold"}>
                    {available} of {total} left ({availabilityPercent}%)
                  </span>
                </div>
                <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isAvailable ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" : "bg-rose-500"
                    }`}
                    style={{ width: `${availabilityPercent}%` }}
                  />
                  {isAvailable && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  )}
                </div>
              </div>

              {/* Metadata Specs Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs dark:border-slate-800/80 dark:bg-slate-800/50">
                  <Building2 className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div className="truncate">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider dark:text-slate-400">Publisher</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-200 truncate">{book.publisher || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs dark:border-slate-800/80 dark:bg-slate-800/50">
                  <Calendar className="h-4 w-4 text-cyan-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider dark:text-slate-400">Published</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-200">{book.publishedYear}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs dark:border-slate-800/80 dark:bg-slate-800/50 col-span-2">
                  <Hash className="h-4 w-4 text-amber-500 shrink-0" />
                  <div className="truncate">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider dark:text-slate-400">ISBN Number</p>
                    <p className="font-mono font-semibold text-slate-900 dark:text-slate-200 truncate">{book.isbn}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
              <Link
                to={`/books/${book.id}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300/90 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 dark:hover:text-cyan-300"
              >
                View Full Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleIssueClick}
                disabled={!isAvailable}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 ${
                  isAvailable
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/25"
                    : "bg-slate-400 cursor-not-allowed dark:bg-slate-700"
                }`}
              >
                <BookmarkCheck className="h-4 w-4" />
                <span>{isAvailable ? "Borrow This Book" : "Currently Unavailable"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookQuickViewModal;
