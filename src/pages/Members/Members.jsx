
import { useContext } from "react";
import { Link } from "react-router-dom";

import { LibraryContext } from "../../context/LibraryContext";
import MemberTable from "../../components/members/MemberTable";

const Members = () => {
  const { members, deleteMember } = useContext(LibraryContext);

  const handleDeleteMember = (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${member.name}"?`
    );

    if (!confirmed) return;

    const result = deleteMember(member.id);

    if (!result.success) {
      window.alert(result.message);
      return;
    }

    window.alert("Member deleted successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Members
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all registered library members.
          </p>
        </div>

        <Link
          to="/members/add"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Member
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Total Members
        </p>

        <p className="mt-2 text-3xl font-bold text-gray-900">
          {members.length}
        </p>
      </div>

      <MemberTable
        members={members}
        onDelete={handleDeleteMember}
      />
    </div>
  );
}

export default Members;
