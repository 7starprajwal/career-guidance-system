import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const openSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const closeSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#020617] text-white">

      {/* ================================
          MOBILE / TABLET HEADER
      ================================= */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          flex
          h-16
          items-center
          justify-between
          border-b
          border-slate-800
          bg-[#0f172a]
          px-4
          lg:hidden
        "
      >
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-white sm:text-lg">
            Career Guidance
          </h1>

          <p className="hidden text-xs text-slate-400 sm:block">
            Intelligent Career System
          </p>
        </div>

        <button
          type="button"
          onClick={
            mobileSidebarOpen
              ? closeSidebar
              : openSidebar
          }
          aria-label={
            mobileSidebarOpen
              ? "Close menu"
              : "Open menu"
          }
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-slate-700
            bg-slate-900
            text-white
            transition
            hover:bg-slate-800
          "
        >
          {mobileSidebarOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </header>

      {/* ================================
          SIDEBAR
      ================================= */}

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={closeSidebar}
      />

      {/* ================================
          MOBILE OVERLAY
      ================================= */}

      {mobileSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            lg:hidden
          "
        />
      )}

      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main
        className="
          min-h-screen
          w-full
          lg:ml-[240px]
          lg:w-[calc(100%-240px)]
        "
      >
        <div
          className="
            min-h-screen
            w-full
            px-4
            pb-8
            pt-20
            sm:px-6
            lg:px-8
            lg:pt-6
          "
        >
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default DashboardLayout;