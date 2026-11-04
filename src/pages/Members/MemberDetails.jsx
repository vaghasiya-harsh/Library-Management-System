import { useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  ArrowLeft,
  Edit3,
  ArrowLeftRight,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members, books, transactions } = useContext(LibraryContext);

  const member = members.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Member Not Found
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          No borrower record exists for ID: <span className="font-mono">{id}</span>
        </p>
        <Link
          to="/members"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Members</span>
        </Link>
      </div>
    );
  }

  const memberTransactions = transactions.filter((t) => t.memberId === member.id);
  const activeLoans = memberTransactions.filter((t) =>
    ["Issued", "Overdue"].includes(t.status)
  );
  const isActive = member.status === "Active";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Members Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/members/${member.id}/edit`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Link>

          <Link
            to={`/transactions?memberId=${member.id}`}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Issue a Book to Member</span>
          </Link>
        </div>
      </div>

      {/* Member Profile Hero & Digital Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Digital Library Card Mockup */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950 p-6 text-white shadow-2xl">
            {/* Glow Blobs */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-indigo-500/20 blur-2xl" />

            <div className="relative z-10 flex flex-col justify-between h-56">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-xs">
                    <CreditCard className="h-4 w-4 text-cyan-300" />
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase text-cyan-200">
                    Lumina Library Pass
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/30" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {member.status}
                </span>
              </div>

              <div>
                <p className="font-mono text-base tracking-widest text-slate-300">
                  {member.id}
                </p>
                <h3 className="mt-1 text-xl font-extrabold tracking-tight text-white font-display">
                  {member.name}
                </h3>
                <p className="text-xs text-indigo-200">{member.course}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
                <span>Member Since: {member.joiningDate}</span>
                <span className="font-mono text-cyan-300">ATHENA-ID-PASS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Specs & Contact Overview */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-lg font-bold text-white shadow-md">
                {member.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Registered Library Borrower • {member.id}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </span>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white truncate">
                  {member.email}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </span>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {member.phone}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <GraduationCap className="h-3.5 w-3.5" /> Academic Course
                </span>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {member.course}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Calendar className="h-3.5 w-3.5" /> Member Since
                </span>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {member.joiningDate}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Total Loans: <strong className="text-slate-900 dark:text-white">{memberTransactions.length} books</strong></span>
            <span>Active Issues: <strong className="text-emerald-600 dark:text-emerald-400">{activeLoans.length} books</strong></span>
          </div>
        </div>
      </div>

      {/* Borrowing History Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="border-b border-slate-200/80 p-6 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Borrowing & Circulation History
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            List of all books loaned, due dates, and return statuses for {member.name}
          </p>
        </div>

        {memberTransactions.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No loans have been recorded for this member yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Return Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {memberTransactions.map((trx) => {
                  const book = books.find((b) => b.id === trx.bookId);
                  const isReturned = trx.status === "Returned";

                  return (
                    <tr key={trx.id} className="text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-4 font-mono font-medium">{trx.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        <Link to={`/books/${trx.bookId}`} className="hover:text-indigo-600 transition">
                          {book?.title || trx.bookId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{trx.issueDate}</td>
                      <td className="px-6 py-4 text-slate-500">{trx.dueDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            isReturned
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          }`}
                        >
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;
