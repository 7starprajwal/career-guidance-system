import { useEffect, useState } from "react";

import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Menu,
  MessageSquare,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";

function AdminLayout() {
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // ============================================================
  // ADMIN NAVIGATION
  // ============================================================

  const navigation = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: BarChart3,
    },

    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },

    {
      label: "Careers",
      path: "/admin/careers",
      icon: BriefcaseBusiness,
    },

    {
      label: "Skills",
      path: "/admin/skills",
      icon: GraduationCap,
    },

    {
      label: "Courses",
      path: "/admin/courses",
      icon: BookOpen,
    },

    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },

    {
      label: "Feedback",
      path: "/admin/feedback",
      icon: MessageSquare,
    },
  ];

  // ============================================================
  // CLOSE MOBILE MENU WHEN PAGE CHANGES
  // ============================================================

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ============================================================
  // CHECK ACTIVE ROUTE
  // ============================================================

  const isActiveRoute = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname === path;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#020617] text-white">

      {/* ======================================================
          ADMIN TOP NAVBAR
      ====================================================== */}

      <header className="fixed left-0 right-0 top-0 z-[100] border-b border-slate-800 bg-[#0b1220]/95 shadow-xl shadow-black/20 backdrop-blur-xl">

        {/* ====================================================
            NAVBAR MAIN ROW
        ==================================================== */}

        <div className="mx-auto flex h-[68px] w-full max-w-[1600px] items-center px-3 sm:px-5 md:px-6 lg:px-8">

          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            to="/admin"
            className="flex min-w-0 shrink-0 items-center gap-2.5"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck
                size={21}
              />
            </div>

            <div className="hidden min-w-0 sm:block">

              <p className="truncate text-sm font-bold text-white">
                Career Guidance
              </p>

              <p className="truncate text-[10px] text-slate-500">
                Administration Panel
              </p>

            </div>

          </Link>

          {/* ==================================================
              LAPTOP NAVIGATION
          ================================================== */}

          <nav className="ml-5 hidden min-w-0 flex-1 items-center gap-1 lg:flex xl:ml-8">

            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  isActiveRoute(
                    item.path
                  );

                return (
                  <Link
                    key={
                      item.path
                    }
                    to={
                      item.path
                    }
                    className={`
                      flex
                      min-h-[40px]
                      items-center
                      gap-2
                      rounded-lg
                      px-2.5
                      py-2
                      text-xs
                      font-semibold
                      transition-all
                      duration-200
                      xl:px-3
                      xl:text-sm

                      ${
                        active
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >

                    <Icon
                      size={16}
                      className="shrink-0"
                    />

                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>

                  </Link>
                );
              }
            )}

          </nav>

          {/* ==================================================
              TABLET NAVIGATION
          ================================================== */}

          <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex lg:hidden">

            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  isActiveRoute(
                    item.path
                  );

                return (
                  <Link
                    key={
                      item.path
                    }
                    to={
                      item.path
                    }
                    title={
                      item.label
                    }
                    aria-label={
                      item.label
                    }
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      duration-200

                      ${
                        active
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >

                    <Icon
                      size={18}
                    />

                  </Link>
                );
              }
            )}

          </nav>

          {/* ==================================================
              ADMIN BADGE
          ================================================== */}

          <div className="ml-auto hidden shrink-0 items-center md:flex">

            <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3">

              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">

                <ShieldCheck
                  size={14}
                />

              </div>

              <span className="hidden text-xs font-semibold text-slate-300 lg:block">
                Admin
              </span>

            </div>

          </div>

          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (previous) =>
                  !previous
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close admin navigation"
                : "Open admin navigation"
            }
            aria-expanded={
              mobileMenuOpen
            }
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white md:hidden"
          >

            {mobileMenuOpen ? (
              <X
                size={21}
              />
            ) : (
              <Menu
                size={21}
              />
            )}

          </button>

        </div>

        {/* ====================================================
            MOBILE NAVIGATION
        ==================================================== */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-[#0b1220] px-3 pb-4 pt-3 md:hidden">

            <nav className="space-y-1">

              {navigation.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    isActiveRoute(
                      item.path
                    );

                  return (
                    <Link
                      key={
                        item.path
                      }
                      to={
                        item.path
                      }
                      className={`
                        flex
                        min-h-[46px]
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        text-sm
                        font-semibold
                        transition-all
                        duration-200

                        ${
                          active
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >

                      <Icon
                        size={18}
                        className="shrink-0"
                      />

                      <span>
                        {item.label}
                      </span>

                    </Link>
                  );
                }
              )}

            </nav>

            {/* MOBILE ADMIN INFO */}

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">

                <ShieldCheck
                  size={17}
                />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-semibold text-white">
                  Administrator
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Admin Control Panel
                </p>

              </div>

            </div>

          </div>
        )}

      </header>

      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}

      <main className="min-h-screen w-full pt-[68px]">

        <div className="w-full px-3 pb-8 pt-4 sm:px-5 sm:pt-5 md:px-6 lg:px-8">

          <Outlet />

        </div>

      </main>

    </div>
  );
}

export default AdminLayout;