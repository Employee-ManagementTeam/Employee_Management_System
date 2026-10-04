import { useEffect, useState } from "react";

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employee: "",
    type: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // Load data
  useEffect(() => {
    const savedLeaves =
      JSON.parse(localStorage.getItem("emsLeaves")) || [];

    const savedEmployees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    setLeaves(savedLeaves);
    setEmployees(savedEmployees);
  }, []);

  // Save leaves
  const saveLeaves = (data) => {
    setLeaves(data);

    localStorage.setItem(
      "emsLeaves",
      JSON.stringify(data)
    );
  };

  // Form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add leave
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.employee ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.reason
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newLeave = {
      id: Date.now(),
      ...formData,
      status: "Pending",
    };

    saveLeaves([
      ...leaves,
      newLeave,
    ]);

    setFormData({
      employee: "",
      type: "Casual Leave",
      fromDate: "",
      toDate: "",
      reason: "",
    });

    setShowForm(false);
  };

  // Change status
  const updateStatus = (id, status) => {
    const updatedLeaves = leaves.map(
      (leave) =>
        leave.id === id
          ? { ...leave, status }
          : leave
    );

    saveLeaves(updatedLeaves);
  };

  // Search
  const filteredLeaves = leaves.filter((leave) => {
    const text = search.toLowerCase();

    return (
      leave.employee
        .toLowerCase()
        .includes(text) ||
      leave.type
        .toLowerCase()
        .includes(text) ||
      leave.status
        .toLowerCase()
        .includes(text)
    );
  });

  const pending = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approved = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejected = leaves.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Leave Management
          </h1>

          <p style={styles.subtitle}>
            Review and manage employee leave requests
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + Add Leave Request
        </button>

      </div>


      {/* SUMMARY */}

      <div style={styles.summaryGrid}>

        <SummaryCard
          title="Total Requests"
          value={leaves.length}
          icon="📋"
        />

        <SummaryCard
          title="Pending"
          value={pending}
          icon="⏳"
        />

        <SummaryCard
          title="Approved"
          value={approved}
          icon="✅"
        />

        <SummaryCard
          title="Rejected"
          value={rejected}
          icon="❌"
        />

      </div>


      {/* FORM */}

      {showForm && (
        <div style={styles.formCard}>

          <h2 style={styles.formTitle}>
            New Leave Request
          </h2>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">
                  Select Employee
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.name}
                  >
                    {employee.name}
                  </option>
                ))}

              </select>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={styles.input}
              >
                <option>
                  Casual Leave
                </option>

                <option>
                  Sick Leave
                </option>

                <option>
                  Annual Leave
                </option>

                <option>
                  Emergency Leave
                </option>
              </select>

              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                style={styles.input}
              />

              <textarea
                name="reason"
                placeholder="Reason for leave"
                value={formData.reason}
                onChange={handleChange}
                style={styles.textarea}
              />

            </div>

            <div style={styles.formButtons}>

              <button
                type="submit"
                style={styles.saveButton}
              >
                Submit Request
              </button>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* SEARCH */}

      <div style={styles.searchContainer}>

        <input
          type="text"
          placeholder="Search leave requests..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />

        <span style={styles.count}>
          {filteredLeaves.length} Requests
        </span>

      </div>


      {/* TABLE */}

      <div style={styles.tableCard}>

        {filteredLeaves.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📅
            </div>

            <h3>
              No leave requests
            </h3>

            <p>
              Add a leave request to see it here.
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
                    Leave Type
                  </th>

                  <th style={styles.th}>
                    From
                  </th>

                  <th style={styles.th}>
                    To
                  </th>

                  <th style={styles.th}>
                    Reason
                  </th>

                  <th style={styles.th}>
                    Status
                  </th>

                  <th style={styles.th}>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLeaves.map((leave) => (

                  <tr key={leave.id}>

                    <td style={styles.td}>
                      <strong>
                        {leave.employee}
                      </strong>
                    </td>

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

                      <span
                        style={{
                          ...styles.status,
                          background:
                            leave.status === "Approved"
                              ? "#dcfce7"
                              : leave.status === "Rejected"
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            leave.status === "Approved"
                              ? "#166534"
                              : leave.status === "Rejected"
                              ? "#991b1b"
                              : "#92400e",
                        }}
                      >
                        {leave.status}
                      </span>

                    </td>

                    <td style={styles.td}>

                      {leave.status === "Pending" && (
                        <>
                          <button
                            style={styles.approveButton}
                            onClick={() =>
                              updateStatus(
                                leave.id,
                                "Approved"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            style={styles.rejectButton}
                            onClick={() =>
                              updateStatus(
                                leave.id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}


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

  addButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
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
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  formCard: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
  },

  formTitle: {
    marginTop: 0,
    marginBottom: "20px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "15px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
  },

  textarea: {
    gridColumn: "1 / -1",
    minHeight: "90px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "Arial",
  },

  formButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  saveButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  cancelButton: {
    background: "#e5e7eb",
    color: "#374151",
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  searchContainer: {
    background: "white",
    padding: "18px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
    display: "flex",
    gap: "15px",
    alignItems: "center",
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

  status: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  approveButton: {
    background: "#dcfce7",
    color: "#166534",
    border: "none",
    padding: "7px 9px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },

  rejectButton: {
    background: "#fee2e2",
    color: "#991b1b",
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

export default Leave;