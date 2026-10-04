import { useEffect, useState } from "react";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    department: "",
    designation: "",
    attendance: "Present",
  });

  // Load employees from localStorage
  useEffect(() => {
    const savedEmployees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    setEmployees(savedEmployees);
  }, []);

  // Save employees to localStorage
  const saveEmployees = (updatedEmployees) => {
    setEmployees(updatedEmployees);
    localStorage.setItem(
      "emsEmployees",
      JSON.stringify(updatedEmployees)
    );
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add or update employee
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.department ||
      !formData.designation
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.id) {
      // UPDATE
      const updatedEmployees = employees.map((employee) =>
        employee.id === formData.id
          ? formData
          : employee
      );

      saveEmployees(updatedEmployees);
    } else {
      // ADD
      const newEmployee = {
        ...formData,
        id: Date.now(),
      };

      saveEmployees([
        ...employees,
        newEmployee,
      ]);
    }

    resetForm();
  };

  // Edit employee
  const handleEdit = (employee) => {
    setFormData(employee);
    setShowForm(true);
  };

  // Delete employee
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    const updatedEmployees = employees.filter(
      (employee) => employee.id !== id
    );

    saveEmployees(updatedEmployees);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      email: "",
      department: "",
      designation: "",
      attendance: "Present",
    });

    setShowForm(false);
  };

  // Search
  const filteredEmployees = employees.filter((employee) => {
    const text = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(text) ||
      employee.email.toLowerCase().includes(text) ||
      employee.department.toLowerCase().includes(text) ||
      employee.designation.toLowerCase().includes(text)
    );
  });

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Employees
          </h1>

          <p style={styles.subtitle}>
            Manage employee information
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Employee
        </button>

      </div>


      {/* SEARCH */}

      <div style={styles.searchContainer}>

        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />

        <span style={styles.employeeCount}>
          {filteredEmployees.length} Employees
        </span>

      </div>


      {/* FORM */}

      {showForm && (
        <div style={styles.formCard}>

          <h2 style={styles.formTitle}>
            {formData.id
              ? "Edit Employee"
              : "Add Employee"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              <input
                type="text"
                name="name"
                placeholder="Employee Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Present">
                  Present
                </option>

                <option value="Absent">
                  Absent
                </option>

                <option value="Leave">
                  Leave
                </option>
              </select>

            </div>

            <div style={styles.formButtons}>

              <button
                type="submit"
                style={styles.saveButton}
              >
                {formData.id
                  ? "Update Employee"
                  : "Save Employee"}
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


      {/* EMPLOYEE TABLE */}

      <div style={styles.tableCard}>

        {filteredEmployees.length === 0 ? (

          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              👥
            </div>

            <h3>
              No employees found
            </h3>

            <p>
              Add your first employee using
              the button above.
            </p>
          </div>

        ) : (

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}>
                    Name
                  </th>

                  <th style={styles.th}>
                    Email
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
                    Actions
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
                          {employee.attendance}
                        </span>

                      </td>

                      <td style={styles.td}>

                        <button
                          style={styles.editButton}
                          onClick={() =>
                            handleEdit(employee)
                          }
                        >
                          Edit
                        </button>

                        <button
                          style={styles.deleteButton}
                          onClick={() =>
                            handleDelete(employee.id)
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
    fontSize: "14px",
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
    outline: "none",
    fontSize: "14px",
  },

  employeeCount: {
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
    fontSize: "19px",
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
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
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
    borderBottom:
      "1px solid #e5e7eb",
  },

  td: {
    padding: "15px",
    borderBottom:
      "1px solid #f1f5f9",
    color: "#4b5563",
    fontSize: "13px",
  },

  status: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
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
    marginBottom: "10px",
  },
};

export default Employees;