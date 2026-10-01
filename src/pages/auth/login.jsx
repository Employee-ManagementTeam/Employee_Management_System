import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { loginUser } from "../../api/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      console.log("Login successful:", data);

localStorage.setItem("user", JSON.stringify(data));

const role = data.user.role;

if (role === "employee") {
  navigate("/employee/dashboard");
} else if (role === "manager") {
  navigate("/manager/dashboard");
} else if (role === "admin") {
  navigate("/admin/dashboard");
} else {
  setError("Unknown user role");
}

    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-blue-600">
            Employee Management System
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your account
          </p>

        </div>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-5">

            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              required
            />

          </div>

          {/* Password */}
          <div className="mb-5">

            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              required
            />

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
        <p className="text-center text-gray-500 mt-6">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="text-blue-600 font-semibold hover:underline"
  >
    Register
  </Link>
</p>

      </div>

    </div>
  );
}

export default Login;
