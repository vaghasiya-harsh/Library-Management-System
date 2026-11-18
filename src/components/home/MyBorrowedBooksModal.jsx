import { useState, useId, useContext, useMemo } from "react";
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  User,
  ArrowRight,
  BookmarkCheck,
  Lock,
} from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import { useAuth } from "../../context/AuthContext";
import BookCoverImage from "../common/BookCoverImage";

const MyBorrowedBooksModal = ({ isOpen, onClose, initialMemberId, onBorrowMore }) => {
  const { members, transactions, books, returnBook } = useContext(LibraryContext);
  const { currentUser, isAuthenticated } = useAuth();
  const isReader = isAuthenticated && currentUser?.role === "Reader";

  const readerSelectId = useId();

  // Find linked member record for logged in reader
  const readerMember = useMemo(() => {
    if (!currentUser) return null;
    return (
      members.find((m) => m.id === currentUser.memberId) ||
      members.find((m) => m.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
      null
    );
  }, [members, currentUser]);

  const [selectedMemberId, setSelectedMemberId] = useState(() => {
    if (isReader) {
      return readerMember ? readerMember.id : currentUser?.memberId || "MEM001";
    }
    if (initialMemberId) return initialMemberId;
    try {
      const rememberedId = localStorage.getItem("library_last_reader_id");
      const found = members.find((m) => m.id === rememberedId) || members[0];
      return found ? found.id : "";
    } catch {
      return members[0]?.id || "";
    }
  });

  const [prevInitialId, setPrevInitialId] = useState(initialMemberId);
  if (initialMemberId && initialMemberId !== prevInitialId && !isReader) {
    setPrevInitialId(initialMemberId);
    setSelectedMemberId(initialMemberId);
  }

  const [filterTab, setFilterTab] = useState("active"); // 'active' | 'history'
  const [returnSuccessMsg, setReturnSuccessMsg] = useState("");

  const handleClose = () => {
    setReturnSuccessMsg("");
    onClose();
  };

  // Effective Member ID for queries
  const effectiveMemberId = isReader
    ? (readerMember?.id || currentUser?.memberId || "MEM001")
    : selectedMemberId;

  // Selected Member Object
  const currentMember = useMemo(() => {
    if (isReader) {
      return (
        readerMember || {
          id: effectiveMemberId,
          name: currentUser?.name || "Library Reader",
          course: currentUser?.department || "General Studies",
        }
      );
    }
    return members.find((m) => m.id === selectedMemberId) || members[0];
  }, [isReader, readerMember, effectiveMemberId, currentUser, members, selectedMemberId]);

  // All transactions for this member
  const memberTransactions = useMemo(() => {
    if (!effectiveMemberId) return [];
    return transactions.filter((t) => t.memberId === effectiveMemberId);
  }, [transactions, effectiveMemberId]);

  // Active Loans vs Returned
  const activeLoans = useMemo(
    () => memberTransactions.filter((t) => ["Issued", "Overdue"].includes(t.status)),
    [memberTransactions]
  );

  const returnedHistory = useMemo(
    () => memberTransactions.filter((t) => t.status === "Returned"),
    [memberTransactions]
  );

  if (!isOpen) return null;

  const handleReturn = (transactionId, bookTitle) => {
    const res = returnBook(transactionId);
    if (res.success) {
      setReturnSuccessMsg(`"${bookTitle}" has been successfully returned and restocked.`);
      setTimeout(() => setReturnSuccessMsg(""), 4500);
    }
  };

  // Helper to calculate days remaining or overdue
  const getDueStatus = (dueDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffMs = due - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`,
        isOverdue: true,
        isWarning: false,
        colorClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
      };
    }
    if (diffDays === 0) {
      return {
        label: "Due Today",
        isOverdue: false,
        isWarning: true,
        colorClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
      };
    }
    if (diffDays <= 3) {
      return {
        label: `Due in ${diffDays} day${diffDays > 1 ? "s" : ""}`,
        isOverdue: false,
        isWarning: true,
        colorClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
      };
    }
    return {
      label: `${diffDays} days left`,
      isOverdue: false,
      isWarning: false,
      colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
    };
  };

  const displayedList = filterTab === "active" ? activeLoans : returnedHistory;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-300/90 bg-white p-1 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-indigo-500/30 dark:bg-slate-900 sm:p-2 max-h-[92vh] flex flex-col">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 sm:px-7 py-4.5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
              <BookmarkCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
                My Borrowed Books
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isReader
                  ? "Personal circulation ledger and active reading loans"
                  : "Circulation management desk and member reading history"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 hover:rotate-90 active:scale-90 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Member Selector Bar & Reader Card (Privacy Protected) */}
        <div className="border-b border-slate-200/80 bg-slate-50/70 p-4 sm:px-7 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {isReader ? (
              /* Privacy Enforced: Reader sees strictly their own profile */
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-cyan-300">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentUser?.name || "Library Reader"}
                  </span>
                  <span className="ml-2 font-mono text-[11px] font-semibold text-indigo-600 dark:text-cyan-400">
                    ({effectiveMemberId})
                  </span>
                </div>
                <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                  <Lock className="h-2.5 w-2.5" />
                  <span>Personal Reader Card</span>
                </span>
              </div>
            ) : (
              /* Admin Circulation Desk: Selector for all members */
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                <label htmlFor={readerSelectId} className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                  Staff View Reader:
                </label>
                <select
                  id={readerSelectId}
                  value={selectedMemberId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    try {
                      localStorage.setItem("library_last_reader_id", e.target.value);
                    } catch {
                      // ignore
                    }
                  }}
                  className="rounded-xl border border-slate-300/80 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Stats Pills */}
            {currentMember && (
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-cyan-300">
                  Active Loans: {activeLoans.length} / 3
                </span>
                <span className="rounded-lg bg-slate-200/70 px-2.5 py-1 font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  Total Returned: {returnedHistory.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Success Alert Banner on Return */}
        {returnSuccessMsg && (
          <div className="mx-5 sm:mx-7 mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300 animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{returnSuccessMsg}</span>
          </div>
        )}

        {/* Tab Switcher: Active Loans vs Borrowing History */}
        <div className="flex border-b border-slate-200/80 px-5 sm:px-7 pt-3 dark:border-slate-800 gap-4">
          <button
            type="button"
            onClick={() => setFilterTab("active")}
            className={`pb-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              filterTab === "active"
                ? "border-indigo-600 text-indigo-600 dark:border-cyan-400 dark:text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Currently Borrowed ({activeLoans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("history")}
            className={`pb-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              filterTab === "history"
                ? "border-indigo-600 text-indigo-600 dark:border-cyan-400 dark:text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Past Returns History ({returnedHistory.length})</span>
          </button>
        </div>

        {/* Scrollable Book List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          {displayedList.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                {filterTab === "active"
                  ? "No Books Currently Borrowed"
                  : "No Past Return Records"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {filterTab === "active"
                  ? "Explore our collection and click 'Borrow' on any available book to read."
                  : "Books you return will appear here with complete circulation records."}
              </p>
              {filterTab === "active" && (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onBorrowMore?.();
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
                >
                  <span>Explore & Borrow Books</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            displayedList.map((tx) => {
              const bookObj = books.find((b) => b.id === tx.bookId) || {
                id: tx.bookId,
                title: tx.bookTitle,
                author: "Unknown Author",
                category: "General",
              };
              const dueStatus = getDueStatus(tx.dueDate);

              return (
                <div
                  key={tx.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-indigo-500/40"
                >
                  {/* Book Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-18 w-13 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                      <BookCoverImage book={bookObj} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-cyan-300">
                          {bookObj.category}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          #{tx.id}
                        </span>
                      </div>

                      <h4 className="mt-1 line-clamp-1 text-sm font-extrabold text-slate-900 dark:text-white">
                        {tx.bookTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        By {bookObj.author}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          Issued: {tx.issueDate}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          Due: {tx.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Status Right Side */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                    {/* Status / Due Badge */}
                    {tx.status === "Returned" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Returned on {tx.returnDate || "Shelf"}</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-extrabold ${dueStatus.colorClass}`}
                        >
                          {dueStatus.isOverdue && <AlertTriangle className="h-3 w-3" />}
                          {!dueStatus.isOverdue && <Clock className="h-3 w-3" />}
                          <span>{dueStatus.label}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleReturn(tx.id, tx.bookTitle)}
                          className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-600 hover:text-white active:scale-95 transition dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-cyan-300 dark:hover:bg-indigo-600 dark:hover:text-white"
                          title="Return physical copy to counter"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Return Book</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="flex items-center justify-between border-t border-slate-200/80 px-5 sm:px-7 py-3.5 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            Self-service circulation powered by Lumina Central Library
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBorrowedBooksModal;
