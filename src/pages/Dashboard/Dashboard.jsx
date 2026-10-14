import { useContext } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../../context/LibraryContext";
import BooksByCategoryChart from "../../components/dashboard/BooksByCategoryChart";
import MonthlyIssuesChart from "../../components/dashboard/MonthlyIssuesChart";
import ReturnStatusChart from "../../components/dashboard/ReturnStatusChart";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const { books, members, transactions } = useContext(LibraryContext);

  const today = getLocalDate();

  // Active transactions with a past due date are overdue.
  const activeTransactions = transactions.filter((transaction) =>
    ["Issued", "Overdue"].includes(transaction.status),
  );

  const overdueTransactions = activeTransactions.filter(
    (transaction) => transaction.dueDate < today,
  );

  // Sum the available physical copies across all book records.
  const availableBooks = books.reduce(
    (total, book) => total + Number(book.availableCopies || 0),
    0,
  );

  const currentlyIssuedBooks = activeTransactions.length;

  // Newest issue dates first. Show only the latest five.
  const recentTransactions = [...transactions]
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 5);

  const stats = [
    {
      title: "Total Books",
      value: books.length,
      description: "Book records in library",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Members",
      value: members.length,
      description: "Registered members",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Currently Issued",
      value: currentlyIssuedBooks,
      description: "Books not yet returned",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Available Books",
      value: availableBooks,
      description: "Copies ready to issue",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Overdue Books",
      value: overdueTransactions.length,
      description: "Active issues past due date",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your library's activity.
          </p>
        </div>

        <Link
          to="/transactions"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Issue a Book
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className={`rounded-lg p-3 ${stat.bg} ${stat.color}`}>
                <span className="text-xl font-bold">#</span>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BooksByCategoryChart books={books} />
        <MonthlyIssuesChart transactions={transactions} />
        <ReturnStatusChart transactions={transactions} />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recently Issued Books
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest five transactions by issue date.
            </p>
          </div>

          <Link
            to="/transactions"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all transactions →
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold text-gray-800">No transactions yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Issue a book to see recent activity here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Book</th>
                  <th className="px-5 py-4">Member</th>
                  <th className="px-5 py-4">Issue Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((transaction) => {
                  const book = books.find(
                    (item) => item.id === transaction.bookId,
                  );

                  const member = members.find(
                    (item) => item.id === transaction.memberId,
                  );

                  const isActive = ["Issued", "Overdue"].includes(
                    transaction.status,
                  );

                  const status =
                    isActive && transaction.dueDate < today
                      ? "Overdue"
                      : transaction.status;

                  const statusClasses =
                    status === "Returned"
                      ? "bg-green-100 text-green-700"
                      : status === "Overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700";

                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                        {transaction.id}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {book?.title || transaction.bookId}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {member?.name || transaction.memberId}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {transaction.issueDate}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
