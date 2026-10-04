import { useEffect, useState } from "react";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employee: "",
    documentName: "",
    documentType: "ID Proof",
    status: "Submitted",
  });

  useEffect(() => {
    const savedDocuments =
      JSON.parse(localStorage.getItem("emsDocuments")) || [];

    const savedEmployees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    setDocuments(savedDocuments);
    setEmployees(savedEmployees);
  }, []);

  const saveDocuments = (data) => {
    setDocuments(data);
    localStorage.setItem("emsDocuments", JSON.stringify(data));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.employee || !formData.documentName) {
      alert("Please fill all required fields.");
      return;
    }

    const newDocument = {
      id: Date.now(),
      ...formData,
    };

    saveDocuments([...documents, newDocument]);

    setFormData({
      employee: "",
      documentName: "",
      documentType: "ID Proof",
      status: "Submitted",
    });

    setShowForm(false);
  };

  const updateStatus = (id, status) => {
    const updated = documents.map((document) =>
      document.id === id
        ? { ...document, status }
        : document
    );

    saveDocuments(updated);
  };

  const deleteDocument = (id) => {
    if (!window.confirm("Delete this document record?")) {
      return;
    }

    const updated = documents.filter(
      (document) => document.id !== id
    );

    saveDocuments(updated);
  };

  const filteredDocuments = documents.filter((document) => {
    const text = search.toLowerCase();

    return (
      document.employee.toLowerCase().includes(text) ||
      document.documentName.toLowerCase().includes(text) ||
      document.documentType.toLowerCase().includes(text)
    );
  });

  const submitted = documents.filter(
    (document) => document.status === "Submitted"
  ).length;

  const verified = documents.filter(
    (document) => document.status === "Verified"
  ).length;

  const pending = documents.filter(
    (document) => document.status === "Pending"
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Document Management</h1>
          <p style={styles.subtitle}>
            Manage employee documents and verification status
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + Add Document
        </button>
      </div>

      <div style={styles.summaryGrid}>
        <SummaryCard
          title="Total Documents"
          value={documents.length}
          icon="📁"
        />

        <SummaryCard
          title="Submitted"
          value={submitted}
          icon="📤"
        />

        <SummaryCard
          title="Verified"
          value={verified}
          icon="✅"
        />

        <SummaryCard
          title="Pending"
          value={pending}
          icon="⏳"
        />
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Add Employee Document</h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Employee</option>

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
                name="documentName"
                placeholder="Document name"
                value={formData.documentName}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="ID Proof">ID Proof</option>
                <option value="Education">Education</option>
                <option value="Address Proof">Address Proof</option>
                <option value="Experience">Experience</option>
                <option value="Offer Letter">Offer Letter</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Verified">Verified</option>
              </select>
            </div>

            <div style={styles.formButtons}>
              <button
                type="submit"
                style={styles.saveButton}
              >
                Save Document
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

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <span style={styles.count}>
          {filteredDocuments.length} Documents
        </span>
      </div>

      <div style={styles.tableCard}>
        {filteredDocuments.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📁</div>
            <h3>No documents found</h3>
            <p>Add an employee document to see it here.</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Document</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredDocuments.map((document) => (
                  <tr key={document.id}>
                    <td style={styles.td}>
                      <strong>{document.employee}</strong>
                    </td>

                    <td style={styles.td}>
                      {document.documentName}
                    </td>

                    <td style={styles.td}>
                      {document.documentType}
                    </td>

                    <td style={styles.td}>
                      <select
                        value={document.status}
                        onChange={(e) =>
                          updateStatus(
                            document.id,
                            e.target.value
                          )
                        }
                        style={styles.statusSelect}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Verified">Verified</option>
                      </select>
                    </td>

                    <td style={styles.td}>
                      <button
                        style={styles.deleteButton}
                        onClick={() =>
                          deleteDocument(document.id)
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

function SummaryCard({ title, value, icon }) {
  return (
    <div style={styles.summaryCard}>
      <div>
        <p style={styles.summaryTitle}>{title}</p>
        <h2 style={styles.summaryValue}>{value}</h2>
      </div>

      <div style={styles.summaryIcon}>{icon}</div>
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

  statusSelect: {
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

export default Documents;