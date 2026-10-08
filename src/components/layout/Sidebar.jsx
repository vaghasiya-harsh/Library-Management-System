import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white">

      <div className="border-b border-gray-800 px-6 py-6">
        <h2 className="text-2xl font-bold">Library</h2>

        <p className="mt-1 text-xs text-gray-400">Management System</p>
      </div>

      <nav className="px-4 py-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `mb-2 flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            `mb-2 flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Books
        </NavLink>

        <NavLink
          to="/members"
          className={({ isActive }) =>
            `mb-2 flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Members
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `mb-2 flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Transactions
        </NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;
