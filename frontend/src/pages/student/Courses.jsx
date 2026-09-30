import { useEffect, useState } from "react";
import courseService from "../../services/courseService";

function Courses() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await courseService.getCourses();

      if (response.success) {
        setData(response);
      } else {
        setError(
          response.message ||
            "Failed to load courses"
        );
      }
    } catch (error) {
      console.error("Courses error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load personalized courses"
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
            Loading your personalized courses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="text-xl font-bold text-red-400">
          Courses
        </h2>

        <p className="mt-2 text-red-300">
          {error}
        </p>

        <button
          onClick={loadCourses}
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

  const courses = Array.isArray(data.courses)
    ? data.courses
    : [];

  const summary = data.summary || {};

  const filteredCourses = courses.filter(
    (course) => {
      if (filter === "recommended") {
        return course.status === "recommended";
      }

      if (filter === "completed") {
        return course.status === "completed";
      }

      return true;
    }
  );

  return (
    <div className="min-h-screen space-y-8 bg-[#020617] pb-10 text-white">

      {/* ================================
          HEADER
      ================================= */}
      <div>
        <p className="text-sm font-medium text-blue-400">
          Personalized Learning
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Personalized Courses
        </h1>

        <p className="mt-2 text-slate-400">
          Learn the skills required for your target career
          through a personalized learning path.
        </p>
      </div>

      {/* ================================
          CAREER
      ================================= */}
      {data.career && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">

          <p className="text-sm text-slate-400">
            Target Career
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {data.career.name}
          </h2>

          {data.career.category && (
            <p className="mt-1 text-sm text-slate-400">
              {data.career.category}
            </p>
          )}

        </div>
      )}

      {/* ================================
          SUMMARY
      ================================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        {/* Total */}
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

        {/* Recommended */}
        <div className="rounded-xl border border-blue-500/20 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Recommended
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-400">
            {summary.recommendedCourses || 0}
          </p>

        </div>

      </div>

      {/* ================================
          FILTERS
      ================================= */}
      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All Courses
        </button>

        <button
          onClick={() => setFilter("recommended")}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
            filter === "recommended"
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Recommended
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
            filter === "completed"
              ? "bg-green-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Completed
        </button>

      </div>

      {/* ================================
          COURSE LIST
      ================================= */}
      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold text-white">
            Your Courses
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Courses selected according to your career
            requirements and current skills.
          </p>

        </div>

        {filteredCourses.length === 0 ? (

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-2xl">
              📚
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              No courses found
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              There are no courses in this category yet.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {filteredCourses.map(
              (course) => {

                const completed =
                  course.status === "completed";

                return (

                  <div
                    key={course.id}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40"
                  >

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                          {course.category}
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-white">
                          {course.title}
                        </h3>

                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          completed
                            ? "bg-green-500/10 text-green-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {completed
                          ? "Completed"
                          : "Recommended"}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {course.description}
                    </p>

                    {/* Course Info */}
                    <div className="mt-5 flex flex-wrap gap-2">

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        Skill: {course.skill}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        Level: {course.level}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        Duration: {course.duration}
                      </span>

                    </div>

                    {/* Topics */}
                    {course.topics?.length > 0 && (

                      <div className="mt-6">

                        <p className="text-sm font-medium text-slate-300">
                          Topics
                        </p>

                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">

                          {course.topics.map(
                            (topic) => (

                              <div
                                key={topic}
                                className="flex items-center gap-2 rounded-lg bg-slate-950 p-3"
                              >

                                <span className="text-blue-400">
                                  •
                                </span>

                                <span className="text-sm text-slate-300">
                                  {topic}
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">

                      <div>

                        <p className="text-xs text-slate-500">
                          Provider
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-300">
                          {course.provider}
                        </p>

                      </div>

                      <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                        {course.type}
                      </span>

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
          Complete the recommended courses to improve your
          skills and increase your career readiness.
        </p>

      </div>

    </div>
  );
}

export default Courses;