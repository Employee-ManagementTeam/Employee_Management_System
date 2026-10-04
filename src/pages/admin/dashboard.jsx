import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getEmployees,
  getDepartments,
  getAttendance,
  getLeaves,
  getTasks,
  getPerformance,
} from "../../api/api";

function StatIcon({ type }) {
  const common =
    "h-6 w-6";

  if (type === "employees") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (type === "departments") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 21h18" />
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        <path d="M9 7h2" />
        <path d="M13 7h2" />
        <path d="M9 11h2" />
        <path d="M13 11h2" />
        <path d="M9 15h2" />
        <path d="M13 15h2" />
      </svg>
    );
  }

  if (type === "attendance") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (type === "leaves") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
        <path d="M8 14h3" />
      </svg>
    );
  }

  if (type === "tasks") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  if (type === "completed") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 3v18" />
        <path d="M7 8l5-5 5 5" />
        <path d="M7 16l5 5 5-5" />
      </svg>
    );
  }

  if (type === "performance") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 2 5-6" />
      </svg>
    );
  }

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [performance, setPerformance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toArray = (response, keys = []) => {
    if (Array.isArray(response)) return response;

    for (const key of keys) {
      if (Array.isArray(response?.[key])) {
        return response[key];
      }
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        employeesRes,
        departmentsRes,
        attendanceRes,
        leavesRes,
        tasksRes,
        performanceRes,
      ] = await Promise.all([
        getEmployees(),
        getDepartments(),
        getAttendance(),
        getLeaves(),
        getTasks(),
        getPerformance(),
      ]);

      setEmployees(toArray(employeesRes, ["employees"]));
      setDepartments(toArray(departmentsRes, ["departments"]));
      setAttendance(toArray(attendanceRes, ["attendance"]));
      setLeaves(toArray(leavesRes, ["leaves"]));
      setTasks(toArray(tasksRes, ["tasks"]));
      setPerformance(
        toArray(performanceRes, ["performance", "records"])
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const pendingLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() === "pending"
  ).length;

  const completedTasks = tasks.filter(
    (task) =>
      String(task.status || "").toLowerCase() === "completed"
  ).length;

  const activeEmployees = employees.filter(
    (employee) =>
      String(employee.employment_status || "").toLowerCase() ===
      "active"
  ).length;

  const cards = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: "employees",
      description: "Registered employees",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: "departments",
      description: "Active departments",
    },
    {
      title: "Attendance Records",
      value: attendance.length,
      icon: "attendance",
      description: "Recorded attendance",
    },
    {
      title: "Pending Leaves",
      value: pendingLeaves,
      icon: "leaves",
      description: "Awaiting approval",
    },
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: "tasks",
      description: "Assigned tasks",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: "completed",
      description: "Successfully completed",
    },
    {
      title: "Performance Records",
      value: performance.length,
      icon: "performance",
      description: "Employee evaluations",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: "active",
      description: "Currently active",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          {/* HEADER */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
                Administration
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>

              <p className="mt-2 text-slate-500">
                Overview of your employee management system
              </p>
            </div>

            <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:block">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                System Status
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-slate-700">
                  Operational
                </span>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />
              <p className="text-sm font-medium text-slate-600">
                Loading dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* STAT CARDS */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                  <div
                    key={card.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {card.title}
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                          {card.value}
                        </h2>

                        <p className="mt-2 text-xs text-slate-400">
                          {card.description}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-100">
                        <StatIcon type={card.icon} />
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY SECTION */}
              <div className="mt-8 grid gap-6 lg:grid-cols-3">

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">
                    Workforce
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {activeEmployees}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Active employees
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                      Active
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">
                    Leave Requests
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {pendingLeaves}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Pending approvals
                      </p>
                    </div>

                    <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                      Review
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">
                    Task Progress
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {completedTasks}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Completed tasks
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                      Progress
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default Dashboard;