import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
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

  const loadTasks = () => {
    const saved =
      JSON.parse(localStorage.getItem("emsTasks")) || [];

    setTasks(
      saved.filter(
        (task) => task.employee === getEmployeeName()
      )
    );
  };

  const updateStatus = (id, status) => {
    const allTasks =
      JSON.parse(localStorage.getItem("emsTasks")) || [];

    const updated = allTasks.map((task) =>
      task.id === id
        ? { ...task, status }
        : task
    );

    localStorage.setItem(
      "emsTasks",
      JSON.stringify(updated)
    );

    loadTasks();
  };

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const progress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div style={styles.page}>

      <h1>My Tasks</h1>

      <p style={styles.subtitle}>
        View and update your assigned tasks
      </p>

      <div style={styles.cards}>

        <Stat title="Total" value={tasks.length} />
        <Stat title="Pending" value={pending} />
        <Stat title="In Progress" value={progress} />
        <Stat title="Completed" value={completed} />

      </div>

      <div style={styles.grid}>

        {tasks.map((task) => (

          <div
            key={task.id}
            style={styles.card}
          >

            <h2>{task.title}</h2>

            <p>
              <strong>Description:</strong>{" "}
              {task.description}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {task.priority}
            </p>

            <p>
              <strong>Due Date:</strong>{" "}
              {task.dueDate}
            </p>

            <label>
              <strong>Status</strong>
            </label>

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus(
                  task.id,
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

          </div>

        ))}

      </div>

      {tasks.length === 0 && (
        <div style={styles.empty}>
          No tasks assigned to you.
        </div>
      )}

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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  select: {
    width: "100%",
    padding: "10px",
    marginTop: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
  },

  empty: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    color: "#6b7280",
  },
};

export default Tasks;