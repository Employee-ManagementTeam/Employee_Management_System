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

      const employeeList = Array.isArray(employeesResponse)
        ? employeesResponse
        : employeesResponse.employees ||
          employeesResponse.data ||
          [];

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
          : leavesResponse.leaves ||
              leavesResponse.data ||
              []
      );

      setTasks(
        Array.isArray(tasksResponse)
          ? tasksResponse
          : tasksResponse.tasks ||
              tasksResponse.data ||
              []
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

  const approvedLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() === "approved"
  );

  const completedTasks = employeeTasks.filter((task) => {
    const status = String(task.status || "").toLowerCase();

    return (
      status === "completed" ||
      status === "complete" ||
      status === "done"
    );
  });

  const unreadNotifications = notifications.filter(
    (notification) =>
      !notification.is_read &&
      !notification.read
  );

  const employeeName =
    employee?.first_name ||
    employee?.username ||
    "Employee";

  const fullName = [
    employee?.first_name,
    employee?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const displayName = fullName || employeeName;

  const designation =
    employee?.designation ||
    employee?.job_title ||
    "Employee";

  const department =
    employee?.department ||
    employee?.department_name ||
    "Department not assigned";

  const employeeCode =
    employee?.employee_code ||
    employee?.employeeCode ||
    employee?.code ||
    "Employee ID not available";

  const employmentStatus =
    employee?.employment_status ||
    employee?.status ||
    "Active";

  const latestAttendance = attendance.length > 0
    ? attendance[0]
    : null;

  const attendanceStatus = latestAttendance?.status || "No record";

  const getStatusStyle = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (
      normalized === "completed" ||
      normalized === "complete" ||
      normalized === "done" ||
      normalized === "approved" ||
      normalized === "present" ||
      normalized === "active"
    ) {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (
      normalized === "pending" ||
      normalized === "in progress" ||
      normalized === "in_progress"
    ) {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    if (
      normalized === "rejected" ||
      normalized === "cancelled" ||
      normalized === "inactive"
    ) {
      return "bg-red-50 text-red-700 border-red-100";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const getTaskStatusLabel = (status) => {
    if (!status) {
      return "Not specified";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <EmployeeSidebar />
        <Navbar />

        <main className="ml-64 pt-20">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">

            {/* Loading header */}
            <div className="mb-8">
              <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-4 h-10 w-72 animate-pulse rounded-xl bg-slate-200" />
              <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
            </div>

            {/* Loading cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* =========================================================
              PAGE HEADER
          ========================================================= */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Employee Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Welcome back, {employeeName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Here&apos;s a quick overview of your employee information,
                attendance, tasks, leave requests, and performance.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-orange-600">
                {displayName
                  .split(" ")
                  .map((name) => name.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  {displayName}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  {designation}
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================
              ERROR
          ========================================================= */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Unable to load dashboard
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =========================================================
              EMPLOYEE PROFILE SUMMARY
          ========================================================= */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-orange-600" />

            <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">

              {/* Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-2xl font-black text-orange-600">
                {displayName
                  .split(" ")
                  .map((name) => name.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              {/* Employee info */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {displayName}
                  </h2>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                      employmentStatus
                    )}`}
                  >
                    {employmentStatus}
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-orange-600">
                  {designation}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      ID:
                    </strong>{" "}
                    {employeeCode}
                  </span>

                  <span>
                    <strong className="font-semibold text-slate-700">
                      Department:
                    </strong>{" "}
                    {department}
                  </span>
                </div>
              </div>

              {/* Employee info card */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 md:min-w-[180px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Attendance status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      String(attendanceStatus).toLowerCase() === "present"
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  />

                  <p className="text-sm font-bold text-slate-800">
                    {attendanceStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              STAT CARDS
          ========================================================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Attendance */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Attendance
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-slate-900">
                    {attendance.length}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Total attendance records
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M7 2v4M17 2v4M3 9h18" />
                    <path d="M8 13h2M14 13h2M8 17h2M14 17h2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Leaves */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Pending Leaves
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-slate-900">
                    {pendingLeaves.length}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Requests awaiting review
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M7 2v4M17 2v4M3 9h18" />
                    <path d="M12 12v3l2 1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    My Tasks
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-slate-900">
                    {employeeTasks.length}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {completedTasks.length} completed
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Performance
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-slate-900">
                    {employeePerformance.length}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Performance records
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 19V5" />
                    <path d="M4 17l5-5 4 3 7-8" />
                    <path d="M16 7h4v4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              MAIN CONTENT
          ========================================================= */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">

            {/* =======================================================
                TASKS
            ======================================================= */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Recent Tasks
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Your latest assigned work
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
              </div>

              <div className="p-6">
                {employeeTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      No tasks assigned
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Your assigned tasks will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employeeTasks.slice(0, 5).map((task, index) => {
                      const status = task.status || "Not provided";

                      return (
                        <div
                          key={
                            task.id ||
                            task.task_id ||
                            task._id ||
                            `task-${index}`
                          }
                          className="group flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-orange-100 hover:bg-orange-50/30"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xs font-black text-orange-600">
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-800">
                                {task.title ||
                                  task.name ||
                                  "Untitled task"}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-400">
                                {task.description ||
                                  "Task details are available in the Tasks module."}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {getTaskStatusLabel(status)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* =======================================================
                NOTIFICATIONS
            ======================================================= */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Notifications
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Important updates for you
                  </p>
                </div>

                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                  </svg>

                  {unreadNotifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[8px] font-bold text-white">
                      {unreadNotifications.length > 9
                        ? "9+"
                        : unreadNotifications.length}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                {unreadNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M5 12l4 4L19 6" />
                      </svg>
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      You&apos;re all caught up
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      No unread notifications at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unreadNotifications.slice(0, 5).map(
                      (notification, index) => (
                        <div
                          key={
                            notification.id ||
                            notification.notification_id ||
                            notification._id ||
                            `notification-${index}`
                          }
                          className="rounded-xl border border-orange-100 bg-orange-50/60 p-4"
                        >
                          <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                                <path d="M10 21h4" />
                              </svg>
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800">
                                {notification.title ||
                                  "New notification"}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {notification.message ||
                                  "You have a new notification."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
              QUICK SUMMARY
          ========================================================= */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Leave overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Leave Overview
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                    {leaves.length} requests
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M7 2v4M17 2v4M3 9h18" />
                  </svg>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-2xl font-black text-orange-600">
                    {pendingLeaves.length}
                  </p>

                  <p className="mt-1 text-xs text-orange-700">
                    Pending
                  </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <p className="text-2xl font-black text-green-600">
                    {approvedLeaves.length}
                  </p>

                  <p className="mt-1 text-xs text-green-700">
                    Approved
                  </p>
                </div>
              </div>
            </div>

            {/* Work progress */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Task Progress
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                    {employeeTasks.length
                      ? `${completedTasks.length}/${employeeTasks.length}`
                      : "0/0"}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 19V5" />
                    <path d="M4 19h16" />
                    <path d="M8 16v-4M12 16V8M16 16v-7M20 16V5" />
                  </svg>
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-orange-600 transition-all"
                  style={{
                    width:
                      employeeTasks.length > 0
                        ? `${Math.min(
                            100,
                            Math.round(
                              (completedTasks.length /
                                employeeTasks.length) *
                                100
                            )
                          )}%`
                        : "0%",
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs">
                <span className="text-slate-400">
                  Completed
                </span>

                <span className="font-bold text-orange-600">
                  {employeeTasks.length > 0
                    ? `${Math.round(
                        (completedTasks.length /
                          employeeTasks.length) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>

            {/* Performance */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Performance
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                    {employeePerformance.length > 0
                      ? `${employeePerformance.length} records`
                      : "No records"}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 19V5" />
                    <path d="M4 17l5-5 4 3 7-8" />
                    <path d="M16 7h4v4" />
                  </svg>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Review your performance records
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      employeePerformance.length > 0
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  />

                  <span className="text-sm font-bold text-slate-700">
                    {employeePerformance.length > 0
                      ? "Performance data available"
                      : "No performance data yet"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              FOOTER NOTE
          ========================================================= */}
          <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              EmployeeMS · Employee Portal
            </p>

            <p>
              Your employee information is managed through the central HR
              system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;