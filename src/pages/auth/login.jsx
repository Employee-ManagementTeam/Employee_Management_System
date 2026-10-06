import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth as firebaseAuth } from "../../firebase";
import { apiRequest } from "../../api/api";


function EyeIcon({ hidden = false }) {
  return hidden ? (
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
  ) : (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M2.5 12s4-7.5 9.5-7.5 9.5 7.5 9.5 7.5-4 7.5-9.5 7.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}


function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}


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


function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.79-.07-1.55-.22-2.28H12v4.31h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.99-4.31 2.99-7.56Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.89 6.61-2.41l-3.23-2.51c-.89.6-2.02.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.59A9.98 9.98 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.91A6 6 0 0 1 6.08 12c0-.66.11-1.3.32-1.91V7.5H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.5l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87C16.95 2.99 14.69 2 12 2a9.98 9.98 0 0 0-8.94 5.5l3.34 2.59C7.19 7.72 9.4 5.96 12 5.96Z"
      />
    </svg>
  );
}


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  // -------------------------------------------------------
  // Save user session and redirect
  // -------------------------------------------------------

  const saveUserAndRedirect = (user) => {
    const role = String(
      user?.role || "employee"
    ).trim().toLowerCase();

    const userId =
      user?._id ||
      user?.id ||
      user?.user_id;

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
      user?.email || email.trim()
    );

    localStorage.setItem(
      "userName",
      user?.username ||
        user?.name ||
        ""
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    setMessage(
      "Login successful. Redirecting..."
    );

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "manager") {
      navigate("/manager/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
  };


  // -------------------------------------------------------
  // NORMAL EMAIL/PASSWORD LOGIN
  // -------------------------------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const cleanEmail =
        email.trim().toLowerCase();

      // Firebase authenticates the password.
      const credential =
        await signInWithEmailAndPassword(
          firebaseAuth,
          cleanEmail,
          password
        );

      // Get Firebase ID token.
      const idToken =
        await credential.user.getIdToken();

      // Send Firebase token to Flask.
      const data = await apiRequest(
        "/auth/firebase-login",
        {
          method: "POST",
          body: JSON.stringify({
            id_token: idToken,
          }),
        }
      );

      if (!data?.success || !data?.user) {
        setError(
          data?.message ||
            "Unable to load your EMS account."
        );
        return;
      }

      saveUserAndRedirect(data.user);

    } catch (err) {
      console.error(
        "Email login error:",
        err
      );

      switch (err?.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError(
            "Invalid email or password."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/user-disabled":
          setError(
            "This account has been disabled. Please contact the administrator."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many login attempts. Please wait and try again."
          );
          break;

        default:
          setError(
            err?.message ||
              "Unable to sign in. Please try again."
          );
      }

    } finally {
      setLoading(false);
    }
  };


  // -------------------------------------------------------
  // GOOGLE LOGIN
  // -------------------------------------------------------

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setGoogleLoading(true);

    try {
      const provider =
        new GoogleAuthProvider();

      const result =
        await signInWithPopup(
          firebaseAuth,
          provider
        );

      const idToken =
        await result.user.getIdToken();

      // Keep the existing Google backend endpoint.
      const data = await apiRequest(
        "/auth/google",
        {
          method: "POST",
          body: JSON.stringify({
            id_token: idToken,
          }),
        }
      );

      if (!data?.success || !data?.user) {
        setError(
          data?.message ||
            "Google login failed."
        );
        return;
      }

      saveUserAndRedirect(data.user);

    } catch (err) {
      console.error(
        "Google login error:",
        err
      );

      if (
        err?.code ===
        "auth/popup-closed-by-user"
      ) {
        setError(
          "Google sign-in was cancelled."
        );
      } else if (
        err?.code ===
        "auth/popup-blocked"
      ) {
        setError(
          "Your browser blocked the Google sign-in popup."
        );
      } else if (
        err?.code ===
        "auth/network-request-failed"
      ) {
        setError(
          "Network error. Please check your internet connection."
        );
      } else {
        setError(
          err?.message ||
            "Google login failed."
        );
      }

    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 lg:flex">

      {/* =================================================
          LEFT BRANDING
      ================================================= */}

      <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex lg:w-[48%]">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-slate-950 to-slate-900" />

        <div className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-orange-600/20 blur-3xl" />

        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-xl font-black text-white shadow-lg shadow-orange-950/40">
              E
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                Employee Management System
              </p>

              <p className="text-xs font-medium uppercase tracking-[0.18em] text-orange-300">
                People Portal
              </p>
            </div>

          </div>


          {/* MAIN */}

          <div className="max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-orange-200 backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              Secure employee access

            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">

              One portal for

              <span className="block text-orange-400">
                people & performance.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
              Access attendance, tasks, leave requests,
              performance, documents, payroll, and employee
              services from one professional workspace.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">

              {[
                ["01", "Attendance"],
                ["02", "Workforce"],
                ["03", "Reports"],
              ].map(
                ([number, label]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xs font-semibold text-orange-300">
                      {number}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-white">
                      {label}
                    </p>
                  </div>
                )
              )}

            </div>

          </div>


          {/* COMPANY */}

          <div className="text-sm text-slate-400">

            <p className="font-semibold text-slate-300">
              SHNOOR INTERNATIONAL LLC
            </p>

            <p className="mt-1">
              Empowering people. Managing work. Building success.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          LOGIN PANEL
      ================================================= */}

      <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[52%] lg:px-12">

        <div className="w-full max-w-md">

          {/* MOBILE BRAND */}

          <div className="mb-9 flex items-center gap-3 lg:hidden">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-xl font-black text-white shadow-sm">
              E
            </div>

            <div>

              <p className="font-bold tracking-tight text-slate-900">
                Employee Management System
              </p>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                People Portal
              </p>

            </div>

          </div>


          {/* HEADING */}

          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              People Login
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in with your registered account to
              continue to your employee portal.
            </p>

          </div>


          {/* FORM */}

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
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-orange-600 transition hover:text-orange-700"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
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


              {/* MESSAGES */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-5 text-emerald-700">
                  {message}
                </div>
              )}


              {/* PROTECTED ACCESS */}

              <div className="flex items-center justify-between">

                <div className="inline-flex items-center gap-2 text-xs text-slate-500">

                  <ShieldIcon />

                  Protected account access

                </div>

              </div>


              {/* EMAIL LOGIN BUTTON */}

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
                  <>
                    Sign in to People Portal

                    <ArrowIcon />
                  </>
                )}

              </button>


              {/* DIVIDER */}

              <div className="flex items-center gap-3 py-1">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium text-slate-400">
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
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {googleLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />

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


          {/* REGISTER */}

          <div className="mt-7 text-center text-sm text-slate-500">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Create an account
            </Link>

          </div>


          {/* FOOTER */}

          <div className="mt-8 text-center text-xs leading-5 text-slate-400">

            By continuing, you agree to use the employee portal only
            with authorized account credentials.

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;