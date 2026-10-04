import { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const leaves =
      JSON.parse(localStorage.getItem("emsLeaves")) || [];

    const tasks =
      JSON.parse(localStorage.getItem("emsTasks")) || [];

    const email = localStorage.getItem("email");

    const employees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    const employee = employees.find(
      (item) => item.email === email
    );

    const name =
      employee?.name ||
      localStorage.getItem("username") ||
      "Employee";

    const messages = [];

    leaves
      .filter((leave) => leave.employee === name)
      .forEach((leave) => {
        messages.push({
          id: `leave-${leave.id}`,
          title: "Leave Update",
          message: `Your ${leave.type} request is ${leave.status}.`,
          icon: "📅",
        });
      });

    tasks
      .filter((task) => task.employee === name)
      .forEach((task) => {
        messages.push({
          id: `task-${task.id}`,
          title: "Task Assigned",
          message: `Task: ${task.title} - ${task.status}`,
          icon: "📋",
        });
      });

    setNotifications(messages);
  };

  return (
    <div style={styles.page}>

      <h1>Notifications</h1>

      <p style={styles.subtitle}>
        View your latest updates
      </p>

      <div style={styles.list}>

        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={styles.card}
          >

            <div style={styles.icon}>
              {notification.icon}
            </div>

            <div>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
            </div>

          </div>
        ))}

      </div>

      {notifications.length === 0 && (
        <div style={styles.empty}>
          🔔 No notifications available.
        </div>
      )}

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

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "25px",
  },

  card: {
    background: "white",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  icon: {
    fontSize: "30px",
  },

  empty: {
    marginTop: "25px",
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    color: "#6b7280",
  },
};

export default Notifications;