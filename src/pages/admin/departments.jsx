import { useEffect, useState } from "react";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    manager: "",
  });

  // Load departments
  useEffect(() => {
    const savedDepartments =
      JSON.parse(localStorage.getItem("emsDepartments")) || [];

    setDepartments(savedDepartments);
  }, []);

  // Save departments
  const saveDepartments = (data) => {
    setDepartments(data);

    localStorage.setItem(
      "emsDepartments",
      JSON.stringify(data)
    );
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add / Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.manager
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.id) {
      const updatedDepartments = departments.map(
        (department) =>
          department.id === formData.id
            ? formData
            : department
      );

      saveDepartments(updatedDepartments);
    } else {
      const newDepartment = {
        ...formData,
        id: Date.now(),
      };

      saveDepartments([
        ...departments,
        newDepartment,
      ]);
    }

    resetForm();
  };

  // Edit
  const handleEdit = (department) => {
    setFormData(department);
    setShowForm(true);
  };

  // Delete
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) return;

    const updatedDepartments =
      departments.filter(
        (department) =>
          department.id !== id
      );

    saveDepartments(updatedDepartments);
  };

  // Reset
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      manager: "",
    });

    setShowForm(false);
  };

  // Search
  const filteredDepartments =
    departments.filter((department) => {
      const text = search.toLowerCase();

      return (
        department.name
          .toLowerCase()
          .includes(text) ||
        department.description
          .toLowerCase()
          .includes(text) ||
        department.manager
          .toLowerCase()
          .includes(text)
      );
    });

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Departments
          </h1>

          <p style={styles.subtitle}>
            Manage company departments
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Department
        </button>

      </div>


      {/* SEARCH */}

      <div style={styles.searchContainer}>

        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />

        <span style={styles.count}>
          {filteredDepartments.length} Departments
        </span>

      </div>


      {/* FORM */}

      {showForm && (
        <div style={styles.formCard}>

          <h2 style={styles.formTitle}>
            {formData.id
              ? "Edit Department"
              : "Add Department"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              <input
                type="text"
                name="name"
                placeholder="Department Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="text"
                name="manager"
                placeholder="Department Manager"
                value={formData.manager}
                onChange={handleChange}
                style={styles.input}
              />

              <textarea
                name="description"
                placeholder="Department Description"
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
              />

            </div>

            <div style={styles.formButtons}>

              <button
                type="submit"
                style={styles.saveButton}
              >
                {formData.id
                  ? "Update Department"
                  : "Save Department"}
              </button>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* TABLE */}

      <div style={styles.tableCard}>

        {filteredDepartments.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              🏢
            </div>

            <h3>
              No departments found
            </h3>

            <p>
              Add your first department
              using the button above.
            </p>

          </div>

        ) : (

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}>
                    Department
                  </th>

                  <th style={styles.th}>
                    Description
                  </th>

                  <th style={styles.th}>
                    Manager
                  </th>

                  <th style={styles.th}>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredDepartments.map(
                  (department) => (

                    <tr key={department.id}>

                      <td style={styles.td}>
                        <strong>
                          {department.name}
                        </strong>
                      </td>

                      <td style={styles.td}>
                        {department.description}
                      </td>

                      <td style={styles.td}>
                        {department.manager}
                      </td>

                      <td style={styles.td}>

                        <button
                          style={styles.editButton}
                          onClick={() =>
                            handleEdit(department)
                          }
                        >
                          Edit
                        </button>

                        <button
                          style={styles.deleteButton}
                          onClick={() =>
                            handleDelete(
                              department.id
                            )
                          }
                        >
                          Delete
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
    whiteSpace: "nowrap",
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
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    boxSizing: "border-box",
    width: "100%",
  },

  textarea: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    minHeight: "90px",
    resize: "vertical",
    gridColumn: "1 / -1",
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

  editButton: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "none",
    padding: "7px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "7px",
  },

  deleteButton: {
    background: "#fef2f2",
    color: "#dc2626",
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

export default Departments;