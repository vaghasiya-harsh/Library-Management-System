import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Books from "./pages/Books/Books";
import BookDetails from "./pages/Books/BookDetails";
import AddBook from "./pages/Books/AddBook";
import EditBook from "./pages/Books/EditBook";
import Members from "./pages/Members/Members";
import MemberDetails from "./pages/Members/MemberDetails";
import Transactions from "./pages/Transactions/Transactions";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/books" element={<Books />} />
        <Route path="/books/add" element={<AddBook />} />
        <Route path="/books/:id/edit" element={<EditBook />} />
        <Route path="/books/:id" element={<BookDetails />} />

        <Route path="/members" element={<Members />} />
        <Route path="/members/:id" element={<MemberDetails />} />

        <Route path="/transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}

export default App;