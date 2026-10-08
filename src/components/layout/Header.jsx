import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">

      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Library Management System
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          A
        </div>

        <div>
          <p className="text-sm font-medium text-gray-800">Admin</p>

          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      </div>
    </header>
  );
};
export default Header;
