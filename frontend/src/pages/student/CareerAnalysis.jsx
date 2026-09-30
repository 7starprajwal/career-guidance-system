import { useEffect, useState } from "react";
import careerService from "../../services/careerService";

function CareerAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCareerAnalysis();
  }, []);

  const loadCareerAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await careerService.getRecommendations();

      if (response.success) {
        setData(response);
      } else {
        setError(
          response.message ||
            "Failed to load career analysis"
        );
      }
    } catch (error) {
      console.error(
        "Career analysis error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load career analysis"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#020617]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-400">
            Analyzing your career profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Career Analysis
        </h2>

        <p className="mt-2 text-red-300">
          {error}
        </p>
      </div>
    );
  }

  const profileSummary =
    data?.profileSummary || {};

  const behaviorAnalysis =
    data?.behaviorAnalysis || {};

  const machineLearning =
    data?.machineLearning || {};

  const recommendations =
    data?.recommendations || [];

  return (
    <div className="min-h-screen space-y-8 bg-[#020617] pb-10 text-white">

      {/* ================================
          HEADER
      ================================= */}
      <div>
        <p className="text-sm font-medium text-blue-400">
          AI & Machine Learning
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Career Analysis
        </h1>

        <p className="mt-2 text-slate-400">
          Your career recommendations are generated
          using your profile and behavioral assessment.
        </p>
      </div>

      {/* ================================
          PROFILE SUMMARY
      ================================= */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">
          Profile Summary
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Preferred Career */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Preferred Career
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {profileSummary.preferredCareer ||
                "Not specified"}
            </p>
          </div>

          {/* Career Goal */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Career Goal
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {profileSummary.careerGoal ||
                "Not specified"}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <p className="text-sm text-slate-400">
            Current Skills
          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            {(profileSummary.skills || []).length >
            0 ? (
              profileSummary.skills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-400"
                  >
                    {skill}
                  </span>
                )
              )
            ) : (
              <span className="text-slate-500">
                No skills added
              </span>
            )}

          </div>
        </div>
      </section>

      {/* ================================
          BEHAVIORAL ANALYSIS
      ================================= */}
      <section>

        <h2 className="mb-4 text-xl font-bold text-white">
          Behavioral Analysis
        </h2>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Assessment Status
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {behaviorAnalysis.completed
                  ? "Completed"
                  : "Not Completed"}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-sm ${
                behaviorAnalysis.completed
                  ? "bg-green-500/10 text-green-400"
                  : "bg-orange-500/10 text-orange-400"
              }`}
            >
              {behaviorAnalysis.completed
                ? "Completed"
                : "Pending"}
            </span>

          </div>

          {/* Behavioral Scores */}
          {Object.keys(
            behaviorAnalysis.scores || {}
          ).length > 0 && (

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {Object.entries(
                behaviorAnalysis.scores
              ).map(([key, value]) => (

                <div
                  key={key}
                  className="rounded-lg bg-slate-950 p-4"
                >

                  <p className="text-xs capitalize text-slate-500">
                    {key.replace(
                      /([A-Z])/g,
                      " $1"
                    )}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-400">
                    {value}
                  </p>

                </div>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* ================================
          MACHINE LEARNING MODEL
      ================================= */}
      <section>

        <h2 className="mb-4 text-xl font-bold text-white">
          Machine Learning Model
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Algorithm */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Algorithm
            </p>

            <p className="mt-2 font-semibold text-white">
              {machineLearning.algorithm ||
                "Not available"}
            </p>
          </div>

          {/* Training Samples */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Training Samples
            </p>

            <p className="mt-2 text-xl font-bold text-white">
              {machineLearning.trainingSamples ??
                "N/A"}
            </p>
          </div>

          {/* Feature Count */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Feature Count
            </p>

            <p className="mt-2 text-xl font-bold text-white">
              {machineLearning.featureCount ??
                "N/A"}
            </p>
          </div>

          {/* K Value */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              K Value
            </p>

            <p className="mt-2 text-xl font-bold text-white">
              {machineLearning.k ?? "N/A"}
            </p>
          </div>

        </div>
      </section>

      {/* ================================
          RECOMMENDED CAREERS
      ================================= */}
      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold text-white">
            Recommended Careers
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Careers generated from your profile,
            behavioral analysis, and KNN model.
          </p>

        </div>

        {recommendations.length === 0 ? (

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

            <p className="text-slate-400">
              No career recommendations available.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {recommendations.map(
              (recommendation, index) => {

                const careerName =
                  recommendation.careerName ||
                  "Unknown Career";

                const finalScore =
                  Number(
                    recommendation.scores
                      ?.finalScore
                  ) || 0;

                const skillMatch =
                  Number(
                    recommendation.scores
                      ?.skillMatch
                  ) || 0;

                const interestMatch =
                  Number(
                    recommendation.scores
                      ?.interestMatch
                  ) || 0;

                const behavioralMatch =
                  Number(
                    recommendation.scores
                      ?.behavioralMatch
                  ) || 0;

                const mlScore =
                  Number(
                    recommendation.scores
                      ?.mlScore
                  ) || 0;

                const matchedSkills =
                  recommendation.matchedSkills ||
                  [];

                const missingSkills =
                  recommendation.missingSkills ||
                  [];

                return (

                  <div
                    key={
                      recommendation.careerId ||
                      index
                    }
                    className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40"
                  >

                    {/* Rank + Career */}
                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <span className="text-xs uppercase tracking-wide text-blue-400">
                          Recommendation{" "}
                          {recommendation.recommendationRank ||
                            index + 1}
                        </span>

                        <h3 className="mt-2 text-xl font-bold text-white">
                          {careerName}
                        </h3>

                        {recommendation.category && (
                          <p className="mt-1 text-sm text-slate-500">
                            {recommendation.category}
                          </p>
                        )}

                      </div>

                      {/* Score */}
                      <div className="text-right">

                        <p className="text-xs text-slate-500">
                          Match
                        </p>

                        <p className="text-2xl font-bold text-blue-400">
                          {finalScore}%
                        </p>

                      </div>

                    </div>

                    {/* Score Bar */}
                    <div className="mt-5">

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                finalScore,
                                0
                              ),
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* Description */}
                    {recommendation.description && (

                      <p className="mt-5 text-sm leading-6 text-slate-400">
                        {recommendation.description}
                      </p>

                    )}

                    {/* Score Breakdown */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-lg bg-slate-950 p-3">
                        <p className="text-xs text-slate-500">
                          Skill Match
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {skillMatch}%
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-950 p-3">
                        <p className="text-xs text-slate-500">
                          Interest Match
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {interestMatch}%
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-950 p-3">
                        <p className="text-xs text-slate-500">
                          Behavioral Match
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {behavioralMatch}%
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-950 p-3">
                        <p className="text-xs text-slate-500">
                          ML Score
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {mlScore}%
                        </p>
                      </div>

                    </div>

                    {/* Matched Skills */}
                    {matchedSkills.length > 0 && (

                      <div className="mt-5">

                        <p className="text-sm font-medium text-slate-300">
                          Matched Skills
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          {matchedSkills.map(
                            (skill) => (

                              <span
                                key={skill}
                                className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400"
                              >
                                ✓ {skill}
                              </span>

                            )
                          )}

                        </div>

                      </div>
                    )}

                    {/* Missing Skills */}
                    {missingSkills.length > 0 && (

                      <div className="mt-5">

                        <p className="text-sm font-medium text-slate-300">
                          Skills to Improve
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          {missingSkills.map(
                            (skill) => (

                              <span
                                key={skill}
                                className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-400"
                              >
                                + {skill}
                              </span>

                            )
                          )}

                        </div>

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default CareerAnalysis;