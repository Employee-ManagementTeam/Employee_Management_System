import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [message, setMessage] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("Please fill all fields.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("emsUsers")) || [];

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      setMessage("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      role,
    };

    users.push(newUser);

    localStorage.setItem("emsUsers", JSON.stringify(users));

    setMessage("Account created successfully!");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* LEFT IMAGE SECTION */}

      <div className="relative w-full lg:w-1/2 h-72 lg:h-screen overflow-hidden">

        <img
          src="https://img.magnific.com/free-vector/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.jpg"
          alt="Shnoor International LLC"
          className="w-full h-full object-cover"
        />

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


      {/* RIGHT REGISTER SECTION */}

      <div className="w-full lg:w-1/2 min-h-[calc(100vh-18rem)] lg:min-h-screen flex items-center justify-center px-6 py-10 lg:px-16">

        <div className="w-full max-w-md">

          {/* HEADING */}

          <div className="mb-8">

            <p className="text-orange-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Employee Management System
            </p>

            <h1 className="text-4xl font-bold text-gray-900">
              Create Your Account
            </h1>

            <p className="text-gray-500 mt-3">
              Register to access the employee management portal.
            </p>

          </div>


          {/* REGISTER FORM */}

          <form onSubmit={handleRegister} className="space-y-5">

            {/* USERNAME */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

            </div>


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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

            </div>


            {/* ROLE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg outline-none transition bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>

            </div>


            {/* CREATE ACCOUNT BUTTON */}

            <button
              type="submit"
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-200 shadow-sm hover:shadow-md"
            >
              Create Account
            </button>


            {/* MESSAGE */}

            {message && (
              <p
                className={`text-sm px-4 py-3 rounded-lg ${
                  message === "Account created successfully!"
                    ? "text-green-700 bg-green-50 border border-green-200"
                    : "text-red-600 bg-red-50 border border-red-200"
                }`}
              >
                {message}
              </p>
            )}

          </form>


          {/* LOGIN LINK */}

          <p className="text-center text-gray-500 mt-7">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;