import { Link } from "react-router-dom";
import { Edit3, Trash2, Eye, BookOpen, ExternalLink } from "lucide-react";
import BookCoverImage from "../common/BookCoverImage";

const BookTable = ({ books, onDelete, onQuickView }) => {
  if (books.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <BookOpen className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
          No books found
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Try clearing your filters or add a new book to the catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200/90 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4">Book Details</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Copies (Avail / Total)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {books.map((book) => {
              const available = Number(book.availableCopies || 0);
              const total = Number(book.totalCopies || 0);
              const isAvailable = available > 0;

              return (
                <tr
                  key={book.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  {/* Book Cover + Title + Author */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg shadow-2xs border border-slate-200/70 dark:border-slate-700">
                        <BookCoverImage book={book} />
                      </div>

                      <div className="min-w-0 max-w-xs sm:max-w-md">
                        <Link
                          to={`/books/${book.id}`}
                          className="font-bold text-slate-900 transition hover:text-indigo-600 dark:text-white dark:hover:text-cyan-400 line-clamp-1"
                        >
                          {book.title}
                        </Link>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                          By {book.author} • {book.publishedYear}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    {book.id}
                  </td>

                  {/* Category */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-lg bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      {book.category}
                    </span>
                  </td>

                  {/* Copies */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className={isAvailable ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-rose-500"}>
                        {available}
                      </span>
                      <span className="text-slate-400">/</span>
                      <span>{total}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isAvailable ? "beacon-emerald bg-emerald-500" : "beacon-rose bg-rose-500"
                        }`}
                      />
                      {isAvailable ? "Available" : "Checked Out"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onQuickView && (
                        <button
                          type="button"
                          onClick={() => onQuickView(book)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                          title="Quick preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}

                      <Link
                        to={`/books/${book.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                        title="View book details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <Link
                        to={`/books/${book.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                        title="Edit book"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(book)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 active:scale-90 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                        title="Delete book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;
