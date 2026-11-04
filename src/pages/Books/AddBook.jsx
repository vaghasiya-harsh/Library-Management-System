import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
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
    publishedYear: new Date().getFullYear(),
    totalCopies: 3,
    availableCopies: 3,
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Book Inventory</span>
        </Link>
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
          <PlusCircle className="h-3.5 w-3.5" />
          New Acquisition
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Add New Book to Collection
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Catalog a new title into the library management system
        </p>
      </div>

      <BookForm
        initialValues={initialValues}
        onSubmit={handleAddBook}
        submitLabel="Add Book to Catalog"
      />
    </div>
  );
};

export default AddBook;
