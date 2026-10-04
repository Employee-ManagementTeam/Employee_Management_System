import { useEffect, useState } from "react";

function Performance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employee: "",
    period: "",
    rating: "3",
    feedback: "",
  });

  useEffect(() => {
    const savedRecords =
      JSON.parse(localStorage.getItem("emsPerformance")) || [];

    const savedEmployees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    setRecords(savedRecords);
    setEmployees(savedEmployees);
  }, []);

  const saveRecords = (data) => {
    setRecords(data);

    localStorage.setItem(
      "emsPerformance",
      JSON.stringify(data)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.employee ||
      !formData.period ||
      !formData.feedback
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      ...formData,
      rating: Number(formData.rating),
    };

    saveRecords([
      ...records,
      newRecord,
    ]);

    setFormData({
      employee: "",
      period: "",
      rating: "3",
      feedback: "",
    });

    setShowForm(false);
  };

  const updateRating = (id, rating) => {
    const updatedRecords = records.map(
      (record) =>
        record.id === id
          ? {
              ...record,
              rating: Number(rating),
            }
          : record
    );

    saveRecords(updatedRecords);
  };

  const deleteRecord = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this performance record?"
    );

    if (!confirmed) return;

    const updatedRecords = records.filter(
      (record) => record.id !== id
    );

    saveRecords(updatedRecords);
  };

  const filteredRecords = records.filter((record) => {
    const text = search.toLowerCase();

    return (
      record.employee
        .toLowerCase()
        .includes(text) ||
      record.period
        .toLowerCase()
        .includes(text) ||
      record.feedback
        .toLowerCase()
        .includes(text)
    );
  });

  const averageRating =
    records.length > 0
      ? (
          records.reduce(
            (total, record) =>
              total + Number(record.rating),
            0
          ) / records.length
        ).toFixed(1)
      : "0.0";

  const excellent = records.filter(
    (record) => Number(record.rating) >= 4
  ).length;

  const needsImprovement = records.filter(
    (record) => Number(record.rating) <= 2
  ).length;

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Performance Management
          </h1>

          <p style={styles.subtitle}>
            Evaluate employee performance and feedback
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + Add Evaluation
        </button>

      </div>


      {/* SUMMARY */}

      <div style={styles.summaryGrid}>

        <SummaryCard
          title="Total Evaluations"
          value={records.length}
          icon="📊"
        />

        <SummaryCard
          title="Average Rating"
          value={`${averageRating}/5`}
          icon="⭐"
        />

        <SummaryCard
          title="Good Performance"
          value={excellent}
          icon="🏆"
        />

        <SummaryCard
          title="Needs Improvement"
          value={needsImprovement}
          icon="📈"
        />

      </div>


      {/* FORM */}

      {showForm && (
        <div style={styles.formCard}>

          <h2 style={styles.formTitle}>
            New Performance Evaluation
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

              <input
                type="text"
                name="period"
                placeholder="Evaluation period (e.g. Q1 2026)"
                value={formData.period}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="1">
                  1 - Poor
                </option>

                <option value="2">
                  2 - Needs Improvement
                </option>

                <option value="3">
                  3 - Average
                </option>

                <option value="4">
                  4 - Good
                </option>

                <option value="5">
                  5 - Excellent
                </option>

              </select>

              <textarea
                name="feedback"
                placeholder="Enter performance feedback"
                value={formData.feedback}
                onChange={handleChange}
                style={styles.textarea}
              />

            </div>

            <div style={styles.formButtons}>

              <button
                type="submit"
                style={styles.saveButton}
              >
                Save Evaluation
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
          placeholder="Search performance records..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />

        <span style={styles.count}>
          {filteredRecords.length} Evaluations
        </span>

      </div>


      {/* TABLE */}

      <div style={styles.tableCard}>

        {filteredRecords.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              ⭐
            </div>

            <h3>
              No performance records
            </h3>

            <p>
              Add an evaluation to see it here.
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
                    Period
                  </th>

                  <th style={styles.th}>
                    Rating
                  </th>

                  <th style={styles.th}>
                    Feedback
                  </th>

                  <th style={styles.th}>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredRecords.map((record) => (

                  <tr key={record.id}>

                    <td style={styles.td}>
                      <strong>
                        {record.employee}
                      </strong>
                    </td>

                    <td style={styles.td}>
                      {record.period}
                    </td>

                    <td style={styles.td}>

                      <select
                        value={record.rating}
                        onChange={(e) =>
                          updateRating(
                            record.id,
                            e.target.value
                          )
                        }
                        style={styles.ratingSelect}
                      >
                        <option value="1">
                          1 / 5
                        </option>

                        <option value="2">
                          2 / 5
                        </option>

                        <option value="3">
                          3 / 5
                        </option>

                        <option value="4">
                          4 / 5
                        </option>

                        <option value="5">
                          5 / 5
                        </option>

                      </select>

                    </td>

                    <td style={styles.td}>
                      {record.feedback}
                    </td>

                    <td style={styles.td}>

                      <button
                        style={styles.deleteButton}
                        onClick={() =>
                          deleteRecord(record.id)
                        }
                      >
                        Delete
                      </button>

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
    gridTemplateColumns: "repeat(4, 1fr)",
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
    gridTemplateColumns: "repeat(2, 1fr)",
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
    minHeight: "100px",
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

  ratingSelect: {
    padding: "7px",
    border: "1px solid #d1d5db",
    borderRadius: "5px",
    cursor: "pointer",
  },

  deleteButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    padding: "7px 10px",
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

export default Performance;