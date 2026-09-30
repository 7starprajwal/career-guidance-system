import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  BarChart3,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  Star,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

// ============================================================
// ANALYTICS PAGE
// ============================================================

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD ANALYTICS
  // ==========================================================

  const loadAnalytics = async (showInitialLoader = false) => {
    try {
      if (showInitialLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await api.get("/admin/analytics");

      console.log("Admin analytics response:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load analytics."
        );
      }

      setData(response.data);
    } catch (err) {
      console.error("Admin analytics error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load admin analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadAnalytics(true);
  }, []);

  // ==========================================================
  // NORMALIZED DATA
  // ==========================================================

  const analytics = data?.analytics || {};

  const users = analytics.users || {};
  const assessments = analytics.assessments || {};
  const feedback = analytics.feedback || {};
  const learning = analytics.learning || {};

  const registrations = Array.isArray(
    analytics.registrations
  )
    ? analytics.registrations
    : [];

  const feedbackCategories = Array.isArray(
    feedback.byCategory
  )
    ? feedback.byCategory
    : [];

  // ==========================================================
  // BASIC VALUES
  // ==========================================================

  const totalUsers = Number(users.total) || 0;
  const totalStudents = Number(users.students) || 0;
  const totalAdmins = Number(users.admins) || 0;

  const completedAssessments =
    Number(assessments.completed) || 0;

  const totalFeedback = Number(feedback.total) || 0;

  const averageRating =
    Number(feedback.averageRating) || 0;

  const totalProgressRecords =
    Number(learning.totalProgressRecords) || 0;

  const completedCourses =
    Number(learning.completedCourses) || 0;

  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const studentPercentage =
    totalUsers > 0
      ? Math.min(
          100,
          Math.round(
            (totalStudents / totalUsers) * 100
          )
        )
      : 0;

  const adminPercentage =
    totalUsers > 0
      ? Math.min(
          100,
          Math.round(
            (totalAdmins / totalUsers) * 100
          )
        )
      : 0;

  const assessmentCompletionRate =
    totalStudents > 0
      ? Math.min(
          100,
          Math.round(
            (completedAssessments / totalStudents) * 100
          )
        )
      : 0;

  const ratingPercentage = Math.min(
    100,
    Math.max(0, averageRating * 20)
  );

  // ==========================================================
  // REGISTRATION DATA
  // ==========================================================

  const registrationData = useMemo(() => {
    return registrations.map((item) => {
      const year = Number(item?._id?.year);
      const month = Number(item?._id?.month);
      const count = Number(item?.count) || 0;

      let label = "Unknown";

      if (year && month) {
        const date = new Date(year, month - 1, 1);

        label = date.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        });
      }

      return {
        label,
        count,
      };
    });
  }, [registrations]);

  const maxRegistration = Math.max(
    ...registrationData.map((item) => item.count),
    1
  );

  const registrationTotal = registrationData.reduce(
    (total, item) => total + item.count,
    0
  );

  // ==========================================================
  // FEEDBACK CATEGORY DATA
  // ==========================================================

  const categoryData = useMemo(() => {
    return feedbackCategories.map((item) => ({
      label: item?._id || "Unknown",
      count: Number(item?.count) || 0,
    }));
  }, [feedbackCategories]);

  const maxCategory = Math.max(
    ...categoryData.map((item) => item.count),
    1
  );

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] px-3 py-4 text-white sm:px-5 sm:py-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="rounded-2xl border border-red-500/20 bg-[#0f172a] p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <AlertCircle size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-red-400">
                  Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  Analytics
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  We could not load the latest analytics
                  information.
                </p>

                <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                  <p className="break-words text-sm leading-6 text-red-300">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => loadAnalytics(true)}
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <RefreshCw size={17} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // SUMMARY CARDS
  // ==========================================================

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "All registered accounts",
      icon: Users,
      iconClass: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Students",
      value: totalStudents,
      description: "Student accounts",
      icon: Activity,
      iconClass: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Assessments",
      value: completedAssessments,
      description: "Completed assessments",
      icon: CheckCircle2,
      iconClass: "bg-green-500/10 text-green-400",
    },
    {
      title: "Completed Courses",
      value: completedCourses,
      description: "Completed learning records",
      icon: BookOpen,
      iconClass: "bg-purple-500/10 text-purple-400",
    },
  ];

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#020617] px-3 py-4 pb-10 text-white sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px]">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/10 sm:h-12 sm:w-12">
                <BarChart3 size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-400 sm:text-sm">
                  Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Analytics Dashboard
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Monitor users, assessments, feedback and
                  learning activity across the Career Guidance
                  System.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadAnalytics(false)}
              disabled={refreshing}
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 transition hover:border-slate-700 hover:bg-[#111a2e] sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 sm:text-sm">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${stat.iconClass}`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================================================
            USER + ASSESSMENT
        ================================================== */}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* USER DISTRIBUTION */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">
            <SectionHeader
              icon={<Users size={20} />}
              iconClass="bg-blue-500/10 text-blue-400"
              title="User Distribution"
              description="Registered account types"
            />

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <DonutChart
                studentPercentage={studentPercentage}
                adminPercentage={adminPercentage}
                totalUsers={totalUsers}
              />

              <div className="w-full min-w-0 space-y-5">
                <DistributionRow
                  label="Students"
                  value={totalStudents}
                  percentage={studentPercentage}
                  barClass="bg-cyan-500"
                  textClass="text-cyan-400"
                />

                <DistributionRow
                  label="Administrators"
                  value={totalAdmins}
                  percentage={adminPercentage}
                  barClass="bg-purple-500"
                  textClass="text-purple-400"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MiniStat
                label="Total Users"
                value={totalUsers}
              />

              <MiniStat
                label="Administrators"
                value={totalAdmins}
                valueClass="text-purple-400"
              />
            </div>
          </div>

          {/* ASSESSMENT */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">
            <SectionHeader
              icon={<CheckCircle2 size={20} />}
              iconClass="bg-green-500/10 text-green-400"
              title="Assessment Activity"
              description="Behavioral assessment completion"
            />

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  Completion Rate
                </p>

                <p className="mt-1 text-3xl font-bold text-green-400 sm:text-4xl">
                  {assessmentCompletionRate}%
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-8 border-green-500/10 bg-green-500/5 sm:h-20 sm:w-20">
                <CheckCircle2
                  size={27}
                  className="text-green-400 sm:h-8 sm:w-8"
                />
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-700"
                style={{
                  width: `${assessmentCompletionRate}%`,
                }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat
                label="Completed"
                value={completedAssessments}
                valueClass="text-green-400"
              />

              <MiniStat
                label="Students"
                value={totalStudents}
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            FEEDBACK + LEARNING
        ================================================== */}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* FEEDBACK */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">
            <SectionHeader
              icon={<Star size={20} />}
              iconClass="bg-yellow-500/10 text-yellow-400"
              title="Feedback Overview"
              description="Student feedback statistics"
            />

            <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <MiniStat
                label="Total Feedback"
                value={totalFeedback}
              />

              <MiniStat
                label="Average Rating"
                value={averageRating.toFixed(2)}
                valueClass="text-yellow-400"
                suffix="/ 5"
              />
            </div>

            <div className="mt-4 rounded-xl bg-slate-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-400">
                  Rating level
                </span>

                <span className="flex items-center gap-1.5 text-sm font-semibold text-yellow-400">
                  <Star
                    size={15}
                    className="fill-yellow-400"
                  />

                  {averageRating.toFixed(2)}
                </span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                  style={{
                    width: `${ratingPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* LEARNING */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">
            <SectionHeader
              icon={<BookOpen size={20} />}
              iconClass="bg-purple-500/10 text-purple-400"
              title="Learning Activity"
              description="Student course progress"
            />

            <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <MiniStat
                label="Progress Records"
                value={totalProgressRecords}
              />

              <MiniStat
                label="Completed Courses"
                value={completedCourses}
                valueClass="text-green-400"
              />
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-500/10 bg-green-500/5 p-4">
              <TrendingUp
                size={19}
                className="mt-0.5 shrink-0 text-green-400"
              />

              <p className="text-sm leading-6 text-green-300">
                Learning progress is being tracked across
                student accounts.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            REGISTRATION ACTIVITY
        ================================================== */}

        <div className="mt-4 rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">
          <SectionHeader
            icon={<TrendingUp size={20} />}
            iconClass="bg-blue-500/10 text-blue-400"
            title="Registration Activity"
            description="User registrations grouped by month"
          />

          {registrationData.length === 0 ? (
            <EmptyChart
              message="No registration data available."
            />
          ) : (
            <div className="mt-6 overflow-x-auto pb-2">
              <div
                className="flex min-w-[520px] items-end gap-3 px-1 sm:gap-5"
                style={{
                  minHeight: "240px",
                }}
              >
                {registrationData.map(
                  (item, index) => {
                    const height = Math.max(
                      16,
                      Math.round(
                        (item.count / maxRegistration) *
                          180
                      )
                    );

                    return (
                      <div
                        key={`${item.label}-${index}`}
                        className="flex min-w-[55px] flex-1 flex-col items-center"
                      >
                        <span className="mb-2 text-xs font-semibold text-slate-300">
                          {item.count}
                        </span>

                        <div
                          className="w-full max-w-[48px] rounded-t-xl bg-blue-500 transition-all duration-500 hover:bg-blue-400"
                          style={{
                            height: `${height}px`,
                          }}
                          title={`${item.label}: ${item.count}`}
                        />

                        <p className="mt-3 whitespace-nowrap text-[10px] text-slate-500 sm:text-[11px]">
                          {item.label}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-900 p-4">
            <Users
              size={17}
              className="shrink-0 text-blue-400"
            />

            <span className="text-sm text-slate-400">
              Registration records
            </span>

            <span className="ml-auto font-bold text-white">
              {registrationTotal}
            </span>
          </div>
        </div>

        {/* ==================================================
            FEEDBACK CATEGORIES
        ================================================== */}

        <div className="mt-4 rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">
          <SectionHeader
            icon={<MessageSquare size={20} />}
            iconClass="bg-yellow-500/10 text-yellow-400"
            title="Feedback Categories"
            description="Feedback submissions grouped by category"
          />

          {categoryData.length === 0 ? (
            <EmptyChart
              message="No feedback category data available."
            />
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categoryData.map((item, index) => {
                const percentage = Math.round(
                  (item.count / maxCategory) * 100
                );

                return (
                  <div
                    key={`${item.label}-${index}`}
                    className="min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-medium capitalize text-slate-300">
                        {item.label}
                      </p>

                      <span className="shrink-0 text-lg font-bold text-white">
                        {item.count}
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-right text-[11px] text-slate-600">
                      {percentage}%
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================================================
            SYSTEM SUMMARY
        ================================================== */}

        <div className="mt-4 rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">
          <SectionHeader
            icon={<Activity size={20} />}
            iconClass="bg-green-500/10 text-green-400"
            title="System Summary"
            description="Current platform activity"
          />

          <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
            <SummaryItem
              label="Users"
              value={totalUsers}
              valueClass="text-white"
            />

            <SummaryItem
              label="Assessments"
              value={completedAssessments}
              valueClass="text-green-400"
            />

            <SummaryItem
              label="Feedback"
              value={totalFeedback}
              valueClass="text-yellow-400"
            />

            <SummaryItem
              label="Progress Records"
              value={totalProgressRecords}
              valueClass="text-purple-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  icon,
  iconClass,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h2 className="text-base font-semibold text-white sm:text-lg">
          {title}
        </h2>

        <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// DONUT CHART
// ============================================================

function DonutChart({
  studentPercentage,
  adminPercentage,
  totalUsers,
}) {
  const studentDegree = studentPercentage * 3.6;

  const donutBackground =
    totalUsers === 0
      ? "conic-gradient(#334155 0deg 360deg)"
      : `conic-gradient(
          #06b6d4 0deg ${studentDegree}deg,
          #a855f7 ${studentDegree}deg 360deg
        )`;

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center sm:h-36 sm:w-36">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: donutBackground,
        }}
      />

      <div className="relative flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full bg-[#0f172a] sm:h-24 sm:w-24">
        <p className="text-xl font-bold text-white sm:text-2xl">
          {totalUsers}
        </p>

        <p className="text-[10px] text-slate-500">
          Users
        </p>
      </div>
    </div>
  );
}

// ============================================================
// DISTRIBUTION ROW
// ============================================================

function DistributionRow({
  label,
  value,
  percentage,
  barClass,
  textClass,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${barClass}`}
          />

          <span className="truncate text-sm text-slate-400">
            {label}
          </span>
        </div>

        <span
          className={`shrink-0 text-sm font-bold ${textClass}`}
        >
          {value}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="mt-1 text-right text-[11px] text-slate-600">
        {percentage}%
      </p>
    </div>
  );
}

