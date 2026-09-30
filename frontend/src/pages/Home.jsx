import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Compass,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Moon,
  Search,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// ============================================================
// CLOUDINARY SCREENSHOTS
// ============================================================

const SCREENSHOTS = {
  dashboard:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790799723/Screenshot_1-10-2026_14832_localhost_kom6pv.jpg",

  progress:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790799829/Screenshot_1-10-2026_14928_localhost_gj9c63.jpg",

  profile:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790799994/Screenshot_1-10-2026_15013_localhost_mbsemf.jpg",

  feedback:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790800073/Screenshot_1-10-2026_14958_localhost_xhvye4.jpg",

  chatbot:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790800146/Screenshot_1-10-2026_14947_localhost_a1aijb.jpg",

  assessment:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790800240/Screenshot_1-10-2026_14937_localhost_wodkv4.jpg",

  courses:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790800567/Screenshot_1-10-2026_2344_localhost_cf0rng.jpg",

  skillGap:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790800763/Screenshot_1-10-2026_14852_localhost_vwxfcs.jpg",

  careerAnalysis:
    "https://res.cloudinary.com/dqyqrudnv/image/upload/v1790800899/Screenshot_1-10-2026_1492_localhost_id58iq.jpg",
};

// ============================================================
// EXPLORE SYSTEM
// ============================================================

const exploreScreens = [
  {
    id: "dashboard",
    title: "Personalized Dashboard",
    shortTitle: "Dashboard",
    description:
      "Get a clear overview of your career readiness, matched skills, missing skills, career recommendations, and learning progress.",
    image: SCREENSHOTS.dashboard,
    icon: LayoutDashboard,
    color: "blue",
  },

  {
    id: "assessment",
    title: "Behavioral Assessment",
    shortTitle: "Assessment",
    description:
      "Answer behavioral questions that help the system understand your problem solving, adaptability, communication, creativity, teamwork, leadership, and logical thinking.",
    image: SCREENSHOTS.assessment,
    icon: ClipboardCheck,
    color: "cyan",
  },

  {
    id: "career-analysis",
    title: "ML Career Analysis",
    shortTitle: "Career Analysis",
    description:
      "Your profile and behavioral assessment are analyzed to generate career recommendations and show how the recommendation was produced.",
    image: SCREENSHOTS.careerAnalysis,
    icon: Brain,
    color: "purple",
  },

  {
    id: "skill-gap",
    title: "Skill Gap Analysis",
    shortTitle: "Skill Gap",
    description:
      "Compare your current skills with the skills required for your target career and clearly identify the skills you need to improve.",
    image: SCREENSHOTS.skillGap,
    icon: Target,
    color: "orange",
  },

  {
    id: "courses",
    title: "Personalized Courses",
    shortTitle: "Courses",
    description:
      "Explore courses recommended according to your target career, current skills, and learning requirements.",
    image: SCREENSHOTS.courses,
    icon: GraduationCap,
    color: "green",
  },

  {
    id: "progress",
    title: "Learning Progress",
    shortTitle: "Progress",
    description:
      "Track your overall learning progress, completed courses, courses in progress, and individual course progress.",
    image: SCREENSHOTS.progress,
    icon: TrendingUp,
    color: "emerald",
  },

  {
    id: "profile",
    title: "Student Profile",
    shortTitle: "Profile",
    description:
      "Manage your personal information, education, skills, interests, career goal, work preference, bio, and profile image.",
    image: SCREENSHOTS.profile,
    icon: UserRound,
    color: "violet",
  },

  {
    id: "chatbot",
    title: "AI Career Assistant",
    shortTitle: "AI Assistant",
    description:
      "Ask career-related questions and receive personalized guidance about skills, learning plans, projects, internships, and placement preparation.",
    image: SCREENSHOTS.chatbot,
    icon: MessageCircle,
    color: "pink",
  },

  {
    id: "feedback",
    title: "Feedback System",
    shortTitle: "Feedback",
    description:
      "Share your experience with the system and view responses from the administration.",
    image: SCREENSHOTS.feedback,
    icon: Users,
    color: "yellow",
  },
];

