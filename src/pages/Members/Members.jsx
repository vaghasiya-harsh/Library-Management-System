import { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, Plus, Search } from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import MemberTable from "../../components/members/MemberTable";
import Modal from "../../components/common/Modal";

const Members = () => {
  const { members, deleteMember } = useContext(LibraryContext);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    confirmText: "OK",
    onConfirm: null,
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      const matchSearch =
        !q ||
        [m.name, m.email, m.phone, m.course, m.id].some((val) =>
          String(val || "").toLowerCase().includes(q)
        );
      const matchStatus =
        statusFilter === "All" || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [members, search, statusFilter]);

  const activeCount = members.filter((m) => m.status === "Active").length;
  const inactiveCount = members.filter((m) => m.status === "Inactive").length;

  const handleDeleteMember = (member) => {
    setModal({
      isOpen: true,
      title: "Remove Member",
      message: `Are you sure you want to remove "${member.name}"? All associated member profile records will be archived.`,
      type: "warning",
      showCancel: true,
      confirmText: "Delete Member",
      onConfirm: () => {
        const result = deleteMember(member.id);
        if (!result.success) {
          setModal({
            isOpen: true,
            title: "Delete Failed",
            message: result.message,
            type: "error",
            showCancel: false,
            confirmText: "OK",
            onConfirm: closeModal,
          });
          return;
        }

        setModal({
          isOpen: true,
          title: "Member Removed",
          message: `"${member.name}" has been deleted from the directory.`,
          type: "success",
          showCancel: false,
          confirmText: "OK",
          onConfirm: closeModal,
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
            <Users className="h-3.5 w-3.5" />
            Borrower Directory
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Library Members
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage registered students, faculty, and circulation permissions
          </p>
        </div>

        <Link
          to="/members/add"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Member</span>
        </Link>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="interactive-card card-sheen rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Registered</span>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white font-display">{members.length}</p>
        </div>
        <div className="interactive-card card-sheen rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Active Borrowers</span>
          <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">{activeCount}</p>
        </div>
        <div className="interactive-card card-sheen rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Inactive / On Hold</span>
          <p className="mt-2 text-3xl font-black text-slate-500 dark:text-slate-400 font-display">{inactiveCount}</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member by name, email, phone, ID..."
            className="w-full rounded-xl border border-slate-300/80 bg-slate-50/80 py-2 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Status:</span>
          {["All", "Active", "Inactive"].map((st) => (
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

      {/* Members Table */}
      <MemberTable
        members={filteredMembers}
        onDelete={handleDeleteMember}
      />

      {/* Action Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
        confirmText={modal.confirmText}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default Members;
