import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Code2,
  Layers3,
  Loader2,
  RefreshCw,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

import roadmapService from "../../services/roadmapService";
import progressService from "../../services/progressService";

function Roadmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingSkill, setSavingSkill] = useState("");
  const [expandedSteps, setExpandedSteps] = useState({});
  const [topicSelections, setTopicSelections] =
    useState({});

  /*
  ============================================================
  STEP REFS
  Used for smooth scrolling when Continue is clicked.
  ============================================================
  */

  const stepRefs = useRef([]);

  /*
  ============================================================
  LOAD ROADMAP
  ============================================================
  */

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await roadmapService.getRoadmap();

      if (!response?.success) {
        setError(
          response?.message ||
            "Failed to load your personalized roadmap."
        );

        return;
      }

      const roadmapData =
        response?.roadmap || null;

      setData(roadmapData);

      const steps = Array.isArray(
        roadmapData?.roadmap
      )
        ? roadmapData.roadmap
        : [];

      /*
      ----------------------------------------------------------
      RESTORE SAVED TOPIC PROGRESS
      ----------------------------------------------------------
      */

      const restoredSelections = {};

      steps.forEach((step, stepIndex) => {
        const topics = Array.isArray(
          step?.topics
        )
          ? step.topics
          : [];

        const savedTopics = Array.isArray(
          step?.topicProgress
        )
          ? step.topicProgress
          : [];

        const savedMap = {};

        savedTopics.forEach((item) => {
          if (item?.topic) {
            savedMap[
              normalizeTopic(item.topic)
            ] = Boolean(item.completed);
          }
        });

        restoredSelections[stepIndex] = {};

        topics.forEach((topic) => {
          const key =
            normalizeTopic(topic);

          restoredSelections[stepIndex][
            topic
          ] = savedMap[key] === true;
        });
      });

      setTopicSelections(
        restoredSelections
      );

      /*
      ----------------------------------------------------------
      OPEN FIRST INCOMPLETE STEP
      ----------------------------------------------------------
      */

      const firstIncompleteIndex =
        steps.findIndex((step, index) => {
          const progress =
            getLearningProgress(
              step,
              restoredSelections[index]
            );

          return progress < 100;
        });

      const defaultIndex =
        firstIncompleteIndex >= 0
          ? firstIncompleteIndex
          : steps.length > 0
            ? 0
            : -1;

      setExpandedSteps(
        defaultIndex >= 0
          ? {
              [defaultIndex]: true,
            }
          : {}
      );
    } catch (err) {
      console.error(
        "Roadmap error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load personalized roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  TOGGLE STEP
  ============================================================
  */

  const toggleStep = (index) => {
    setExpandedSteps((current) => ({
      ...current,
      [index]: !current[index],
    }));
  };

  /*
  ============================================================
  TOGGLE TOPIC
  ============================================================
  */

  const toggleTopic = (
    stepIndex,
    topic
  ) => {
    setTopicSelections((current) => ({
      ...current,

      [stepIndex]: {
        ...(current[stepIndex] || {}),

        [topic]:
          !current?.[stepIndex]?.[topic],
      },
    }));
  };

  /*
  ============================================================
  CONTINUE BUTTON
  ============================================================
  */

  const handleContinue = () => {
    if (nextStepIndex < 0) {
      return;
    }

    /*
    Open the next incomplete step.
    */

    setExpandedSteps((current) => ({
      ...current,
      [nextStepIndex]: true,
    }));

    /*
    Scroll after React has updated
    the expanded state.
    */

    setTimeout(() => {
      stepRefs.current[
        nextStepIndex
      ]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  };

  /*
  ============================================================
  SAVE ROADMAP PROGRESS
  ============================================================
  */

  const saveProgress = async (
    step,
    index
  ) => {
    try {
      const topics = Array.isArray(
        step?.topics
      )
        ? step.topics
        : [];

      const selections =
        topicSelections[index] || {};

      const completedTopics =
        topics.filter(
          (topic) =>
            Boolean(
              selections[topic]
            )
        ).length;

      const progress =
        topics.length === 0
          ? 0
          : Math.round(
              (completedTopics /
                topics.length) *
                100
            );

      setSavingSkill(
        getSkillKey(step, index)
      );

      const career =
        data?.career || "Career";

      const courseId = `roadmap-${slugify(
        career
      )}-${slugify(
        step?.skill ||
          `skill-${index}`
      )}`;

      const topicProgress =
        topics.map((topic) => ({
          topic,
          completed:
            Boolean(
              selections[topic]
            ),
        }));

      const response =
        await progressService.updateProgress(
          {
            career,
            skill:
              step?.skill ||
              `Skill ${index + 1}`,
            courseId,
            progress,
            source: "roadmap",
            topicProgress,
          }
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to save progress."
        );
      }

      /*
      ----------------------------------------------------------
      UPDATE LOCAL DATA
      ----------------------------------------------------------
      */

      setData((current) => {
        if (!current) {
          return current;
        }

        const updatedRoadmap =
          Array.isArray(
            current.roadmap
          )
            ? [...current.roadmap]
            : [];

        updatedRoadmap[index] = {
          ...updatedRoadmap[index],

          progress,

          status:
            progress === 100
              ? "completed"
              : progress > 0
                ? "in-progress"
                : "not-started",

          topicProgress,
        };

        const totalSteps =
          updatedRoadmap.length;

        const completedSteps =
          updatedRoadmap.filter(
            (item) =>
              Number(
                item?.progress || 0
              ) === 100
          ).length;

        const remainingSteps =
          Math.max(
            totalSteps -
              completedSteps,
            0
          );

        const overallProgress =
          totalSteps === 0
            ? 0
            : Math.round(
                updatedRoadmap.reduce(
                  (sum, item) =>
                    sum +
                    Number(
                      item?.progress ||
                        0
                    ),
                  0
                ) / totalSteps
              );

        return {
          ...current,

          roadmap:
            updatedRoadmap,

          totalSteps,

          completedSteps,

          remainingSteps,

          overallProgress,
        };
      });

      /*
      ----------------------------------------------------------
      OPTIONAL: CLEAR ERROR AFTER SUCCESS
      ----------------------------------------------------------
      */

      setError("");
    } catch (err) {
      console.error(
        "Save roadmap progress error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to save learning progress."
      );
    } finally {
      setSavingSkill("");
    }
  };

  /*
  ============================================================
  ROADMAP
  ============================================================
  */

  const roadmap = useMemo(() => {
    return Array.isArray(data?.roadmap)
      ? data.roadmap
      : [];
  }, [data]);

  /*
  ============================================================
  LIVE ROADMAP PROGRESS
  ============================================================
  */

  const roadmapWithProgress =
    useMemo(() => {
      return roadmap.map(
        (step, index) => {
          const progress =
            getLearningProgress(
              step,
              topicSelections[index]
            );

          return {
            ...step,
            learningProgress:
              progress,
          };
        }
      );
    }, [
      roadmap,
      topicSelections,
    ]);

  /*
  ============================================================
  OVERALL PROGRESS
  ============================================================
  */

  const overallProgress =
    roadmapWithProgress.length === 0
      ? 0
      : Math.round(
          roadmapWithProgress.reduce(
            (sum, item) =>
              sum +
              Number(
                item.learningProgress ||
                  0
              ),
            0
          ) /
            roadmapWithProgress.length
        );

  const totalSteps =
    roadmapWithProgress.length;

  const completedSteps =
    roadmapWithProgress.filter(
      (item) =>
        item.learningProgress === 100
    ).length;

  const remainingSteps =
    Math.max(
      totalSteps -
        completedSteps,
      0
    );

  /*
  ============================================================
  NEXT LEARNING STEP
  ============================================================
  */

  const nextStepIndex =
    roadmapWithProgress.findIndex(
      (item) =>
        item.learningProgress < 100
    );

  const nextStep =
    nextStepIndex >= 0
      ? roadmapWithProgress[
          nextStepIndex
        ]
      : null;

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
        onRetry={loadRoadmap}
      />
    );
  }

  /*
  ============================================================
  EMPTY
  ============================================================
  */

  if (!data) {
    return (
      <EmptyRoadmapState
        onRefresh={loadRoadmap}
      />
    );
  }

  /*
  ============================================================
  MAIN UI
  ============================================================
  */

  return (
    <div className="w-full pb-12 text-white">
      {/* ====================================================
          HEADER
      ===================================================== */}

      <section className="relative mb-6 overflow-hidden rounded-[24px] border border-slate-800 bg-[#0b1328] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400">
              <Sparkles size={13} />

              Personalized Learning Path
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-[36px]">
              Your Learning Roadmap
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-[15px]">
              Follow your personalized
              learning path, complete each
              topic, and track your progress
              toward your target career.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRoadmap}
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
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <span className="mt-0.5 font-bold">
            !
          </span>

          <p>{error}</p>
        </div>
      )}

      {/* ====================================================
          CAREER CARD
      ===================================================== */}

      <section className="mb-6 rounded-[24px] border border-slate-800 bg-[#0b1328] p-5 shadow-lg sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Target size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Target Career
            </p>

            <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              {data.career ||
                "Career Goal"}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Build the required skills step
              by step and track your learning
              progress.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold text-blue-400">
                {totalSteps} Learning Steps
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] font-semibold text-slate-400">
                Personalized
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] font-semibold text-slate-400">
                Topic Based
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          OVERALL PROGRESS
      ===================================================== */}

      <section className="mb-6 rounded-[24px] border border-slate-800 bg-[#0b1328] p-5 shadow-lg sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Overall Progress
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Roadmap completion
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {completedSteps} of{" "}
              {totalSteps} learning steps
              completed
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ProgressRing
              progress={
                overallProgress
              }
            />

            <div className="text-right">
              <p className="text-3xl font-black text-white">
                {overallProgress}%
              </p>

              <p className="text-xs text-slate-500">
                overall
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-900">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{
              width: `${overallProgress}%`,
            }}
          />
        </div>
      </section>

      {/* ====================================================
          STAT CARDS
      ===================================================== */}

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Total Steps"
          value={totalSteps}
          icon={
            <Layers3 size={17} />
          }
          description="Learning skills"
        />

        <StatCard
          label="Completed"
          value={completedSteps}
          icon={
            <CheckCircle2 size={17} />
          }
          description="Fully learned"
          success
        />

        <StatCard
          label="Remaining"
          value={remainingSteps}
          icon={
            <Route size={17} />
          }
          description="Steps to continue"
        />
      </section>

      {/* ====================================================
          NEXT STEP
      ===================================================== */}

      {nextStep && (
        <section className="mb-7 overflow-hidden rounded-[22px] border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-[#0b1328] to-[#0b1328]">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ArrowRight size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
                  Next Learning Step
                </p>

                <h3 className="mt-1 truncate text-lg font-black text-white">
                  {nextStep.skill}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Phase{" "}
                  {nextStep.phase ||
                    nextStepIndex + 1}{" "}
                  •{" "}
                  {nextStep.duration ||
                    "Flexible duration"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 active:scale-[0.98]"
            >
              Continue

              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* ====================================================
          ALL COMPLETE
      ===================================================== */}

      {!nextStep &&
        totalSteps > 0 && (
          <section className="mb-7 rounded-[22px] border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2
                  size={21}
                />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Roadmap Completed
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  You have completed every
                  learning step in this roadmap.
                </p>
              </div>
            </div>
          </section>
        )}

      {/* ====================================================
          LEARNING JOURNEY
      ===================================================== */}

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Route
                size={18}
                className="text-blue-400"
              />

              <h2 className="text-xl font-black text-white sm:text-2xl">
                Learning Journey
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-slate-500">
              Complete each topic and save
              your progress.
            </p>
          </div>

          <span className="shrink-0 text-xs font-medium text-slate-600">
            {totalSteps}{" "}
            {totalSteps === 1
              ? "step"
              : "steps"}
          </span>
        </div>

        <div className="relative">
          {/* Desktop timeline */}

          <div className="absolute bottom-8 left-[24px] top-8 hidden w-px bg-gradient-to-b from-blue-500/50 via-slate-700 to-slate-800 md:block" />

          <div className="space-y-4">
            {roadmapWithProgress.map(
              (item, index) => (
                <RoadmapStep
                  key={`${item?.skill || "step"}-${index}`}
                  stepRef={(element) => {
                    stepRefs.current[
                      index
                    ] = element;
                  }}
                  item={item}
                  index={index}
                  progress={
                    item.learningProgress
                  }
                  topics={
                    Array.isArray(
                      item?.topics
                    )
                      ? item.topics
                      : []
                  }
                  prerequisites={
                    Array.isArray(
                      item?.prerequisites
                    )
                      ? item.prerequisites
                      : []
                  }
                  selections={
                    topicSelections[
                      index
                    ] || {}
                  }
                  expanded={Boolean(
                    expandedSteps[
                      index
                    ]
                  )}
                  saving={
                    savingSkill ===
                    getSkillKey(
                      item,
                      index
                    )
                  }
                  onToggle={() =>
                    toggleStep(
                      index
                    )
                  }
                  onToggleTopic={(
                    topic
                  ) =>
                    toggleTopic(
                      index,
                      topic
                    )
                  }
                  onSave={() =>
                    saveProgress(
                      item,
                      index
                    )
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* ====================================================
          FOOTER
      ===================================================== */}

      {roadmap.length > 0 && (
        <section className="relative mt-6 overflow-hidden rounded-[24px] border border-blue-500/20 bg-[#0b1328] p-5 shadow-lg sm:p-6">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Sparkles size={20} />
            </div>

            <div>
              <h3 className="font-bold text-white">
                Keep Building Your Skills
              </h3>

              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
                Complete the topics in each
                roadmap step and save your
                progress regularly. Your
                learning history is stored with
                your account.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/*
============================================================
ROADMAP STEP
============================================================
*/

function RoadmapStep({
  stepRef,
  item,
  index,
  progress,
  topics,
  prerequisites,
  selections,
  expanded,
  saving,
  onToggle,
  onToggleTopic,
  onSave,
}) {
  const completedTopics =
    topics.filter(
      (topic) =>
        selections[topic]
    ).length;

  const isFullyLearned =
    progress === 100;

  /*
  Skill matching and actual learning
  progress are intentionally separate.
  */

  const skillMatched =
    item?.status === "completed" &&
    progress < 100;

  const status = isFullyLearned
    ? "Completed"
    : progress > 0
      ? "In Progress"
      : skillMatched
        ? "Skill Matched"
        : "Not Started";

  return (
    <article
      ref={stepRef}
      className={`relative scroll-mt-24 rounded-[22px] border bg-[#0b1328] shadow-lg transition-all duration-300 ${
        isFullyLearned
          ? "border-emerald-500/20"
          : progress > 0
            ? "border-blue-500/20"
            : "border-slate-800 hover:border-blue-500/20"
      }`}
    >
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex gap-3 sm:gap-5">
          {/* ==================================================
              TIMELINE NODE
          =================================================== */}

          <div className="relative z-10 hidden shrink-0 md:block">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-lg ${
                isFullyLearned
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : progress > 0
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-slate-700 bg-[#0b1328] text-slate-500"
              }`}
            >
              {isFullyLearned ? (
                <Check
                  size={20}
                  strokeWidth={3}
                />
              ) : (
                <span className="text-sm font-black">
                  {index + 1}
                </span>
              )}
            </div>
          </div>

          {/* ==================================================
              CONTENT
          =================================================== */}

          <div className="min-w-0 flex-1">
            {/* HEADER */}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-[11px] font-black text-blue-400 md:hidden">
                    {index + 1}
                  </span>

                  <h3 className="text-lg font-black text-white">
                    {item?.skill ||
                      `Step ${index + 1}`}
                  </h3>

                  <StatusBadge
                    status={status}
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-500">
                  Phase{" "}
                  {item?.phase ||
                    index + 1}{" "}
                  •{" "}
                  {item?.duration ||
                    "Flexible duration"}{" "}
                  •{" "}
                  {item?.level ||
                    "Intermediate"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                  {topics.length}{" "}
                  {topics.length === 1
                    ? "topic"
                    : "topics"}
                </span>

                <button
                  type="button"
                  onClick={onToggle}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-blue-500/30 hover:text-white"
                >
                  {expanded
                    ? "Hide"
                    : "Details"}

                  {expanded ? (
                    <ChevronUp
                      size={14}
                    />
                  ) : (
                    <ChevronDown
                      size={14}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* ==================================================
                PROGRESS
            =================================================== */}

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    Learning Progress
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {completedTopics} of{" "}
                    {topics.length}{" "}
                    topics completed
                  </p>
                </div>

                <span
                  className={`text-sm font-black ${
                    progress === 100
                      ? "text-emerald-400"
                      : "text-blue-400"
                  }`}
                >
                  {progress}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
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

            {/* ==================================================
                EXPANDED DETAILS
            =================================================== */}

            {expanded && (
              <div className="mt-4 space-y-4">
                {/* PREREQUISITES */}

                {prerequisites.length >
                  0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex items-center gap-2">
                      <Layers3
                        size={15}
                        className="text-purple-400"
                      />

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Prerequisites
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {prerequisites.map(
                        (prerequisite) => (
                          <span
                            key={
                              prerequisite
                            }
                            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400"
                          >
                            {prerequisite}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* LEARNING DETAILS */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock3
                        size={14}
                      />

                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Duration
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-white">
                      {item?.duration ||
                        "Flexible"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Code2
                        size={14}
                      />

                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Level
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-white">
                      {item?.level ||
                        "Intermediate"}
                    </p>
                  </div>
                </div>

                {/* TOPICS */}

                {topics.length >
                  0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen
                          size={15}
                          className="text-blue-400"
                        />

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Topics to Learn
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-600">
                        {completedTopics}/
                        {topics.length}{" "}
                        completed
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {topics.map(
                        (topic) => {
                          const checked =
                            Boolean(
                              selections[
                                topic
                              ]
                            );

                          return (
                            <button
                              type="button"
                              key={topic}
                              onClick={() =>
                                onToggleTopic(
                                  topic
                                )
                              }
                              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                                checked
                                  ? "border-emerald-500/20 bg-emerald-500/5"
                                  : "border-slate-800 bg-slate-950 hover:border-blue-500/20 hover:bg-blue-500/5"
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                                  checked
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-slate-700 bg-slate-900 text-transparent"
                                }`}
                              >
                                <Check
                                  size={12}
                                  strokeWidth={
                                    3
                                  }
                                />
                              </span>

                              <span
                                className={`text-xs leading-5 ${
                                  checked
                                    ? "text-emerald-300"
                                    : "text-slate-400"
                                }`}
                              >
                                {topic}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* SAVE */}

                    <button
                      type="button"
                      onClick={onSave}
                      disabled={saving}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />

                          Saving Progress...
                        </>
                      ) : (
                        <>
                          <CheckCircle2
                            size={16}
                          />

                          Save Progress
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* MATCHED SKILL */}

                {skillMatched && (
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />

                      <div>
                        <p className="text-sm font-semibold text-emerald-300">
                          Skill already matched
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          This skill is already
                          present in your profile.
                          Complete the roadmap
                          topics if you want to
                          track your learning
                          progress separately.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                COLLAPSED FOOTER
            =================================================== */}

            {!expanded && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  {isFullyLearned ? (
                    <>
                      <CheckCircle2
                        size={13}
                        className="text-emerald-400"
                      />

                      <span className="text-emerald-400">
                        Learning completed
                      </span>
                    </>
                  ) : skillMatched ? (
                    <>
                      <CheckCircle2
                        size={13}
                        className="text-emerald-400"
                      />

                      <span>
                        Skill matched in profile
                      </span>
                    </>
                  ) : progress > 0 ? (
                    <>
                      <BookOpen
                        size={13}
                        className="text-blue-400"
                      />

                      <span>
                        Continue learning
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowRight
                        size={13}
                      />

                      <span>
                        Ready to start
                      </span>
                    </>
                  )}
                </div>

                <span className="text-[10px] font-medium text-slate-700">
                  Step {index + 1}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
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
  const styles = {
    Completed:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    "In Progress":
      "border-blue-500/20 bg-blue-500/10 text-blue-400",

    "Skill Matched":
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    "Not Started":
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 text-[9px] font-bold ${
        styles[status] ||
        styles["Not Started"]
      }`}
    >
      {status}
    </span>
  );
}

/*
============================================================
STAT CARD
============================================================
*/

function StatCard({
  label,
  value,
  icon,
  description,
  success = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b1328] p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3">
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
    <div className="relative h-14 w-14">
      <svg
        className="h-14 w-14 -rotate-90"
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
          Loading your roadmap
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Preparing your personalized
          learning path...
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
        Unable to load roadmap
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
EMPTY STATE
============================================================
*/

function EmptyRoadmapState({
  onRefresh,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b1328] p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        <Route size={22} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-white">
        No roadmap available
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Complete your profile and select
        a target career to generate your
        personalized roadmap.
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
      >
        <RefreshCw size={15} />

        Refresh Roadmap
      </button>
    </div>
  );
}

/*
============================================================
CALCULATE LEARNING PROGRESS
============================================================
*/

function getLearningProgress(
  step,
  selections = {}
) {
  const topics = Array.isArray(
    step?.topics
  )
    ? step.topics
    : [];

  /*
  If there are no topics, use the
  backend progress.
  */

  if (topics.length === 0) {
    return clampProgress(
      step?.progress
    );
  }

  const completed =
    topics.filter(
      (topic) =>
        Boolean(
          selections?.[topic]
        )
    ).length;

  return Math.round(
    (completed /
      topics.length) *
      100
  );
}

/*
============================================================
SKILL KEY
============================================================
*/

function getSkillKey(
  step,
  index
) {
  return `${step?.skill || "skill"}-${index}`;
}

/*
============================================================
SLUGIFY
============================================================
*/

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      "");
}

/*
============================================================
NORMALIZE TOPIC
============================================================
*/

function normalizeTopic(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/*
============================================================
CLAMP PROGRESS
============================================================
*/

function clampProgress(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(
    Math.max(number, 0),
    100
  );
}

export default Roadmap;