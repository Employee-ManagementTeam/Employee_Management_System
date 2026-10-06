import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  loginUser,
  loginWithGoogle,
} from "../../api/auth";

/*
|--------------------------------------------------------------------------
| Eye Icon
|--------------------------------------------------------------------------
*/

function EyeIcon({ hidden = false }) {
  if (hidden) {
    return (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.5c5.5 0 9.5 7.5 9.5 7.5a17.2 17.2 0 0 1-3.06 3.96" />
        <path d="M6.61 6.61C3.92 8.43 2.5 12 2.5 12s4 7.5 9.5 7.5a10.9 10.9 0 0 0 3.12-.45" />
      </svg>
    );
  }

  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M2.5 12s4-7.5 9.5-7.5 9.5 7.5 9.5 7.5-4 7.5-9.5 7.5-9.5-7.5-9.5-7.5Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/*
|--------------------------------------------------------------------------
| Google Icon
|--------------------------------------------------------------------------
*/

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.78-.07-1.53-.23-2.25H12v4.26h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.22 2.91-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.63 0 4.83-.87 6.44-2.36l-3.14-2.45c-.87.58-1.98.92-3.3.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.73 9.73 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.83A5.85 5.85 0 0 1 6.23 12c0-.64.11-1.25.31-1.83V7.64H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.36l3.25-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.24 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.39l3.25 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
      />
    </svg>
  );
}

/*
|--------------------------------------------------------------------------
| Shield Icon
|--------------------------------------------------------------------------
*/

function ShieldIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v5c0 5.1-3.4 8.7-8 10-4.6-1.3-8-4.9-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/*
|--------------------------------------------------------------------------
| Login Page
|--------------------------------------------------------------------------
*/

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Redirect by role
  |--------------------------------------------------------------------------
  */

  const redirectByRole = (user) => {
    const role = String(
      user?.role || "employee"
    )
      .trim()
      .toLowerCase();

    if (role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (role === "manager") {
      navigate("/manager/dashboard");
      return;
    }

    navigate("/employee/dashboard");
  };

  /*
  |--------------------------------------------------------------------------
  | Email Login
  |--------------------------------------------------------------------------
  */

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(
        email.trim(),
        password
      );

      if (
        !data?.success ||
        !data?.user
      ) {
        setError(
          data?.message ||
            "Invalid email or password."
        );
        return;
      }

      const user = data.user;

      const userId =
        user._id ||
        user.id ||
        user.user_id;

      const role = String(
        user.role || ""
      )
        .trim()
        .toLowerCase();

      if (userId) {
        localStorage.setItem(
          "userId",
          String(userId)
        );
      }

      localStorage.setItem(
        "userRole",
        role
      );

      localStorage.setItem(
        "userEmail",
        user.email || email.trim()
      );

      localStorage.setItem(
        "userName",
        user.username ||
          user.name ||
          ""
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );

      setMessage(
        "Login successful. Redirecting..."
      );

      redirectByRole(user);
    } catch (err) {
      console.error(
        "Email login error:",
        err
      );

      setError(
        err?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Google Login
  |--------------------------------------------------------------------------
  */

  const handleGoogleLogin = async () => {
    setMessage("");
    setError("");

    setGoogleLoading(true);

    try {
      const data =
        await loginWithGoogle();

      if (
        !data?.success ||
        !data?.user
      ) {
        setError(
          data?.message ||
            "Google login failed."
        );
        return;
      }

      const user = data.user;

      const userId =
        user._id ||
        user.id ||
        user.user_id;

      const role = String(
        user.role || ""
      )
        .trim()
        .toLowerCase();

      if (userId) {
        localStorage.setItem(
          "userId",
          String(userId)
        );
      }

      localStorage.setItem(
        "userRole",
        role
      );

      localStorage.setItem(
        "userEmail",
        user.email || ""
      );

      localStorage.setItem(
        "userName",
        user.username ||
          user.name ||
          ""
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );

      setMessage(
        "Google login successful. Redirecting..."
      );

      redirectByRole(user);
    } catch (err) {
      console.error(
        "Google login error:",
        err
      );

      setError(
        err?.message ||
          "Google authentication failed."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">

      {/* =========================================================
          LEFT BRANDING
      ========================================================== */}

      <div className="relative w-full lg:w-1/2 min-h-[320px] lg:min-h-screen overflow-hidden">

        <img
          src="https://img.magnific.com/free-vector/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.jpg"
          alt="Employee Management System"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/65" />

        <div className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-14 text-white">

          {/* =====================================================
              TOP LEFT EMS HEADING REMOVED
          ===================================================== */}

          {/* Main Text */}

          <div className="max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-orange-200 backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              Workforce management platform

            </div>

            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">

              Welcome back.

              <span className="block text-orange-400">
                Manage your workforce.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-200">

              Sign in to your People Portal
              account to access attendance,
              tasks, leave requests, performance,
              documents, payroll, and employee services.

            </p>

          </div>

          {/* Company Footer */}

          <div className="text-sm text-slate-300">

            <p className="font-semibold text-white">
              SHNOOR INTERNATIONAL LLC
            </p>

            <p className="mt-1">
              Empowering people. Managing work. Building success.
            </p>

          </div>

        </div>
      </div>

      {/* =========================================================
          RIGHT LOGIN AREA
      ========================================================== */}

      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-5 py-10 sm:px-8 lg:px-16">

        <div className="w-full max-w-md">

          {/* Heading */}

          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              People Login
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in with your registered
              email address or continue
              securely with Google.
            </p>

          </div>

          {/* Login Form */}

          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
          >

            <div className="space-y-5">

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <EyeIcon
                      hidden={showPassword}
                    />
                  </button>

                </div>

              </div>

              {/* FORGOT PASSWORD */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2 text-xs text-slate-500">

                  <ShieldIcon />

                  Protected account access

                </div>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Forgot password?
                </Link>

              </div>

              {/* ERROR */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-5 text-emerald-700">
                  {message}
                </div>
              )}

              {/* EMAIL LOGIN */}

              <button
                type="submit"
                disabled={
                  loading ||
                  googleLoading
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  "Sign in to People Portal"
                )}

              </button>

              {/* DIVIDER */}

              <div className="flex items-center gap-3 py-1">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>

              {/* GOOGLE LOGIN */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={
                  loading ||
                  googleLoading
                }
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >

                {googleLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}

              </button>

            </div>

          </form>

          {/* REGISTER LINK */}

          <p className="mt-7 text-center text-sm text-slate-500">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Create an account
            </Link>

          </p>

          {/* KEEP BOTTOM COMPANY FOOTER */}

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            SHNOOR INTERNATIONAL LLC · Employee Management System
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;