import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LibraryContext } from "../../context/LibraryContext";
import BookForm from "../../components/books/BookForm";

const AddBook = () => {
  const { addBook } = useContext(LibraryContext);
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    author: "",
    category: "",
    isbn: "",
    publisher: "",
    publishedYear: "",
    totalCopies: 1,
    availableCopies: 1,
    image: "",
  };

  const handleAddBook = (bookDetails) => {
    const result = addBook(bookDetails);

    if (!result.success) {
      alert(result.message);
      return;
    }

    navigate("/books");
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

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Add Book
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Enter the details of the new book.
        </p>
      </div>

      <BookForm
        initialValues={initialValues}
        onSubmit={handleAddBook}
        submitLabel="Add Book"
      />
    </div>
  );
}

export default AddBook;




