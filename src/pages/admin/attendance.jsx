import { useEffect, useState } from "react";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Load employees
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const savedEmployees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    setEmployees(savedEmployees);
  };

  // Change attendance
  const updateAttendance = (id, status) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === id
        ? {
            ...employee,
            attendance: status,
          }
        : employee
    );

    setEmployees(updatedEmployees);

    localStorage.setItem(
      "emsEmployees",
      JSON.stringify(updatedEmployees)
    );
  };

  // Search employees
  const filteredEmployees = employees.filter((employee) => {
    const text = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(text) ||
      employee.email.toLowerCase().includes(text) ||
      employee.department.toLowerCase().includes(text)
    );
  });

  const presentCount = employees.filter(
    (employee) => employee.attendance === "Present"
  ).length;

  const absentCount = employees.filter(
    (employee) => employee.attendance === "Absent"
  ).length;

  const leaveCount = employees.filter(
    (employee) => employee.attendance === "Leave"
  ).length;

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Attendance
          </h1>

          <p style={styles.subtitle}>
            Manage daily employee attendance
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
          style={styles.dateInput}
        />

      </div>


      {/* SUMMARY */}

      <div style={styles.summaryGrid}>

        <SummaryCard
          title="Total Employees"
          value={employees.length}
          icon="👥"
        />

        <SummaryCard
          title="Present"
          value={presentCount}
          icon="✅"
        />

        <SummaryCard
          title="Absent"
          value={absentCount}
          icon="❌"
        />

        <SummaryCard
          title="On Leave"
          value={leaveCount}
          icon="📅"
        />

      </div>


      {/* SEARCH */}

      <div style={styles.searchContainer}>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />

        <span style={styles.count}>
          {filteredEmployees.length} Employees
        </span>

      </div>


      {/* TABLE */}

      <div style={styles.tableCard}>

        {filteredEmployees.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              🕐
            </div>

            <h3>
              No employees found
            </h3>

            <p>
              Add employees first from the
              Employees page.
            </p>

          </div>

        ) : (

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}>
                    Employee
                  </th>

                  <th style={styles.th}>
                    Department
                  </th>

                  <th style={styles.th}>
                    Designation
                  </th>

                  <th style={styles.th}>
                    Attendance
                  </th>

                  <th style={styles.th}>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredEmployees.map(
                  (employee) => (

                    <tr key={employee.id}>

                      <td style={styles.td}>

                        <strong>
                          {employee.name}
                        </strong>

                        <div style={styles.email}>
                          {employee.email}
                        </div>

                      </td>

                      <td style={styles.td}>
                        {employee.department}
                      </td>

                      <td style={styles.td}>
                        {employee.designation}
                      </td>

                      <td style={styles.td}>

                        <span
                          style={{
                            ...styles.status,
                            background:
                              employee.attendance ===
                              "Present"
                                ? "#dcfce7"
                                : employee.attendance ===
                                  "Absent"
                                ? "#fee2e2"
                                : "#fef3c7",

                            color:
                              employee.attendance ===
                              "Present"
                                ? "#166534"
                                : employee.attendance ===
                                  "Absent"
                                ? "#991b1b"
                                : "#92400e",
                          }}
                        >
                          {employee.attendance ||
                            "Not Marked"}
                        </span>

                      </td>

                      <td style={styles.td}>

                        <button
                          style={styles.presentButton}
                          onClick={() =>
                            updateAttendance(
                              employee.id,
                              "Present"
                            )
                          }
                        >
                          Present
                        </button>

                        <button
                          style={styles.absentButton}
                          onClick={() =>
                            updateAttendance(
                              employee.id,
                              "Absent"
                            )
                          }
                        >
                          Absent
                        </button>

                        <button
                          style={styles.leaveButton}
                          onClick={() =>
                            updateAttendance(
                              employee.id,
                              "Leave"
                            )
                          }
                        >
                          Leave
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}


/* SUMMARY CARD */

function SummaryCard({
  title,
  value,
  icon,
}) {
  return (
    <div style={styles.summaryCard}>

      <div>

        <p style={styles.summaryTitle}>
          {title}
        </p>

        <h2 style={styles.summaryValue}>
          {value}
        </h2>

      </div>

      <div style={styles.summaryIcon}>
        {icon}
      </div>

    </div>
  );
}


/* STYLES */

const styles = {

  page: {
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "calc(100vh - 80px)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "26px",
    color: "#111827",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  dateInput: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    background: "white",
    fontSize: "14px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "25px",
  },

  summaryCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  summaryValue: {
    margin: "7px 0 0",
    fontSize: "26px",
    color: "#111827",
  },

  summaryIcon: {
    fontSize: "25px",
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  searchContainer: {
    background: "white",
    padding: "18px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  search: {
    flex: 1,
    padding: "11px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
  },

  count: {
    color: "#6b7280",
    fontSize: "13px",
  },

  tableCard: {
    background: "white",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "15px",
    background: "#f9fafb",
    color: "#374151",
    fontSize: "13px",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "15px",
    borderBottom: "1px solid #f1f5f9",
    color: "#4b5563",
    fontSize: "13px",
  },

  email: {
    marginTop: "4px",
    color: "#9ca3af",
    fontSize: "11px",
  },

  status: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  presentButton: {
    background: "#dcfce7",
    color: "#166534",
    border: "none",
    padding: "7px 9px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },

  absentButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    padding: "7px 9px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },

  leaveButton: {
    background: "#fef3c7",
    color: "#92400e",
    border: "none",
    padding: "7px 9px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "70px 20px",
    color: "#6b7280",
  },

  emptyIcon: {
    fontSize: "45px",
  },
};

export default Attendance;