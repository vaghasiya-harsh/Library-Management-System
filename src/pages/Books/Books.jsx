import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../../context/LibraryContext";
import BookTable from "../../components/books/BookTable";
import Modal from "../../components/common/Modal";

const PAGE_SIZE = 10;

const Books = () => {
  const { books, deleteBook } = useContext(LibraryContext);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("title-asc");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    confirmText: "OK",
    onConfirm: null,
  });

  // Create category options from the actual book data.
  const categories = useMemo(() => {
    return [
      ...new Set(books.map((book) => book.category).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
  }, [books]);

  // 1. Search + 2. Filter + 3. Sort
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = books.filter((book) => {
      const matchesSearch = [book.id, book.title, book.author, book.isbn].some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
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
  }, [books, search, category, availability, sortBy]);

  // 4. Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));

  // Prevent an invalid page if deleting a book reduces page count.
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const resetPage = () => setPage(1);

  const handleDeleteBook = (book) => {
    setModal({
      isOpen: true,
      title: "Delete Book?",
      message: `Are you sure you want to delete "${book.title}"? This action cannot be undone.`,
      type: "warning",
      showCancel: true,
      confirmText: "Delete",

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
            onConfirm: () => {
              setModal((previous) => ({
                ...previous,
                isOpen: false,
              }));
            },
          });

          return;
        }

        setModal({
          isOpen: true,
          title: "Success!",
          message: "Book deleted successfully.",
          type: "success",
          showCancel: false,
          confirmText: "OK",
          onConfirm: () => {
            setModal((previous) => ({
              ...previous,
              isOpen: false,
            }));
          },
        });
      },
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setAvailability("All");
    setSortBy("title-asc");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search, filter, sort and manage library books.
          </p>
        </div>

        <Link
          to="/books/add"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add Book
        </Link>
      </div>

      {/* Total records */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total Book Records</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{books.length}</p>
      </div>

      {/* Search, filters and sorting */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label
              htmlFor="book-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search Books
            </label>
            <input
              id="book-search"
              type="search"
              placeholder="Title, author, ID, ISBN..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="book-category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="book-category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                resetPage();
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="All">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="book-availability"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Availability
            </label>
            <select
              id="book-availability"
              value={availability}
              onChange={(event) => {
                setAvailability(event.target.value);
                resetPage();
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="All">All books</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="book-sort"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Sort By
            </label>
            <select
              id="book-sort"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                resetPage();
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="year-newest">Year: Newest first</option>
              <option value="year-oldest">Year: Oldest first</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Found {filteredBooks.length} of {books.length} books
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Clear search and filters
          </button>
        </div>
      </section>

      {/* Results table */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            No books found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Try a different search term or change the filters.
          </p>
        </div>
      ) : (
        <>
          <BookTable books={paginatedBooks} onDelete={handleDeleteBook} />

          {/* Pagination controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}–
              {Math.min(startIndex + PAGE_SIZE, filteredBooks.length)} of{" "}
              {filteredBooks.length} books
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-black "
              >
                Previous
              </button>

              <span className="px-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-black"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
        confirmText={modal.confirmText}
        onConfirm={() => {
          if (modal.onConfirm) {
            modal.onConfirm();
          } else {
            setModal((previous) => ({
              ...previous,
              isOpen: false,
            }));
          }
        }}
        onCancel={() => {
          setModal((previous) => ({
            ...previous,
            isOpen: false,
          }));
        }}
      />
    </div>
  );
};

export default Books;
