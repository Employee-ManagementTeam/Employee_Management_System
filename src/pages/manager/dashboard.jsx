import { useEffect, useMemo, useState } from "react";
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
      setError(
        err.message || "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const pendingLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() ===
      "pending"
  );

  const approvedLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() ===
      "approved"
  );

  const completedTasks = tasks.filter((task) => {
    const status = String(
      task.status || ""
    ).toLowerCase();

    return (
      status === "completed" ||
      status === "complete" ||
      status === "done"
    );
  });

  const inProgressTasks = tasks.filter((task) => {
    const status = String(
      task.status || ""
    ).toLowerCase();

    return (
      status === "in progress" ||
      status === "in_progress"
    );
  });

  const attendancePresent = attendance.filter(
    (item) => {
      const status = String(
        item.status || ""
      ).toLowerCase();

      return (
        status === "present" ||
        status === "active"
      );
    }
  ).length;

  const attendancePercentage =
    attendance.length > 0
      ? Math.round(
          (attendancePresent /
            attendance.length) *
            100
        )
      : 0;

  const taskProgress =
    tasks.length > 0
      ? Math.round(
          (completedTasks.length /
            tasks.length) *
            100
        )
      : 0;

  const averagePerformance = useMemo(() => {
    const ratings = performance
      .map((item) => {
        const value = Number(
          item.rating ?? item.score
        );

        return Number.isFinite(value)
          ? value
          : null;
      })
      .filter((value) => value !== null);

    if (ratings.length === 0) {
      return null;
    }

    return Number(
      (
        ratings.reduce(
          (total, value) => total + value,
          0
        ) / ratings.length
      ).toFixed(1)
    );
  }, [performance]);

  const formatStatus = (status) => {
    if (!status) {
      return "Not provided";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getStatusStyle = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (
      normalized === "completed" ||
      normalized === "approved" ||
      normalized === "present" ||
      normalized === "active"
    ) {
      return "border-green-100 bg-green-50 text-green-700";
    }

    if (
      normalized === "pending" ||
      normalized === "in progress" ||
      normalized === "in_progress"
    ) {
      return "border-orange-100 bg-orange-50 text-orange-700";
    }

    if (
      normalized === "rejected" ||
      normalized === "inactive"
    ) {
      return "border-red-100 bg-red-50 text-red-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <ManagerSidebar />
        <Navbar />

        <main className="ml-64 pt-20">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">
            <div className="mb-8">
              <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-4 h-10 w-80 animate-pulse rounded-xl bg-slate-200" />
              <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* ======================================================
              HEADER
          ====================================================== */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Manager Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Manager Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor your team&apos;s workforce activity,
                attendance, leave requests, tasks, and performance
                from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20 11a8 8 0 1 0 2 5" />
                <path d="M20 5v6h-6" />
              </svg>

              Refresh Dashboard
            </button>
          </div>

          {/* ======================================================
              ERROR
          ====================================================== */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Dashboard update failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ======================================================
              STAT CARDS
          ====================================================== */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">

            <StatCard
              title="Employees"
              value={employees.length}
              subtitle="Team members"
              type="employees"
            />

            <StatCard
              title="Departments"
              value={departments.length}
              subtitle="Organization units"
              type="departments"
            />

            <StatCard
              title="Attendance"
              value={attendance.length}
              subtitle={`${attendancePercentage}% present`}
              type="attendance"
            />

            <StatCard
              title="Pending Leaves"
              value={pendingLeaves.length}
              subtitle={`${approvedLeaves.length} approved`}
              type="leaves"
            />

            <StatCard
              title="Tasks"
              value={tasks.length}
              subtitle={`${completedTasks.length} completed`}
              type="tasks"
            />

            <StatCard
              title="Performance"
              value={performance.length}
              subtitle={
                averagePerformance !== null
                  ? `${averagePerformance} avg rating`
                  : "No ratings yet"
              }
              type="performance"
            />
          </div>

          {/* ======================================================
              MAIN CONTENT
          ====================================================== */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">

            {/* Recent Performance */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Recent Performance
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Latest employee evaluations and ratings.
                  </p>
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

              <div className="p-6">
                {performance.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M4 19V5" />
                        <path d="M4 19h16" />
                        <path d="M8 16v-4M12 16V8M16 16v-7M20 16V5" />
                      </svg>
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      No performance records found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Employee evaluations will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100 text-left">
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Employee
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Rating
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Date
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {performance
                          .slice(0, 10)
                          .map((item, index) => {
                            const rating =
                              Number(
                                item.rating ??
                                  item.score
                              );

                            return (
                              <tr
                                key={
                                  item.id ||
                                  item._id ||
                                  index
                                }
                                className="border-b border-slate-50 transition hover:bg-orange-50/30"
                              >
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-xs font-black text-orange-600">
                                      {String(
                                        index + 1
                                      ).padStart(2, "0")}
                                    </div>

                                    <span className="text-sm font-bold text-slate-800">
                                      {item.employee_name ||
                                        item.employeeName ||
                                        item.employee_id ||
                                        "-"}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  {Number.isFinite(
                                    rating
                                  ) ? (
                                    <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
                                      {rating} / 5
                                    </span>
                                  ) : (
                                    <span className="text-sm text-slate-400">
                                      -
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-500">
                                  {item.review_date ||
                                    item.date ||
                                    "-"}
                                </td>

                                <td className="px-4 py-4">
                                  <span
                                    className={`rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${getStatusStyle(
                                      item.status
                                    )}`}
                                  >
                                    {formatStatus(
                                      item.status
                                    )}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Team Overview */}
            <div className="space-y-6">

              {/* Attendance */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Attendance Overview
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                      {attendancePercentage}%
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Present attendance records
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M5 12l4 4L19 6" />
                    </svg>
                  </div>
                </div>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${attendancePercentage}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-slate-400">
                    {attendancePresent} present
                  </span>

                  <span className="font-bold text-green-600">
                    {attendance.length} total
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Task Progress
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                      {taskProgress}%
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Team task completion
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
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

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-orange-600 transition-all duration-500"
                    style={{
                      width: `${taskProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-slate-400">
                    {completedTasks.length} completed
                  </span>

                  <span className="font-bold text-orange-600">
                    {tasks.length} total
                  </span>
                </div>
              </div>

              {/* Leave */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Leave Requests
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                      {pendingLeaves.length}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Awaiting manager action
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="17"
                        rx="2"
                      />
                      <path d="M7 2v4M17 2v4M3 9h18" />
                      <path d="M12 12v3l2 1" />
                    </svg>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                    <p className="text-xl font-black text-orange-600">
                      {pendingLeaves.length}
                    </p>

                    <p className="mt-1 text-[10px] text-orange-700">
                      Pending
                    </p>
                  </div>

                  <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                    <p className="text-xl font-black text-green-600">
                      {approvedLeaves.length}
                    </p>

                    <p className="mt-1 text-[10px] text-green-700">
                      Approved
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================
              TEAM SNAPSHOT
          ====================================================== */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Team Snapshot
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  High-level summary of your current workspace.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <SnapshotCard
                title="Team Members"
                value={employees.length}
                subtitle="Employees currently visible"
              />

              <SnapshotCard
                title="Departments"
                value={departments.length}
                subtitle="Departments in workspace"
              />

              <SnapshotCard
                title="Active Tasks"
                value={inProgressTasks.length}
                subtitle="Tasks currently in progress"
              />

              <SnapshotCard
                title="Reviews"
                value={performance.length}
                subtitle="Performance records"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Manager Portal
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  type,
}) {
  const icons = {
    employees: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),

    departments: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),

    attendance: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),

    leaves: (
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
    ),

    tasks: (
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
    ),

    performance: (
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
    ),
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-2xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-[10px] leading-4 text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
          {icons[type]}
        </div>
      </div>
    </div>
  );
}

function SnapshotCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

export default Dashboard;