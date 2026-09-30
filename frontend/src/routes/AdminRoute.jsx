import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { ShieldAlert } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  const location = useLocation();

  // ============================================================
  // CHECKING AUTHENTICATION
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">

        <div className="text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

          </div>

          <p className="mt-4 text-sm font-medium text-slate-300">
            Checking admin access...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Please wait
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // NOT LOGGED IN
  // ============================================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  // ============================================================
  // CHECK ADMIN ROLE
  // ============================================================

  const isAdmin =
    user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">

        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 text-center shadow-2xl sm:p-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">

            <ShieldAlert
              size={28}
            />

          </div>

          <h1 className="mt-5 text-2xl font-bold text-white">
            Access Denied
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            You do not have administrator
            permissions to access this area.
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/dashboard";
            }}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Go to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // ADMIN AUTHORIZED
  // ============================================================

  return <Outlet />;
}

export default AdminRoute;