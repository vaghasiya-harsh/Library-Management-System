import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  ArrowLeftRight,
  BookCheck,
  AlertTriangle,
  Plus,
  ArrowRight,
  Sparkles,
  Eye,
} from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import BooksByCategoryChart from "../../components/dashboard/BooksByCategoryChart";
import MonthlyIssuesChart from "../../components/dashboard/MonthlyIssuesChart";
import ReturnStatusChart from "../../components/dashboard/ReturnStatusChart";
import BookQuickViewModal from "../../components/home/BookQuickViewModal";
import BookCoverImage from "../../components/common/BookCoverImage";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const { books, members, transactions } = useContext(LibraryContext);
  const [quickViewBook, setQuickViewBook] = useState(null);

  const today = getLocalDate();

  const activeTransactions = transactions.filter((t) =>
    ["Issued", "Overdue"].includes(t.status)
  );

  const overdueTransactions = activeTransactions.filter(
    (t) => t.dueDate < today
  );

  const availableBooks = books.reduce(
    (total, book) => total + Number(book.availableCopies || 0),
    0
  );

  const currentlyIssuedBooks = activeTransactions.length;

  const recentTransactions = [...transactions]
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 6);

  // Showcase 6 available books on the dashboard
  const showcaseBooks = books
    .filter((b) => Number(b.availableCopies || 0) > 0)
    .slice(0, 6);

  const stats = [
    {
      title: "Total Books",
      value: books.length,
      description: "Unique catalog records",
      icon: BookOpen,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/60",
      border: "border-indigo-100/80 dark:border-indigo-900/40",
      accent: "from-indigo-500 to-indigo-600",
      glow: "shadow-indigo-500/10",
    },
    {
      title: "Available Copies",
      value: availableBooks,
      description: "Physical copies on shelf",
      icon: BookCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      border: "border-emerald-100/80 dark:border-emerald-900/40",
      accent: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/10",
    },
    {
      title: "Currently Issued",
      value: currentlyIssuedBooks,
      description: "Books with members",
      icon: ArrowLeftRight,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
      border: "border-amber-100/80 dark:border-amber-900/40",
      accent: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/10",
    },
    {
      title: "Total Members",
      value: members.length,
      description: "Registered borrowers",
      icon: Users,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-950/60",
      border: "border-cyan-100/80 dark:border-cyan-900/40",
      accent: "from-cyan-500 to-blue-500",
      glow: "shadow-cyan-500/10",
    },
    {
      title: "Overdue Items",
      value: overdueTransactions.length,
      description: "Past due return deadline",
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/60",
      border: "border-rose-100/80 dark:border-rose-900/40",
      accent: "from-rose-500 to-pink-500",
      glow: "shadow-rose-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-2xl">
        {/* Animated Aurora Glows */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-aurora-drift" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl animate-pulse-glow" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
              <span>Library Management Center</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Welcome back, Administrator
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Here is what is happening across your library catalog and members circulation today.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20 active:scale-95 shadow-sm"
            >
              <span>Explore Public Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to="/books/add"
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20 active:scale-95 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Link>

            <Link
              to="/transactions"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-95 active:scale-95"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Issue a Book</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`interactive-card card-sheen relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 group`}
            >
              {/* Top Accent Gradient Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.accent} opacity-80`}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {stat.title}
                </span>
                <div
                  className={`rounded-xl p-2.5 ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110 shadow-2xs`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Books Showcase Strip on Dashboard */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/60 dark:text-indigo-300">
              <BookOpen className="h-3.5 w-3.5" />
              Available Collection
            </div>
            <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-white font-display">
              Quick Books Showcase
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Browse top available physical titles in stock right now
            </p>
          </div>

          <Link
            to="/books"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300/80 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 active:scale-95 dark:border-slate-800 dark:bg-slate-800/60 dark:text-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
          >
            <span>View All Books Inventory</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {showcaseBooks.map((book) => (
            <div
              key={book.id}
              className="interactive-card card-sheen group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
            >
              <div>
                <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                  <BookCoverImage book={book} alt={book.title} />

                  <span className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 rounded-md bg-emerald-600/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full beacon-emerald bg-white" />
                    {book.availableCopies} left
                  </span>
                </div>

                <div className="mt-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                    {book.category}
                  </p>
                  <h3
                    className="line-clamp-1 text-xs font-bold text-slate-900 dark:text-white"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                  <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {book.author}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setQuickViewBook(book)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200/80 bg-white px-2 py-1.5 text-[10px] font-bold text-slate-700 shadow-2xs transition hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-cyan-300"
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
                <Link
                  to={`/books/${book.id}`}
                  className="rounded-lg bg-indigo-600 p-1.5 text-white shadow-2xs transition hover:bg-indigo-700 active:scale-95"
                  title="Full details"
                >
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <BooksByCategoryChart books={books} />
        </div>
        <div className="xl:col-span-1">
          <MonthlyIssuesChart transactions={transactions} />
        </div>
        <div className="xl:col-span-1">
          <ReturnStatusChart transactions={transactions} />
        </div>
      </div>

      {/* Recent Transactions Table */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/90 p-6 dark:border-slate-800/80">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
              Recent Issue Activity
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Latest transactions sorted by issue date
            </p>
          </div>

          <Link
            to="/transactions"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300/80 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 active:scale-95 dark:border-slate-800 dark:bg-slate-800/60 dark:text-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
          >
            <span>View All Transactions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              No transactions recorded
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Issue a book from the transactions desk to see activity here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200/90 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Member Name</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentTransactions.map((transaction) => {
                  const book = books.find((item) => item.id === transaction.bookId);
                  const member = members.find((item) => item.id === transaction.memberId);

                  const isActive = ["Issued", "Overdue"].includes(transaction.status);
                  const status =
                    isActive && transaction.dueDate < today
                       ? "Overdue"
                      : transaction.status;

                  const statusClasses =
                    status === "Returned"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                      : status === "Overdue"
                      ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800";

                  return (
                    <tr
                      key={transaction.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {transaction.id}
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-7 rounded-md overflow-hidden shadow-2xs shrink-0 border border-slate-200/60 dark:border-slate-700">
                            <BookCoverImage book={book || { title: transaction.bookId }} />
                          </div>
                          <span className="line-clamp-1">{book?.title || transaction.bookId}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 font-mono text-[10px] font-bold text-indigo-700 dark:bg-slate-700 dark:text-cyan-300">
                            {(member?.name || "M").charAt(0)}
                          </div>
                          <span>{member?.name || transaction.memberId}</span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {transaction.issueDate}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {transaction.dueDate}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusClasses}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
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

      {/* Quick View Modal */}
      {quickViewBook && (
        <BookQuickViewModal
          book={quickViewBook}
          onClose={() => setQuickViewBook(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
