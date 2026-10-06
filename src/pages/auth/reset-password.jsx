import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";

import { auth as firebaseAuth } from "../../firebase";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [actionCode, setActionCode] = useState("");

  useEffect(() => {
    const code = searchParams.get("oobCode");

    if (!code) {
      setError(
        "This password reset link is missing or invalid."
      );
      setLoading(false);
      return;
    }

    setActionCode(code);

    const verifyCode = async () => {
      try {
        const accountEmail = await verifyPasswordResetCode(
          firebaseAuth,
          code
        );

        setEmail(accountEmail);
      } catch (err) {
        console.error("Password reset code error:", err);

        switch (err?.code) {
          case "auth/expired-action-code":
            setError(
              "This password reset link has expired. Please request a new one."
            );
            break;

          case "auth/invalid-action-code":
            setError(
              "This password reset link is invalid or has already been used."
            );
            break;

          case "auth/user-disabled":
            setError(
              "This account has been disabled. Please contact the administrator."
            );
            break;

          default:
            setError(
              "Unable to verify this password reset link."
            );
        }
      } finally {
        setLoading(false);
      }
    };

    verifyCode();
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!actionCode) {
      setError("Invalid password reset request.");
      return;
    }

    setSaving(true);

    try {
      await confirmPasswordReset(
        firebaseAuth,
        actionCode,
        password
      );

      setMessage(
        "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Password reset error:", err);

      switch (err?.code) {
        case "auth/expired-action-code":
          setError(
            "This password reset link has expired. Please request a new one."
          );
          break;

        case "auth/invalid-action-code":
          setError(
            "This password reset link is invalid or has already been used."
          );
          break;

        case "auth/weak-password":
          setError(
            "Please choose a stronger password."
          );
          break;

        default:
          setError(
            err?.message ||
              "Unable to reset your password. Please try again."
          );
      }
    } finally {
      setSaving(false);
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

          <div className="max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-orange-200 backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              Secure account recovery

            </div>

            <h1 className="text-5xl font-bold leading-tight">

              Create a new

              <span className="block text-orange-400">
                secure password.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-200">
              Choose a new password for your People Portal account.
            </p>

          </div>

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

          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Password Recovery
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Reset your password
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create a new password for your People Portal account.
            </p>

          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />

              <p className="text-sm font-medium text-slate-600">
                Verifying reset link...
              </p>

            </div>
          ) : error && !email ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">

              <p className="text-sm font-medium leading-6 text-red-700">
                {error}
              </p>

              <Link
                to="/forgot-password"
                className="mt-5 inline-flex rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Request New Reset Link
              </Link>

            </div>
          ) : (
            <form
              onSubmit={handleReset}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
            >

              <div className="space-y-5">

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="reset-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Account email
                  </label>

                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3.5 text-sm text-slate-600 outline-none"
                  />

                </div>

                {/* NEW PASSWORD */}

                <div>

                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    New password
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                    required
                  />

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm new password
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                    required
                  />

                </div>

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

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>

              </div>

            </form>
          )}

          <p className="mt-7 text-center text-sm text-slate-500">
            <Link
              to="/login"
              className="font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Back to Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            SHNOOR INTERNATIONAL LLC · Employee Management System
          </p>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;