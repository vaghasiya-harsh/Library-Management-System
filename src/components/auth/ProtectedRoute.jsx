import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ allowedRoles = ["Admin"] }) {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Role-based authorization gate
  if (allowedRoles && (!currentUser || !allowedRoles.includes(currentUser.role))) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          attemptedPath: location.pathname,
          currentRole: currentUser?.role || "Reader",
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
