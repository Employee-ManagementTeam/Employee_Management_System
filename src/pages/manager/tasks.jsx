import { useEffect, useMemo, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
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
  status: "",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks();

      setTasks(
        response?.tasks ||
          response?.data ||
          (Array.isArray(response)
            ? response
            : [])
      );
    } catch (err) {
      setError(
        err.message || "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!form.employee_id.trim()) {
      setError("Employee ID is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateTask(editingId, form);
        setMessage(
          "Task updated successfully."
        );
      } else {
        await createTask(form);
        setMessage(
          "Task created successfully."
        );
      }

      resetForm();
      await loadTasks();
    } catch (err) {
      setError(
        err.message || "Task operation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const editTask = (task) => {
    setEditingId(
      task.id ||
        task.task_id ||
        task._id
    );

    setForm({
      title: task.title || "",
      description: task.description || "",
      employee_id:
        task.employee_id || "",
      status: task.status || "",
    });

    setError("");
    setMessage("");
  };

  const removeTask = async (task) => {
    const id =
      task.id ||
      task.task_id ||
      task._id;

    if (!id) {
      setError("Task ID was not found.");
      return;
    }

    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await deleteTask(id);

      if (
        String(editingId) === String(id)
      ) {
        resetForm();
      }

      setMessage(
        "Task deleted successfully."
      );

      await loadTasks();
    } catch (err) {
      setError(
        err.message || "Failed to delete task."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const pendingTasks = tasks.filter(
    (task) =>
      String(task.status || "").toLowerCase() ===
      "pending"
  );

  const inProgressTasks = tasks.filter(
    (task) => {
      const status = String(
        task.status || ""
      ).toLowerCase();

      return (
        status === "in progress" ||
        status === "in_progress"
      );
    }
  );

  const completedTasks = tasks.filter(
    (task) => {
      const status = String(
        task.status || ""
      ).toLowerCase();

      return (
        status === "completed" ||
        status === "complete" ||
        status === "done"
      );
    }
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const title = String(
        task.title || ""
      ).toLowerCase();

      const employee = String(
        task.employee_name ||
          task.employee_id ||
          ""
      ).toLowerCase();

      const status = String(
        task.status || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        employee.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const getStatusStyle = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

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

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Manager Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Tasks
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Create, assign, monitor, update, and manage employee tasks.
              </p>
            </div>

            <button
              type="button"
              onClick={loadTasks}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-orange-200 hover:text-orange-600 disabled:opacity-60"
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
              Refresh
            </button>
          </div>

          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                ✓
              </span>
              <div>
                <p className="text-sm font-bold">
                  Task action completed
                </p>
                <p className="mt-1 text-xs text-green-600">
                  {message}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>
              <div>
                <p className="text-sm font-bold">
                  Task action failed
                </p>
                <p className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Summary
              title="Total Tasks"
              value={tasks.length}
              subtitle="All assigned tasks"
            />

            <Summary
              title="Pending"
              value={pendingTasks.length}
              subtitle="Waiting to start"
              orange
            />

            <Summary
              title="In Progress"
              value={inProgressTasks.length}
              subtitle="Currently active"
              amber
            />

            <Summary
              title="Completed"
              value={completedTasks.length}
              subtitle="Successfully finished"
              green
            />
          </div>

          {/* Form */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-orange-600" />

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
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

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingId
                      ? "Edit Task"
                      : "Create Task"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {editingId
                      ? "Update the selected task."
                      : "Assign a new task to an employee."}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Task Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                />

                <Field
                  label="Employee ID"
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                />

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the task..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:bg-slate-300"
                >
                  {saving ? (
                    "Saving..."
                  ) : editingId ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:border-orange-200 hover:text-orange-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Search/filter */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xl">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" />
                </svg>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search task or employee..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Pending",
                  "In Progress",
                  "Completed",
                ].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(status)
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
                      statusFilter === status
                        ? "bg-orange-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-extrabold text-slate-900">
                Task Directory
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredTasks.length} tasks shown
              </p>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-sm font-bold text-slate-700">
                    No tasks found
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try changing your search or status filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Task
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Status
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTasks.map(
                        (task, index) => {
                          const id =
                            task.id ||
                            task.task_id ||
                            task._id ||
                            index;

                          return (
                            <tr
                              key={id}
                              className="border-b border-slate-50 hover:bg-orange-50/30"
                            >
                              <td className="px-4 py-4">
                                <div className="max-w-xs">
                                  <p className="text-sm font-bold text-slate-800">
                                    {task.title ||
                                      "-"}
                                  </p>

                                  <p className="mt-1 truncate text-xs text-slate-400">
                                    {task.description ||
                                      "No description"}
                                  </p>
                                </div>
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {task.employee_name ||
                                  task.employee_id ||
                                  "-"}
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                    task.status
                                  )}`}
                                >
                                  {task.status ||
                                    "Not specified"}
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      editTask(task)
                                    }
                                    className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-600 hover:text-white"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      deletingId === id
                                    }
                                    onClick={() =>
                                      removeTask(
                                        task
                                      )
                                    }
                                    className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                  >
                                    {deletingId === id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}

function Summary({
  title,
  value,
  subtitle,
  orange,
  amber,
  green,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p
        className={`mt-3 text-3xl font-black ${
          orange
            ? "text-orange-600"
            : amber
            ? "text-amber-600"
            : green
            ? "text-green-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

function getStatusStyle(status) {
  const normalized = String(
    status || ""
  ).toLowerCase();

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
}

export default Tasks;