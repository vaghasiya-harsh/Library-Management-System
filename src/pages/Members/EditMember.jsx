import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit3, AlertTriangle } from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import MemberForm from "../../components/members/MemberForm";

const EditMember = () => {
  const { id } = useParams();
  const { members, updateMember } = useContext(LibraryContext);
  const navigate = useNavigate();

  const member = members.find((item) => item.id === id);

  if (!member) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Member Not Found
        </h1>
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

  const initialValues = {
    name: member.name ?? "",
    email: member.email ?? "",
    phone: member.phone ?? "",
    course: member.course ?? "",
    joiningDate: member.joiningDate ?? "",
    status: member.status ?? "Active",
  };

  const handleUpdateMember = (updatedDetails) => {
    const result = updateMember(id, updatedDetails);
    if (!result.success) {
      window.alert(result.message);
      return;
    }
    navigate(`/members/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/members/${id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Member Profile</span>
        </Link>
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
          <Edit3 className="h-3.5 w-3.5" />
          Profile Editor
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Edit Member: {member.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update contact details and account status for <span className="font-mono">{member.id}</span>
        </p>
      </div>

      <MemberForm
        initialValues={initialValues}
        onSubmit={handleUpdateMember}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditMember;
