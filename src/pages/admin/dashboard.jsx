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

      setEmployees(
        toArray(employeesRes, ["employees"])
      );

      setDepartments(
        toArray(departmentsRes, ["departments"])
      );

      setAttendance(
        toArray(attendanceRes, ["attendance"])
      );

      setLeaves(
        toArray(leavesRes, ["leaves"])
      );

      setTasks(
        toArray(tasksRes, ["tasks"])
      );

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
      icon: "👥",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: "🏢",
    },
    {
      title: "Attendance Records",
      value: attendance.length,
      icon: "🕒",
    },
    {
      title: "Pending Leaves",
      value: pendingLeaves,
      icon: "📅",
    },
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: "✅",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: "🎯",
    },
    {
      title: "Performance Records",
      value: performance.length,
      icon: "📈",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: "🟢",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">

        <div className="p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Overview of your employee management system
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
              Loading dashboard...
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm text-gray-500">
                        {card.title}
                      </p>

                      <h2 className="mt-2 text-3xl font-bold text-gray-800">
                        {card.value}
                      </h2>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                      {card.icon}
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default Dashboard;