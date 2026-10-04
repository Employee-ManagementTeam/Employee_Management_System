import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../api/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    employee_id: "",
    status: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
          (Array.isArray(response) ? response : [])
      );
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateTask(editingId, form);
        setMessage("Task updated successfully.");
      } else {
        await createTask(form);
        setMessage("Task created successfully.");
      }

      setForm({
        title: "",
        description: "",
        employee_id: "",
        status: "",
      });

      setEditingId(null);

      await loadTasks();
    } catch (err) {
      setError(err.message || "Task operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const editTask = (task) => {
    setEditingId(task.id || task._id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      employee_id: task.employee_id || "",
      status: task.status || "",
    });
  };

  const removeTask = async (task) => {
    const id = task.id || task._id;

    if (!window.confirm("Delete this task?")) return;

    try {
      setError("");

      await deleteTask(id);

      setMessage("Task deleted successfully.");
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to delete task.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Tasks
          </h1>

          <p className="mt-1 text-gray-500">
            Create and manage employee tasks.
          </p>

          {message && (
            <div className="mt-5 rounded-lg bg-green-50 p-4 text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-lg font-semibold">
              {editingId ? "Edit Task" : "Create Task"}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Task title"
                className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />

              <input
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                placeholder="Employee ID"
                className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />

              <input
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="Status"
                className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#B7792B] px-6 py-2.5 text-white"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Task"
                  : "Create Task"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);

                    setForm({
                      title: "",
                      description: "",
                      employee_id: "",
                      status: "",
                    });
                  }}
                  className="rounded-lg bg-gray-100 px-6 py-2.5 text-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No tasks found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task, index) => (
                    <tr
                      key={task.id || task._id || index}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4">
                        {task.title || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {task.employee_name ||
                          task.employee_id ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {task.status || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editTask(task)}
                            className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-sm text-[#B7792B]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              removeTask(task)
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Tasks;