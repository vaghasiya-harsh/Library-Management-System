import { useContext, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeftRight,
  Download,
  AlertTriangle,
  CheckCircle2,
  Check,
  Search,
} from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import { exportTransactionsCSV } from "../../utils/exportTransactionsCSV";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateAfterDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Transactions = () => {
  const { books, members, transactions, issueBook, returnBook } =
    useContext(LibraryContext);

  const [searchParams] = useSearchParams();
  const today = getLocalDate();

  const paramBook = searchParams.get("bookId") || "";
  const paramMember = searchParams.get("memberId") || "";

  const [bookId, setBookId] = useState(paramBook);
  const [memberId, setMemberId] = useState(paramMember);
  const [prevParams, setPrevParams] = useState({ bookId: paramBook, memberId: paramMember });

  if (paramBook !== prevParams.bookId || paramMember !== prevParams.memberId) {
    setPrevParams({ bookId: paramBook, memberId: paramMember });
    if (paramBook) setBookId(paramBook);
    if (paramMember) setMemberId(paramMember);
  }

  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(getDateAfterDays(14)); // 14 days default
  const [statusFilter, setStatusFilter] = useState("All");
  const [tableSearch, setTableSearch] = useState("");
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

    setSuccess("Book has been successfully issued to borrower.");
    setBookId("");
    setMemberId("");
    setIssueDate(today);
    setDueDate(getDateAfterDays(14));
  };

  const handleReturn = (transactionId) => {
    setError("");
    setSuccess("");

    const result = returnBook(transactionId);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess("Book return checked in successfully. Copy count updated.");
  };

  const transactionRows = transactions.map((transaction) => {
    const book = books.find((item) => item.id === transaction.bookId);
    const member = members.find((item) => item.id === transaction.memberId);

    const status =
      ["Issued", "Overdue"].includes(transaction.status) &&
      transaction.dueDate < today
        ? "Overdue"
        : transaction.status;

    return { ...transaction, book, member, status };
  });

  const activeCount = transactionRows.filter((t) =>
    ["Issued", "Overdue"].includes(t.status)
  ).length;

  const overdueCount = transactionRows.filter(
    (t) => t.status === "Overdue"
  ).length;

  const availableBooks = books.filter(
    (book) => Number(book.availableCopies) > 0
  );

  const activeMembers = members.filter((member) => member.status === "Active");

  // Filter transactions table
  const filteredRows = transactionRows.filter((t) => {
    const matchesFilter =
      statusFilter === "All" ||
      (statusFilter === "Active" && ["Issued", "Overdue"].includes(t.status)) ||
      t.status === statusFilter;

    const q = tableSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      [t.id, t.book?.title, t.member?.name, t.bookId, t.memberId].some((val) =>
        String(val || "").toLowerCase().includes(q)
      );

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Circulation Desk
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Book Loans & Returns
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Issue physical copies, check in returned books, and monitor overdue deadlines
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportTransactionsCSV(transactions, books, members)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-cyan-300"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV Log</span>
        </button>
      </div>

      {/* Success / Error Alerts */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="interactive-card card-sheen rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">All Time Loans</span>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white font-display">{transactions.length}</p>
        </div>

        <div className="interactive-card card-sheen rounded-2xl border border-indigo-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Currently Circulating</span>
          <p className="mt-2 text-3xl font-black text-indigo-600 dark:text-cyan-400 font-display">{activeCount}</p>
        </div>

        <div className="interactive-card card-sheen rounded-2xl border border-rose-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Overdue Items</span>
          <p className="mt-2 text-3xl font-black text-rose-600 dark:text-rose-400 font-display">{overdueCount}</p>
        </div>
      </div>

      {/* Issue Book Form Section */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Issue a Book to Member
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an available title and registered borrower
            </p>
          </div>
        </div>

        <form onSubmit={handleIssue} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Book Selector */}
            <div>
              <label
                htmlFor="bookId"
                className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Select Book to Issue <span className="text-rose-500">*</span>
              </label>
              <select
                id="bookId"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-indigo-900/40"
              >
                <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">-- Choose an available book ({availableBooks.length} available) --</option>
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                    {b.title} • ({b.availableCopies} available) • ID: {b.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Member Selector */}
            <div>
              <label
                htmlFor="memberId"
                className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Select Borrower Member <span className="text-rose-500">*</span>
              </label>
              <select
                id="memberId"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-indigo-900/40"
              >
                <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">-- Choose an active member ({activeMembers.length} active) --</option>
                {activeMembers.map((m) => (
                  <option key={m.id} value={m.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                    {m.name} • ({m.course}) • ID: {m.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Date */}
            <div>
              <label
                htmlFor="issueDate"
                className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Issue Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="issueDate"
                type="date"
                value={issueDate}
                max={today}
                onChange={(e) => setIssueDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:ring-indigo-900/40"
              />
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Due Return Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                min={issueDate || today}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:ring-indigo-900/40"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:opacity-95"
            >
              Confirm & Issue Book
            </button>
          </div>
        </form>
      </section>

      {/* Transactions History Table Section */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 p-6 dark:border-slate-800/80">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
              Circulation History & Records
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredRows.length} loan records
            </p>
          </div>

          {/* Search & Filter Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-44 sm:w-56 rounded-xl border border-slate-300/80 bg-slate-50/80 py-1.5 pl-8 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:border-cyan-400"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "Active", "Returned", "Overdue"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                    statusFilter === st
                      ? "bg-indigo-600 text-white shadow-xs dark:bg-gradient-to-r dark:from-indigo-600 dark:to-cyan-600 dark:text-white"
                      : "bg-white text-slate-800 border border-slate-300/80 shadow-2xs hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 dark:hover:text-cyan-300"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredRows.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No transactions matching the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200/90 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Issued</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Returned Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRows.map((trx) => {
                  const isReturned = trx.status === "Returned";
                  const isOverdue = trx.status === "Overdue";

                  return (
                    <tr
                      key={trx.id}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {trx.id}
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        <Link to={`/books/${trx.bookId}`} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition">
                          {trx.book?.title || trx.bookId}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        <Link to={`/members/${trx.memberId}`} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition">
                          {trx.member?.name || trx.memberId}
                        </Link>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {trx.issueDate}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {trx.dueDate}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {trx.returnDate || "—"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isReturned
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                              : isOverdue
                              ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {trx.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {!isReturned ? (
                          <button
                            type="button"
                            onClick={() => handleReturn(trx.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Check In</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Completed</span>
                        )}
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

export default Transactions;
