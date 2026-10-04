import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [performance, setPerformance] = useState([]);

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("email");

    const employees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    const currentEmployee = employees.find(
      (item) =>
        String(item.id) === String(userId) ||
        item.email === userEmail
    );

    setEmployee(currentEmployee || null);

    setTasks(JSON.parse(localStorage.getItem("emsTasks")) || []);
    setLeaves(JSON.parse(localStorage.getItem("emsLeaves")) || []);
    setDocuments(JSON.parse(localStorage.getItem("emsDocuments")) || []);
    setPayroll(JSON.parse(localStorage.getItem("emsPayroll")) || []);
    setPerformance(
      JSON.parse(localStorage.getItem("emsPerformance")) || []
    );
  };

  const employeeName =
    employee?.name ||
    localStorage.getItem("username") ||
    "Employee";

  const myTasks = tasks.filter(
    (task) => task.employee === employeeName
  );

  const myLeaves = leaves.filter(
    (leave) => leave.employee === employeeName
  );

  const myDocuments = documents.filter(
    (document) => document.employee === employeeName
  );

  const myPayroll = payroll.filter(
    (salary) => salary.employee === employeeName
  );

  const myPerformance = performance.filter(
    (item) => item.employee === employeeName
  );

  const pendingTasks = myTasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const completedTasks = myTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingLeaves = myLeaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    const routes = {
      Dashboard: "/employee/dashboard",
      Attendance: "/employee/attendance",
      Documents: "/employee/documents",
      Leave: "/employee/leave",
      Notifications: "/employee/notifications",
      Payroll: "/employee/payroll",
      Performance: "/employee/performance",
      Profile: "/employee/profile",
      Tasks: "/employee/tasks",
    };

    if (routes[menu]) {
      navigate(routes[menu]);
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const menuItems = [
    "Dashboard",
    "Attendance",
    "Tasks",
    "Leave",
    "Performance",
    "Documents",
    "Payroll",
    "Notifications",
    "Profile",
  ];

  return (
    <div style={styles.container}>

      <aside style={styles.sidebar}>

        <div style={styles.logo}>EMS</div>

        <div style={styles.logoText}>
          Employee Panel
        </div>

        <nav style={styles.nav}>
          {menuItems.map((menu) => (
            <div
              key={menu}
              onClick={() => handleMenuClick(menu)}
              style={{
                ...styles.menuItem,
                ...(activeMenu === menu
                  ? styles.activeMenu
                  : {}),
              }}
            >
              <span>{getIcon(menu)}</span>
              <span>{menu}</span>
            </div>
          ))}
        </nav>

        <button
          onClick={logout}
          style={styles.logout}
        >
          🚪 Logout
        </button>

      </aside>

      <main style={styles.main}>

        <header style={styles.navbar}>

          <div>
            <h2 style={styles.pageTitle}>
              Employee Dashboard
            </h2>

            <p style={styles.welcome}>
              Welcome back, {employeeName}
            </p>
          </div>

          <div style={styles.profile}>
            <div style={styles.avatar}>
              {employeeName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{employeeName}</strong>

              <div style={styles.role}>
                Employee
              </div>
            </div>
          </div>

        </header>

        <section style={styles.content}>

          <h1 style={styles.heading}>
            My Dashboard
          </h1>

          <p style={styles.description}>
            View your work information and activities
          </p>

          <div style={styles.cardGrid}>

            <StatCard
              title="Active Tasks"
              value={pendingTasks}
              icon="📋"
            />

            <StatCard
              title="Completed Tasks"
              value={completedTasks}
              icon="✅"
            />

            <StatCard
              title="Pending Leaves"
              value={pendingLeaves}
              icon="📅"
            />

            <StatCard
              title="Documents"
              value={myDocuments.length}
              icon="📄"
            />

            <StatCard
              title="Payroll Records"
              value={myPayroll.length}
              icon="💰"
            />

            <StatCard
              title="Performance Reviews"
              value={myPerformance.length}
              icon="⭐"
            />

          </div>

          <div style={styles.section}>

            <h2>Quick Actions</h2>

            <div style={styles.quickGrid}>

              <button
                style={styles.quickButton}
                onClick={() => handleMenuClick("Tasks")}
              >
                📋 View Tasks
              </button>

              <button
                style={styles.quickButton}
                onClick={() => handleMenuClick("Leave")}
              >
                📅 Apply Leave
              </button>

              <button
                style={styles.quickButton}
                onClick={() => handleMenuClick("Payroll")}
              >
                💰 View Payroll
              </button>

              <button
                style={styles.quickButton}
                onClick={() => handleMenuClick("Profile")}
              >
                👤 My Profile
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div style={styles.statCard}>

      <div>
        <p style={styles.statTitle}>{title}</p>
        <h2 style={styles.statValue}>{value}</h2>
      </div>

      <div style={styles.statIcon}>
        {icon}
      </div>

    </div>
  );
}

function getIcon(menu) {
  const icons = {
    Dashboard: "📊",
    Attendance: "🕒",
    Tasks: "📋",
    Leave: "📅",
    Performance: "⭐",
    Documents: "📄",
    Payroll: "💰",
    Notifications: "🔔",
    Profile: "👤",
  };

  return icons[menu] || "•";
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "white",
    padding: "20px 15px",
    boxSizing: "border-box",
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    width: "45px",
    height: "45px",
    background: "#2563eb",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },

  logoText: {
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "8px",
    marginBottom: "25px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
    overflowY: "auto",
  },

  menuItem: {
    padding: "12px",
    borderRadius: "7px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "14px",
  },

  activeMenu: {
    background: "#2563eb",
  },

  logout: {
    marginTop: "10px",
    padding: "12px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
    flexShrink: 0,
  },

  main: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
  },

  navbar: {
    height: "75px",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "20px",
  },

  welcome: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "12px",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  role: {
    fontSize: "11px",
    color: "#6b7280",
  },

  content: {
    padding: "30px",
  },

  heading: {
    margin: 0,
    fontSize: "27px",
  },

  description: {
    color: "#6b7280",
    marginBottom: "25px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },

  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  statValue: {
    margin: "7px 0 0",
    fontSize: "27px",
  },

  statIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  section: {
    marginTop: "30px",
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginTop: "15px",
  },

  quickButton: {
    padding: "14px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "7px",
    cursor: "pointer",
  },
};

export default Dashboard;