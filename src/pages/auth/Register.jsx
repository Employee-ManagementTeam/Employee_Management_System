import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(
        username.trim(),
        email.trim().toLowerCase(),
        password,
        role
      );

      if (!data?.success) {
        setError(
          data?.message ||
            "Registration failed. Please try again."
        );
        return;
      }

      setMessage(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.message ||
          "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">

      {/* LEFT BRANDING */}
      <div className="relative w-full lg:w-1/2 min-h-[320px] lg:min-h-screen overflow-hidden">

        <img
          src="https://img.magnific.com/free-vector/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.jpg"
          alt="Employee Management System"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/65" />

        <div className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-14 text-white">

          {/* Brand */}
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

          {/* Main text */}
          <div className="max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-orange-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Workforce management platform
            </div>

            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
              Build your
              <span className="block text-orange-400">
                employee profile.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-200">
              Create your People Portal account to access
              attendance, tasks, leave requests, performance,
              documents, payroll, and employee services.
            </p>

          </div>

          {/* Company */}
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


      {/* RIGHT REGISTER AREA */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-5 py-10 sm:px-8 lg:px-16">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              People Registration
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Register with your email address to access the
              Employee Management System.
            </p>

          </div>


          {/* FORM */}
          <form
            onSubmit={handleRegister}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
          >

            <div className="space-y-5">

              {/* USERNAME */}
              <div>

                <label
                  htmlFor="register-username"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Username
                </label>

                <input
                  id="register-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

              </div>


              {/* EMAIL */}
              <div>

                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="register-email"
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
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

              </div>


              {/* ROLE */}
              <div>

                <label
                  htmlFor="register-role"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Role
                </label>

                <select
                  id="register-role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                >
                  <option value="employee">
                    Employee
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>

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
                    Creating account...
                  </>
                ) : (
                  "Create People Portal Account"
                )}

              </button>

            </div>

          </form>


          {/* LOGIN LINK */}
          <p className="mt-7 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Sign in
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

export default Register;