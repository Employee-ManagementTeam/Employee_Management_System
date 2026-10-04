import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
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
    priority: "Medium",
    status: "Pending",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const response = await getTasks();

      const data = Array.isArray(response)
        ? response
        : response?.tasks ||
          response?.data ||
          [];

      setTasks(data);
    } catch (err) {
      setError(err.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTask(form);

      setMessage("Task created successfully.");

      setForm({
        title: "",
        description: "",
        employee_id: "",
        priority: "Medium",
        status: "Pending",
      });

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = async (task) => {
    try {
      const id = task._id || task.id;

      const newStatus =
        String(task.status).toLowerCase() ===
        "completed"
          ? "Pending"
          : "Completed";

      await updateTask(id, {
        status: newStatus,
      });

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      await deleteTask(id);

      setMessage("Task deleted successfully.");

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Tasks
          </h1>

          <p className="mb-8 text-gray-500">
            Assign and track employee tasks
          </p>

          {message && (
            <div className="mb-4 rounded-xl bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-bold">
              Create Task
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Task title"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                placeholder="Employee ID"
                className="rounded-xl border px-4 py-3"
                required
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Task description"
                className="rounded-xl border px-4 py-3"
              />

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="rounded-xl border px-4 py-3"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

            </div>

            <button className="mt-5 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
              Create Task
            </button>
          </form>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {tasks.map((task, index) => {

              const id =
                task._id ||
                task.id ||
                index;

              return (
                <div
                  key={id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex justify-between">

                    <h3 className="text-lg font-bold">
                      {task.title}
                    </h3>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                      {task.priority}
                    </span>

                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {task.description}
                  </p>

                  <p className="mt-3 text-sm">
                    Employee:{" "}
                    <span className="font-semibold">
                      {task.employee_id}
                    </span>
                  </p>

                  <p className="mt-2 text-sm">
                    Status:{" "}
                    <span className="font-semibold">
                      {task.status}
                    </span>
                  </p>

                  <div className="mt-5 flex gap-2">

                    <button
                      onClick={() =>
                        changeStatus(task)
                      }
                      className="rounded-lg bg-orange-100 px-3 py-2 text-orange-700"
                    >
                      Toggle Status
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(id)
                      }
                      className="rounded-lg bg-red-100 px-3 py-2 text-red-600"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Tasks;