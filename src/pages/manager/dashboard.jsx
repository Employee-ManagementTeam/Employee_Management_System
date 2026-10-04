import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
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

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        employeesResponse,
        departmentsResponse,
        attendanceResponse,
        leavesResponse,
        tasksResponse,
        performanceResponse,
      ] = await Promise.all([
        getEmployees(),
        getDepartments(),
        getAttendance(),
        getLeaves(),
        getTasks(),
        getPerformance(),
      ]);

      setEmployees(
        employeesResponse?.employees ||
          employeesResponse?.data ||
          (Array.isArray(employeesResponse)
            ? employeesResponse
            : [])
      );

      setDepartments(
        departmentsResponse?.departments ||
          departmentsResponse?.data ||
          (Array.isArray(departmentsResponse)
            ? departmentsResponse
            : [])
      );

      setAttendance(
        attendanceResponse?.attendance ||
          attendanceResponse?.data ||
          (Array.isArray(attendanceResponse)
            ? attendanceResponse
            : [])
      );

      setLeaves(
        leavesResponse?.leaves ||
          leavesResponse?.data ||
          (Array.isArray(leavesResponse)
            ? leavesResponse
            : [])
      );

      setTasks(
        tasksResponse?.tasks ||
          tasksResponse?.data ||
          (Array.isArray(tasksResponse)
            ? tasksResponse
            : [])
      );

      setPerformance(
        performanceResponse?.performance ||
          performanceResponse?.data ||
          (Array.isArray(performanceResponse)
            ? performanceResponse
            : [])
      );
    } catch (err) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const pendingLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() === "pending"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Manager Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Overview of your team's activities.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
              Loading dashboard...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
                <StatCard
                  title="Employees"
                  value={employees.length}
                />

                <StatCard
                  title="Departments"
                  value={departments.length}
                />

                <StatCard
                  title="Attendance"
                  value={attendance.length}
                />

                <StatCard
                  title="Pending Leaves"
                  value={pendingLeaves.length}
                />

                <StatCard
                  title="Tasks"
                  value={tasks.length}
                />

                <StatCard
                  title="Performance"
                  value={performance.length}
                />
              </div>

              <div className="mt-6 rounded-xl bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Recent Performance
                  </h2>
                </div>

                {performance.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No performance records found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-sm text-gray-500">
                        <tr>
                          <th className="px-5 py-3">Employee</th>
                          <th className="px-5 py-3">Rating</th>
                          <th className="px-5 py-3">Date</th>
                          <th className="px-5 py-3">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {performance.slice(0, 10).map((item, index) => (
                          <tr
                            key={item.id || item._id || index}
                            className="border-t border-gray-100"
                          >
                            <td className="px-5 py-4">
                              {item.employee_name ||
                                item.employee_id ||
                                "-"}
                            </td>

                            <td className="px-5 py-4">
                              {item.rating ?? "-"}
                            </td>

                            <td className="px-5 py-4">
                              {item.review_date || "-"}
                            </td>

                            <td className="px-5 py-4">
                              {item.status || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-[#B7792B]">
        {value}
      </p>
    </div>
  );
}

export default Dashboard;