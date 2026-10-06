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

  const saveUserAndRedirect = (user) => {
    const role = String(user?.role || "employee")
      .trim()
      .toLowerCase();

    const userId =
      user?._id ||
      user?.id ||
      user?.user_id;

    if (userId) {
      localStorage.setItem("userId", String(userId));
    }

    localStorage.setItem("userRole", role);

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

    setMessage("Login successful. Redirecting...");

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "manager") {
      navigate("/manager/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const credential =
        await signInWithEmailAndPassword(
          firebaseAuth,
          cleanEmail,
          password
        );

      const idToken =
        await credential.user.getIdToken();

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
      console.error("Email login error:", err);

      switch (err?.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Invalid email or password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
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

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      const result =
        await signInWithPopup(
          firebaseAuth,
          provider
        );

      const idToken =
        await result.user.getIdToken();

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
      console.error("Google login error:", err);

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
    <div className="h-screen overflow-hidden bg-white lg:flex">

      {/* LEFT IMAGE */}
      <div className="relative hidden h-screen w-1/2 overflow-hidden lg:block">

        {/* PASTE YOUR IMAGE URL HERE */}
        <img
          src="https://media.istockphoto.com/id/1895058984/vector/hand-holding-smartphone-with-user-login-form-page-flat-illustration-vector-template-account.jpg?s=612x612&w=0&k=20&c=Wan_RzvpQhIQtYNq7cR7zJj42BvFIkmDFVD4wcmEcDA="
          alt="Shnoor International LLC"
          className="absolute inset-0 h-full w-full object-cover scale-125"
        />

        

       </div>

     


      {/* RIGHT LOGIN */}
      <div className="flex h-screen w-full items-center justify-center overflow-hidden px-5 sm:px-8 lg:w-1/2 lg:px-16">

        <div className="w-full max-w-md">

          {/* COMPANY NAME */}
          <div className="mb-6 text-center">
            <p>WELCOME TO</p>

            <h1 className="text-2xl font-bold tracking-wide text-slate-900">
              SHNOOR INTERNATIONAL LLC
            </h1>

            <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-orange-600" />

          </div>


          {/* LOGIN FORM */}
          <form
            onSubmit={handleLogin}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60"
          >

            <div className="space-y-4">

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
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
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

              </div>


              {/* PASSWORD */}
              <div>

                <div className="mb-1.5 flex items-center justify-between">

                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-orange-600 hover:text-orange-700"
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
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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


              {/* ERROR */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}


              {/* SUCCESS */}
              {message && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  {message}
                </div>
              )}


              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={
                  loading || googleLoading
                }
                className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>


              {/* DIVIDER */}
              <div className="flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[10px] font-medium text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>


              {/* GOOGLE LOGIN */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={
                  loading || googleLoading
                }
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {googleLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />

                    Connecting...
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
          <p className="mt-4 text-center text-xs text-slate-500">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Create an account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;