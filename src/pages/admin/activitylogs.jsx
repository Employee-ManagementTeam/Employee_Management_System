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
      setError("");

      const response = await getActivityLogs();

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
      setError("");

      await createActivityLog(form);

      setMessage("Activity log created successfully.");

      setForm({
        user_id: localStorage.getItem("userId") || "",
        action: "",
        module: "",
        description: "",
      });

      await loadLogs();
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
              Security & Monitoring
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Activity Logs
            </h1>

            <p className="mt-2 text-slate-500">
              Track system and user activity across the application
            </p>
          </div>

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

          {/* CREATE LOG */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-900">
                Create Activity Log
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Record an activity or system event
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    User ID
                  </label>

                  <input
                    value={form.user_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        user_id: e.target.value,
                      })
                    }
                    placeholder="User ID"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Action
                  </label>

                  <input
                    value={form.action}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        action: e.target.value,
                      })
                    }
                    placeholder="Example: Updated employee"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Module
                  </label>

                  <input
                    value={form.module}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        module: e.target.value,
                      })
                    }
                    placeholder="Example: Employees"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the activity"
                    rows={1}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md"
                >
                  Add Activity
                </button>
              </div>

            </form>
          </div>

          {/* HISTORY */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Activity History
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {logs.length} recorded activit
                    {logs.length === 1 ? "y" : "ies"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                  Audit Trail
                </div>
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-semibold text-slate-700">
                  No activity recorded
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  New activity records will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">

                {logs.map((log, index) => {
                  const id =
                    log._id ||
                    log.id ||
                    index;

                  return (
                    <div
                      key={id}
                      className="px-6 py-5 transition hover:bg-slate-50"
                    >
                      <div className="flex gap-4">

                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M12 3v18" />
                            <path d="M5 8h10a4 4 0 0 1 0 8H8" />
                          </svg>
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {log.action || "Activity"}
                              </h3>

                              <p className="mt-1 text-sm font-medium text-orange-600">
                                {log.module || "System"}
                              </p>
                            </div>

                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-500">
                              {log.user_id || "User"}
                            </span>

                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {log.description || "No description available."}
                          </p>

                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default ActivityLogs;