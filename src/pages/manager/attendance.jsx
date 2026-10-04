import { useEffect, useState } from "react";

function Attendance() {
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

  const markAttendance = (id, status) => {
    const updated = employees.map((employee) =>
      employee.id === id
        ? { ...employee, attendance: status }
        : employee
    );

    setEmployees(updated);
    localStorage.setItem(
      "emsEmployees",
      JSON.stringify(updated)
    );
  };

  const filtered = employees.filter((employee) =>
    `${employee.name} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const present = employees.filter(
    (employee) => employee.attendance === "Present"
  ).length;

  const absent = employees.filter(
    (employee) => employee.attendance === "Absent"
  ).length;

  const leave = employees.filter(
    (employee) => employee.attendance === "Leave"
  ).length;

  return (
    <div style={styles.page}>

      <h1>Attendance</h1>
      <p style={styles.subtitle}>
        Monitor team attendance
      </p>

      <div style={styles.cards}>

        <Stat title="Total" value={employees.length} />
        <Stat title="Present" value={present} />
        <Stat title="Absent" value={absent} />
        <Stat title="Leave" value={leave} />

      </div>

      <input
        placeholder="Search employees..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.tableCard}>

        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((employee) => (

              <tr key={employee.id}>

                <td style={styles.td}>
                  {employee.name}
                </td>

                <td style={styles.td}>
                  {employee.department}
                </td>

                <td style={styles.td}>
                  {employee.attendance || "Not Marked"}
                </td>

                <td style={styles.td}>

                  <button
                    onClick={() =>
                      markAttendance(employee.id, "Present")
                    }
                    style={styles.present}
                  >
                    Present
                  </button>

                  <button
                    onClick={() =>
                      markAttendance(employee.id, "Absent")
                    }
                    style={styles.absent}
                  >
                    Absent
                  </button>

                  <button
                    onClick={() =>
                      markAttendance(employee.id, "Leave")
                    }
                    style={styles.leave}
                  >
                    Leave
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={styles.stat}>
      <p>{title}</p>
      <h2>{value}</h2>
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

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    margin: "25px 0",
  },

  stat: {
    background: "white",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  search: {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
  },

  tableCard: {
    background: "white",
    borderRadius: "10px",
    overflow: "auto",
    border: "1px solid #e5e7eb",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px",
    textAlign: "left",
    background: "#f9fafb",
  },

  td: {
    padding: "14px",
    borderTop: "1px solid #e5e7eb",
  },

  present: {
    marginRight: "5px",
    padding: "7px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  absent: {
    marginRight: "5px",
    padding: "7px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  leave: {
    padding: "7px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Attendance;