// ============================================================
// MINI STAT
// ============================================================

function MiniStat({
  label,
  value,
  valueClass = "text-white",
  suffix = "",
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-900 p-3.5 sm:p-4">
      <p className="truncate text-xs text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-bold sm:text-2xl ${valueClass}`}
      >
        {value}

        {suffix && (
          <span className="ml-1 text-sm font-medium text-slate-500">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

// ============================================================
// SUMMARY ITEM
// ============================================================

function SummaryItem({
  label,
  value,
  valueClass = "text-white",
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <p className="text-[10px] uppercase tracking-wide text-slate-500 sm:text-xs">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================
// EMPTY CHART
// ============================================================

function EmptyChart({ message }) {
  return (
    <div className="mt-5 flex min-h-[170px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/50 px-5 text-center">
      <div>
        <BarChart3
          size={28}
          className="mx-auto text-slate-700"
        />

        <p className="mt-3 text-sm text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// ANALYTICS SKELETON
// ============================================================

function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] px-3 py-4 pb-10 text-white sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* HEADER */}

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800 sm:h-12 sm:w-12" />

              <div className="space-y-3">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />

                <div className="h-7 w-48 animate-pulse rounded bg-slate-800" />

                <div className="h-3 w-72 max-w-full animate-pulse rounded bg-slate-800" />
              </div>
            </div>

            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-800 sm:w-28" />
          </div>
        </div>

        {/* SUMMARY */}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>

        {/* PANELS */}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PanelSkeleton />
          <PanelSkeleton />
          <PanelSkeleton />
          <PanelSkeleton />
        </div>

        <div className="mt-4">
          <WidePanelSkeleton />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STAT SKELETON
// ============================================================

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />

          <div className="h-9 w-14 animate-pulse rounded bg-slate-800" />

          <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
        </div>

        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800" />
      </div>
    </div>
  );
}

// ============================================================
// PANEL SKELETON
// ============================================================

function PanelSkeleton() {
  return (
    <div className="min-h-[270px] rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800" />

        <div className="space-y-2">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-800" />

          <div className="h-3 w-52 animate-pulse rounded bg-slate-800" />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="h-12 animate-pulse rounded-xl bg-slate-900" />

        <div className="h-12 animate-pulse rounded-xl bg-slate-900" />

        <div className="h-10 animate-pulse rounded-xl bg-slate-900" />
      </div>
    </div>
  );
}

// ============================================================
// WIDE PANEL SKELETON
// ============================================================

function WidePanelSkeleton() {
  return (
    <div className="min-h-[300px] rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800" />

        <div className="space-y-2">
          <div className="h-5 w-48 animate-pulse rounded bg-slate-800" />

          <div className="h-3 w-64 animate-pulse rounded bg-slate-800" />
        </div>
      </div>

      <div className="mt-10 flex h-40 items-end justify-around gap-3">
        <div className="h-20 w-8 animate-pulse rounded-t-lg bg-slate-800 sm:w-10" />

        <div className="h-32 w-8 animate-pulse rounded-t-lg bg-slate-800 sm:w-10" />

        <div className="h-24 w-8 animate-pulse rounded-t-lg bg-slate-800 sm:w-10" />

        <div className="h-36 w-8 animate-pulse rounded-t-lg bg-slate-800 sm:w-10" />

        <div className="h-28 w-8 animate-pulse rounded-t-lg bg-slate-800 sm:w-10" />
      </div>
    </div>
  );
}

export default Analytics;