import React from "react";
const Dashboard = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome to Library Management System
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Books</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">100</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Members</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Issued Books</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Available Books</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">100</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
