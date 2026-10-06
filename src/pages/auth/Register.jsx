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
          data?.message || "Registration failed. Please try again."
        );
        return;
      }

      setMessage("Account created successfully. Redirecting to login...");

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
    <div className="h-screen overflow-hidden bg-white lg:flex">

      {/* LEFT IMAGE */}
      <div className="relative hidden h-screen w-1/2 overflow-hidden lg:block">

        {/* PASTE YOUR IMAGE URL HERE */}
        <img
          src="https://media.istockphoto.com/id/1895058984/vector/hand-holding-smartphone-with-user-login-form-page-flat-illustration-vector-template-account.jpg?s=612x612&w=0&k=20&c=Wan_RzvpQhIQtYNq7cR7zJj42BvFIkmDFVD4wcmEcDA="
          className="absolute inset-0 h-full w-full object-cover scale-125"
        />

        {/* LIGHT OVERLAY */}
        <div className="absolute inset-0 " />

       

      </div>


      {/* RIGHT REGISTER */}
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


          {/* REGISTER FORM */}
          <form
            onSubmit={handleRegister}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60"
          >

            <div className="space-y-4">

              {/* USERNAME */}
              <div>

                <label
                  htmlFor="register-username"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Username
                </label>

                <input
                  id="register-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

              </div>


              {/* EMAIL */}
              <div>

                <label
                  htmlFor="register-email"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

              </div>


              {/* PASSWORD */}
              <div>

                <label
                  htmlFor="register-password"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  required
                />

              </div>


              {/* ROLE */}
              <div>

                <label
                  htmlFor="register-role"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Role
                </label>

                <select
                  id="register-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>

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


              {/* REGISTER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Register"}
              </button>

            </div>

          </form>


          {/* LOGIN */}
          <p className="mt-4 text-center text-xs text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;