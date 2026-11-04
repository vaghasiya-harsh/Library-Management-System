import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit3, ArrowLeft, AlertTriangle } from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import BookForm from "../../components/books/BookForm";

const EditBook = () => {
  const { id } = useParams();
  const { books, updateBook } = useContext(LibraryContext);
  const navigate = useNavigate();

  const book = books.find((item) => item.id === id);

  if (!book) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Book Not Found
        </h1>
        <Link
          to="/books"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Books</span>
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
    navigate(`/books/${id}`);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/books/${id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Book Details</span>
        </Link>
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
          <Edit3 className="h-3.5 w-3.5" />
          Catalog Editor
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Edit: {book.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update bibliographic details and inventory for <span className="font-mono">{book.id}</span>
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
