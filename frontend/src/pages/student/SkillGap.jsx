import { useEffect, useState } from "react";
import skillGapService from "../../services/skillGapService";

function SkillGap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkillGap();
  }, []);

  const loadSkillGap = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await skillGapService.getSkillGap();

      if (response.success) {
        setData(response.skillGap);
      } else {
        setError(
          response.message ||
            "Failed to load skill gap"
        );
      }
    } catch (error) {
      console.error(
        "Skill gap error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load skill gap"
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
            Analyzing your skill gap...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="text-xl font-bold text-red-400">
          Skill Gap
        </h2>

        <p className="mt-2 text-red-300">
          {error}
        </p>

        <button
          onClick={loadSkillGap}
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

  const readiness =
    Number(data.readiness) || 0;

  return (
    <div className="min-h-screen space-y-8 bg-[#020617] pb-10 text-white">

      {/* ================================
          HEADER
      ================================= */}
      <div>
        <p className="text-sm font-medium text-blue-400">
          Skills & Career Readiness
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Skill Gap Analysis
        </h1>

        <p className="mt-2 text-slate-400">
          Understand which skills you already have and
          which skills you need to develop for your target
          career.
        </p>
      </div>

      {/* ================================
          CAREER + READINESS
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

          {data.category && (
            <p className="mt-1 text-sm text-slate-500">
              {data.category}
            </p>
          )}

          <p className="mt-5 text-slate-400">
            Your current skills are compared with the
            required skills for this career.
          </p>

        </div>

        {/* Readiness */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <p className="text-sm text-slate-400">
            Career Readiness
          </p>

          <div className="mt-2 flex items-end gap-2">

            <span className="text-4xl font-bold text-blue-400">
              {readiness}%
            </span>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${Math.min(
                  Math.max(readiness, 0),
                  100
                )}%`,
              }}
            />

          </div>

          <p className="mt-3 text-sm text-slate-500">
            {data.matchedCount} of{" "}
            {data.totalRequired} required skills matched
          </p>

        </div>

      </div>

      {/* ================================
          SUMMARY
      ================================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        {/* Required */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Required Skills
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {data.totalRequired}
          </p>

        </div>

        {/* Matched */}
        <div className="rounded-xl border border-green-500/20 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Matched Skills
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {data.matchedCount}
          </p>

        </div>

        {/* Missing */}
        <div className="rounded-xl border border-orange-500/20 bg-slate-900 p-5">

          <p className="text-sm text-slate-400">
            Missing Skills
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-400">
            {data.missingCount}
          </p>

        </div>

      </div>

      {/* ================================
          CURRENT SKILLS
      ================================= */}
      <section>

        <h2 className="text-xl font-bold text-white">
          Your Current Skills
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Skills currently present in your profile.
        </p>

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-6">

          {data.currentSkills?.length > 0 ? (

            <div className="flex flex-wrap gap-3">

              {data.currentSkills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          ) : (

            <p className="text-slate-500">
              No skills found in your profile.
            </p>

          )}

        </div>

      </section>

      {/* ================================
          MATCHED SKILLS
      ================================= */}
      <section>

        <div className="flex items-center justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-white">
              Matched Skills
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Skills that already match your target
              career.
            </p>

          </div>

          <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
            {data.matchedCount} matched
          </span>

        </div>

        <div className="mt-5 rounded-xl border border-green-500/20 bg-slate-900 p-6">

          {data.matchedSkills?.length > 0 ? (

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {data.matchedSkills.map(
                (skill) => (

                  <div
                    key={skill}
                    className="flex items-center gap-3 rounded-lg border border-green-500/10 bg-green-500/5 p-4"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                      ✓
                    </div>

                    <span className="font-medium text-slate-200">
                      {skill}
                    </span>

                  </div>

                )
              )}

            </div>

          ) : (

            <p className="text-slate-500">
              No matched skills found.
            </p>

          )}

        </div>

      </section>

      {/* ================================
          MISSING SKILLS
      ================================= */}
      <section>

        <div className="flex items-center justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-white">
              Skills You Need to Improve
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              These skills are required for your target
              career but are not currently matched.
            </p>

          </div>

          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm text-orange-400">
            {data.missingCount} missing
          </span>

        </div>

        <div className="mt-5 space-y-3">

          {data.missingSkills?.length > 0 ? (

            data.missingSkills.map(
              (item) => {

                const skill =
                  typeof item === "string"
                    ? item
                    : item.skill;

                const priority =
                  typeof item === "string"
                    ? "Medium"
                    : item.priority;

                const isHigh =
                  priority === "High";

                return (

                  <div
                    key={skill}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-4">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                          +
                        </div>

                        <div>

                          <h3 className="font-semibold text-white">
                            {skill}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Skill to develop
                          </p>

                        </div>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          isHigh
                            ? "bg-red-500/10 text-red-400"
                            : "bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {priority} Priority
                      </span>

                    </div>

                  </div>

                );
              }
            )

          ) : (

            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">

              <p className="font-medium text-green-400">
                🎉 You have matched all required skills!
              </p>

            </div>

          )}

        </div>

      </section>

      {/* ================================
          NEXT STEP
      ================================= */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">

        <h2 className="text-lg font-bold text-blue-400">
          What should you do next?
        </h2>

        <p className="mt-2 text-slate-400">
          Use your personalized roadmap to learn the
          missing skills step by step.
        </p>

      </div>

    </div>
  );
}

export default SkillGap;