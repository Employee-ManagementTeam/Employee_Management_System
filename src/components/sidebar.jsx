import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/auth";

function Sidebar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const role = String(user.role || "").toLowerCase();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Employees",
      path: "/employees",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Departments",
      path: "/departments",
      roles: ["admin", "manager"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Leaves",
      path: "/leaves",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Tasks",
      path: "/tasks",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Performance",
      path: "/performance",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Documents",
      path: "/documents",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Salary",
      path: "/salary",
      roles: ["admin"],
    },
    {
      name: "Payroll",
      path: "/payroll",
      roles: ["admin", "employee"],
    },
    {
      name: "Notifications",
      path: "/notifications",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Reports",
      path: "/reports",
      roles: ["admin", "manager"],
    },
    {
      name: "Activity Logs",
      path: "/activity-logs",
      roles: ["admin", "manager", "employee"],
    },
  ];

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          EMS
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Employee Management
        </p>
      </div>

      <div className="p-5 border-b border-slate-700">

        <p className="font-semibold">
          {user.username || "User"}
        </p>

        <p className="text-sm text-slate-400 capitalize mt-1">
          {role || "employee"}
        </p>

      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

        {visibleItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {item.name}
          </NavLink>

        ))}

      </nav>

      <div className="p-4 border-t border-slate-700">

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;