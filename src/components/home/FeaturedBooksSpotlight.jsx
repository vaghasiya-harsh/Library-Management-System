import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Eye, ArrowRight, Sparkles, BookmarkCheck } from "lucide-react";
import BookCoverImage from "../common/BookCoverImage";

const FeaturedBooksSpotlight = ({ books = [], featuredBooks, onQuickView, onBorrow }) => {
  // Use provided featuredBooks or fallback
  const featured = featuredBooks && featuredBooks.length > 0 ? featuredBooks : books.slice(0, 4);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (featured.length === 0) return null;

  const currentBook = featured[selectedIdx] || featured[0];
  const available = Number(currentBook.availableCopies || 0);
  const total = Number(currentBook.totalCopies || 0);
  const isAvailable = available > 0;

  return (
    <section id="featured-spotlight" className="py-12 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Editor's Spotlight Selection
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Featured Masterpieces
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Handpicked must-reads currently trending across the library
            </p>
          </div>

          {/* Selector Tabs with Book Title & Genre */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {featured.map((book, idx) => (
              <button
                key={book.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`flex items-center gap-2 shrink-0 rounded-xl px-4 py-2 text-xs transition active:scale-95 ${
                  selectedIdx === idx
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30 font-bold"
                    : "bg-white text-slate-800 font-bold border border-slate-300/80 shadow-2xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-cyan-300 dark:hover:border-cyan-500/40"
                }`}
              >
                <span className="opacity-75">{book.category}:</span>
                <span className="font-bold truncate max-w-[120px] sm:max-w-none">
                  {book.title.split(":")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Big Spotlight Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white shadow-2xl transition-all duration-500">
          {/* Dynamic Ambient Glow with Aurora Drift */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl animate-aurora-drift" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl animate-pulse-glow" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Spotlight Book Cover with 3D Floating Hardcover Look */}
            <div className="md:col-span-4 flex justify-center">
              <div className="animate-float-slow relative aspect-3/4 w-full max-w-[270px] overflow-hidden rounded-2xl shadow-2xl shadow-black/80 transition-transform duration-500 hover:scale-105 border-2 border-white/15 card-sheen">
                <BookCoverImage book={currentBook} alt={currentBook.title} />

                <div className="absolute top-3 left-3 z-20">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-md ${
                      isAvailable ? "bg-emerald-500/90 text-white beacon-emerald" : "bg-rose-500/90 text-white beacon-rose"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    {isAvailable ? `Available (${available} left)` : "All Issued"}
                  </span>
                </div>
              </div>
            </div>

            {/* Spotlight Book Content */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {currentBook.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5.0 Rating</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10">
                    ID: {currentBook.id}
                  </span>
                </div>

                <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                  {currentBook.title}
                </h3>

                <p className="mt-2 text-base text-slate-300">
                  By <span className="font-semibold text-white">{currentBook.author}</span> • Published by {currentBook.publisher} ({currentBook.publishedYear})
                </p>

                <p className="mt-4 text-sm text-slate-300/90 leading-relaxed max-w-2xl">
                  A celebrated masterwork in our library's collection. Renowned worldwide for profound insight, literary brilliance, and transformative ideas that continue to inspire readers across generations.
                </p>

                {/* Live Inventory Bar with Shimmer */}
                <div className="mt-6 max-w-md">
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      Copies In Stock
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {available} of {total} Available
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isAvailable ? "bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-400" : "bg-rose-500"
                      }`}
                      style={{
                        width: `${total > 0 ? (available / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onQuickView(currentBook)}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-900 shadow-lg shadow-white/10 transition-all duration-200 hover:bg-slate-100 hover:scale-105 active:scale-95"
                >
                  <Eye className="h-4 w-4 text-indigo-600" />
                  <span>Quick Preview</span>
                </button>

                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onBorrow?.(currentBook)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isAvailable
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 hover:opacity-95"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  }`}
                >
                  <BookmarkCheck className="h-4 w-4" />
                  <span>{isAvailable ? "Borrow This Book" : "Checked Out"}</span>
                </button>

                <Link
                  to={`/books/${currentBook.id}`}
                  className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-3 text-xs font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooksSpotlight;
