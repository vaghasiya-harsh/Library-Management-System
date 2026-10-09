import { useContext } from "react";
import { LibraryContext } from "../../context/LibraryContext";
import BookTable from "../../components/books/BookTable";

const Books = () => {
   const { books } = useContext(LibraryContext);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Books
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View all books available in the library.
        </p>
      </div>

      <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:w-64">
        <p className="text-sm font-medium text-gray-500">
          Total Book Records
        </p>

        <p className="mt-2 text-3xl font-bold text-gray-900">
          {books.length}
        </p>
      </div>

      <BookTable books={books} />
    </div>
  );
}
export default Books;
