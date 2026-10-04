import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getActivityLogs,
  createActivityLog,
} from "../../api/api";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  const [form, setForm] = useState({
    user_id: localStorage.getItem("userId") || "",
    action: "",
    module: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLogs = async () => {
    try {
      const response =
        await getActivityLogs();

      const data = Array.isArray(response)
        ? response
        : response?.activity_logs ||
          response?.logs ||
          response?.data ||
          [];

      setLogs(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createActivityLog(form);

      setMessage(
        "Activity log created successfully."
      );

      setForm({
        user_id:
          localStorage.getItem("userId") || "",
        action: "",
        module: "",
        description: "",
      });

      await loadLogs();
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
            Activity Logs
          </h1>

          <p className="mb-8 text-gray-500">
            Track system and user activities
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
              Create Activity Log
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                value={form.user_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    user_id: e.target.value,
                  })
                }
                placeholder="User ID"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                value={form.action}
                onChange={(e) =>
                  setForm({
                    ...form,
                    action: e.target.value,
                  })
                }
                placeholder="Action"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                value={form.module}
                onChange={(e) =>
                  setForm({
                    ...form,
                    module: e.target.value,
                  })
                }
                placeholder="Module"
                className="rounded-xl border px-4 py-3"
                required
              />

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="rounded-xl border px-4 py-3"
                required
              />

            </div>

            <button className="mt-5 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
              Add Activity
            </button>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold">
              Activity History
            </h2>

            <div className="space-y-4">

              {logs.map((log, index) => {

                const id =
                  log._id ||
                  log.id ||
                  index;

                return (
                  <div
                    key={id}
                    className="rounded-xl border border-gray-100 p-5 transition hover:border-orange-200 hover:bg-orange-50"
                  >
                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="font-bold text-gray-800">
                          {log.action ||
                            "Activity"}
                        </h3>

                        <p className="mt-1 text-sm text-orange-600">
                          {log.module ||
                            "System"}
                        </p>

                        <p className="mt-2 text-gray-600">
                          {log.description ||
                            "-"}
                        </p>

                      </div>

                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                        {log.user_id ||
                          "User"}
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default ActivityLogs;