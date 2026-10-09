
import { useContext } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../../context/LibraryContext";
import BookTable from "../../components/books/BookTable";

const Books = () => {
  const { books, deleteBook } = useContext(LibraryContext);

  const handleDeleteBook = (book) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    );

    if (!confirmed) return;

    const result = deleteBook(book.id);

    if (!result.success) {
      window.alert(result.message);
      return;
    }

    window.alert("Book deleted successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Books
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all books in your library.
          </p>
        </div>

        <Link
          to="/books/add"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Book
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Total Book Records
        </p>

        <p className="mt-2 text-3xl font-bold text-gray-900">
          {books.length}
        </p>
      </div>

      <BookTable
        books={books}
        onDelete={handleDeleteBook}
      />
    </div>
  );
}

export default Books;