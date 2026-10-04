import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Employees", path: "/admin/employees" },
    { name: "Departments", path: "/admin/department" },
    { name: "Attendance", path: "/admin/attendance" },
    { name: "Leave", path: "/admin/leave" },
    { name: "Tasks", path: "/admin/tasks" },
    { name: "Performance", path: "/admin/performance" },
    { name: "Documents", path: "/admin/documents" },
    { name: "Salary", path: "/admin/salary" },
    { name: "Payroll", path: "/admin/payroll" },
    { name: "Notifications", path: "/admin/notifications" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Activity Logs", path: "/admin/activitylogs" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
           <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">S</div>
           <div>
            <h1 className="text-[13px] font-bold leading-tight text-slate-900 tracking-wide">SHNOOR INTE...</h1>
            <p className="text-[11px] text-gray-400">Connecting Tech...</p>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all ${
                    isActive
                     ? "bg-[#FFF8E7] text-[#B7792B]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-2.5 text-[14px] font-semibold text-red-500 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;