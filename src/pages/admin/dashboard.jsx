import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const savedEmployees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    const savedDepartments =
      JSON.parse(localStorage.getItem("emsDepartments")) || [];

    const savedLeaves =
      JSON.parse(localStorage.getItem("emsLeaves")) || [];

    const savedTasks =
      JSON.parse(localStorage.getItem("emsTasks")) || [];

    setEmployees(savedEmployees);
    setDepartments(savedDepartments);
    setLeaves(savedLeaves);
    setTasks(savedTasks);
  };

  const totalEmployees = employees.length;

  const totalDepartments = departments.length;

  const presentToday = employees.filter(
    (employee) => employee.attendance === "Present"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const activeTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    if (menu === "Dashboard") {
      navigate("/admin/dashboard");
    }

    if (menu === "Employees") {
      navigate("/admin/employees");
    }

    if (menu === "Department") {
      navigate("/admin/departments");
    }
    if (menu === "Task") {
      navigate("/admin/tasks");
    }   
    if (menu === "Performance") {
      navigate("/admin/performance");
    }   
    if (menu === "Document") {
      navigate("/admin/documents");
    }   
    if (menu === "Payroll") {
      navigate("/admin/payroll");
    }

    if (menu === "Attendance") {
      navigate("/admin/attendance");
    }

    if (menu === "Leave Management") {
      navigate("/admin/leave-management");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const menuItems = [
    "Dashboard",
    "Employees",
    "Department",
    "Attendance",
    "Leave Management",
    "Task",
    "Performance",
    "Document",
    "Payroll",
  ];

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}

      <aside style={styles.sidebar}>

  <div style={styles.logo}>
    EMS
  </div>

  <div style={styles.logoText}>
    Employee Management
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
        <span>
          {getIcon(menu)}
        </span>

        <span>
          {menu}
        </span>
      </div>
    ))}

  </nav>

  <button
    onClick={handleLogout}
    style={styles.logout}
  >
    🚪 Logout
  </button>

</aside>


      {/* MAIN AREA */}

      <main style={styles.main}>

        {/* NAVBAR */}

        <header style={styles.navbar}>

          <div>
            <h2 style={styles.pageTitle}>
              Admin Dashboard
            </h2>

            <p style={styles.welcome}>
              Welcome back, Admin
            </p>
          </div>

          <div style={styles.profile}>
            <div style={styles.avatar}>
              A
            </div>

            <div>
              <strong>Admin</strong>

              <div style={styles.role}>
                Administrator
              </div>
            </div>
          </div>

        </header>


        {/* CONTENT */}

        <section style={styles.content}>

          <h1 style={styles.heading}>
            Dashboard Overview
          </h1>

          <p style={styles.description}>
            Monitor your employee management system
          </p>


          {/* STAT CARDS */}

          <div style={styles.cardGrid}>

            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon="👥"
            />

            <StatCard
              title="Departments"
              value={totalDepartments}
              icon="🏢"
            />

            <StatCard
              title="Present Today"
              value={presentToday}
              icon="✅"
            />

            <StatCard
              title="Pending Leaves"
              value={pendingLeaves}
              icon="📅"
            />

            <StatCard
              title="Active Tasks"
              value={activeTasks}
              icon="📋"
            />

            <StatCard
              title="Completed Tasks"
              value={completedTasks}
              icon="🎯"
            />

          </div>


          {/* QUICK ACTIONS */}

          <div style={styles.section}>

            <h2 style={styles.sectionTitle}>
              Quick Actions
            </h2>

            <div style={styles.quickGrid}>

              <button
                style={styles.quickButton}
                onClick={() =>
                  handleMenuClick("Employees")
                }
              >
                👥 Manage Employees
              </button>

              <button
                style={styles.quickButton}
                onClick={() =>
                  handleMenuClick("Department")
                }
              >
                🏢 Manage Departments
              </button>

              <button
                style={styles.quickButton}
                onClick={() =>
                  handleMenuClick("Attendance")
                }
              >
                📋 View Attendance
              </button>

              <button
                style={styles.quickButton}
                onClick={() =>
                  handleMenuClick("Leave Management")
                }
              >
                📅 Manage Leaves
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* STAT CARD */

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div style={styles.statCard}>

      <div>

        <p style={styles.statTitle}>
          {title}
        </p>

        <h2 style={styles.statValue}>
          {value}
        </h2>

      </div>

      <div style={styles.statIcon}>
        {icon}
      </div>

    </div>
  );
}


/* ICONS */

function getIcon(menu) {
  const icons = {
    Dashboard: "📊",
    Employees: "👥",
    Department: "🏢",
    Attendance: "🕒",
    "Leave Management": "📅",
    Task: "📋",
    Performance: "⭐",
    Document: "📄",
    Payroll: "💰",
  };

  return icons[menu] || "•";
}


/* STYLES */

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

nav: {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  flex: 1,
  overflowY: "auto",
  paddingRight: "5px",
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
    marginBottom: "8px",
  },

  logoText: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "30px",
  },

  

  menuItem: {
    padding: "12px 13px",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    fontSize: "14px",
  },

  activeMenu: {
    background: "#2563eb",
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
    boxSizing: "border-box",
  },

  pageTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#111827",
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
    marginTop: "2px",
  },

  content: {
    padding: "30px",
  },

  heading: {
    margin: 0,
    color: "#111827",
    fontSize: "27px",
  },

  description: {
    color: "#6b7280",
    marginTop: "7px",
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
    alignItems: "center",
    justifyContent: "space-between",
  },

  statTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  statValue: {
    margin: "7px 0 0",
    fontSize: "27px",
    color: "#111827",
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

  sectionTitle: {
    marginTop: 0,
    color: "#111827",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },

  quickButton: {
    padding: "14px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "7px",
    cursor: "pointer",
    color: "#374151",
  },
};

export default Dashboard;