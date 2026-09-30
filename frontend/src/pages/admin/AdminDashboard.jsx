import { useEffect, useState } from "react";

import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Menu,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import api from "../../services/api";

function AdminDashboard() {
  const location = useLocation();

  const [analytics, setAnalytics] =
    useState(null);

  const [careers, setCareers] =
    useState([]);

  const [skills, setSkills] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [careersLoading, setCareersLoading] =
    useState(false);

  const [skillsLoading, setSkillsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  const loadDashboard = async ({
    refresh = false,
  } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // --------------------------------------------------------
      // ANALYTICS
      // --------------------------------------------------------

      const analyticsResponse =
        await api.get(
          "/admin/analytics"
        );

      const analyticsData =
        analyticsResponse.data?.analytics ||
        {};

      setAnalytics(
        analyticsData
      );

      // Show dashboard immediately
      setLoading(false);

      // --------------------------------------------------------
      // CAREERS + SKILLS
      // --------------------------------------------------------

      setCareersLoading(true);
      setSkillsLoading(true);

      const results =
        await Promise.allSettled([
          api.get("/careers"),
          api.get(
            "/admin/content/skills"
          ),
        ]);

      // --------------------------------------------------------
      // CAREERS
      // --------------------------------------------------------

      const careersResult =
        results[0];

      if (
        careersResult.status ===
        "fulfilled"
      ) {
        const responseData =
          careersResult.value.data;

        const careerList =
          responseData?.careers ||
          responseData?.data ||
          (Array.isArray(
            responseData
          )
            ? responseData
            : []);

        setCareers(
          Array.isArray(
            careerList
          )
            ? careerList
            : []
        );
      }

      setCareersLoading(false);

      // --------------------------------------------------------
      // SKILLS
      // --------------------------------------------------------

      const skillsResult =
        results[1];

      if (
        skillsResult.status ===
        "fulfilled"
      ) {
        const responseData =
          skillsResult.value.data;

        const skillList =
          responseData?.skills ||
          responseData?.data ||
          (Array.isArray(
            responseData
          )
            ? responseData
            : []);

        setSkills(
          Array.isArray(
            skillList
          )
            ? skillList
            : []
        );
      }

      setSkillsLoading(false);
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load admin dashboard."
      );

      setLoading(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setCareersLoading(false);
      setSkillsLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ============================================================
  // CLOSE MOBILE MENU WHEN ROUTE CHANGES
  // ============================================================

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ============================================================
  // DATA
  // ============================================================

  const users =
    analytics?.users || {};

  const assessments =
    analytics?.assessments || {};

  const feedback =
    analytics?.feedback || {};

  const learning =
    analytics?.learning || {};

  const totalStudents =
    Number(
      users.students
    ) || 0;

  const totalUsers =
    Number(
      users.total
    ) || 0;

  const totalCareers =
    careers.length;

  const totalSkills =
    skills.length;

  const completedAssessments =
    Number(
      assessments.completed
    ) || 0;

  const totalFeedback =
    Number(
      feedback.total
    ) || 0;

  const completedCourses =
    Number(
      learning.completedCourses
    ) || 0;

  const totalProgressRecords =
    Number(
      learning.totalProgressRecords
    ) || 0;

  // ============================================================
  // MODULES
  // ============================================================

  const modules = [
    "Authentication",
    "Career Recommendation",
    "Skill Gap Analysis",
    "Personalized Roadmap",
    "Course Recommendation",
    "Progress Tracking",
    "AI Career Assistant",
    "Behavioral Analysis",
  ];

  // ============================================================
  // NAVIGATION
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
  // QUICK ACTIONS
  // ============================================================

  const quickActions = [
    {
      title: "Manage Careers",
      description:
        "Add, edit and manage career profiles.",
      path: "/admin/careers",
      icon: BriefcaseBusiness,
    },
    {
      title: "Manage Skills",
      description:
        "Manage skills used by the career system.",
      path: "/admin/skills",
      icon: GraduationCap,
    },
    {
      title: "Manage Courses",
      description:
        "Create and manage learning courses.",
      path: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "View Users",
      description:
        "View registered student accounts.",
      path: "/admin/users",
      icon: Users,
    },
    {
      title: "View Feedback",
      description:
        "Review and respond to student feedback.",
      path: "/admin/feedback",
      icon: MessageSquare,
    },
    {
      title: "View Analytics",
      description:
        "Monitor system activity and statistics.",
      path: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  // ============================================================
  // INITIAL LOADING
  // ============================================================

  if (
    loading &&
    !analytics
  ) {
    return (
      <AdminLoading />
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (
    error &&
    !analytics
  ) {
    return (
      <div className="min-h-screen bg-[#020617] p-4 text-white sm:p-6 lg:p-8">

        <div className="mx-auto max-w-3xl">

          <AdminNavbar
            navigation={navigation}
            mobileMenuOpen={
              mobileMenuOpen
            }
            setMobileMenuOpen={
              setMobileMenuOpen
            }
          />

          <div className="mt-24 rounded-2xl border border-red-500/30 bg-[#0f172a] p-6 sm:p-8">

            <div className="flex flex-col gap-4 sm:flex-row">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                !
              </div>

              <div>

                <h1 className="text-2xl font-bold text-white">
                  Admin Dashboard
                </h1>

                <p className="mt-2 text-sm leading-6 text-red-300">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    loadDashboard()
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <RefreshCw
                    size={17}
                  />
                  Try Again
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020617] pb-10 text-white">

      {/* ========================================================
          RESPONSIVE TOP NAVBAR
      ======================================================== */}

      <AdminNavbar
        navigation={navigation}
        mobileMenuOpen={
          mobileMenuOpen
        }
        setMobileMenuOpen={
          setMobileMenuOpen
        }
      />

      {/* ========================================================
          PAGE CONTENT
      ======================================================== */}

      <main className="mx-auto w-full max-w-[1500px] px-3 pb-10 pt-24 sm:px-5 md:px-6 lg:px-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <section className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 shadow-xl shadow-black/10 sm:p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex min-w-0 items-start gap-3 sm:gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 sm:h-12 sm:w-12">
                <ShieldCheck
                  size={24}
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-semibold text-blue-400 sm:text-sm">
                  Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Admin Dashboard
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  Manage and monitor the
                  Intelligent Career Guidance
                  System.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                loadDashboard({
                  refresh: true,
                })
              }
              disabled={
                refreshing
              }
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >

              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

        </section>

        {/* ======================================================
            REFRESH ERROR
        ====================================================== */}

        {error &&
          analytics && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-red-300">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    loadDashboard({
                      refresh: true,
                    })
                  }
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  <RefreshCw
                    size={15}
                  />
                  Retry
                </button>

              </div>

            </div>
          )}

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Students"
            value={
              totalStudents
            }
            description="Registered students"
            icon={
              <Users
                size={21}
              />
            }
          />

          <StatCard
            title="Career Profiles"
            value={
              careersLoading
                ? "..."
                : totalCareers
            }
            description={
              careersLoading
                ? "Loading careers..."
                : "Available careers"
            }
            icon={
              <BriefcaseBusiness
                size={21}
              />
            }
          />

          <StatCard
            title="Skills"
            value={
              skillsLoading
                ? "..."
                : totalSkills
            }
            description={
              skillsLoading
                ? "Loading skills..."
                : "Career skills"
            }
            icon={
              <GraduationCap
                size={21}
              />
            }
          />

          <StatCard
            title="Assessments"
            value={
              completedAssessments
            }
            description="Completed assessments"
            icon={
              <BarChart3
                size={21}
              />
            }
          />

        </section>

        {/* ======================================================
            SYSTEM OVERVIEW + QUICK ACTIONS
        ====================================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-2">

          {/* SYSTEM OVERVIEW */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">

            <SectionHeader
              title="System Overview"
              description="Current platform modules"
            />

            <div className="mt-5 space-y-3">

              {modules.map(
                (module) => (
                  <div
                    key={module}
                    className="flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-3 sm:px-4"
                  >

                    <span className="min-w-0 truncate text-xs text-slate-200 sm:text-sm">
                      {module}
                    </span>

                    <span className="shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-semibold text-green-400 sm:px-3 sm:text-xs">
                      Active
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

          {/* QUICK ACTIONS */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">

            <SectionHeader
              title="Quick Actions"
              description="Manage important system resources"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              {quickActions.map(
                (action) => {
                  const Icon =
                    action.icon;

                  return (
                    <Link
                      key={
                        action.title
                      }
                      to={
                        action.path
                      }
                      className="group rounded-xl border border-slate-800 bg-slate-900 p-4 transition duration-200 hover:border-blue-500/40 hover:bg-slate-800"
                    >

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon
                          size={19}
                        />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-white sm:text-base">
                        {
                          action.title
                        }
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {
                          action.description
                        }
                      </p>

                    </Link>
                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* ======================================================
            SYSTEM SUMMARY
        ====================================================== */}

        <section className="mt-5 rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">

          <SectionHeader
            title="System Summary"
            description="Current platform activity"
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <SummaryCard
              label="Users"
              value={
                totalUsers
              }
              valueClass="text-white"
            />

            <SummaryCard
              label="Assessments"
              value={
                completedAssessments
              }
              valueClass="text-green-400"
            />

            <SummaryCard
              label="Feedback"
              value={
                totalFeedback
              }
              valueClass="text-yellow-400"
            />

            <SummaryCard
              label="Progress Records"
              value={
                totalProgressRecords
              }
              valueClass="text-purple-400"
            />

          </div>

        </section>

        {/* ======================================================
            RESOURCE SUMMARY
        ====================================================== */}

        <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {/* CAREERS */}

          <ResourceCard
            title="Career Profiles"
            description="Available career paths"
            value={
              careersLoading
                ? "..."
                : totalCareers
            }
            valueDescription={
              careersLoading
                ? "Loading career profiles..."
                : "Career profiles available"
            }
            icon={
              <BriefcaseBusiness
                size={21}
              />
            }
            iconClass="bg-blue-500/10 text-blue-400"
            link="/admin/careers"
            linkText="Manage Careers"
          />

          {/* SKILLS */}

          <ResourceCard
            title="Skills"
            description="Skills used by careers"
            value={
              skillsLoading
                ? "..."
                : totalSkills
            }
            valueDescription={
              skillsLoading
                ? "Loading skills..."
                : "Skills available"
            }
            icon={
              <GraduationCap
                size={21}
              />
            }
            iconClass="bg-purple-500/10 text-purple-400"
            link="/admin/skills"
            linkText="Manage Skills"
          />

          {/* LEARNING */}

          <ResourceCard
            title="Learning"
            description="Student course activity"
            value={
              completedCourses
            }
            valueDescription="Completed course records"
            icon={
              <BookOpen
                size={21}
              />
            }
            iconClass="bg-green-500/10 text-green-400"
            link="/admin/courses"
            linkText="Manage Courses"
          />

        </section>

        {/* ======================================================
            TECHNOLOGY STACK
        ====================================================== */}

        <section className="mt-5 rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">

          <SectionHeader
            title="Technology Stack"
            description="Technologies powering the career guidance platform"
          />

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "React",
              "Vite",
              "Tailwind CSS",
              "Node.js",
              "Express.js",
              "MongoDB",
              "JWT",
              "Gemini AI",
              "KNN Machine Learning",
              "Behavioral Analysis",
            ].map(
              (technology) => (
                <span
                  key={
                    technology
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 sm:px-4 sm:text-sm"
                >
                  {technology}
                </span>
              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

// ============================================================
// ADMIN NAVBAR
// ============================================================

function AdminNavbar({
  navigation,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const location =
    useLocation();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] border-b border-slate-800 bg-[#0b1220]/95 shadow-xl shadow-black/20 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] w-full max-w-[1500px] items-center px-3 sm:px-5 md:px-6 lg:px-8">

          {/* LOGO */}

          <Link
            to="/admin"
            className="flex min-w-0 items-center gap-2.5"
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

          {/* DESKTOP NAVIGATION */}

          <nav className="ml-6 hidden flex-1 items-center gap-1 lg:flex">

            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const isActive =
                  location.pathname ===
                  item.path;

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
                      items-center
                      gap-2
                      rounded-lg
                      px-3
                      py-2.5
                      text-xs
                      font-semibold
                      transition
                      xl:px-3.5
                      xl:text-sm
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >

                    <Icon
                      size={16}
                    />

                    <span>
                      {
                        item.label
                      }
                    </span>

                  </Link>
                );
              }
            )}

          </nav>

          {/* TABLET NAVIGATION */}

          <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex lg:hidden">

            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const isActive =
                  location.pathname ===
                  item.path;

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
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
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

          {/* ADMIN BADGE */}

          <div className="ml-auto hidden items-center gap-2 md:flex">

            <div className="hidden h-9 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 lg:flex">

              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
                <ShieldCheck
                  size={14}
                />
              </div>

              <span className="text-xs font-semibold text-slate-300">
                Admin
              </span>

            </div>

          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (value) =>
                  !value
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white md:hidden"
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

        {/* MOBILE MENU */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-[#0b1220] px-3 pb-4 pt-3 md:hidden">

            <div className="space-y-1">

              {navigation.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const isActive =
                    location.pathname ===
                    item.path;

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
                        transition
                        ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >

                      <Icon
                        size={18}
                      />

                      <span>
                        {
                          item.label
                        }
                      </span>

                    </Link>
                  );
                }
              )}

            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <ShieldCheck
                  size={17}
                />
              </div>

              <div>

                <p className="text-xs font-semibold text-white">
                  Administrator
                </p>

                <p className="text-[10px] text-slate-500">
                  Admin Panel
                </p>

              </div>

            </div>

          </div>
        )}

      </header>
    </>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 transition hover:border-slate-700 sm:p-5">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-xs text-slate-400 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 truncate text-[11px] text-slate-500 sm:text-xs">
            {description}
          </p>

        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 sm:h-11 sm:w-11">
          {icon}
        </div>

      </div>

    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  title,
  description,
}) {
  return (
    <div>

      <h2 className="text-lg font-semibold text-white sm:text-xl">
        {title}
      </h2>

      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
        {description}
      </p>

    </div>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  label,
  value,
  valueClass,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">

      <p className="text-[10px] uppercase tracking-wide text-slate-500 sm:text-xs">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold sm:text-3xl ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}

// ============================================================
// RESOURCE CARD
// ============================================================

function ResourceCard({
  title,
  description,
  value,
  valueDescription,
  icon,
  iconClass,
  link,
  linkText,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <h2 className="font-semibold text-white">
            {title}
          </h2>

          <p className="truncate text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <p className="mt-6 text-3xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
        {valueDescription}
      </p>

      <Link
        to={link}
        className="mt-5 inline-flex text-sm font-semibold text-blue-400 transition hover:text-blue-300"
      >
        {linkText}
      </Link>

    </div>
  );
}

// ============================================================
// ADMIN LOADING
// ============================================================

function AdminLoading() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020617] text-white">

      {/* TOP NAVBAR SKELETON */}

      <div className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-slate-800 bg-[#0b1220]">

        <div className="mx-auto flex h-full max-w-[1500px] items-center gap-3 px-3 sm:px-5 md:px-6 lg:px-8">

          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-800" />

          <div className="hidden space-y-2 sm:block">

            <div className="h-3 w-28 animate-pulse rounded bg-slate-800" />

            <div className="h-2 w-24 animate-pulse rounded bg-slate-800" />

          </div>

          <div className="ml-8 hidden gap-2 lg:flex">

            {[1, 2, 3, 4, 5, 6, 7].map(
              (item) => (
                <div
                  key={item}
                  className="h-9 w-20 animate-pulse rounded-lg bg-slate-800"
                />
              )
            )}

          </div>

          <div className="ml-auto h-10 w-10 animate-pulse rounded-lg bg-slate-800 md:hidden" />

        </div>

      </div>

      {/* CONTENT */}

      <div className="mx-auto max-w-[1500px] px-3 pb-10 pt-24 sm:px-5 md:px-6 lg:px-8">

        {/* HEADER */}

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">

          <div className="flex items-center gap-4">

            <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-800" />

            <div className="space-y-3">

              <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />

              <div className="h-7 w-48 animate-pulse rounded bg-slate-800" />

              <div className="h-3 w-72 max-w-[60vw] animate-pulse rounded bg-slate-800" />

            </div>

          </div>

        </div>

        {/* STAT SKELETON */}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            1,
            2,
            3,
            4,
          ].map(
            (item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5"
              >

                <div className="flex justify-between">

                  <div className="space-y-3">

                    <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />

                    <div className="h-9 w-14 animate-pulse rounded bg-slate-800" />

                    <div className="h-3 w-28 animate-pulse rounded bg-slate-800" />

                  </div>

                  <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800" />

                </div>

              </div>
            )
          )}

        </div>

        {/* PANELS */}

        <div className="mt-5 grid gap-5 lg:grid-cols-2">

          <div className="h-[420px] animate-pulse rounded-2xl bg-[#0f172a]" />

          <div className="h-[420px] animate-pulse rounded-2xl bg-[#0f172a]" />

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;