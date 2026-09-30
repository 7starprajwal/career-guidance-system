import { useEffect, useState } from "react";
import progressService from "../../services/progressService";

function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await progressService.getProgress();

      if (response.success) {
        setData(response);
      } else {
        setError(
          response.message ||
            "Failed to load progress"
        );
      }
    } catch (error) {
      console.error(
        "Progress error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load learning progress"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#020617]">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-slate-400">
            Loading your progress...
          </p>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">

        <h2 className="text-xl font-bold text-red-400">
          Progress
        </h2>

        <p className="mt-2 text-red-300">
          {error}
        </p>

        <button
          onClick={loadProgress}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>

      </div>
    );
  }

  if (!data) {
    return null;
  }

  const summary = data.summary || {};

  const progressList = Array.isArray(
    data.progress
  )
    ? data.progress
    : [];

  const overallProgress =
    Number(summary.overallProgress) || 0;

  return (
    <div className="min-h-screen space-y-8 bg-[#020617] pb-10 text-white">

      {/* ================================
          HEADER
      ================================= */}
      <div>

        <p className="text-sm font-medium text-blue-400">
          Learning Analytics
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          My Progress
        </h1>

        <p className="mt-2 text-slate-400">
          Track your learning progress and completed
          courses.
        </p>

      </div>

      {/* ================================
          OVERALL PROGRESS
      ================================= */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm text-slate-400">
              Overall Learning Progress
            </p>

            <p className="mt-2 text-4xl font-bold text-blue-400">
              {overallProgress}%
            </p>

          </div>

          <div className="w-full md:w-2/3">

            <div className="h-4 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(
                      overallProgress,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================================
          SUMMARY CARDS
      ================================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        {/* Total Courses */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Total Courses
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {summary.totalCourses || 0}
          </p>

        </div>

        {/* Completed */}
        <div className="rounded-xl border border-green-500/20 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {summary.completedCourses || 0}
          </p>

        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-orange-500/20 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            In Progress
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-400">
            {summary.inProgressCourses || 0}
          </p>

        </div>

      </div>

      {/* ================================
          COURSE PROGRESS
      ================================= */}
      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold text-white">
            Course Progress
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your individual learning progress.
          </p>

        </div>

        {progressList.length === 0 ? (

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-2xl">
              📚
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              No learning progress yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Start a course and your progress will appear
              here.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {progressList.map(
              (item, index) => {

                const progress =
                  Number(item.progress) || 0;

                const completed =
                  item.status ===
                  "completed";

                const inProgress =
                  item.status ===
                  "in-progress";

                return (

                  <div
                    key={
                      item.courseId ||
                      index
                    }
                    className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                  >

                    {/* TOP */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-wide text-blue-400">
                          {item.skill ||
                            "Learning"}
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-white">
                          {item.courseId}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {item.career}
                        </p>

                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          completed
                            ? "bg-green-500/10 text-green-400"
                            : inProgress
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {completed
                          ? "Completed"
                          : inProgress
                          ? "In Progress"
                          : "Not Started"}
                      </span>

                    </div>

                    {/* PROGRESS BAR */}
                    <div className="mt-6">

                      <div className="flex justify-between text-sm">

                        <span className="text-slate-400">
                          Progress
                        </span>

                        <span className="font-semibold text-blue-400">
                          {progress}%
                        </span>

                      </div>

                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            completed
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              Math.max(
                                progress,
                                0
                              ),
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* DATE */}
                    <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500">

                      {item.updatedAt && (
                        <span>
                          Updated:{" "}
                          {new Date(
                            item.updatedAt
                          ).toLocaleDateString()}
                        </span>
                      )}

                      {item.completedAt && (
                        <span className="text-green-400">
                          Completed:{" "}
                          {new Date(
                            item.completedAt
                          ).toLocaleDateString()}
                        </span>
                      )}

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* ================================
          INFORMATION
      ================================= */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">

        <h2 className="text-lg font-bold text-blue-400">
          Keep Learning
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your progress is updated when learning progress
          is submitted. Continue working through your
          personalized courses and roadmap.
        </p>

      </div>

    </div>
  );
}

export default Progress;