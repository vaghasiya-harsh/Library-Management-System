
import { Link } from "react-router-dom";

const MemberTable = ({ members, onDelete }) => {
  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          No members found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Add your first member to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-237.5 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4">Member ID</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">Course</th>
              <th className="px-5 py-4">Joining Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-700">
                  {member.id}
                </td>

                <td className="px-5 py-4 font-semibold text-gray-900">
                  {member.name}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {member.email}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {member.phone}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {member.course}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                  {member.joiningDate}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/members/${member.id}/edit`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(member)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MemberTable;
