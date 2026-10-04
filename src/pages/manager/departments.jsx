import { useEffect, useState } from "react";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = () => {
    setDepartments(
      JSON.parse(localStorage.getItem("emsDepartments")) || []
    );
  };

  const filteredDepartments = departments.filter((department) =>
    `${department.name} ${department.description} ${department.manager}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <div>
          <h1>Departments</h1>
          <p>View department information</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search departments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.grid}>

        {filteredDepartments.map((department) => (
          <div
            key={department.id}
            style={styles.card}
          >
            <h2>{department.name}</h2>

            <p>
              <strong>Description:</strong>{" "}
              {department.description || "No description"}
            </p>

            <p>
              <strong>Manager:</strong>{" "}
              {department.manager || "Not assigned"}
            </p>
          </div>
        ))}

      </div>

      {filteredDepartments.length === 0 && (
        <div style={styles.empty}>
          No departments found.
        </div>
      )}

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

  header: {
    marginBottom: "20px",
  },

  search: {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    marginBottom: "25px",
    boxSizing: "border-box",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  empty: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    color: "#6b7280",
  },
};

export default Departments;