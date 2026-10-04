import { useEffect, useState } from "react";

function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = () => {
    setLeaves(
      JSON.parse(localStorage.getItem("emsLeaves")) || []
    );
  };

  const updateStatus = (id, status) => {
    const updated = leaves.map((leave) =>
      leave.id === id
        ? { ...leave, status }
        : leave
    );

    setLeaves(updated);

    localStorage.setItem(
      "emsLeaves",
      JSON.stringify(updated)
    );
  };

  const filtered = leaves.filter((leave) =>
    `${leave.employee} ${leave.type} ${leave.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

      <h1>Leave Approvals</h1>

      <p style={styles.subtitle}>
        Review and manage employee leave requests
      </p>

      <div style={styles.cards}>

        <Stat title="Total" value={leaves.length} />
        <Stat title="Pending" value={pending} />
        <Stat title="Approved" value={approved} />
        <Stat title="Rejected" value={rejected} />

      </div>

      <input
        placeholder="Search leave requests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.tableCard}>

        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((leave) => (

              <tr key={leave.id}>

                <td style={styles.td}>
                  {leave.employee}
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
                  {leave.status}
                </td>

                <td style={styles.td}>

                  {leave.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(
                            leave.id,
                            "Approved"
                          )
                        }
                        style={styles.approve}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            leave.id,
                            "Rejected"
                          )
                        }
                        style={styles.reject}
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

        {filtered.length === 0 && (
          <p style={styles.empty}>
            No leave requests found.
          </p>
        )}

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

  approve: {
    padding: "7px 10px",
    marginRight: "5px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  reject: {
    padding: "7px 10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  empty: {
    padding: "20px",
    color: "#6b7280",
  },
};

export default LeaveApprovals;