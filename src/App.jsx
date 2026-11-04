import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Books from "./pages/Books/Books";
import BookDetails from "./pages/Books/BookDetails";
import AddBook from "./pages/Books/AddBook";
import EditBook from "./pages/Books/EditBook";
import Members from "./pages/Members/Members";
import MemberDetails from "./pages/Members/MemberDetails";
import Transactions from "./pages/Transactions/Transactions";
import AddMember from "./pages/Members/AddMember";
import EditMember from "./pages/Members/EditMember";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* New Visitor Auth Gate: Directs to login/signup unless authenticated */}
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/books/:id"
        element={isAuthenticated ? <BookDetails /> : <Navigate to="/login" replace />}
      />

      {/* Authentication Gateway with Log In & Sign Up */}
      <Route path="/login" element={<Login />} />

      {/* Management Console (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/:id/edit" element={<EditBook />} />

          <Route path="/members" element={<Members />} />
          <Route path="/members/add" element={<AddMember />} />
          <Route path="/members/:id/edit" element={<EditMember />} />
          <Route path="/members/:id" element={<MemberDetails />} />

          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
