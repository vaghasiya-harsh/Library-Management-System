import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Search,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import BookTable from "../../components/books/BookTable";
import BookCard from "../../components/home/BookCard";
import BookQuickViewModal from "../../components/home/BookQuickViewModal";
import Modal from "../../components/common/Modal";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const PAGE_SIZE = 12;

const Books = () => {
  const { books, deleteBook } = useContext(LibraryContext);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("title-asc");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [quickViewBook, setQuickViewBook] = useState(null);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    confirmText: "OK",
    onConfirm: null,
  });

  const categories = useMemo(() => {
    return [
      ...new Set(books.map((book) => book.category).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    let result = books.filter((book) => {
      const matchesSearch = [book.id, book.title, book.author, book.isbn].some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query)
      );

      const matchesCategory = category === "All" || book.category === category;
      const copies = Number(book.availableCopies || 0);

      const matchesAvailability =
        availability === "All" ||
        (availability === "Available" && copies > 0) ||
        (availability === "Unavailable" && copies <= 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "year-newest":
          return Number(b.publishedYear || 0) - Number(a.publishedYear || 0);
        case "year-oldest":
          return Number(a.publishedYear || 0) - Number(b.publishedYear || 0);
        case "title-asc":
        default:
          return (a.title || "").localeCompare(b.title || "");
      }
    });

    return result;
  }, [books, debouncedSearch, category, availability, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const totalAvailable = books.reduce(
    (sum, b) => sum + Number(b.availableCopies || 0),
    0
  );

  const handleDeleteBook = (book) => {
    setModal({
      isOpen: true,
      title: "Delete Book",
      message: `Are you sure you want to remove "${book.title}" from the catalog? This action cannot be reversed.`,
      type: "warning",
      showCancel: true,
      confirmText: "Delete Book",
      onConfirm: () => {
        const result = deleteBook(book.id);
        if (!result.success) {
          setModal({
            isOpen: true,
            title: "Delete Failed",
            message: result.message,
            type: "error",
            showCancel: false,
            confirmText: "OK",
            onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
          });
          return;
        }

        setModal({
          isOpen: true,
          title: "Book Removed",
          message: `"${book.title}" has been successfully deleted.`,
          type: "success",
          showCancel: false,
          confirmText: "Done",
          onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <BookOpen className="h-3.5 w-3.5" />
            Catalog Management
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Book Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage titles, ISBNs, physical stock, and copies availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/books/add"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Book</span>
          </Link>
        </div>
      </div>

      {/* Mini Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="interactive-card card-sheen rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Titles</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white font-display">{books.length}</p>
        </div>
        <div className="interactive-card card-sheen rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Available Copies</span>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display">{totalAvailable}</p>
        </div>
        <div className="interactive-card card-sheen rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Categories</span>
          <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">{categories.length}</p>
        </div>
        <div className="interactive-card card-sheen rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Filtered Results</span>
          <p className="mt-1 text-2xl font-black text-cyan-600 dark:text-cyan-400 font-display">{filteredBooks.length}</p>
        </div>
      </div>

      {/* Search & Filters Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, author, ISBN, or ID..."
              className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2.5 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:text-white"
            >
              <option value="All" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">All Categories ({books.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="md:col-span-2">
            <select
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:text-white"
            >
              <option value="All" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">All Status</option>
              <option value="Available" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Available Only</option>
              <option value="Unavailable" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Checked Out Only</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:text-white"
            >
              <option value="title-asc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Title: A to Z</option>
              <option value="title-desc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Title: Z to A</option>
              <option value="year-newest" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Published: Newest</option>
              <option value="year-oldest" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Published: Oldest</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="md:col-span-1 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 rounded-xl p-2 text-xs font-semibold transition ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 rounded-xl p-2 text-xs font-semibold transition ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
              title="Card Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Display (Table or Grid) */}
      {viewMode === "table" ? (
        <BookTable
          books={paginatedBooks}
          onDelete={handleDeleteBook}
          onQuickView={(b) => setQuickViewBook(b)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onQuickView={(b) => setQuickViewBook(b)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {Math.min(startIndex + PAGE_SIZE, filteredBooks.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-900 dark:text-white">{filteredBooks.length}</span> books
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <span className="text-xs font-bold px-2 text-slate-700 dark:text-slate-300">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewBook && (
        <BookQuickViewModal
          book={quickViewBook}
          onClose={() => setQuickViewBook(null)}
        />
      )}

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
        confirmText={modal.confirmText}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default Books;
