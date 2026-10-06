import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth as firebaseAuth } from "../../firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(
        firebaseAuth,
        cleanEmail
      );

      setMessage(
        "Password reset email sent. Please check your inbox and follow the instructions."
      );

      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);

      switch (err?.code) {
        case "auth/user-not-found":
          setError(
            "No account was found with this email address."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many reset attempts. Please wait a while and try again."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection and try again."
          );
          break;

        default:
          setError(
            err?.message ||
              "Unable to send the password reset email. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">

      {/* ================= LEFT BRANDING ================= */}

      <div className="relative hidden w-1/2 min-h-screen overflow-hidden lg:block">

        <img
          src="https://img.magnific.com/free-vector/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.jpg"
          alt="Employee Management System"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/65" />

        <div className="relative z-10 flex h-full flex-col justify-between p-14 text-white">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-xl font-black shadow-lg">
              E
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">
                Employee Management System
              </p>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                People Portal
              </p>
            </div>

          </div>

          {/* MAIN CONTENT */}

          <div className="max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-orange-200 backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              Secure account recovery

            </div>

            <h1 className="text-5xl font-bold leading-tight">

              Get back into your

              <span className="block text-orange-400">
                People Portal.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-200">
              Enter your registered email address and we’ll send you
              instructions to reset your password securely.
            </p>

          </div>

          {/* COMPANY */}

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

      {/* ================= RIGHT AREA ================= */}

      <div className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-16">

        <div className="w-full max-w-md">

          {/* HEADING */}

          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Password Recovery
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter the email address associated with your People Portal
              account.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleReset}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
          >

            <div className="space-y-5">

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="forgot-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

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

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

            </div>

          </form>

          {/* BACK TO LOGIN */}

          <p className="mt-7 text-center text-sm text-slate-500">

            Remember your password?{" "}

            <Link
              to="/login"
              className="font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Sign in
            </Link>

          </p>

          {/* REGISTER */}

          <p className="mt-3 text-center text-sm text-slate-500">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Create account
            </Link>

          </p>

          {/* FOOTER */}

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            SHNOOR INTERNATIONAL LLC · Employee Management System
          </p>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;