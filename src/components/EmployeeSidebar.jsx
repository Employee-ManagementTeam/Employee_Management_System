import { NavLink, useNavigate } from "react-router-dom";

function EmployeeSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/employee/Dashboard" },
    { name: "My Tasks", path: "/employee/tasks" },
    { name: "Documents", path: "/employee/documents" },
    { name: "Leaves", path: "/employee/leave" },
    { name: "Attendance", path: "/employee/attendance" },
    { name: "Performance", path: "/employee/performance" },
    { name: "Payroll", path: "/employee/payroll" },
    { name: "Notifications", path: "/employee/notifications" },
    { name: "Profile", path: "/employee/profile" },
    { name: "Activity Logs", path: "/employee/activitylogs" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-100 bg-white">

      {/* LOGO */}
      <div className="border-b border-gray-100 px-6 py-5">
        <h1 className="text-[13px] font-bold leading-tight tracking-wide text-slate-900">
          SHNOOR INTE...
        </h1>

        <p className="mt-0.5 text-[11px] text-gray-400">
          Connecting Tech...
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              "mb-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-[14px] font-medium transition " +
              (isActive
                ? "bg-[#FFF8E7] text-[#B7792B]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800")
            }
          >
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-4 py-2.5 text-left text-[14px] font-semibold text-red-500 transition hover:bg-red-50"
        >
          Logout
        </button>
      </div>

    </aside>
  );
}

export default EmployeeSidebar;