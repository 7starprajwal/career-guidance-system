import { useEffect, useState } from "react";
import roadmapService from "../../services/roadmapService";

function Roadmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await roadmapService.getRoadmap();

      if (response.success) {
        setData(response.roadmap);
      } else {
        setError(
          response.message ||
            "Failed to load roadmap"
        );
      }
    } catch (error) {
      console.error("Roadmap error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load personalized roadmap"
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
            Generating your personalized roadmap...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="text-xl font-bold text-red-400">
          Learning Roadmap
        </h2>

        <p className="mt-2 text-red-300">
          {error}
        </p>

        <button
          onClick={loadRoadmap}
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

  const overallProgress =
    Number(data.overallProgress) || 0;

  const roadmap = Array.isArray(data.roadmap)
    ? data.roadmap
    : [];

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
          Learning Roadmap
        </h1>

        <p className="mt-2 text-slate-400">
          Follow your personalized learning path step by
          step to prepare for your target career.
        </p>
      </div>

      {/* ================================
          CAREER + PROGRESS
      ================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Career */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">

          <p className="text-sm text-slate-400">
            Target Career
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {data.career || "Not specified"}
          </h2>

          <p className="mt-2 text-slate-400">
            Complete the learning steps below to build
            the skills required for your career.
          </p>

        </div>

        {/* Progress */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <p className="text-sm text-slate-400">
            Overall Progress
          </p>

          <p className="mt-2 text-4xl font-bold text-blue-400">
            {overallProgress}%
          </p>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${Math.min(
                  Math.max(overallProgress, 0),
                  100
                )}%`,
              }}
            />

          </div>

          <p className="mt-3 text-sm text-slate-500">
            {data.completedSteps} of{" "}
            {data.totalSteps} steps completed
          </p>

        </div>

      </div>

      {/* ================================
          SUMMARY
      ================================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        {/* Total */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Total Steps
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {data.totalSteps}
          </p>

        </div>

        {/* Completed */}
        <div className="rounded-xl border border-green-500/20 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {data.completedSteps}
          </p>

        </div>

        {/* Remaining */}
        <div className="rounded-xl border border-orange-500/20 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Remaining
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-400">
            {data.remainingSteps}
          </p>

        </div>

      </div>

      {/* ================================
          ROADMAP
      ================================= */}
      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold text-white">
            Your Learning Path
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Follow the phases in order and build your
            skills progressively.
          </p>

        </div>

        {roadmap.length === 0 ? (

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

            <p className="text-slate-400">
              No roadmap steps are available yet.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {roadmap.map((item, index) => {

              const completed =
                item.status === "completed";

              const progress =
                Number(item.progress) || 0;

              return (
                <div
                  key={`${item.skill}-${index}`}
                  className={`rounded-xl border bg-slate-900 p-6 ${
                    completed
                      ? "border-green-500/20"
                      : "border-slate-800"
                  }`}
                >

                  {/* =========================
                      TOP SECTION
                  ========================== */}
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    {/* Skill */}
                    <div className="flex gap-4">

                      {/* Number */}
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                          completed
                            ? "bg-green-500/10 text-green-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {completed
                          ? "✓"
                          : index + 1}
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-xl font-bold text-white">
                            {item.skill}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              completed
                                ? "bg-green-500/10 text-green-400"
                                : "bg-orange-500/10 text-orange-400"
                            }`}
                          >
                            {completed
                              ? "Completed"
                              : "Not Started"}
                          </span>

                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Phase {item.phase}
                        </p>

                      </div>

                    </div>

                    {/* INFO */}
                    <div className="flex flex-wrap gap-2">

                      {item.duration && (
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          ⏱ {item.duration}
                        </span>
                      )}

                      {item.level && (
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          {item.level}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* =========================
                      PROGRESS
                  ========================== */}
                  <div className="mt-6">

                    <div className="flex justify-between text-sm">

                      <span className="text-slate-400">
                        Progress
                      </span>

                      <span className="font-medium text-blue-400">
                        {progress}%
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className={`h-full rounded-full transition-all ${
                          completed
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.max(progress, 0),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* =========================
                      PREREQUISITES
                  ========================== */}
                  {item.prerequisites?.length > 0 && (

                    <div className="mt-6">

                      <p className="text-sm font-medium text-slate-300">
                        Prerequisites
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">

                        {item.prerequisites.map(
                          (prerequisite) => (

                            <span
                              key={prerequisite}
                              className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400"
                            >
                              {prerequisite}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}

                  {/* =========================
                      TOPICS
                  ========================== */}
                  {item.topics?.length > 0 && (

                    <div className="mt-6">

                      <p className="text-sm font-medium text-slate-300">
                        Topics to Learn
                      </p>

                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">

                        {item.topics.map(
                          (topic) => (

                            <div
                              key={topic}
                              className="flex items-center gap-3 rounded-lg bg-slate-950 p-3"
                            >

                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                                  completed
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-blue-500/10 text-blue-400"
                                }`}
                              >
                                {completed
                                  ? "✓"
                                  : "•"}
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

                </div>
              );
            })}

          </div>

        )}

      </section>

      {/* ================================
          FINAL MESSAGE
      ================================= */}
      {roadmap.length > 0 && (

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">

          <h2 className="text-lg font-bold text-blue-400">
            Keep Building Your Skills
          </h2>

          <p className="mt-2 text-slate-400">
            Follow the roadmap step by step. Once you
            complete the required skills, your career
            readiness will improve.
          </p>

        </div>

      )}

    </div>
  );
}

export default Roadmap;