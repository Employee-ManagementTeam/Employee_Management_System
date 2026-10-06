import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import { getTasks, updateTask } from "../../api/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks();

      const taskList = Array.isArray(response)
        ? response
        : response.tasks || response.data || [];

      const userId = localStorage.getItem("userId");

      const employeesResponse = await fetch(
        "http://127.0.0.1:5000/api/employees",
        {
          headers: {
            "X-User-ID": userId,
          },
        }
      );

      if (!employeesResponse.ok) {
        throw new Error("Failed to load employee information.");
      }

      const employeesData = await employeesResponse.json();

      const employees = Array.isArray(employeesData)
        ? employeesData
        : employeesData.employees ||
          employeesData.data ||
          [];

      const currentEmployee = employees.find(
        (employee) =>
          String(employee.user_id) === String(userId) ||
          String(employee.userId) === String(userId)
      );

      if (!currentEmployee) {
        throw new Error(
          "Employee profile was not found for the logged-in user."
        );
      }

      const id =
        currentEmployee.id ||
        currentEmployee.employee_id ||
        currentEmployee._id;

      setEmployeeId(id);

      const myTasks = taskList.filter(
        (task) =>
          String(task.employee_id) === String(id) ||
          String(task.assigned_to) === String(id) ||
          String(task.user_id) === String(userId)
      );

      setTasks(myTasks);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      const taskId =
        task.id ||
        task.task_id ||
        task._id;

      setUpdating(taskId);
      setError("");

      await updateTask(taskId, {
        ...task,
        status,
      });

      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to update task.");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusStyle = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (
      normalized === "completed" ||
      normalized === "complete" ||
      normalized === "done"
    ) {
      return "border-green-100 bg-green-50 text-green-700";
    }

    if (
      normalized === "in progress" ||
      normalized === "in_progress"
    ) {
      return "border-orange-100 bg-orange-50 text-orange-700";
    }

    if (normalized === "pending") {
      return "border-amber-100 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "Not specified";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const completedTasks = tasks.filter((task) => {
    const status = String(task.status || "").toLowerCase();

    return (
      status === "completed" ||
      status === "complete" ||
      status === "done"
    );
  });

  const inProgressTasks = tasks.filter((task) => {
    const status = String(task.status || "").toLowerCase();

    return (
      status === "in progress" ||
      status === "in_progress"
    );
  });

  const pendingTasks = tasks.filter(
    (task) =>
      String(task.status || "").toLowerCase() === "pending"
  );

  const progressPercentage =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

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
                My Tasks
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                View the tasks assigned to you and keep their status updated
                as your work progresses.
              </p>
            </div>

            <button
              onClick={loadTasks}
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

              Refresh Tasks
            </button>
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
                  Task update failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =========================================================
              SUMMARY CARDS
          ========================================================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Tasks
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {tasks.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Assigned to you
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

            {/* Pending */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Pending
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {pendingTasks.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Waiting to start
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
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
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    In Progress
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {inProgressTasks.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Currently working
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
                    <path d="M4 12h16" />
                    <path d="M12 4v16" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Completed
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {completedTasks.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Finished successfully
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
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
            </div>
          </div>

          {/* =========================================================
              PROGRESS BAR
          ========================================================= */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Overall Progress
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                  {progressPercentage}% completed
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Based on your assigned tasks
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-orange-600">
                  {completedTasks.length} / {tasks.length}
                </p>
              </div>
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-orange-600 transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* =========================================================
              TASK LIST
          ========================================================= */}
          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>

                <h2 className="mt-5 text-lg font-extrabold text-slate-800">
                  No tasks assigned
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  You currently have no tasks assigned to your employee
                  account. New tasks will appear here when they are assigned.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {tasks.map((task, index) => {
                  const taskId =
                    task.id ||
                    task.task_id ||
                    task._id;

                  const status =
                    task.status || "";

                  const isUpdating =
                    updating === taskId;

                  return (
                    <div
                      key={taskId || `task-${index}`}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                    >
                      {/* Orange top border */}
                      <div className="h-1 bg-orange-600" />

                      <div className="p-6">

                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-orange-600">
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="min-w-0">
                              <h2 className="truncate text-lg font-extrabold text-slate-900">
                                {task.title ||
                                  task.name ||
                                  "Untitled Task"}
                              </h2>

                              <p className="mt-1 text-xs text-slate-400">
                                Assigned task
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                              status
                            )}`}
                          >
                            {getStatusLabel(status)}
                          </span>
                        </div>

                        {/* Description */}
                        <div className="mt-5 rounded-xl bg-slate-50 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Description
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {task.description ||
                              "No description has been provided for this task."}
                          </p>
                        </div>

                        {/* Optional details */}
                        {(task.due_date ||
                          task.deadline ||
                          task.priority) && (
                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {(task.due_date || task.deadline) && (
                              <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Due Date
                                </p>

                                <p className="mt-1 text-xs font-bold text-slate-700">
                                  {task.due_date ||
                                    task.deadline}
                                </p>
                              </div>
                            )}

                            {task.priority && (
                              <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Priority
                                </p>

                                <p className="mt-1 text-xs font-bold text-slate-700">
                                  {task.priority}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status control */}
                        <div className="mt-5">
                          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Update Status
                          </label>

                          <div className="relative">
                            <select
                              value={status}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleStatusChange(
                                  task,
                                  e.target.value
                                )
                              }
                              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            >
                              <option value="">
                                Select status
                              </option>

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Completed">
                                Completed
                              </option>
                            </select>

                            <svg
                              viewBox="0 0 24 24"
                              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </div>
                        </div>

                        {/* Updating indicator */}
                        {isUpdating && (
                          <div className="mt-4 flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
                            <svg
                              className="h-4 w-4 animate-spin text-orange-600"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="opacity-30"
                              />

                              <path
                                d="M21 12a9 9 0 0 0-9-9"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                            </svg>

                            <p className="text-xs font-semibold text-orange-700">
                              Updating task status...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =========================================================
              FOOTER
          ========================================================= */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Task Management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Tasks;