import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login(
        email,
        password
      );

      if (response?.user?.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 text-white">

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-[-200px] left-[-100px] h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute right-[-100px] top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400">
              <LockKeyhole size={28} />
            </div>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-3 text-slate-400">
              Login to your career guidance account
            </p>

          </div>

          {/* Error Message */}
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

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="login-email"
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
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-[#020617]
                    py-3.5
                    pl-11
                    pr-4
                    text-white
                    caret-blue-400
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  style={{
                    WebkitTextFillColor:
                      "#ffffff",
                    WebkitBoxShadow:
                      "0 0 0 1000px #020617 inset",
                  }}
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="login-password"
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
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-[#020617]
                    py-3.5
                    pl-11
                    pr-12
                    text-white
                    caret-blue-400
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  style={{
                    WebkitTextFillColor:
                      "#ffffff",
                    WebkitBoxShadow:
                      "0 0 0 1000px #020617 inset",
                  }}
                />

                {/* Show / Hide Password */}
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
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-9
                    w-9
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-800
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Click the 👁 icon to show or hide your password.
              </p>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                px-4
                py-3.5
                font-semibold
                text-white
                shadow-lg
                shadow-blue-600/10
                transition
                hover:bg-blue-500
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (
                <span className="flex items-center gap-2">

                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Logging in...

                </span>
              ) : (
                "Login"
              )}

            </button>

          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Create account
            </Link>

          </p>

          {/* Back Home */}
          <div className="mt-5 text-center">

            <Link
              to="/"
              className="text-sm text-slate-500 transition hover:text-slate-300"
            >
              ← Back to Home
            </Link>

          </div>

        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-slate-600">
          Intelligent Career Guidance System
        </p>

      </div>

    </div>
  );
}

export default Login;