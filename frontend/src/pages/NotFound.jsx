import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  LayoutDashboard,
  Search,
  Sparkles,
} from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="absolute bottom-[-180px] left-[-120px] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="absolute right-[-120px] top-[35%] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.8) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

      </div>

      {/* =========================================================
          HEADER
      ========================================================== */}

      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-3"
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              shadow-lg
              shadow-blue-600/20
              transition
              group-hover:bg-blue-500
            "
          >
            <Compass size={21} />
          </div>

          <div className="hidden text-left sm:block">

            <p className="text-sm font-bold text-white">
              Career Guidance
            </p>

            <p className="text-[11px] text-slate-500">
              Intelligent Career System
            </p>

          </div>

        </button>

        <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">

          <Sparkles
            size={14}
            className="text-blue-400"
          />

          Intelligent Career Guidance

        </div>

      </header>

      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-24 sm:px-8">

        <div className="w-full max-w-4xl text-center">

          {/* =====================================================
              404 VISUAL
          ====================================================== */}

          <div className="relative mx-auto mb-8 flex w-fit items-center justify-center">

            {/* Outer glow */}

            <div className="absolute h-64 w-64 rounded-full bg-blue-600/5 blur-3xl sm:h-80 sm:w-80" />

            {/* Decorative ring */}

            <div
              className="
                absolute
                h-56
                w-56
                rounded-full
                border
                border-blue-500/10
                sm:h-72
                sm:w-72
              "
            />

            <div
              className="
                absolute
                h-44
                w-44
                rounded-full
                border
                border-slate-800
                sm:h-60
                sm:w-60
              "
            />

            {/* 404 */}

            <div className="relative">

              <p
                className="
                  select-none
                  bg-gradient-to-br
                  from-blue-300
                  via-blue-500
                  to-indigo-500
                  bg-clip-text
                  text-[100px]
                  font-black
                  leading-none
                  tracking-[-0.08em]
                  text-transparent
                  drop-shadow-[0_0_35px_rgba(59,130,246,0.15)]
                  sm:text-[150px]
                  md:text-[180px]
                "
              >
                404
              </p>

              <div className="absolute bottom-[-8px] left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-blue-500/60" />

            </div>

            {/* Floating search icon */}

            <div
              className="
                absolute
                -left-4
                top-8
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-slate-800
                bg-[#0f172a]
                text-blue-400
                shadow-xl
                sm:-left-8
              "
            >
              <Search size={19} />
            </div>

            {/* Floating compass icon */}

            <div
              className="
                absolute
                -right-4
                bottom-7
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-slate-800
                bg-[#0f172a]
                text-cyan-400
                shadow-xl
                sm:-right-8
              "
            >
              <Compass size={19} />
            </div>

          </div>

          {/* =====================================================
              CONTENT
          ====================================================== */}

          <div className="mx-auto max-w-2xl">

            <div className="mb-4 flex items-center justify-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Page unavailable
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

            </div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white
                sm:text-4xl
                md:text-5xl
              "
            >
              We couldn't find that page.
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-7
                text-slate-400
                sm:text-base
              "
            >
              The page you're looking for may have been moved,
              removed, or the address may be incorrect.
            </p>

          </div>

          {/* =====================================================
              ACTIONS
          ====================================================== */}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                group
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-blue-600/20
                transition
                hover:bg-blue-500
                hover:shadow-blue-600/30
                sm:w-auto
              "
            >
              <Home size={18} />

              Go to Home

              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-slate-900/60
                px-6
                py-3
                text-sm
                font-semibold
                text-slate-200
                transition
                hover:border-slate-600
                hover:bg-slate-800
                sm:w-auto
              "
            >
              <LayoutDashboard size={18} />

              Dashboard
            </button>

          </div>

          {/* =====================================================
              BACK
          ====================================================== */}

          <button
            type="button"
            onClick={handleGoBack}
            className="
              group
              mt-7
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-slate-200
            "
          >

            <ArrowLeft
              size={16}
              className="transition group-hover:-translate-x-1"
            />

            Go back to previous page

          </button>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <div className="mt-12 flex flex-col items-center gap-2">

            <div className="h-px w-16 bg-slate-800" />

            <p className="text-xs text-slate-600">
              Intelligent Career Guidance System
            </p>

            <p className="text-[11px] text-slate-700">
              Error 404 • Page not found
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default NotFound;