
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="space-y-6">
      <div>
        <Link
          to="/members"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Members
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Add Member
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Register a new library member.
        </p>
      </div>

      <MemberForm
        initialValues={initialValues}
        onSubmit={handleAddMember}
        submitLabel="Add Member"
      />
    </div>
  );
}

export default AddMember;
