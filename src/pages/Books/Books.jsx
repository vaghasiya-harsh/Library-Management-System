
import { useContext } from "react";
import { LibraryContext } from "../../context/LibraryContext";

const Books = () => {
    const { books } = useContext(LibraryContext);
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Books</h1>

      <p className="mb-6 text-sm text-gray-500">Total Books: {books.length}</p>

      <div className="space-y-4">
        {books.map((book) => (
          <div key={book.id} className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900">{book.title}</h2>

            <p className="text-sm text-gray-500">Author: {book.author}</p>

            <p className="text-sm text-gray-500">Category: {book.category}</p>

            <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>

            <p className="text-sm text-gray-500">Publisher: {book.publisher}</p>

            <p className="text-sm text-gray-500">PublishedYear: {book.publishedYear}</p>

            <p className="text-sm text-gray-500">TotalCopies: {book.totalCopies}</p>

            <p className="text-sm text-gray-500">AvailableCopies: {book.availableCopies}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
