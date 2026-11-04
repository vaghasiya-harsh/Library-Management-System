import { useState, useId, useContext, useMemo } from "react";
import {
  X,
  BookOpen,
  Calendar,
  UserCheck,
  UserPlus,
  ShieldAlert,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowRight,
  Clock,
  IdCard,
  ChevronDown,
} from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import BookCoverImage from "../common/BookCoverImage";

const LOAN_PERIODS = [
  { days: 7, label: "7 Days", desc: "Quick Read" },
  { days: 14, label: "14 Days", desc: "Standard Loan (Recommended)" },
  { days: 21, label: "21 Days", desc: "Semester Research" },
];

const UserBorrowModal = ({ book, isOpen, onClose, onOpenMyBooks }) => {
  const { members, transactions, issueBook, addMember } = useContext(LibraryContext);
  const memberSelectId = useId();

  const [activeTab, setActiveTab] = useState("existing"); // 'existing' | 'new'
  const [selectedMemberId, setSelectedMemberId] = useState(() => {
    try {
      const rememberedId = localStorage.getItem("library_last_reader_id");
      const initialMember =
        members.find((m) => m.id === rememberedId && m.status === "Active") ||
        members.find((m) => m.status === "Active");
      return initialMember ? initialMember.id : members[0]?.id || "";
    } catch {
      return members[0]?.id || "";
    }
  });
  const [loanDays, setLoanDays] = useState(14);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // New Reader Quick Form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCourse, setNewCourse] = useState("Computer Science & Engineering");

  // Error / Success states
  const [error, setError] = useState("");
  const [issueReceipt, setIssueReceipt] = useState(null);

  const handleClose = () => {
    setError("");
    setIssueReceipt(null);
    onClose();
  };

  // Selected member details and their active loans
  const selectedMember = useMemo(
    () => members.find((m) => m.id === selectedMemberId),
    [members, selectedMemberId]
  );

  const memberActiveLoans = useMemo(() => {
    if (!selectedMemberId) return [];
    return transactions.filter(
      (t) =>
        t.memberId === selectedMemberId &&
        ["Issued", "Overdue"].includes(t.status)
    );
  }, [transactions, selectedMemberId]);

  if (!isOpen || !book) return null;

  const availableCopies = Number(book.availableCopies || 0);
  const isAvailable = availableCopies > 0;

  // Calculate Dates
  const today = new Date();
  const issueDateStr = today.toISOString().split("T")[0];

  const dueDateObj = new Date(today);
  dueDateObj.setDate(dueDateObj.getDate() + loanDays);
  const dueDateStr = dueDateObj.toISOString().split("T")[0];

  const formattedDueDate = dueDateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isAvailable) {
      setError("This title is currently out of physical stock on library shelves.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the library borrowing and care guidelines.");
      return;
    }

    let targetMemberId = selectedMemberId;

    // Handle new reader registration on the fly
    if (activeTab === "new") {
      if (!newName.trim() || !newEmail.trim()) {
        setError("Please enter your name and email to create your reader card.");
        return;
      }

      const addResult = addMember({
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim() || "N/A",
        course: newCourse.trim() || "General Studies",
        joiningDate: issueDateStr,
        status: "Active",
      });

      if (!addResult.success) {
        setError(addResult.message || "Could not register new member.");
        return;
      }

      targetMemberId = addResult.member.id;
      setSelectedMemberId(targetMemberId);
    }

    if (!targetMemberId) {
      setError("Please select or register a valid library member account.");
      return;
    }

    // Call issueBook in LibraryContext
    const issueResult = issueBook({
      bookId: book.id,
      memberId: targetMemberId,
      issueDate: issueDateStr,
      dueDate: dueDateStr,
    });

    if (!issueResult.success) {
      setError(issueResult.message || "Failed to borrow book. Check borrowing quota.");
      return;
    }

    // Remember reader ID in browser
    try {
      localStorage.setItem("library_last_reader_id", targetMemberId);
    } catch {
      // Ignore storage errors
    }

    // Create Receipt Data
    const borrower =
      members.find((m) => m.id === targetMemberId) || {
        id: targetMemberId,
        name: newName || "Library Reader",
        course: newCourse,
      };

    setIssueReceipt({
      transactionId: issueResult.transaction?.id || `TRX${Date.now().toString().slice(-4)}`,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCategory: book.category,
      bookId: book.id,
      isbn: book.isbn,
      memberId: borrower.id,
      memberName: borrower.name,
      memberCourse: borrower.course || "Student Member",
      issueDate: issueDateStr,
      dueDate: dueDateStr,
      formattedDueDate,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-300/90 bg-white p-1 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-indigo-500/30 dark:bg-slate-900 sm:p-2 max-h-[92vh] flex flex-col">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600" />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 hover:rotate-90 active:scale-90 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* If Issue Receipt is Ready (Checkout Complete View) */}
          {issueReceipt ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              {/* Success Badge */}
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-md shadow-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-400 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white font-display">
                  Book Issued Successfully!
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Your physical copy has been reserved. Please present this digital receipt at the library pickup desk.
                </p>
              </div>

              {/* Realistic Digital Library Borrow Receipt Slip */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50/60 via-white to-indigo-50/40 p-5 sm:p-6 shadow-sm dark:border-indigo-800/80 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/60">
                {/* Official Library Seal */}
                <div className="flex items-center justify-between border-b border-indigo-200/80 pb-4 dark:border-indigo-900/50">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-950 dark:text-cyan-300">
                        Lumina Central Library
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Official Reader Issue Pass
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    Issued
                  </span>
                </div>

                {/* Slip Details Grid */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Transaction Slip No.
                    </span>
                    <p className="font-mono text-sm font-black text-indigo-600 dark:text-cyan-400">
                      {issueReceipt.transactionId}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Return Due Date
                    </span>
                    <p className="text-sm font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {issueReceipt.formattedDueDate}
                    </p>
                  </div>

                  <div className="col-span-2 border-t border-indigo-100 pt-3 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Borrowed Title
                    </span>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                      {issueReceipt.bookTitle}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      By {issueReceipt.bookAuthor} • Catalog ID: {issueReceipt.bookId}
                    </p>
                  </div>

                  <div className="col-span-2 border-t border-indigo-100 pt-3 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Borrower Member
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {issueReceipt.memberName}{" "}
                      <span className="font-mono text-indigo-600 dark:text-cyan-400">
                        ({issueReceipt.memberId})
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {issueReceipt.memberCourse}
                    </p>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="mt-5 border-t border-indigo-200/80 pt-4 text-center dark:border-slate-800">
                  <div className="mx-auto flex h-8 w-48 items-center justify-between px-2 bg-slate-900 rounded-sm">
                    {[3, 1, 4, 1, 5, 2, 4, 1, 3, 2, 5, 1, 2, 4, 2, 3, 1, 4].map((w, idx) => (
                      <span
                        key={idx}
                        className="bg-white h-full"
                        style={{ width: `${w * 1.5}px` }}
                      />
                    ))}
                  </div>
                  <p className="mt-1 font-mono text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                    *{issueReceipt.transactionId}-{issueReceipt.bookId}*
                  </p>
                </div>
              </div>

              {/* Action Buttons on Receipt */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Printer className="h-4 w-4" />
                  Print Issue Slip
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onOpenMyBooks?.(issueReceipt.memberId);
                  }}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition"
                >
                  <span>View in My Borrowed Books</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Borrowing Checkout Form */
            <form onSubmit={handleIssueSubmit} className="space-y-6">
              {/* Modal Top Heading */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400">
                  <IdCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
                    Borrow Library Book
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Self-service checkout for students, faculty & registered members
                  </p>
                </div>
              </div>

              {/* Book Overview Banner */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/40">
                <div className="relative h-18 w-13 shrink-0 overflow-hidden rounded-xl shadow-xs border border-slate-200 dark:border-slate-700">
                  <BookCoverImage book={book} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-cyan-300">
                    {book.category}
                  </span>
                  <h3 className="mt-1 line-clamp-1 text-sm font-extrabold text-slate-900 dark:text-white">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    By {book.author}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span
                      className={`font-bold ${
                        isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"
                      }`}
                    >
                      {availableCopies} copies on shelf
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-mono text-slate-500 text-[11px]">ID: {book.id}</span>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 animate-in shake">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Member Identity Selector / Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor={memberSelectId} className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Step 1: Borrower Identification
                  </label>
                  <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveTab("existing")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold transition ${
                        activeTab === "existing"
                          ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-700 dark:text-cyan-300"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Select Member</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("new")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold transition ${
                        activeTab === "new"
                          ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-700 dark:text-cyan-300"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>+ New Card</span>
                    </button>
                  </div>
                </div>

                {activeTab === "existing" ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <select
                        id={memberSelectId}
                        value={selectedMemberId}
                        onChange={(e) => setSelectedMemberId(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-10 text-xs font-bold text-slate-900 outline-none transition-all duration-200 shadow-2xs hover:border-indigo-400 focus:border-indigo-500 focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-slate-600 dark:focus:bg-slate-800 dark:focus:text-white dark:focus:border-cyan-400 dark:focus:ring-2 dark:focus:ring-cyan-400/25 cursor-pointer"
                      >
                        {members.map((m) => (
                          <option
                            key={m.id}
                            value={m.id}
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 py-2 font-semibold"
                          >
                            {m.name} ({m.id}) — {m.course}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-400">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Member Quota & Status Pill */}
                    {selectedMember && (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/80 shadow-2xs transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-sm font-black text-white shadow-xs">
                            {selectedMember.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-slate-900 dark:text-white truncate text-xs sm:text-sm">
                              {selectedMember.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {selectedMember.course} • <span className="font-mono text-indigo-600 dark:text-cyan-400 font-bold">{selectedMember.id}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                            Active Loans:{" "}
                            <strong
                              className={
                                memberActiveLoans.length >= 3
                                  ? "text-rose-600 dark:text-rose-400 font-black"
                                  : "text-indigo-600 dark:text-cyan-400 font-black"
                              }
                            >
                              {memberActiveLoans.length} / 3
                            </strong>
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              selectedMember.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60"
                                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/60"
                            }`}
                          >
                            {selectedMember.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* New Reader Quick Registration Form */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="mt-1 w-full rounded-xl border border-slate-300/80 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-2 dark:focus:ring-cyan-400/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="john.doe@university.edu"
                        className="mt-1 w-full rounded-xl border border-slate-300/80 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-2 dark:focus:ring-cyan-400/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Phone / Contact
                      </label>
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="mt-1 w-full rounded-xl border border-slate-300/80 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-2 dark:focus:ring-cyan-400/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Department / Course
                      </label>
                      <input
                        type="text"
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value)}
                        placeholder="e.g. Literature & Arts"
                        className="mt-1 w-full rounded-xl border border-slate-300/80 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-2 dark:focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Loan Period & Due Date */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Step 2: Choose Loan Period & Return Due Date
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {LOAN_PERIODS.map((period) => (
                    <button
                      key={period.days}
                      type="button"
                      onClick={() => setLoanDays(period.days)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                        loanDays === period.days
                          ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm dark:border-cyan-400 dark:bg-indigo-950/60 dark:text-cyan-300 scale-102"
                          : "border-slate-200/90 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-sm font-extrabold">{period.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {period.desc}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs dark:border-indigo-900/40 dark:bg-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    Scheduled Return Date:
                  </span>
                  <span className="font-extrabold text-indigo-700 dark:text-cyan-300 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formattedDueDate}
                  </span>
                </div>
              </div>

              {/* Library Terms Agreement Checkbox */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/30">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700"
                  />
                  <span>
                    I confirm this checkout request and agree to preserve the physical book in good condition and return it on or before the due date.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isAvailable || (activeTab === "existing" && memberActiveLoans.length >= 3)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 ${
                    !isAvailable || (activeTab === "existing" && memberActiveLoans.length >= 3)
                      ? "bg-slate-400 cursor-not-allowed dark:bg-slate-700"
                      : "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/25"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Confirm & Issue Book</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBorrowModal;