// ============================================================
// HOW IT WORKS
// ============================================================

const workflowSteps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Add your education, skills, interests, career goal, work preference, and other profile information.",
    icon: UserRound,
  },

  {
    number: "02",
    title: "Take Behavioral Assessment",
    description:
      "Answer behavioral questions so the system can understand your individual preferences and characteristics.",
    icon: ClipboardCheck,
  },

  {
    number: "03",
    title: "ML Career Recommendation",
    description:
      "The system analyzes your profile and behavioral information to generate suitable career recommendations.",
    icon: Brain,
  },

  {
    number: "04",
    title: "Find Your Skill Gap",
    description:
      "Compare your current skills with the required skills for the recommended career.",
    icon: Target,
  },

  {
    number: "05",
    title: "Learn With Personalized Courses",
    description:
      "Use recommended courses to develop the skills required for your target career.",
    icon: GraduationCap,
  },

  {
    number: "06",
    title: "Track Your Progress",
    description:
      "Monitor your learning progress and use the AI Career Assistant whenever you need guidance.",
    icon: TrendingUp,
  },
];

// ============================================================
// FEATURES
// ============================================================

const features = [
  {
    title: "Behavioral Analysis",
    description:
      "Analyze behavioral characteristics such as problem solving, adaptability, creativity, communication, teamwork, leadership, and logical thinking.",
    icon: Brain,
  },

  {
    title: "Machine Learning",
    description:
      "Use machine learning based career recommendations to identify suitable career paths from profile and behavioral information.",
    icon: Zap,
  },

  {
    title: "Skill Gap Detection",
    description:
      "Clearly identify matched skills and missing skills for your target career.",
    icon: Target,
  },

  {
    title: "Personalized Learning",
    description:
      "Follow personalized learning recommendations based on your target career and current skill requirements.",
    icon: GraduationCap,
  },

  {
    title: "Progress Tracking",
    description:
      "Monitor your completed courses and overall learning progress toward your career goal.",
    icon: TrendingUp,
  },

  {
    title: "AI Career Assistant",
    description:
      "Ask questions about careers, skills, projects, internships, learning plans, and placement preparation.",
    icon: MessageCircle,
  },
];

// ============================================================
// COLORS
// ============================================================

const colorClasses = {
  blue: {
    active:
      "border-blue-500/50 bg-blue-500/10 text-blue-300",
    dot: "bg-blue-400",
  },

  cyan: {
    active:
      "border-cyan-500/50 bg-cyan-500/10 text-cyan-300",
    dot: "bg-cyan-400",
  },

  purple: {
    active:
      "border-purple-500/50 bg-purple-500/10 text-purple-300",
    dot: "bg-purple-400",
  },

  orange: {
    active:
      "border-orange-500/50 bg-orange-500/10 text-orange-300",
    dot: "bg-orange-400",
  },

  green: {
    active:
      "border-green-500/50 bg-green-500/10 text-green-300",
    dot: "bg-green-400",
  },

  emerald: {
    active:
      "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
  },

  violet: {
    active:
      "border-violet-500/50 bg-violet-500/10 text-violet-300",
    dot: "bg-violet-400",
  },

  pink: {
    active:
      "border-pink-500/50 bg-pink-500/10 text-pink-300",
    dot: "bg-pink-400",
  },

  yellow: {
    active:
      "border-yellow-500/50 bg-yellow-500/10 text-yellow-300",
    dot: "bg-yellow-400",
  },
};

// ============================================================
// HOME
// ============================================================

