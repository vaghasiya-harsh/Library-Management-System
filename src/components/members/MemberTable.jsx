import { Link } from "react-router-dom";
import { Edit3, Trash2, Eye, Users, Mail, Phone } from "lucide-react";

const MemberTable = ({ members, onDelete }) => {
  if (members.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
          <Users className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
          No members registered yet
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Enroll your first student or borrower to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200/90 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Contact Details</th>
              <th className="px-6 py-4">Course / Department</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {members.map((member) => {
              const isActive = member.status === "Active";

              return (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  {/* Name + Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-2xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <Link
                          to={`/members/${member.id}`}
                          className="font-bold text-slate-900 transition hover:text-indigo-600 dark:text-white dark:hover:text-cyan-400 line-clamp-1"
                        >
                          {member.name}
                        </Link>
                        <p className="text-[11px] text-slate-400">Borrower Account</p>
                      </div>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {member.id}
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-1.5 truncate max-w-xs">
                        <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{member.email}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{member.phone}</span>
                      </p>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-6 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs dark:bg-slate-800">
                      {member.course}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {member.joiningDate}
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                      {member.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/members/${member.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                        title="View member profile & history"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <Link
                        to={`/members/${member.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                        title="Edit member"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(member)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 active:scale-90 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                        title="Delete member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTable;
