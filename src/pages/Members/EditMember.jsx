
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { LibraryContext } from "../../context/LibraryContext";
import MemberForm from "../../components/members/MemberForm";

const EditMember = () => {
  const { id } = useParams();
  const { members, updateMember } = useContext(LibraryContext);
  const navigate = useNavigate();

  const member = members.find((item) => item.id === id);

  if (!member) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          Member not found
        </h1>

        <Link
          to="/members"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to Members
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
          Edit Member
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update member details for {member.id}.
        </p>
      </div>

      <MemberForm
        initialValues={initialValues}
        onSubmit={handleUpdateMember}
        submitLabel="Save Changes"
      />
    </div>
  );
}

export default EditMember;
