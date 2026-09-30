import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

import api from "../../services/api";

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [skillGap, setSkillGap] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [progress, setProgress] = useState(null);

  const [error, setError] = useState("");

  // ============================================================
  // WELCOME POPUP
  // ============================================================

  const [showWelcome, setShowWelcome] = useState(false);

  // ============================================================
  // USER
  // ============================================================

  const storedUser = JSON.parse(
    localStorage.getItem("career_guidance_user") || "null"
  );

  const displayName =
    storedUser?.name?.split(" ")[0] ||
    storedUser?.username ||
    "Prajwal";

  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const startDashboard = async () => {
      await loadDashboard();

      if (!mounted) {
        return;
      }

      /*
        Show welcome only once during the current login session.

        This means:
        Login
          ↓
        Dashboard
          ↓
        Welcome popup

        If the user goes to another page and comes back
        during the same login session, the popup will not
        appear again.
      */

      const welcomeShown =
        sessionStorage.getItem(
          "career_guidance_dashboard_welcome_shown"
        );

      if (!welcomeShown) {
        sessionStorage.setItem(
          "career_guidance_dashboard_welcome_shown",
          "true"
        );

        setShowWelcome(true);

        const timer = setTimeout(() => {
          if (mounted) {
            setShowWelcome(false);
          }
        }, 4000);

        return () => {
          clearTimeout(timer);
        };
      }
    };

    startDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        api.get("/skill-gap"),
        api.get("/careers/recommendations"),
        api.get("/progress"),
      ]);

      const skillGapResponse = results[0];
      const recommendationResponse = results[1];
      const progressResponse = results[2];

      // ----------------------------------------------------------
      // SKILL GAP
      // ----------------------------------------------------------

      if (skillGapResponse.status === "fulfilled") {
        const data = skillGapResponse.value.data;

        setSkillGap(
          data?.skillGap ||
            data?.data?.skillGap ||
            data?.data ||
            null
        );
      }

      // ----------------------------------------------------------
      // CAREER RECOMMENDATIONS
      // ----------------------------------------------------------

      if (recommendationResponse.status === "fulfilled") {
        const data = recommendationResponse.value.data;

        setRecommendations(
          data?.recommendations ||
            data?.data?.recommendations ||
            []
        );
      }

      // ----------------------------------------------------------
      // PROGRESS
      // ----------------------------------------------------------

      if (progressResponse.status === "fulfilled") {
        const data = progressResponse.value.data;

        setProgress(
          data?.summary
            ? data
            : data?.data || null
        );
      }

      // ----------------------------------------------------------
      // CHECK IF ALL REQUESTS FAILED
      // ----------------------------------------------------------

      const allFailed = results.every(
        (result) => result.status === "rejected"
      );

      if (allFailed) {
        setError(
          "Unable to load dashboard data. Please try again."
        );
      }
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DASHBOARD CALCULATIONS
  // ============================================================

  const readiness = Number(
    skillGap?.readiness || 0
  );

  const matchedSkills = Number(
    skillGap?.matchedCount ??
      skillGap?.matchedSkills?.length ??
      0
  );

  const missingSkills = Number(
    skillGap?.missingCount ??
      skillGap?.missingSkills?.length ??
      0
  );

  const targetCareer =
    skillGap?.career ||
    storedUser?.preferredCareer ||
    "Full Stack Developer";

  const progressSummary = progress?.summary || {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    overallProgress: 0,
  };

  const overallProgress = Number(
    progressSummary.overallProgress || 0
  );

  const totalCourses = Number(
    progressSummary.totalCourses || 0
  );

  const completedCourses = Number(
    progressSummary.completedCourses || 0
  );

  const remainingCourses = Math.max(
    0,
    totalCourses - completedCourses
  );

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-md text-center">

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

            <div className="absolute inset-0 animate-ping rounded-2xl bg-blue-500/10" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/20 bg-[#0f172a] shadow-2xl shadow-blue-900/20">
              <Sparkles
                size={32}
                className="text-blue-400"
              />
            </div>

          </div>

          <h2 className="mt-7 text-2xl font-bold text-white">
            Preparing Your Dashboard
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            We are loading your career insights,
            skill analysis and learning progress.
          </p>

          <div className="mx-auto mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-1/2 animate-[loadingBar_1.4s_ease-in-out_infinite] rounded-full bg-blue-500" />
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span>Analyzing your career journey...</span>
          </div>

        </div>

        <style>
          {`
            @keyframes loadingBar {
              0% {
                transform: translateX(-120%);
              }

              50% {
                transform: translateX(100%);
              }

              100% {
                transform: translateX(250%);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="relative min-h-screen bg-[#020617] text-white">

      {/* ======================================================
          WELCOME POPUP
      ======================================================= */}

      {showWelcome && (
        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-sm animate-[welcomeIn_0.4s_ease-out]">

          <div className="overflow-hidden rounded-2xl border border-blue-500/30 bg-[#0f172a]/95 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">

            <div className="flex items-start gap-3 p-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Sparkles size={21} />
              </div>

              <div className="min-w-0 flex-1">

                <p className="font-semibold text-white">
                  Welcome Back, {displayName}! 👋
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-400">
                  Your personalized career dashboard
                  is ready.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowWelcome(false)}
                aria-label="Close welcome message"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={17} />
              </button>

            </div>

            <div className="h-1 bg-slate-800">
              <div className="h-full animate-[welcomeProgress_4s_linear_forwards] bg-blue-500" />
            </div>

          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-8">

        {/* ====================================================
            HEADER
        ===================================================== */}

        <div>

          <p className="text-sm font-semibold text-blue-400">
            Student Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Welcome, {displayName} 👋
          </h1>

          <p className="mt-2 text-slate-400">
            Here's an overview of your current career journey.
          </p>

        </div>

        {/* ====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">

            <span>{error}</span>

            <button
              type="button"
              onClick={loadDashboard}
              className="shrink-0 rounded-lg bg-red-500/10 px-3 py-2 font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              Retry
            </button>

          </div>
        )}

        {/* ====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="grid gap-5 sm:grid-cols-2">

          {/* CAREER READINESS */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-blue-500/30">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Career Readiness
                </p>

                <p className="mt-3 text-3xl font-bold text-blue-400">
                  {readiness}%
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <TrendingUp size={21} />
              </div>

            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, readiness)
                  )}%`,
                }}
              />

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Based on required career skills
            </p>

          </div>

          {/* MATCHED SKILLS */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-green-500/30">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Matched Skills
                </p>

                <p className="mt-3 text-3xl font-bold text-green-400">
                  {matchedSkills}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <CheckCircle2 size={21} />
              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Skills currently matched
            </p>

          </div>

          {/* MISSING SKILLS */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-orange-500/30">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Missing Skills
                </p>

                <p className="mt-3 text-3xl font-bold text-orange-400">
                  {missingSkills}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Target size={21} />
              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Skills to improve
            </p>

          </div>

          {/* TARGET CAREER */}

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-purple-500/30">

            <div className="flex items-start justify-between">

              <div className="min-w-0">

                <p className="text-sm text-slate-400">
                  Target Career
                </p>

                <h2 className="mt-3 truncate text-xl font-bold text-white">
                  {targetCareer}
                </h2>

              </div>

              <div className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <BriefcaseBusiness size={21} />
              </div>

            </div>

            <p className="mt-3 text-sm text-slate-500">
              Your current career target
            </p>

          </div>

        </div>

        {/* ====================================================
            LEARNING PROGRESS
        ===================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>

              <div className="flex items-center gap-2">

                <BookOpen
                  size={20}
                  className="text-blue-400"
                />

                <h2 className="text-xl font-bold text-white">
                  Learning Progress
                </h2>

              </div>

              <p className="mt-2 text-sm text-slate-400">
                Track your progress toward your career goal.
              </p>

            </div>

            <p className="text-3xl font-bold text-blue-400">
              {overallProgress}%
            </p>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, overallProgress)
                )}%`,
              }}
            />

          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">

            <span className="text-slate-400">
              Total courses:{" "}
              <span className="font-semibold text-white">
                {totalCourses}
              </span>
            </span>

            <span className="text-slate-400">
              Completed:{" "}
              <span className="font-semibold text-green-400">
                {completedCourses}
              </span>
            </span>

            <span className="text-slate-400">
              Remaining:{" "}
              <span className="font-semibold text-orange-400">
                {remainingCourses}
              </span>
            </span>

          </div>

        </div>

        {/* ====================================================
            CAREER RECOMMENDATIONS
        ===================================================== */}

        <section>

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-white">
              Career Recommendations
            </h2>

            <p className="mt-2 text-slate-400">
              Recommendations generated from your profile
              and behavioral assessment.
            </p>

          </div>

          {recommendations.length > 0 ? (

            <div className="grid gap-5 md:grid-cols-2">

              {recommendations
                .slice(0, 4)
                .map((recommendation, index) => {

                  const careerName =
                    recommendation.careerName ||
                    recommendation.career ||
                    "Career";

                  const score = Number(
                    recommendation?.scores?.finalScore ??
                      recommendation?.score ??
                      0
                  );

                  const description =
                    recommendation.description ||
                    "Career recommendation based on your profile and behavioral analysis.";

                  return (
                    <div
                      key={
                        recommendation.careerId ||
                        recommendation._id ||
                        index
                      }
                      className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-blue-500/40"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                            Recommendation {index + 1}
                          </p>

                          <h3 className="mt-3 text-xl font-bold text-white">
                            {careerName}
                          </h3>

                        </div>

                        <Award
                          size={22}
                          className="shrink-0 text-blue-400"
                        />

                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                        {description}
                      </p>

                      <div className="mt-5">

                        <div className="flex items-center justify-between text-sm">

                          <span className="text-slate-400">
                            Match Score
                          </span>

                          <span className="font-bold text-blue-400">
                            {Math.round(score)}%
                          </span>

                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-700"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, score)
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                      <div className="mt-5">

                        <Link
                          to="/career-analysis"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                        >
                          View Analysis
                          <ArrowRight size={16} />
                        </Link>

                      </div>

                    </div>
                  );
                })}

            </div>

          ) : (

            <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-8 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <BriefcaseBusiness size={23} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                No recommendations available
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Complete your profile and behavioral
                assessment to generate career recommendations.
              </p>

              <Link
                to="/assessment"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <ClipboardCheck size={17} />
                Take Assessment
              </Link>

            </div>

          )}

        </section>

        {/* ====================================================
            CONTINUE YOUR JOURNEY
        ===================================================== */}

        <section>

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-white">
              Continue Your Journey
            </h2>

            <p className="mt-2 text-slate-400">
              Explore your personalized career tools.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* CAREER ANALYSIS */}

            <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-blue-500/40">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <BarChart3 size={21} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Career Analysis
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                View your ML-based career recommendations
                and behavioral analysis.
              </p>

              <Link
                to="/career-analysis"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View Analysis
                <ArrowRight size={16} />
              </Link>

            </div>

            {/* SKILL GAP */}

            <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-blue-500/40">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Target size={21} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Skill Gap
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                See your matched and missing skills for
                the target career.
              </p>

              <Link
                to="/skill-gap"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View Skill Gap
                <ArrowRight size={16} />
              </Link>

            </div>

            {/* ROADMAP */}

            <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-blue-500/40">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <TrendingUp size={21} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Learning Roadmap
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Follow the personalized learning path
                generated for you.
              </p>

              <Link
                to="/roadmap"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View Roadmap
                <ArrowRight size={16} />
              </Link>

            </div>

            {/* PROGRESS */}

            <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-blue-500/40">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <BarChart3 size={21} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Learning Progress
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Track your courses and learning progress.
              </p>

              <Link
                to="/progress"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View Progress
                <ArrowRight size={16} />
              </Link>

            </div>

            {/* COURSES */}

            <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-blue-500/40">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <BookOpen size={21} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Personalized Courses
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Learn the skills required for your target
                career through your personalized course path.
              </p>

              <Link
                to="/courses"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View Courses
                <ArrowRight size={16} />
              </Link>

            </div>

            {/* ASSESSMENT */}

            <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 transition hover:border-blue-500/40">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                <ClipboardCheck size={21} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Behavioral Assessment
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Complete or retake your behavioral
                assessment to improve career analysis.
              </p>

              <Link
                to="/assessment"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                Take Assessment
                <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </section>

        {/* ====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

          <h2 className="text-xl font-bold text-white">
            Build Your Career
          </h2>

          <p className="mt-2 text-slate-400">
            Keep improving your skills and follow your
            personalized learning path.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <Link
              to="/skill-gap"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Target size={17} />
              Check Skill Gap
            </Link>

            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <TrendingUp size={17} />
              Open Roadmap
            </Link>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <BookOpen size={17} />
              Browse Courses
            </Link>

          </div>

        </section>

      </div>

      {/* ======================================================
          ANIMATIONS
      ======================================================= */}

      <style>
        {`
          @keyframes welcomeIn {
            from {
              opacity: 0;
              transform: translateY(-18px) scale(0.96);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes welcomeProgress {
            from {
              width: 100%;
            }

            to {
              width: 0%;
            }
          }
        `}
      </style>

    </div>
  );
}

export default Dashboard;