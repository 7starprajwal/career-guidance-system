import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const { register } = useAuth();

  // ============================================================
  // FORM
  // ============================================================

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ============================================================
  // UI STATES
  // ============================================================

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [showWelcome, setShowWelcome] =
    useState(false);

  const [showFlowers, setShowFlowers] =
    useState(false);

  // ============================================================
  // FLOWER DATA
  // ============================================================

  const flowers = useMemo(() => {
    const flowerTypes = [
      "🌸",
      "🌼",
      "🌺",
      "🌷",
      "✿",
      "❀",
    ];

    return Array.from(
      { length: 28 },
      (_, index) => ({
        id: index,
        flower:
          flowerTypes[
            index % flowerTypes.length
          ],
        left:
          Math.floor(
            Math.random() * 100
          ),
        delay:
          Math.random() * 2,
        duration:
          4 + Math.random() * 3,
        size:
          14 + Math.random() * 14,
        rotation:
          Math.random() * 360,
      })
    );
  }, []);

  // ============================================================
  // FIRST-TIME WELCOME EXPERIENCE
  // ============================================================

  useEffect(() => {
    setError("");
    setLoading(false);
    setShowPassword(false);
    setShowConfirmPassword(false);

    const welcomeAlreadyShown =
      localStorage.getItem(
        "career_guidance_welcome_seen"
      );

    if (!welcomeAlreadyShown) {
      setShowWelcome(true);
      setShowFlowers(true);

      localStorage.setItem(
        "career_guidance_welcome_seen",
        "true"
      );

      const welcomeTimer =
        setTimeout(() => {
          setShowWelcome(false);
        }, 6000);

      const flowerTimer =
        setTimeout(() => {
          setShowFlowers(false);
        }, 6500);

      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(flowerTimer);
      };
    }
  }, [location.key]);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) {
      setError("");
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // REGISTRATION
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;
    const confirmPassword =
      form.confirmPassword;

    if (!name) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!email) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter a password."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Please confirm your password."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await register(
        name,
        email,
        password
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-8 text-white">

      {/* ======================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-[-200px] left-[-100px] h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute right-[-100px] top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-3xl" />

      </div>

      {/* ======================================================
          FALLING FLOWERS
      ====================================================== */}

      {showFlowers && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">

          {flowers.map((item) => (
            <span
              key={item.id}
              className="absolute -top-10 animate-[flowerFall_linear_forwards] opacity-80"
              style={{
                left: `${item.left}%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
                fontSize: `${item.size}px`,
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              {item.flower}
            </span>
          ))}

        </div>
      )}

      {/* ======================================================
          FIRST-TIME WELCOME POPUP
      ====================================================== */}

      {showWelcome && (
        <div className="fixed left-1/2 top-6 z-50 w-[calc(100%-32px)] max-w-lg -translate-x-1/2 animate-[welcomeIn_0.5s_ease-out]">

          <div className="rounded-2xl border border-blue-500/30 bg-slate-900/95 p-5 shadow-2xl shadow-blue-900/30 backdrop-blur-xl">

            <div className="flex items-start gap-4">

              {/* ICON */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">

                <Sparkles size={24} />

              </div>

              {/* MESSAGE */}

              <div className="min-w-0 flex-1">

                <h2 className="text-lg font-bold text-white">
                  Welcome to AI Career Guidance
                  Platform! ✨
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Your personalized career journey
                  starts here. Create your account
                  and discover the right path for you.
                </p>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={() => {
                  setShowWelcome(false);
                  setShowFlowers(false);
                }}
                aria-label="Close welcome message"
                className="shrink-0 text-slate-500 transition hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            {/* PROGRESS */}

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">

              <div className="h-full w-full origin-left animate-[welcomeProgress_6s_linear] rounded-full bg-blue-500" />

            </div>

          </div>

        </div>
      )}

      {/* ======================================================
          REGISTER CARD
      ====================================================== */}

      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl sm:p-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400">

              <Sparkles size={28} />

            </div>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Create Account
            </h1>

            <p className="mt-3 text-slate-400">
              Start your personalized career journey
            </p>

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">

              <span className="mt-0.5">
                ⚠
              </span>

              <span>
                {error}
              </span>

            </div>
          )}

          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ==================================================
                NAME
            ================================================== */}

            <div>

              <label
                htmlFor="register-name"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Full Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-[#020617] py-3.5 pl-11 pr-4 text-white caret-blue-400 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

            </div>

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div>

              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-[#020617] py-3.5 pl-11 pr-4 text-white caret-blue-400 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

            </div>

            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div>

              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-[#020617] py-3.5 pl-11 pr-12 text-white caret-blue-400 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* ==================================================
                CONFIRM PASSWORD
            ================================================== */}

            <div>

              <label
                htmlFor="register-confirm-password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Confirm Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="register-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    form.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-[#020617] py-3.5 pl-11 pr-12 text-white caret-blue-400 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  title={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* ==================================================
                CREATE ACCOUNT
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">

                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Creating Account...

                </span>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          {/* ==================================================
              LOGIN
          ================================================== */}

          <p className="mt-7 text-center text-sm text-slate-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Login
            </Link>

          </p>

          {/* ==================================================
              HOME
          ================================================== */}

          <div className="mt-5 text-center">

            <Link
              to="/"
              className="text-sm text-slate-500 transition hover:text-slate-300"
            >
              ← Back to Home
            </Link>

          </div>

        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <p className="mt-5 text-center text-xs text-slate-600">
          Intelligent Career Guidance System
        </p>

      </div>

      {/* ======================================================
          ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes flowerFall {
            0% {
              transform:
                translateY(-60px)
                rotate(0deg);
              opacity: 0;
            }

            10% {
              opacity: 0.9;
            }

            50% {
              opacity: 0.85;
            }

            100% {
              transform:
                translateY(110vh)
                rotate(360deg);
              opacity: 0;
            }
          }

          @keyframes welcomeIn {
            0% {
              opacity: 0;
              transform:
                translate(-50%, -20px)
                scale(0.96);
            }

            100% {
              opacity: 1;
              transform:
                translate(-50%, 0)
                scale(1);
            }
          }

          @keyframes welcomeProgress {
            0% {
              transform: scaleX(1);
            }

            100% {
              transform: scaleX(0);
            }
          }
        `}
      </style>

    </div>
  );
}

export default Register;