import { Link } from "react-router-dom";

const BookTable = ({ books, onDelete }) => {
  if (books.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">No books found</h2>
        <p className="mt-2 text-sm text-gray-500">
          Add your first book to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4">Book ID</th>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Author</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Copies</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {books.map((book) => {
              const isAvailable = book.availableCopies > 0;

              return (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-700">
                    {book.id}
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {book.title}
                  </td>

                  <td className="px-5 py-4 text-gray-600">{book.author}</td>

                  <td className="px-5 py-4 text-gray-600">{book.category}</td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {book.availableCopies} / {book.totalCopies}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/books/${book.id}/edit`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(book)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
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
