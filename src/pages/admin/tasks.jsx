import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../api/api";

const emptyForm = {
  title: "",
  description: "",
  employee_id: "",
  priority: "Medium",
  status: "Pending",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] =
    useState(null);
  const [deletingId, setDeletingId] =
    useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks();

      const data = Array.isArray(response)
        ? response
        : response?.tasks ||
          response?.data ||
          [];

      setTasks(data);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await createTask(form);

      setMessage(
        "Task created successfully."
      );

      resetForm();

      await loadTasks();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to create task."
      );
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (task) => {
    const id =
      task._id ||
      task.id;

    if (!id) {
      setError("Task ID not found.");
      return;
    }

    try {
      setActionLoading(id);
      setError("");
      setMessage("");

      const currentStatus =
        String(task.status || "").toLowerCase();

      const newStatus =
        currentStatus === "completed"
          ? "Pending"
          : "Completed";

      await updateTask(id, {
        status: newStatus,
      });

      setMessage(
        `Task marked as ${newStatus.toLowerCase()}.`
      );

      await loadTasks();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to update task status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError("Task ID not found.");
      return;
    }

    if (
      !window.confirm(
        "Delete this task?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await deleteTask(id);

      setMessage(
        "Task deleted successfully."
      );

      await loadTasks();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to delete task."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const text = `
        ${task.title || ""}
        ${task.description || ""}
        ${task.employee_id || ""}
        ${task.priority || ""}
        ${task.status || ""}
      `.toLowerCase();

      const matchesSearch =
        text.includes(
          search.toLowerCase()
        );

      const matchesPriority =
        priorityFilter === "All" ||
        String(task.priority || "")
          .toLowerCase() ===
          priorityFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        String(task.status || "")
          .toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [
    tasks,
    search,
    priorityFilter,
    statusFilter,
  ]);

  const completedCount = tasks.filter(
    (task) =>
      String(task.status || "")
        .toLowerCase() === "completed"
  ).length;

  const pendingCount = tasks.filter(
    (task) =>
      String(task.status || "")
        .toLowerCase() === "pending"
  ).length;

  const highPriorityCount = tasks.filter(
    (task) =>
      String(task.priority || "")
        .toLowerCase() === "high"
  ).length;

  const getPriorityStyle = (priority) => {
    const value = String(
      priority || ""
    ).toLowerCase();

    if (value === "high") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (value === "medium") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  };

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "completed") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
                Work Management
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Tasks
              </h1>

              <p className="mt-2 text-slate-500">
                Assign, monitor and manage employee tasks.
              </p>
            </div>

            <button
              onClick={loadTasks}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

          {/* SUMMARY */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              title="Total Tasks"
              value={tasks.length}
              icon="📋"
            />

            <SummaryCard
              title="Completed"
              value={completedCount}
              icon="✓"
            />

            <SummaryCard
              title="Pending"
              value={pendingCount}
              icon="⏳"
            />

            <SummaryCard
              title="High Priority"
              value={highPriorityCount}
              icon="!"
            />

          </div>

          {/* ALERTS */}
          {message && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* CREATE TASK */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Task Assignment
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Create Task
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Assign a new task to an employee.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Task Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Employee ID
                  </label>

                  <input
                    name="employee_id"
                    value={form.employee_id}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the task..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Initial Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

              </div>

              <div className="mt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Creating..."
                    : "Create Task"}
                </button>
              </div>
            </form>

          </section>

          {/* FILTERS */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  🔎
                </div>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search task, employee or description..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex flex-wrap gap-2">
                  {[
                    "All",
                    "Pending",
                    "Completed",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        setStatusFilter(status)
                      }
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        statusFilter === status
                          ? "bg-orange-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "All",
                    "Low",
                    "Medium",
                    "High",
                  ].map((priority) => (
                    <button
                      key={priority}
                      onClick={() =>
                        setPriorityFilter(priority)
                      }
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        priorityFilter === priority
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>

              </div>

            </div>
          </section>

          {/* TASKS */}
          <section>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Task Board
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredTasks.length} task
                {filteredTasks.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

                <p className="text-sm text-slate-500">
                  Loading tasks...
                </p>

              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                  📋
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No tasks found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Create a task or change your filters.
                </p>

              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {filteredTasks.map(
                  (task, index) => {
                    const id =
                      task._id ||
                      task.id ||
                      index;

                    const completed =
                      String(
                        task.status || ""
                      ).toLowerCase() ===
                      "completed";

                    return (
                      <article
                        key={id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold text-slate-900">
                              {task.title ||
                                "Untitled Task"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Employee:{" "}
                              <span className="font-semibold text-slate-700">
                                {task.employee_id ||
                                  "-"}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority ||
                              "Medium"}
                          </span>

                        </div>

                        <div className="mt-5 rounded-xl bg-slate-50 p-4">

                          <p className="text-sm leading-6 text-slate-600">
                            {task.description ||
                              "No description provided."}
                          </p>

                        </div>

                        <div className="mt-5 flex items-center justify-between">

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              task.status
                            )}`}
                          >
                            {task.status ||
                              "Pending"}
                          </span>

                          <span className="text-xs text-slate-400">
                            {completed
                              ? "Completed"
                              : "In progress"}
                          </span>

                        </div>

                        <div className="mt-5 flex gap-2">

                          <button
                            onClick={() =>
                              changeStatus(task)
                            }
                            disabled={
                              actionLoading === id
                            }
                            className="flex-1 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading === id
                              ? "Updating..."
                              : completed
                              ? "Mark Pending"
                              : "Mark Complete"}
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(id)
                            }
                            disabled={
                              deletingId === id
                            }
                            className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === id
                              ? "..."
                              : "Delete"}
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-lg font-bold text-orange-600">
          {icon}
        </div>

      </div>
    </div>
  );
}

export default Tasks;