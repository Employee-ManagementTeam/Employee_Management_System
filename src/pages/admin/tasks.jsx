import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employee: "",
    priority: "Medium",
    dueDate: "",
  });

  // Load data
  useEffect(() => {
    const savedTasks =
      JSON.parse(localStorage.getItem("emsTasks")) || [];

    const savedEmployees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    setTasks(savedTasks);
    setEmployees(savedEmployees);
  }, []);

  // Save tasks
  const saveTasks = (data) => {
    setTasks(data);
    localStorage.setItem("emsTasks", JSON.stringify(data));
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.employee ||
      !formData.dueDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newTask = {
      id: Date.now(),
      ...formData,
      status: "Pending",
    };

    saveTasks([...tasks, newTask]);

    setFormData({
      title: "",
      description: "",
      employee: "",
      priority: "Medium",
      dueDate: "",
    });

    setShowForm(false);
  };

  // Update task status
  const updateStatus = (id, status) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, status }
        : task
    );

    saveTasks(updatedTasks);
  };

  // Delete task
  const deleteTask = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    const updatedTasks = tasks.filter(
      (task) => task.id !== id
    );

    saveTasks(updatedTasks);
  };

  // Search
  const filteredTasks = tasks.filter((task) => {
    const text = search.toLowerCase();

    return (
      task.title.toLowerCase().includes(text) ||
      task.employee.toLowerCase().includes(text) ||
      task.priority.toLowerCase().includes(text) ||
      task.status.toLowerCase().includes(text)
    );
  });

  // Counts
  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Task Management
          </h1>

          <p style={styles.subtitle}>
            Create and track employee tasks
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + Add Task
        </button>

      </div>


      {/* SUMMARY */}

      <div style={styles.summaryGrid}>

        <SummaryCard
          title="Total Tasks"
          value={tasks.length}
          icon="📋"
        />

        <SummaryCard
          title="Pending"
          value={pending}
          icon="⏳"
        />

        <SummaryCard
          title="In Progress"
          value={inProgress}
          icon="🔄"
        />

        <SummaryCard
          title="Completed"
          value={completed}
          icon="✅"
        />

      </div>


      {/* ADD TASK FORM */}

      {showForm && (
        <div style={styles.formCard}>

          <h2 style={styles.formTitle}>
            Create New Task
          </h2>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={formData.title}
                onChange={handleChange}
                style={styles.input}
              />

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
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Low">
                  Low Priority
                </option>

                <option value="Medium">
                  Medium Priority
                </option>

                <option value="High">
                  High Priority
                </option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                style={styles.input}
              />

              <textarea
                name="description"
                placeholder="Task description"
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
                Create Task
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
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />

        <span style={styles.count}>
          {filteredTasks.length} Tasks
        </span>

      </div>


      {/* TASK TABLE */}

      <div style={styles.tableCard}>

        {filteredTasks.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📋
            </div>

            <h3>
              No tasks found
            </h3>

            <p>
              Create a task to see it here.
            </p>

          </div>

        ) : (

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}>
                    Task
                  </th>

                  <th style={styles.th}>
                    Employee
                  </th>

                  <th style={styles.th}>
                    Priority
                  </th>

                  <th style={styles.th}>
                    Due Date
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

                {filteredTasks.map((task) => (

                  <tr key={task.id}>

                    <td style={styles.td}>

                      <strong>
                        {task.title}
                      </strong>

                      {task.description && (
                        <div style={styles.description}>
                          {task.description}
                        </div>
                      )}

                    </td>

                    <td style={styles.td}>
                      {task.employee}
                    </td>

                    <td style={styles.td}>

                      <span
                        style={{
                          ...styles.badge,
                          background:
                            task.priority === "High"
                              ? "#fee2e2"
                              : task.priority === "Low"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            task.priority === "High"
                              ? "#991b1b"
                              : task.priority === "Low"
                              ? "#166534"
                              : "#92400e",
                        }}
                      >
                        {task.priority}
                      </span>

                    </td>

                    <td style={styles.td}>
                      {task.dueDate}
                    </td>

                    <td style={styles.td}>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateStatus(
                            task.id,
                            e.target.value
                          )
                        }
                        style={styles.statusSelect}
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Completed">
                          Completed
                        </option>
                      </select>

                    </td>

                    <td style={styles.td}>

                      <button
                        style={styles.deleteButton}
                        onClick={() =>
                          deleteTask(task.id)
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

  description: {
    marginTop: "5px",
    color: "#9ca3af",
    fontSize: "12px",
  },

  badge: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
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

export default Tasks;