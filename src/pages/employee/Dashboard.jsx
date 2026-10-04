import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";

import {
  getEmployees,
  getEmployeeAttendance,
  getEmployeeLeaves,
  getTasks,
  getPerformance,
  getNotifications,
} from "../../api/api";

function Dashboard() {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const employeesResponse = await getEmployees();

      const employeeList =
        Array.isArray(employeesResponse)
          ? employeesResponse
          : employeesResponse.employees || employeesResponse.data || [];

      const currentEmployee = employeeList.find(
        (item) =>
          String(item.user_id) === String(userId) ||
          String(item.userId) === String(userId)
      );

      if (!currentEmployee) {
        throw new Error(
          "Employee profile was not found for the logged-in user."
        );
      }

      setEmployee(currentEmployee);

      const employeeId =
        currentEmployee.id ||
        currentEmployee.employee_id ||
        currentEmployee._id;

      const [
        attendanceResponse,
        leavesResponse,
        tasksResponse,
        performanceResponse,
        notificationsResponse,
      ] = await Promise.all([
        getEmployeeAttendance(employeeId),
        getEmployeeLeaves(employeeId),
        getTasks(),
        getPerformance(),
        getNotifications(),
      ]);

      setAttendance(
        Array.isArray(attendanceResponse)
          ? attendanceResponse
          : attendanceResponse.attendance ||
              attendanceResponse.data ||
              []
      );

      setLeaves(
        Array.isArray(leavesResponse)
          ? leavesResponse
          : leavesResponse.leaves || leavesResponse.data || []
      );

      setTasks(
        Array.isArray(tasksResponse)
          ? tasksResponse
          : tasksResponse.tasks || tasksResponse.data || []
      );

      setPerformance(
        Array.isArray(performanceResponse)
          ? performanceResponse
          : performanceResponse.performance ||
              performanceResponse.data ||
              []
      );

      setNotifications(
        Array.isArray(notificationsResponse)
          ? notificationsResponse
          : notificationsResponse.notifications ||
              notificationsResponse.data ||
              []
      );
    } catch (err) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const employeeId =
    employee?.id ||
    employee?.employee_id ||
    employee?._id;

  const employeeTasks = tasks.filter(
    (task) =>
      String(task.employee_id) === String(employeeId) ||
      String(task.assigned_to) === String(employeeId) ||
      String(task.user_id) === String(userId)
  );

  const employeePerformance = performance.filter(
    (item) =>
      String(item.employee_id) === String(employeeId) ||
      String(item.user_id) === String(userId)
  );

  const pendingLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() === "pending"
  );

  const unreadNotifications = notifications.filter(
    (notification) =>
      !notification.is_read &&
      !notification.read
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <EmployeeSidebar />
        <Navbar />

        <main className="ml-64 pt-20 p-6">
          <p className="text-gray-500">Loading dashboard...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Employee Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Welcome,{" "}
              {employee?.first_name || employee?.username || "Employee"}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Attendance Records
              </p>

              <h2 className="mt-2 text-3xl font-bold text-orange-600">
                {attendance.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Pending Leaves
              </p>

              <h2 className="mt-2 text-3xl font-bold text-orange-600">
                {pendingLeaves.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                My Tasks
              </p>

              <h2 className="mt-2 text-3xl font-bold text-orange-600">
                {employeeTasks.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Performance Records
              </p>

              <h2 className="mt-2 text-3xl font-bold text-orange-600">
                {employeePerformance.length}
              </h2>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Recent Tasks
              </h2>

              {employeeTasks.length === 0 ? (
                <p className="text-gray-500">
                  No tasks found.
                </p>
              ) : (
                <div className="space-y-3">
                  {employeeTasks.slice(0, 5).map((task) => (
                    <div
                      key={
                        task.id ||
                        task.task_id ||
                        task._id
                      }
                      className="rounded-xl border border-gray-100 p-4"
                    >
                      <p className="font-semibold text-gray-800">
                        {task.title || task.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {task.status || "Status not provided"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Notifications
              </h2>

              {unreadNotifications.length === 0 ? (
                <p className="text-gray-500">
                  No unread notifications.
                </p>
              ) : (
                <div className="space-y-3">
                  {unreadNotifications
                    .slice(0, 5)
                    .map((notification) => (
                      <div
                        key={
                          notification.id ||
                          notification.notification_id ||
                          notification._id
                        }
                        className="rounded-xl border border-orange-100 bg-orange-50 p-4"
                      >
                        <p className="font-semibold text-gray-800">
                          {notification.title}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;