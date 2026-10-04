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
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h1>EMS Registration</h1>

        <p style={styles.subtitle}>
          Create your Employee Management System account
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" style={styles.button}>
          Create Account
        </button>

        {message && (
          <p style={styles.message}>{message}</p>
        )}

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "20px",
  },

  form: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "16px",
  },

  message: {
    marginTop: "15px",
    color: "#166534",
    fontWeight: "bold",
  },
};

export default Register;