function Home() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const {
  theme,
  toggleTheme,
} = useTheme();

  const [activeScreen, setActiveScreen] =
    useState("dashboard");

  const selectedScreen =
    exploreScreens.find(
      (screen) => screen.id === activeScreen
    ) || exploreScreens[0];

  const SelectedIcon = selectedScreen.icon;

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleDashboard = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/dashboard");
  };

  const handleStartJourney = () => {
    if (isAuthenticated) {
      navigate("/assessment");
      return;
    }

    navigate("/register");
  };

  // ==========================================================
  // SCREEN NAVIGATION
  // ==========================================================

  const showPreviousScreen = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveScreen((currentScreen) => {
      const currentIndex =
        exploreScreens.findIndex(
          (screen) => screen.id === currentScreen
        );

      if (currentIndex <= 0) {
        return exploreScreens[
          exploreScreens.length - 1
        ].id;
      }

      return exploreScreens[currentIndex - 1].id;
    });
  };

  const showNextScreen = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveScreen((currentScreen) => {
      const currentIndex =
        exploreScreens.findIndex(
          (screen) => screen.id === currentScreen
        );

      if (
        currentIndex === -1 ||
        currentIndex >= exploreScreens.length - 1
      ) {
        return exploreScreens[0].id;
      }

      return exploreScreens[currentIndex + 1].id;
    });
  };

  const selectScreen = (event, screenId) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveScreen(screenId);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020617] text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-slate-800/80
          bg-[#020617]/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-full
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              group
              flex
              cursor-pointer
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-lg
                shadow-blue-600/20
                transition
                group-hover:bg-blue-500
              "
            >
              <Compass size={21} />
            </div>

            <div className="text-left">

              <p className="text-sm font-bold text-white sm:text-base">
                Career Guidance
              </p>

              <p className="hidden text-[10px] text-slate-500 sm:block">
                Intelligent Career System
              </p>

            </div>

          </button>

          <nav className="hidden items-center gap-7 lg:flex">

            <a
              href="#how-it-works"
              className="
                cursor-pointer
                text-sm
                text-slate-400
                transition
                hover:text-white
              "
            >
              How It Works
            </a>

            <a
              href="#system"
              className="
                cursor-pointer
                text-sm
                text-slate-400
                transition
                hover:text-white
              "
            >
              Explore System
            </a>

            <a
              href="#features"
              className="
                cursor-pointer
                text-sm
                text-slate-400
                transition
                hover:text-white
              "
            >
              Features
            </a>

          </nav>

          <div className="flex items-center gap-2">

            {!isAuthenticated && (
              <Link
                to="/login"
                className="
                  hidden
                  cursor-pointer
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-300
                  transition
                  hover:bg-slate-900
                  hover:text-white
                  sm:block
                "
              >
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={handleDashboard}
              className="
                inline-flex
                cursor-pointer
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-blue-600/10
                transition
                hover:bg-blue-500
                active:scale-[0.98]
                sm:px-5
              "
            >

              <LayoutDashboard
                size={17}
                className="hidden sm:block"
              />

              {isAuthenticated
                ? "Dashboard"
                : "Get Started"}

            </button>

          </div>

        </div>
      </header>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-[-280px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[130px]" />

          <div className="absolute left-[-180px] top-[35%] h-[450px] w-[450px] rounded-full bg-indigo-600/[0.06] blur-[120px]" />

          <div className="absolute right-[-180px] top-[30%] h-[450px] w-[450px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.8) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

        </div>

        <div
          className="
            relative
            mx-auto
            flex
            min-h-[650px]
            w-full
            max-w-7xl
            items-center
            px-5
            py-20
            sm:px-8
            sm:py-24
            lg:min-h-[720px]
            lg:px-10
          "
        >

          <div className="max-w-4xl">

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-500/20
                bg-blue-500/[0.07]
                px-4
                py-2
                text-xs
                font-semibold
                text-blue-400
                sm:text-sm
              "
            >

              <Sparkles size={15} />

              AI Powered Career Guidance

              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

            </div>

            <h1
              className="
                max-w-4xl
                text-4xl
                font-black
                leading-[1.08]
                tracking-[-0.035em]
                text-white
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
              "
            >
              Build the right career path

              <span className="block text-blue-500">
                for your future.
              </span>
            </h1>

            <p
              className="
                mt-7
                max-w-3xl
                text-base
                leading-7
                text-slate-400
                sm:text-lg
                sm:leading-8
                lg:text-xl
              "
            >
              Analyze your skills, understand your
              behavioral profile, discover suitable
              career opportunities, identify skill
              gaps, and follow a personalized learning
              journey.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={handleStartJourney}
                className="
                  group
                  inline-flex
                  min-h-13
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-xl
                  shadow-blue-600/20
                  transition
                  hover:-translate-y-0.5
                  hover:bg-blue-500
                  active:scale-[0.99]
                  sm:px-7
                  sm:text-base
                "
              >
                Start Your Career Journey

                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  inline-flex
                  min-h-13
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950/50
                  px-7
                  py-3.5
                  text-sm
                  font-bold
                  text-slate-200
                  transition
                  hover:border-slate-600
                  hover:bg-slate-900
                  active:scale-[0.99]
                  sm:text-base
                "
              >
                Login
              </button>

            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">

              <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                <CheckCircle2
                  size={16}
                  className="text-green-400"
                />
                Behavioral Analysis
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                <CheckCircle2
                  size={16}
                  className="text-green-400"
                />
                ML Recommendations
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                <CheckCircle2
                  size={16}
                  className="text-green-400"
                />
                Personalized Learning
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        id="how-it-works"
        className="
          border-t
          border-slate-900
          bg-[#030918]
          px-5
          py-20
          sm:px-8
          sm:py-24
          lg:px-10
        "
      >

        <div className="mx-auto w-full max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-blue-400">
              <Zap size={17} />
              HOW THE SYSTEM WORKS
            </div>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-5xl
              "
            >
              From assessment to career growth
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              The system connects your profile,
              behavioral analysis, machine learning
              recommendations, skill gap detection,
              personalized learning, and progress
              tracking into one career journey.
            </p>

          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {workflowSteps.map((step) => {

              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="
                    group
                    rounded-2xl
                    border
                    border-slate-800
                    bg-[#0b1222]
                    p-6
                    transition
                    hover:-translate-y-1
                    hover:border-blue-500/30
                  "
                >

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-bold tracking-widest text-blue-500">
                      STEP {step.number}
                    </span>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-500/10
                        text-blue-400
                      "
                    >
                      <Icon size={20} />
                    </div>

                  </div>

                  <h3 className="mt-6 text-lg font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ======================================================
          INTELLIGENT ANALYSIS
      ====================================================== */}

      <section className="border-t border-slate-900 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

        <div className="mx-auto w-full max-w-7xl">

          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">

            <div>

              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-400">
                <Brain size={18} />
                INTELLIGENT ANALYSIS
              </div>

              <h2
                className="
                  text-3xl
                  font-bold
                  leading-tight
                  tracking-tight
                  text-white
                  sm:text-4xl
                "
              >
                Your profile becomes

                <span className="text-blue-500">
                  {" "}a personalized career path.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                The system combines your profile and
                behavioral assessment information with
                machine learning based career analysis
                to generate personalized career insights.
              </p>

              <div className="mt-8 space-y-5">

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Your Profile
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Education, skills, interests, and
                      career goals.
                    </p>
                  </div>

                </div>

                <div className="ml-5 h-4 w-px bg-slate-800" />

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Brain size={18} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Behavioral Analysis
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Understand behavioral characteristics
                      through assessment responses.
                    </p>
                  </div>

                </div>

                <div className="ml-5 h-4 w-px bg-slate-800" />

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <BarChart3 size={18} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Machine Learning
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Generate career recommendations
                      from the analyzed information.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-800
                bg-[#0b1222]
                p-5
                sm:p-7
              "
            >

              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

              <div className="relative space-y-3">

                <div className="rounded-2xl border border-slate-800 bg-[#111a2e] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <UserRound size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        INPUT
                      </p>

                      <p className="font-semibold text-white">
                        Student Profile
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {[
                      "JavaScript",
                      "React",
                      "Node.js",
                      "MongoDB",
                      "Python",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs text-blue-400"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>

                <div className="flex justify-center">
                  <ArrowRight
                    size={20}
                    className="rotate-90 text-blue-500"
                  />
                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <Brain size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        ANALYSIS
                      </p>

                      <p className="font-semibold text-white">
                        Behavioral + ML Analysis
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    {[
                      "Problem Solving",
                      "Adaptability",
                      "Creativity",
                      "Logical Thinking",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-lg bg-slate-950/70 px-3 py-2 text-xs text-slate-400"
                      >
                        {item}
                      </div>
                    ))}

                  </div>

                </div>

                <div className="flex justify-center">
                  <ArrowRight
                    size={20}
                    className="rotate-90 text-blue-500"
                  />
                </div>

                <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                      <Target size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        RESULT
                      </p>

                      <p className="font-semibold text-white">
                        Career Recommendation
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/70 p-4">

                    <div>
                      <p className="text-xs text-slate-500">
                        Recommended Career
                      </p>

                      <p className="mt-1 font-bold text-white">
                        Full Stack Developer
                      </p>
                    </div>

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                      ML Match
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================
          EXPLORE SYSTEM
      ====================================================== */}

      <section
        id="system"
        className="
          border-t
          border-slate-900
          bg-[#030918]
          px-5
          py-20
          sm:px-8
          sm:py-24
          lg:px-10
        "
      >

        <div className="mx-auto w-full max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-blue-400">
              <Search size={17} />
              EXPLORE THE SYSTEM
            </div>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-5xl
              "
            >
              See the actual system in action
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              Explore real screens from the Intelligent
              Career Guidance System.
            </p>

          </div>

          {/* ==================================================
              SCREEN TABS
          ================================================== */}

          <div className="mt-12">

            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-3
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >

              {exploreScreens.map((screen) => {

                const Icon = screen.icon;

                const colors =
                  colorClasses[screen.color];

                const isActive =
                  activeScreen === screen.id;

                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={(event) =>
                      selectScreen(
                        event,
                        screen.id
                      )
                    }
                    className={`
                      flex
                      min-w-fit
                      shrink-0
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-xl
                      border
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      transition
                      active:scale-[0.97]
                      sm:text-sm
                      ${
                        isActive
                          ? colors.active
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }
                    `}
                  >

                    <Icon size={16} />

                    {screen.shortTitle}

                  </button>
                );
              })}

            </div>

          </div>

          {/* ==================================================
              SCREENSHOT VIEWER
          ================================================== */}

          <div className="mt-7">

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-800
                bg-[#0b1222]
                shadow-2xl
                shadow-black/30
              "
            >

              {/* Browser bar */}

              <div
                className="
                  flex
                  h-12
                  items-center
                  justify-between
                  border-b
                  border-slate-800
                  bg-[#0f172a]
                  px-4
                  sm:px-5
                "
              >

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />

                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />

                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />

                </div>

                <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">

                  <SelectedIcon
                    size={14}
                    className="text-blue-400"
                  />

                  {selectedScreen.title}

                </div>

                <div className="w-16" />

              </div>

              {/* Screenshot area */}

              <div className="relative bg-[#020617] p-2 sm:p-4 lg:p-6">

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-800
                    bg-[#020617]
                  "
                >

                  <img
                    key={selectedScreen.id}
                    src={selectedScreen.image}
                    alt={selectedScreen.title}
                    loading="lazy"
                    draggable="false"
                    className="
                      block
                      h-auto
                      max-h-[850px]
                      w-full
                      select-none
                      object-contain
                    "
                  />

                </div>

              </div>

              {/* =================================================
                  INFORMATION + ARROWS
              ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  border-t
                  border-slate-800
                  p-5
                  sm:p-7
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >

                <div className="max-w-3xl">

                  <div className="flex items-center gap-2">

                    <span
                      className={`
                        h-2
                        w-2
                        rounded-full
                        ${colorClasses[selectedScreen.color].dot}
                      `}
                    />

                    <h3 className="text-lg font-bold text-white">
                      {selectedScreen.title}
                    </h3>

                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {selectedScreen.description}
                  </p>

                </div>

                {/* =================================================
                    ARROW CONTROLS
                ================================================= */}

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-3
                  "
                >

                  <button
                    type="button"
                    aria-label="Previous screenshot"
                    title="Previous screenshot"
                    onClick={showPreviousScreen}
                    className="
                      flex
                      h-12
                      w-12
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-900
                      text-slate-300
                      outline-none
                      transition-all
                      duration-200
                      hover:border-blue-500/50
                      hover:bg-blue-600
                      hover:text-white
                      hover:shadow-lg
                      hover:shadow-blue-600/20
                      focus-visible:border-blue-500
                      focus-visible:ring-2
                      focus-visible:ring-blue-500/30
                      active:scale-95
                    "
                  >
                    <ChevronLeft
                      size={22}
                      strokeWidth={2.2}
                    />
                  </button>

                  <button
                    type="button"
                    aria-label="Next screenshot"
                    title="Next screenshot"
                    onClick={showNextScreen}
                    className="
                      flex
                      h-12
                      w-12
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-900
                      text-slate-300
                      outline-none
                      transition-all
                      duration-200
                      hover:border-blue-500/50
                      hover:bg-blue-600
                      hover:text-white
                      hover:shadow-lg
                      hover:shadow-blue-600/20
                      focus-visible:border-blue-500
                      focus-visible:ring-2
                      focus-visible:ring-blue-500/30
                      active:scale-95
                    "
                  >
                    <ChevronRight
                      size={22}
                      strokeWidth={2.2}
                    />
                  </button>

                </div>

              </div>

            </div>

            {/* ==================================================
                SCREEN INDICATORS
            ================================================== */}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">

              {exploreScreens.map((screen) => (

                <button
                  key={screen.id}
                  type="button"
                  aria-label={`Show ${screen.title}`}
                  title={screen.title}
                  onClick={(event) =>
                    selectScreen(
                      event,
                      screen.id
                    )
                  }
                  className={`
                    h-2
                    cursor-pointer
                    rounded-full
                    outline-none
                    transition-all
                    duration-200
                    focus-visible:ring-2
                    focus-visible:ring-blue-500/40
                    ${
                      activeScreen === screen.id
                        ? "w-8 bg-blue-500"
                        : "w-2 bg-slate-700 hover:bg-slate-500"
                    }
                  `}
                />

              ))}

            </div>

            <p className="mt-3 text-center text-xs text-slate-600">
              {exploreScreens.findIndex(
                (screen) =>
                  screen.id === activeScreen
              ) + 1}{" "}
              of {exploreScreens.length}
            </p>

          </div>

        </div>
      </section>

      {/* ======================================================
          FEATURES
      ====================================================== */}

      <section
        id="features"
        className="
          border-t
          border-slate-900
          px-5
          py-20
          sm:px-8
          sm:py-24
          lg:px-10
        "
      >

        <div className="mx-auto w-full max-w-7xl">

          <div className="max-w-3xl">

            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-400">
              <Sparkles size={17} />
              BUILT FOR YOUR CAREER JOURNEY
            </div>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white
                sm:text-4xl
              "
            >
              Everything connected in one system
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              The platform connects career discovery,
              behavioral analysis, skill development,
              personalized learning, progress tracking,
              and AI assistance.
            </p>

          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature) => {

              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="
                    group
                    rounded-2xl
                    border
                    border-slate-800
                    bg-[#0b1222]
                    p-6
                    transition
                    duration-200
                    hover:-translate-y-1
                    hover:border-blue-500/30
                    hover:bg-[#0d1528]
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-500/10
                      text-blue-400
                    "
                  >
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ======================================================
          CAREER JOURNEY
      ====================================================== */}

      <section className="border-t border-slate-900 bg-[#030918] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

        <div className="mx-auto w-full max-w-7xl">

          <div
            className="
              rounded-3xl
              border
              border-blue-500/20
              bg-gradient-to-br
              from-blue-500/[0.07]
              via-transparent
              to-indigo-500/[0.04]
              p-7
              sm:p-10
              lg:p-14
            "
          >

            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

              <div>

                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-400">
                  <Compass size={17} />
                  YOUR CAREER JOURNEY
                </div>

                <h2
                  className="
                    text-3xl
                    font-bold
                    leading-tight
                    text-white
                    sm:text-4xl
                  "
                >
                  One connected journey from

                  <span className="text-blue-500">
                    {" "}discovery to progress.
                  </span>
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                  Start with your profile and behavioral
                  assessment, understand your career
                  recommendations, identify skill gaps,
                  learn through personalized courses,
                  and track your progress.
                </p>

                <button
                  type="button"
                  onClick={handleStartJourney}
                  className="
                    mt-7
                    inline-flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-6
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-blue-500
                    active:scale-[0.98]
                  "
                >
                  Start Your Journey
                  <ArrowRight size={17} />
                </button>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {[
                  {
                    title: "Profile",
                    icon: UserRound,
                  },
                  {
                    title: "Assessment",
                    icon: ClipboardCheck,
                  },
                  {
                    title: "Career Analysis",
                    icon: Brain,
                  },
                  {
                    title: "Skill Gap",
                    icon: Target,
                  },
                  {
                    title: "Courses",
                    icon: GraduationCap,
                  },
                  {
                    title: "Progress",
                    icon: TrendingUp,
                  },
                  {
                    title: "AI Assistant",
                    icon: MessageCircle,
                  },
                  {
                    title: "Feedback",
                    icon: Users,
                  },
                ].map((item, index) => {

                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-slate-800
                        bg-[#0b1222]/80
                        px-4
                        py-4
                      "
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] font-bold tracking-wider text-blue-500">
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <p className="truncate text-sm font-semibold text-white">
                          {item.title}
                        </p>

                      </div>

                      <CheckCircle2
                        size={15}
                        className="ml-auto shrink-0 text-green-500/70"
                      />

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <Sparkles size={25} />
          </div>

          <h2
            className="
              mt-6
              text-3xl
              font-bold
              tracking-tight
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            Ready to discover your career path?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Start your assessment, understand your
            strengths, discover suitable careers, and
            build a personalized learning journey.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleStartJourney}
              className="
                inline-flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-7
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-xl
                shadow-blue-600/20
                transition
                hover:bg-blue-500
                active:scale-[0.98]
              "
            >
              Get Started
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("system")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="
                inline-flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-slate-900/60
                px-7
                py-3.5
                text-sm
                font-bold
                text-slate-200
                transition
                hover:border-slate-600
                hover:bg-slate-800
                active:scale-[0.98]
              "
            >
              Explore the System
              <Search size={17} />
            </button>

          </div>

        </div>

      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-slate-900 bg-[#020617]">

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-col
            gap-5
            px-5
            py-8
            sm:px-8
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:px-10
          "
        >

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Compass size={18} />
            </div>

            <div>

              <p className="text-sm font-bold text-white">
                Career Guidance System
              </p>

              <p className="text-xs text-slate-600">
                Intelligent Career Guidance using ML
                and Behavioral Analysis
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-5 text-xs text-slate-600">

            <a
              href="#how-it-works"
              className="cursor-pointer transition hover:text-slate-300"
            >
              How It Works
            </a>

            <a
              href="#system"
              className="cursor-pointer transition hover:text-slate-300"
            >
              Explore System
            </a>

            <a
              href="#features"
              className="cursor-pointer transition hover:text-slate-300"
            >
              Features
            </a>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                cursor-pointer
                transition
                hover:text-slate-300
              "
            >
              Login
            </button>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;