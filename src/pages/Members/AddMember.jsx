import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { LibraryContext } from "../../context/LibraryContext";
import MemberForm from "../../components/members/MemberForm";

const AddMember = () => {
  const { addMember } = useContext(LibraryContext);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    course: "",
    joiningDate: new Date().toISOString().slice(0, 10),
    status: "Active",
  };

  const handleAddMember = (memberDetails) => {
    const result = addMember(memberDetails);
    if (!result.success) {
      window.alert(result.message);
      return;
    }
    navigate("/members");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/members"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Members</span>
        </Link>
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
          <UserPlus className="h-3.5 w-3.5" />
          Member Enrollment
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Register New Member
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create an active borrower account for students, faculty, or library guests
        </p>
      </div>

      <MemberForm
        initialValues={initialValues}
        onSubmit={handleAddMember}
        submitLabel="Register Member"
      />
    </div>
  );
};

export default AddMember;
