import { useEffect, useState } from "react";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    setEmployees(
      JSON.parse(localStorage.getItem("emsEmployees")) || []
    );
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.email} ${employee.department} ${employee.designation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <div>
          <h1>Employees</h1>
          <p>View employee information</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search employees..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.card}>
        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Designation</th>
              <th style={styles.th}>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>

                <td style={styles.td}>
                  {employee.name}
                </td>

                <td style={styles.td}>
                  {employee.email}
                </td>

                <td style={styles.td}>
                  {employee.department}
                </td>

                <td style={styles.td}>
                  {employee.designation}
                </td>

                <td style={styles.td}>
                  {employee.attendance || "Not Marked"}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {filteredEmployees.length === 0 && (
          <p style={styles.empty}>
            No employees found.
          </p>
        )}

      </div>

    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh",
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
    marginBottom: "20px",
    boxSizing: "border-box",
  },

  card: {
    background: "white",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    overflow: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
  },

  empty: {
    padding: "20px",
    color: "#6b7280",
  },
};

export default Employees;