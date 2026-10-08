import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Books from "./pages/Books/Books";
import BookDetails from "./pages/Books/BookDetails";
import Members from "./pages/Members/Members";
import MemberDetails from "./pages/Members/MemberDetails";
import Transactions from "./pages/Transactions/Transactions";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/books" element={<Books />} />

      <Route path="/books/:id" element={<BookDetails />} />

      <Route path="/members" element={<Members />} />

      <Route path="/members/:id" element={<MemberDetails />} />

      <Route path="/transactions" element={<Transactions />} />

    </Routes>
  );
}

export default App;