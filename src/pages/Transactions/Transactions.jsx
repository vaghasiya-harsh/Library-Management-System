
import { useContext, useState } from "react";
import { LibraryContext } from "../../context/LibraryContext";

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateAfterDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const Transactions = () => {
  const { books, members, transactions, issueBook, returnBook } =
    useContext(LibraryContext);

  const today = getLocalDate();

  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(getDateAfterDays(7));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleIssue = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const result = issueBook({
      bookId,
      memberId,
      issueDate,
      dueDate,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess("Book issued successfully.");
    setBookId("");
    setMemberId("");
    setIssueDate(today);
    setDueDate(getDateAfterDays(7));
  };

  const handleReturn = (transactionId) => {
    setError("");
    setSuccess("");

    const result = returnBook(transactionId);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess("Book returned successfully.");
  };

  const transactionRows = transactions.map((transaction) => {
    const book = books.find((item) => item.id === transaction.bookId);
    const member = members.find(
      (item) => item.id === transaction.memberId
    );

    const status =
      ["Issued", "Overdue"].includes(transaction.status) &&
      transaction.dueDate < today
        ? "Overdue"
        : transaction.status;

    return { ...transaction, book, member, status };
  });

  const activeCount = transactionRows.filter(
    (transaction) =>
      ["Issued", "Overdue"].includes(transaction.status)
  ).length;

  const overdueCount = transactionRows.filter(
    (transaction) => transaction.status === "Overdue"
  ).length;

  const availableBooks = books.filter(
    (book) => Number(book.availableCopies) > 0
  );

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Issue books, process returns, and track overdue books.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {transactions.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Issues</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Overdue Books</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {overdueCount}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Issue a Book
        </h2>

        <form onSubmit={handleIssue} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="bookId" className="mb-2 block text-sm font-medium text-gray-700">
                Select Book
              </label>
              <select
                id="bookId"
                value={bookId}
                onChange={(event) => setBookId(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                <option value="">Choose a book</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.availableCopies} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="memberId" className="mb-2 block text-sm font-medium text-gray-700">
                Select Member
              </label>
              <select
                id="memberId"
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                <option value="">Choose a member</option>
                {activeMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="issueDate" className="mb-2 block text-sm font-medium text-gray-700">
                Issue Date
              </label>
              <input
                id="issueDate"
                type="date"
                value={issueDate}
                max={today}
                onChange={(event) => setIssueDate(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="mb-2 block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                min={issueDate || today}
                onChange={(event) => setDueDate(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Issue Book
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction History
          </h2>
        </div>

        {transactionRows.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-gray-800">No transactions yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Issue your first book using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Book</th>
                  <th className="px-5 py-4">Member</th>
                  <th className="px-5 py-4">Issue Date</th>
                  <th className="px-5 py-4">Due Date</th>
                  <th className="px-5 py-4">Return Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactionRows.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {transaction.id}
                    </td>
                    <td className="px-5 py-4">
                      {transaction.book?.title || transaction.bookId}
                    </td>
                    <td className="px-5 py-4">
                      {transaction.member?.name || transaction.memberId}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {transaction.issueDate}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {transaction.dueDate}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {transaction.returnDate || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.status === "Returned"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "Overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {["Issued", "Overdue"].includes(transaction.status) ? (
                        <button
                          type="button"
                          onClick={() => handleReturn(transaction.id)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Return
                        </button>
                      ) : (
                        <span className="text-gray-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Transactions;
