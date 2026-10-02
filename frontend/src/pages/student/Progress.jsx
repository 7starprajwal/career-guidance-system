import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers3,
  Loader2,
  RefreshCw,
  Route,
  Target,
  TrendingUp,
} from "lucide-react";

import progressService from "../../services/progressService";

function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ============================================================
  LOAD PROGRESS
  ============================================================
  */

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await progressService.getProgress();

      if (!response?.success) {
        setError(
          response?.message ||
            "Failed to load your progress."
        );

        return;
      }

      setData(response);
    } catch (err) {
      console.error(
        "Progress loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load your progress."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  DATA
  ============================================================
  */

  const summary = data?.summary || {};

  const allProgress = Array.isArray(
    data?.progress
  )
    ? data.progress
    : [];

  const courseProgress = Array.isArray(
    data?.courseProgress
  )
    ? data.courseProgress
    : allProgress.filter(
        (item) =>
          item?.source !== "roadmap"
      );

  const roadmapProgress = Array.isArray(
    data?.roadmapProgress
  )
    ? data.roadmapProgress
    : allProgress.filter(
        (item) =>
          item?.source === "roadmap"
      );

  /*
  ============================================================
  VALUES
  ============================================================
  */

  const overallProgress = clampProgress(
    summary?.overallProgress ??
      calculateAverage(allProgress)
  );

  const roadmapOverallProgress =
    clampProgress(
      summary?.roadmapOverallProgress ??
        calculateAverage(
          roadmapProgress
        )
    );

  const courseOverallProgress =
    clampProgress(
      summary?.courseOverallProgress ??
        calculateAverage(
          courseProgress
        )
    );

  const totalCourses =
    Number(
      summary?.totalCourses ??
        courseProgress.length
    );

  const completedCourses =
    Number(
      summary?.completedCourses ??
        countCompleted(
          courseProgress
        )
    );

  const inProgressCourses =
    Number(
      summary?.inProgressCourses ??
        countInProgress(
          courseProgress
        )
    );

  const totalRoadmapSkills =
    Number(
      summary?.totalRoadmapSkills ??
        roadmapProgress.length
    );

  const completedRoadmapSkills =
    Number(
      summary?.completedRoadmapSkills ??
        countCompleted(
          roadmapProgress
        )
    );

  const inProgressRoadmapSkills =
    Number(
      summary?.inProgressRoadmapSkills ??
        countInProgress(
          roadmapProgress
        )
    );

  /*
  ============================================================
  RECENT ACTIVITY
  ============================================================
  */

  const recentActivity = useMemo(() => {
    return [...allProgress]
      .sort(
        (a, b) =>
          new Date(
            b?.updatedAt || 0
          ) -
          new Date(
            a?.updatedAt || 0
          )
      )
      .slice(0, 6);
  }, [allProgress]);

  /*
  ============================================================
  LOADING
  ============================================================
  */

  if (loading) {
    return <LoadingState />;
  }

  /*
  ============================================================
  ERROR
  ============================================================
  */

  if (error && !data) {
    return (
      <ErrorState
        error={error}
        onRetry={loadProgress}
      />
    );
  }

  /*
  ============================================================
  MAIN
  ============================================================
  */

  return (
    <div className="w-full pb-12 text-white">
      {/* ====================================================
          HEADER
      ===================================================== */}

      <section className="relative mb-6 overflow-hidden rounded-[24px] border border-slate-800 bg-[#0b1328] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400">
              <TrendingUp size={13} />

              Learning Analytics
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-[36px]">
              Your Progress
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-[15px]">
              Track your course learning,
              roadmap skills, and overall
              learning journey.
            </p>
          </div>

          <button
            type="button"
            onClick={loadProgress}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </section>

      {/* ====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <span className="font-bold">
            !
          </span>

          <p>{error}</p>
        </div>
      )}

      {/* ====================================================
          OVERALL PROGRESS
      ===================================================== */}

      <section className="mb-6 rounded-[24px] border border-slate-800 bg-[#0b1328] p-5 shadow-lg sm:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Overall Learning
            </p>

            <h2 className="mt-1 text-xl font-black text-white">
              Your learning progress
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              This combines your saved course
              and roadmap learning records.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ProgressRing
              progress={
                overallProgress
              }
            />

            <div>
              <p className="text-3xl font-black text-white">
                {overallProgress}%
              </p>

              <p className="text-xs text-slate-500">
                overall progress
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-900">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{
              width: `${overallProgress}%`,
            }}
          />
        </div>
      </section>

      {/* ====================================================
          SUMMARY CARDS
      ===================================================== */}

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Courses"
          value={totalCourses}
          description="Learning records"
          icon={
            <BookOpen size={18} />
          }
        />

        <SummaryCard
          label="Completed Courses"
          value={completedCourses}
          description="Fully completed"
          icon={
            <CheckCircle2
              size={18}
            />
          }
          success
        />

        <SummaryCard
          label="In Progress"
          value={inProgressCourses}
          description="Currently learning"
          icon={
            <Clock3 size={18} />
          }
        />

        <SummaryCard
          label="Roadmap Skills"
          value={totalRoadmapSkills}
          description={`${completedRoadmapSkills} completed`}
          icon={
            <Route size={18} />
          }
        />
      </section>

      {/* ====================================================
          ROADMAP + COURSES
      ===================================================== */}

      <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* ==================================================
            ROADMAP PROGRESS
        =================================================== */}

        <ProgressOverviewCard
          title="Roadmap Progress"
          subtitle="Your skill-by-skill learning journey"
          icon={
            <Route size={18} />
          }
          progress={
            roadmapOverallProgress
          }
          completed={
            completedRoadmapSkills
          }
          total={
            totalRoadmapSkills
          }
          inProgress={
            inProgressRoadmapSkills
          }
          type="roadmap"
        />

        {/* ==================================================
            COURSE PROGRESS
        =================================================== */}

        <ProgressOverviewCard
          title="Course Progress"
          subtitle="Your personalized learning courses"
          icon={
            <BookOpen size={18} />
          }
          progress={
            courseOverallProgress
          }
          completed={
            completedCourses
          }
          total={totalCourses}
          inProgress={
            inProgressCourses
          }
          type="course"
        />
      </section>

      {/* ====================================================
          ROADMAP DETAILS
      ===================================================== */}

      <section className="mb-6 rounded-[24px] border border-slate-800 bg-[#0b1328] p-5 shadow-lg sm:p-6">
        <SectionHeader
          icon={
            <Route size={17} />
          }
          title="Roadmap Skills"
          subtitle="Progress saved from your personalized roadmap"
          count={
            roadmapProgress.length
          }
        />

        {roadmapProgress.length ===
        0 ? (
          <EmptyProgress
            icon={
              <Route size={21} />
            }
            title="No roadmap progress yet"
            description="Open your Roadmap, complete some topics, and save your progress."
          />
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {roadmapProgress.map(
              (item, index) => (
                <RoadmapProgressCard
                  key={
                    item?._id ||
                    item?.courseId ||
                    `${item?.skill}-${index}`
                  }
                  item={item}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* ====================================================
          COURSE DETAILS
      ===================================================== */}

      <section className="mb-6 rounded-[24px] border border-slate-800 bg-[#0b1328] p-5 shadow-lg sm:p-6">
        <SectionHeader
          icon={
            <BookOpen size={17} />
          }
          title="Course Progress"
          subtitle="Your personalized courses and learning records"
          count={
            courseProgress.length
          }
        />

        {courseProgress.length ===
        0 ? (
          <EmptyProgress
            icon={
              <BookOpen size={21} />
            }
            title="No course progress yet"
            description="Start one of your recommended courses to begin tracking progress."
          />
        ) : (
          <div className="mt-5 space-y-3">
            {courseProgress.map(
              (item, index) => (
                <CourseProgressCard
                  key={
                    item?._id ||
                    item?.courseId ||
                    `${item?.skill}-${index}`
                  }
                  item={item}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* ====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <section className="rounded-[24px] border border-slate-800 bg-[#0b1328] p-5 shadow-lg sm:p-6">
        <SectionHeader
          icon={
            <Activity size={17} />
          }
          title="Recent Activity"
          subtitle="Your latest learning updates"
          count={
            recentActivity.length
          }
        />

        {recentActivity.length ===
        0 ? (
          <EmptyProgress
            icon={
              <Activity size={21} />
            }
            title="No recent activity"
            description="Your learning activity will appear here after you save progress."
          />
        ) : (
          <div className="mt-5 space-y-3">
            {recentActivity.map(
              (item, index) => (
                <ActivityItem
                  key={
                    item?._id ||
                    `${item?.courseId}-${index}`
                  }
                  item={item}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/*
============================================================
SUMMARY CARD
============================================================
*/

function SummaryCard({
  label,
  value,
  description,
  icon,
  success = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b1328] p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
            {label}
          </p>

          <p
            className={`mt-2 text-2xl font-black ${
              success
                ? "text-emerald-400"
                : "text-white"
            }`}
          >
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            {description}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            success
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/*
============================================================
PROGRESS OVERVIEW CARD
============================================================
*/

function ProgressOverviewCard({
  title,
  subtitle,
  icon,
  progress,
  completed,
  total,
  inProgress,
  type,
}) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-[#0b1328] p-5 shadow-lg sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            {icon}
          </div>

          <div className="min-w-0">
            <h3 className="font-black text-white">
              {title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <span className="text-xl font-black text-blue-400">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-900">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MiniStat
          label="Total"
          value={total}
        />

        <MiniStat
          label="Done"
          value={completed}
          success
        />

        <MiniStat
          label="Active"
          value={inProgress}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-600">
        {type === "roadmap" ? (
          <>
            <Target size={13} />

            Skill progress from your roadmap
          </>
        ) : (
          <>
            <BookOpen size={13} />

            Progress from your courses
          </>
        )}
      </div>
    </div>
  );
}

/*
============================================================
MINI STAT
============================================================
*/

function MiniStat({
  label,
  value,
  success = false,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-black ${
          success
            ? "text-emerald-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/*
============================================================
ROADMAP PROGRESS CARD
============================================================
*/

function RoadmapProgressCard({
  item,
}) {
  const progress =
    clampProgress(item?.progress);

  const topics = Array.isArray(
    item?.topicProgress
  )
    ? item.topicProgress
    : [];

  const completedTopics =
    topics.filter(
      (topic) =>
        topic?.completed
    ).length;

  const totalTopics =
    topics.length;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-blue-500/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-white">
              {item?.skill ||
                "Roadmap Skill"}
            </h3>

            <StatusBadge
              status={
                item?.status
              }
            />
          </div>

          <p className="mt-1 text-[10px] text-slate-600">
            {item?.career ||
              "Personalized roadmap"}
          </p>
        </div>

        <span className="shrink-0 text-sm font-black text-blue-400">
          {progress}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900">
        <div
          className={`h-full rounded-full transition-all ${
            progress === 100
              ? "bg-emerald-500"
              : "bg-blue-500"
          }`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-slate-600">
        <span>
          {totalTopics > 0
            ? `${completedTopics}/${totalTopics} topics completed`
            : "Skill progress saved"}
        </span>

        {item?.updatedAt && (
          <span>
            {formatDate(
              item.updatedAt
            )}
          </span>
        )}
      </div>
    </div>
  );
}

/*
============================================================
COURSE PROGRESS CARD
============================================================
*/

function CourseProgressCard({
  item,
}) {
  const progress =
    clampProgress(item?.progress);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-blue-500/20 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-white">
              {item?.skill ||
                item?.courseId ||
                "Course"}
            </h3>

            <StatusBadge
              status={
                item?.status
              }
            />
          </div>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-600">
            <span>
              {item?.courseId ||
                "Learning course"}
            </span>

            {item?.career && (
              <span>
                {item.career}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="text-lg font-black text-blue-400">
            {progress}%
          </p>

          {item?.updatedAt && (
            <p className="text-[10px] text-slate-600">
              {formatDate(
                item.updatedAt
              )}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900">
        <div
          className={`h-full rounded-full transition-all ${
            progress === 100
              ? "bg-emerald-500"
              : "bg-blue-500"
          }`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

/*
============================================================
ACTIVITY ITEM
============================================================
*/

function ActivityItem({
  item,
}) {
  const progress =
    clampProgress(item?.progress);

  const isRoadmap =
    item?.source ===
    "roadmap";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3 sm:p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          progress === 100
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-blue-500/10 text-blue-400"
        }`}
      >
        {progress === 100 ? (
          <CheckCircle2
            size={17}
          />
        ) : isRoadmap ? (
          <Route size={17} />
        ) : (
          <BookOpen size={17} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-bold text-white">
            {item?.skill ||
              item?.courseId ||
              "Learning activity"}
          </h3>

          <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
            {isRoadmap
              ? "Roadmap"
              : "Course"}
          </span>
        </div>

        <p className="mt-1 text-[10px] text-slate-600">
          {item?.status ||
            "not-started"}
          {" • "}
          {formatDate(
            item?.updatedAt
          )}
        </p>
      </div>

      <span
        className={`shrink-0 text-sm font-black ${
          progress === 100
            ? "text-emerald-400"
            : "text-blue-400"
        }`}
      >
        {progress}%
      </span>
    </div>
  );
}

/*
============================================================
SECTION HEADER
============================================================
*/

function SectionHeader({
  icon,
  title,
  subtitle,
  count,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <div>
          <h2 className="font-black text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <span className="self-start rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-[10px] font-semibold text-slate-500 sm:self-auto">
        {count}{" "}
        {count === 1
          ? "record"
          : "records"}
      </span>
    </div>
  );
}

/*
============================================================
STATUS BADGE
============================================================
*/

function StatusBadge({
  status,
}) {
  const normalized =
    String(
      status || "not-started"
    ).toLowerCase();

  let label = "Not Started";
  let classes =
    "border-orange-500/20 bg-orange-500/10 text-orange-400";

  if (
    normalized ===
    "completed"
  ) {
    label = "Completed";

    classes =
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  } else if (
    normalized ===
    "in-progress"
  ) {
    label = "In Progress";

    classes =
      "border-blue-500/20 bg-blue-500/10 text-blue-400";
  }

  return (
    <span
      className={`rounded-full border px-2 py-1 text-[9px] font-bold ${classes}`}
    >
      {label}
    </span>
  );
}

/*
============================================================
EMPTY PROGRESS
============================================================
*/

function EmptyProgress({
  icon,
  title,
  description,
}) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-7 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}

/*
============================================================
PROGRESS RING
============================================================
*/

function ProgressRing({
  progress,
}) {
  const radius = 20;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) *
      circumference;

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg
        className="h-16 w-16 -rotate-90"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-800"
        />

        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-blue-500 transition-all duration-700"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={
            offset
          }
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
        {progress}%
      </span>
    </div>
  );
}

/*
============================================================
LOADING STATE
============================================================
*/

function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
          <Loader2
            size={23}
            className="animate-spin text-blue-400"
          />
        </div>

        <h2 className="mt-4 text-lg font-bold text-white">
          Loading your progress
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Preparing your learning analytics...
        </p>
      </div>
    </div>
  );
}

/*
============================================================
ERROR STATE
============================================================
*/

function ErrorState({
  error,
  onRetry,
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <h2 className="text-xl font-bold text-red-400">
        Unable to load progress
      </h2>

      <p className="mt-2 text-sm leading-6 text-red-300">
        {error}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
      >
        <RefreshCw size={15} />

        Try Again
      </button>
    </div>
  );
}

/*
============================================================
CALCULATE AVERAGE
============================================================
*/

function calculateAverage(
  records
) {
  if (
    !Array.isArray(records) ||
    records.length === 0
  ) {
    return 0;
  }

  return Math.round(
    records.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.progress || 0
        ),
      0
    ) / records.length
  );
}

/*
============================================================
COUNT COMPLETED
============================================================
*/

function countCompleted(
  records
) {
  if (
    !Array.isArray(records)
  ) {
    return 0;
  }

  return records.filter(
    (item) =>
      item?.status ===
        "completed" ||
      Number(
        item?.progress || 0
      ) === 100
  ).length;
}

/*
============================================================
COUNT IN PROGRESS
============================================================
*/

function countInProgress(
  records
) {
  if (
    !Array.isArray(records)
  ) {
    return 0;
  }

  return records.filter(
    (item) =>
      item?.status ===
      "in-progress"
  ).length;
}

/*
============================================================
CLAMP PROGRESS
============================================================
*/

function clampProgress(value) {
  const number = Number(value);

  if (
    Number.isNaN(number)
  ) {
    return 0;
  }

  return Math.min(
    Math.max(
      number,
      0
    ),
    100
  );
}

/*
============================================================
FORMAT DATE
============================================================
*/

function formatDate(value) {
  if (!value) {
    return "Recently";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Recently";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default Progress;