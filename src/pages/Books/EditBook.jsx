import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LibraryContext } from "../../context/LibraryContext";
import BookForm from "../../components/books/BookForm";

const EditBook = () => {
  const { id } = useParams();
  const { books, updateBook } = useContext(LibraryContext);
  const navigate = useNavigate();

  const book = books.find((item) => item.id === id);

  if (!book) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Book not found</h1>

        <Link
          to="/books"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to Books
        </Link>
      </div>
    );
  }

  const handleUpdateBook = (updatedDetails) => {
    const result = updateBook(id, updatedDetails);

    if (!result.success) {
      alert(result.message);
      return;
    }

    navigate("/books");
  };

  const initialValues = {
    title: book.title ?? "",
    author: book.author ?? "",
    category: book.category ?? "",
    isbn: book.isbn ?? "",
    publisher: book.publisher ?? "",
    publishedYear: book.publishedYear ?? "",
    totalCopies: book.totalCopies ?? 1,
    availableCopies: book.availableCopies ?? 0,
    image: book.image ?? "",
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/books"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Books
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">Edit Book</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update details for {book.id}.
        </p>
      </div>

      <BookForm
        initialValues={initialValues}
        onSubmit={handleUpdateBook}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditBook;
