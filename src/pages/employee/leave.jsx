import { useEffect, useState } from "react";

function Leave() {
  const [leaves, setLeaves] = useState([]);

  const [type, setType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadLeaves();
  }, []);

  const getEmployeeName = () => {
    const email = localStorage.getItem("email");

    const employees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    const employee = employees.find(
      (item) => item.email === email
    );

    return (
      employee?.name ||
      localStorage.getItem("username") ||
      "Employee"
    );
  };

  const loadLeaves = () => {
    const saved =
      JSON.parse(localStorage.getItem("emsLeaves")) || [];

    const name = getEmployeeName();

    setLeaves(
      saved.filter(
        (leave) => leave.employee === name
      )
    );
  };

  const applyLeave = (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || !reason) {
      alert("Please fill all fields.");
      return;
    }

    const allLeaves =
      JSON.parse(localStorage.getItem("emsLeaves")) || [];

    const newLeave = {
      id: Date.now(),
      employee: getEmployeeName(),
      type,
      fromDate,
      toDate,
      reason,
      status: "Pending",
    };

    const updated = [...allLeaves, newLeave];

    localStorage.setItem(
      "emsLeaves",
      JSON.stringify(updated)
    );

    setLeaves(
      updated.filter(
        (leave) =>
          leave.employee === getEmployeeName()
      )
    );

    setFromDate("");
    setToDate("");
    setReason("");

    alert("Leave application submitted.");
  };

  return (
    <div style={styles.page}>

      <h1>Leave</h1>

      <p style={styles.subtitle}>
        Apply for leave and track your requests
      </p>

      <div style={styles.formCard}>

        <h2>Apply for Leave</h2>

        <form onSubmit={applyLeave}>

          <label>Leave Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={styles.input}
          >
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Emergency Leave</option>
            <option>Other</option>
          </select>

          <label>From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={styles.input}
          />

          <label>To Date</label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={styles.input}
          />

          <label>Reason</label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={styles.textarea}
            placeholder="Enter reason"
          />

          <button
            type="submit"
            style={styles.button}
          >
            Submit Leave
          </button>

        </form>

      </div>

      <div style={styles.tableCard}>

        <h2>My Leave Requests</h2>

        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>

            {leaves.map((leave) => (
              <tr key={leave.id}>

                <td style={styles.td}>
                  {leave.type}
                </td>

                <td style={styles.td}>
                  {leave.fromDate}
                </td>

                <td style={styles.td}>
                  {leave.toDate}
                </td>

                <td style={styles.td}>
                  {leave.reason}
                </td>

                <td style={styles.td}>
                  {leave.status}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

        {leaves.length === 0 && (
          <p style={styles.empty}>
            No leave requests yet.
          </p>
        )}

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

  formCard: {
    maxWidth: "600px",
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    marginTop: "25px",
  },

  input: {
    width: "100%",
    padding: "11px",
    margin: "7px 0 15px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    height: "90px",
    padding: "11px",
    margin: "7px 0 15px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
  },

  button: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  tableCard: {
    marginTop: "25px",
    background: "white",
    padding: "25px",
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
    padding: "12px",
    background: "#f9fafb",
  },

  td: {
    padding: "12px",
    borderTop: "1px solid #e5e7eb",
  },

  empty: {
    color: "#6b7280",
  },
};

export default Leave;