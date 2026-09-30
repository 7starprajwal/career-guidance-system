import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  const location = useLocation();

  // ============================================================
  // CHECKING SESSION
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-sm text-slate-400">
            Checking your session...
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // NOT AUTHENTICATED
  // ============================================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ============================================================
  // AUTHENTICATED
  // ============================================================

  return <Outlet />;
}

export default ProtectedRoute;