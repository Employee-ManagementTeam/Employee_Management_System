import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  setError("");

  try {
    const data = await loginUser(email, password);

    if (!data.success || !data.user) {
      setError(data.message || "Invalid email or password.");
      return;
    }

    const role = String(data.user.role || "").toLowerCase();

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "manager") {
      navigate("/manager/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
  } catch (err) {
    setError(
      err.message || "Unable to connect to the server."
    );
  }
};

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* LEFT IMAGE SECTION */}

      <div className="relative w-full lg:w-1/2 h-72 lg:h-screen overflow-hidden">

        <img
          src={"https://img.magnific.com/free-vector/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.jpg?semt=ais_hybrid&w=740&q=80"}
          alt="Shnoor International LLC"
          className="w-full h-full object-cover"
        />

        {/* Image overlay */}

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute bottom-0 left-0 p-8 lg:p-14 text-white">

          <h2 className="text-3xl lg:text-5xl font-bold mb-3">
            Shnoor International LLC
          </h2>

          <p className="text-base lg:text-lg text-white/90 max-w-lg">
            Empowering people. Managing work. Building success.
          </p>

        </div>
      </div>


      {/* RIGHT LOGIN SECTION */}

      <div className="w-full lg:w-1/2 min-h-[calc(100vh-18rem)] lg:min-h-screen flex items-center justify-center px-6 py-10 lg:px-16">

        <div className="w-full max-w-md">

          {/* Heading */}

          <div className="mb-8">

            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">
              Employee Management System
            </p>

            <h1 className="text-4xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-3">
              Sign in to access your employee portal.
            </p>

          </div>


          {/* LOGIN FORM */}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
              />

            </div>


            {/* ERROR */}

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-200 shadow-sm hover:shadow-md"
            >
              Login
            </button>

          </form>


          {/* REGISTER */}

          <p className="text-center text-gray-500 mt-7">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;