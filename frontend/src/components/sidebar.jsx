import { NavLink } from "react-router-dom";

function Sidebar({ role = "employee" }) {
  const employeeMenu = [
    { name: "Dashboard", path: "/employee/dashboard" },
    { name: "Profile", path: "/employee/profile" },
    { name: "Attendance", path: "/employee/attendance" },
    { name: "Leave", path: "/employee/leave" },
    { name: "Tasks", path: "/employee/tasks" },
    { name: "Performance", path: "/employee/performance" },
    { name: "Documents", path: "/employee/documents" },
    { name: "Payroll", path: "/employee/payroll" },
    { name: "Notifications", path: "/employee/notifications" },
  ];

  const managerMenu = [
    { name: "Dashboard", path: "/manager/dashboard" },
    { name: "Employees", path: "/manager/employees" },
    { name: "Departments", path: "/manager/departments" },
    { name: "Attendance", path: "/manager/attendance" },
    { name: "Leave Approvals", path: "/manager/leave-approvals" },
    { name: "Tasks", path: "/manager/tasks" },
    { name: "Performance", path: "/manager/performance" },
  ];

  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Employees", path: "/admin/employees" },
    { name: "Departments", path: "/admin/departments" },
    { name: "Attendance", path: "/admin/attendance" },
    { name: "Leave Management", path: "/admin/leave-management" },
    { name: "Tasks", path: "/admin/tasks" },
    { name: "Performance", path: "/admin/performance" },
    { name: "Documents", path: "/admin/documents" },
    { name: "Payroll", path: "/admin/payroll" },
  ];

  const menu =
    role === "admin"
      ? adminMenu
      : role === "manager"
      ? managerMenu
      : employeeMenu;

  return (
    <aside className="w-64 min-h-screen bg-blue-700 text-white p-5">

      <h2 className="text-2xl font-bold mb-8">
        Employee Management
      </h2>

      <nav className="space-y-2">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-white text-blue-700 font-semibold"
                  : "hover:bg-blue-600"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;