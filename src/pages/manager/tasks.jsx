import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(
      JSON.parse(localStorage.getItem("emsTasks")) || []
    );
  };

  const updateStatus = (id, status) => {
    const updated = tasks.map((task) =>
      task.id === id
        ? { ...task, status }
        : task
    );

    setTasks(updated);

    localStorage.setItem(
      "emsTasks",
      JSON.stringify(updated)
    );
  };

  const filtered = tasks.filter((task) =>
    `${task.title} ${task.employee} ${task.priority} ${task.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

      <h1>Tasks</h1>

      <p style={styles.subtitle}>
        Monitor and update team tasks
      </p>

      <div style={styles.cards}>

        <Stat title="Total" value={tasks.length} />
        <Stat title="Pending" value={pending} />
        <Stat title="In Progress" value={progress} />
        <Stat title="Completed" value={completed} />

      </div>

      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.grid}>

        {filtered.map((task) => (

          <div
            key={task.id}
            style={styles.card}
          >

            <h2>{task.title}</h2>

            <p>
              <strong>Employee:</strong>{" "}
              {task.employee}
            </p>

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

      {filtered.length === 0 && (
        <div style={styles.empty}>
          No tasks found.
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

  search: {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    marginBottom: "20px",
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
    border: "1px solid #d1d5db",
    borderRadius: "6px",
  },

  empty: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    color: "#6b7280",
  },
};

export default Tasks;