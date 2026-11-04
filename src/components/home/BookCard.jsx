import { Link } from "react-router-dom";
import { Calendar, Eye, ArrowUpRight, BookmarkCheck } from "lucide-react";
import BookCoverImage from "../common/BookCoverImage";

const CATEGORY_STYLES = {
  Fiction: {
    badge: "bg-purple-600/90 text-white shadow-xs border-purple-400/40",
    text: "text-purple-700 dark:text-purple-400",
  },
  "Computer Science": {
    badge: "bg-cyan-600/90 text-white shadow-xs border-cyan-400/40",
    text: "text-cyan-700 dark:text-cyan-400",
  },
  Technology: {
    badge: "bg-blue-600/90 text-white shadow-xs border-blue-400/40",
    text: "text-blue-700 dark:text-blue-400",
  },
  Science: {
    badge: "bg-emerald-600/90 text-white shadow-xs border-emerald-400/40",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  Philosophy: {
    badge: "bg-amber-600/90 text-white shadow-xs border-amber-400/40",
    text: "text-amber-700 dark:text-amber-400",
  },
  History: {
    badge: "bg-orange-600/90 text-white shadow-xs border-orange-400/40",
    text: "text-orange-700 dark:text-orange-400",
  },
  Biography: {
    badge: "bg-rose-600/90 text-white shadow-xs border-rose-400/40",
    text: "text-rose-700 dark:text-rose-400",
  },
  Business: {
    badge: "bg-indigo-600/90 text-white shadow-xs border-indigo-400/40",
    text: "text-indigo-700 dark:text-indigo-400",
  },
  Psychology: {
    badge: "bg-fuchsia-600/90 text-white shadow-xs border-fuchsia-400/40",
    text: "text-fuchsia-700 dark:text-fuchsia-400",
  },
  "Self Help": {
    badge: "bg-teal-600/90 text-white shadow-xs border-teal-400/40",
    text: "text-teal-700 dark:text-teal-400",
  },
};

const BookCard = ({ book, onQuickView, onBorrow }) => {
  const available = Number(book.availableCopies || 0);
  const isAvailable = available > 0;

  const catStyle = CATEGORY_STYLES[book.category] || {
    badge: "bg-slate-700/90 text-white border-slate-500/40",
    text: "text-indigo-700 dark:text-indigo-400",
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm backdrop-blur-md interactive-card card-sheen transition-all duration-300 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-cyan-500/40 dark:hover:shadow-cyan-500/10">
      {/* Top Cover Section */}
      <div>
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-slate-900 shadow-md transition-transform duration-500 group-hover:scale-[1.02] border border-slate-200/60 dark:border-slate-800">
          <BookCoverImage book={book} alt={book.title} />

          {/* Floating Availability Badge */}
          <div className="absolute top-2.5 left-2.5 z-20">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide backdrop-blur-md shadow-md ${
                isAvailable
                  ? "bg-emerald-600 text-white beacon-emerald"
                  : "bg-rose-600 text-white beacon-rose"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {isAvailable ? `${available} Left` : "Out of Stock"}
            </span>
          </div>

          {/* Category Chip with Category-Specific Styling */}
          <div className="absolute top-2.5 right-2.5 z-20">
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${catStyle.badge}`}
            >
              {book.category}
            </span>
          </div>

          {/* Quick View Floating Action Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/45 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onQuickView(book)}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-xl transition-all duration-200 hover:scale-110 hover:bg-slate-50 active:scale-95 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              <Eye className="h-3.5 w-3.5 text-indigo-600 dark:text-cyan-400" />
              Quick Preview
            </button>
          </div>
        </div>

        {/* Book Details Info */}
        <div className="mt-3.5 space-y-1">
          <p className={`text-[11px] font-extrabold tracking-wide uppercase ${catStyle.text}`}>
            {book.category}
          </p>

          <h3
            className="line-clamp-1 text-base font-extrabold text-slate-900 transition-colors duration-200 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-400"
            title={book.title}
          >
            {book.title}
          </h3>

          <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
            By <span className="font-semibold text-slate-800 dark:text-slate-200">{book.author}</span>
          </p>
        </div>
      </div>

      {/* Card Footer Section */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3">
          <span className="inline-flex items-center gap-1 font-medium">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {book.publishedYear}
          </span>
          <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-md">
            {book.id}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onQuickView(book)}
            className="flex items-center justify-center gap-1 rounded-xl border border-slate-300/90 bg-white px-2.5 py-2 text-xs font-bold text-slate-800 shadow-2xs transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:text-cyan-300"
            title="Preview book info"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => (onBorrow ? onBorrow(book) : onQuickView(book))}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm ${
              isAvailable
                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/20 hover:shadow-md"
                : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
            }`}
            title={isAvailable ? "Borrow this title" : "Out of physical copies"}
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
            <span>{isAvailable ? "Borrow" : "Out of Stock"}</span>
          </button>

          <Link
            to={`/books/${book.id}`}
            className="flex items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50 p-2 text-slate-700 shadow-2xs transition-all duration-200 hover:bg-white hover:text-indigo-600 hover:border-indigo-300 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-cyan-300"
            title="View full book synopsis"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
