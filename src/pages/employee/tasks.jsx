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

      const response = await getTasks();

      const taskList =
        Array.isArray(response)
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

      const employeesData = await employeesResponse.json();

      const employees = Array.isArray(employeesData)
        ? employeesData
        : employeesData.employees || employeesData.data || [];

      const currentEmployee = employees.find(
        (employee) =>
          String(employee.user_id) === String(userId) ||
          String(employee.userId) === String(userId)
      );

      const id =
        currentEmployee?.id ||
        currentEmployee?.employee_id ||
        currentEmployee?._id;

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
      setUpdating(task.id || task.task_id || task._id);

      const taskId =
        task.id ||
        task.task_id ||
        task._id;

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

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            My Tasks
          </h1>

          <p className="mt-1 text-gray-500">
            Tasks assigned to you.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No tasks found.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {tasks.map((task) => {
                const taskId =
                  task.id ||
                  task.task_id ||
                  task._id;

                return (
                  <div
                    key={taskId}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {task.title || task.name}
                        </h2>

                        <p className="mt-2 text-gray-500">
                          {task.description ||
                            "No description provided."}
                        </p>
                      </div>

                      <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                        {task.status || "Not specified"}
                      </span>
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-medium text-gray-600">
                        Update Status
                      </label>

                      <select
                        value={task.status || ""}
                        disabled={updating === taskId}
                        onChange={(e) =>
                          handleStatusChange(
                            task,
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
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
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Tasks;