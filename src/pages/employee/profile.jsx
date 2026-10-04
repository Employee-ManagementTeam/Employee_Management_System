import { useEffect, useState } from "react";

function Profile() {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const email = localStorage.getItem("email");

    const employees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    const current = employees.find(
      (item) => item.email === email
    );

    setEmployee(current || null);
  };

  const name =
    employee?.name ||
    localStorage.getItem("username") ||
    "Employee";

  const email =
    employee?.email ||
    localStorage.getItem("email") ||
    "Not Available";

  return (
    <div style={styles.page}>

      <h1>My Profile</h1>

      <p style={styles.subtitle}>
        View your employee information
      </p>

      <div style={styles.card}>

        <div style={styles.avatar}>
          {name.charAt(0).toUpperCase()}
        </div>

        <h2>{name}</h2>

        <div style={styles.info}>
          <p>
            <strong>Email:</strong> {email}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {employee?.department || "Not Available"}
          </p>

          <p>
            <strong>Designation:</strong>{" "}
            {employee?.designation || "Not Available"}
          </p>

          <p>
            <strong>Attendance:</strong>{" "}
            {employee?.attendance || "Not Marked"}
          </p>
        </div>

      </div>

    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  subtitle: {
    color: "#6b7280",
  },

  card: {
    background: "white",
    maxWidth: "600px",
    padding: "30px",
    marginTop: "25px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
  },

  info: {
    marginTop: "25px",
    lineHeight: "1.8",
  },
};

export default Profile;