import { useContext } from "react";
import { LibraryContext } from "../../context/LibraryContext";
const Dashboard = () => {
  const {books, members, transactions} = useContext(LibraryContext);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome to Library Management System
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Books</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {books.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Members</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {members.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Transactions</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {transactions.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Available Books</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {books.reduce((total, book) => total + book.availableCopies, 0)}
          </h2>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
