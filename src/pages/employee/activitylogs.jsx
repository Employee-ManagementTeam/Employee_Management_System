import { useEffect, useMemo, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import { getActivityLogs } from "../../api/api";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getActivityLogs();

      const data = Array.isArray(response)
        ? response
        : response.activity_logs ||
          response.logs ||
          response.data ||
          [];

      const userId = localStorage.getItem("userId");

      const mine = data.filter(
        (log) =>
          String(log.user_id) === String(userId)
      );

      setLogs(mine);
    } catch (err) {
      setError(
        err.message || "Failed to load activity logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const getModule = (log) => {
    return (
      log.module ||
      log.resource ||
      log.category ||
      "General"
    );
  };

  const getAction = (log) => {
    return (
      log.action ||
      log.activity ||
      "Activity"
    );
  };

  const getDescription = (log) => {
    return (
      log.description ||
      log.message ||
      "No description provided."
    );
  };

  const getTimestamp = (log) => {
    return (
      log.created_at ||
      log.timestamp ||
      log.createdAt ||
      ""
    );
  };

  const getActionIcon = (action) => {
    const value = String(
      action || ""
    ).toLowerCase();

    if (
      value.includes("login") ||
      value.includes("sign in")
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M21 19V5a2 2 0 0 0-2-2h-7" />
        </svg>
      );
    }

    if (
      value.includes("logout") ||
      value.includes("sign out")
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M14 17l5-5-5-5" />
          <path d="M19 12H7" />
          <path d="M3 5v14a2 2 0 0 0 2 2h7" />
        </svg>
      );
    }

    if (
      value.includes("attendance") ||
      value.includes("check")
    ) {
      return (
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
      );
    }

    if (
      value.includes("task") ||
      value.includes("assignment")
    ) {
      return (
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
      );
    }

    if (
      value.includes("leave") ||
      value.includes("holiday")
    ) {
      return (
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
        </svg>
      );
    }

    if (
      value.includes("profile") ||
      value.includes("account")
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    }

    if (
      value.includes("document") ||
      value.includes("upload")
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 2h9l5 5v15H6z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  };

  const getModuleStyle = (module) => {
    const value = String(
      module || ""
    ).toLowerCase();

    if (value.includes("attendance")) {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (value.includes("leave")) {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    if (value.includes("task")) {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (value.includes("profile")) {
      return "bg-purple-50 text-purple-700 border-purple-100";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const formatDate = (value) => {
    if (!value) {
      return "Time not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const modules = useMemo(() => {
    const uniqueModules = [
      ...new Set(
        logs.map((log) => getModule(log))
      ),
    ];

    return ["All", ...uniqueModules];
  }, [logs]);

  const filteredLogs =
    filter === "All"
      ? logs
      : logs.filter(
          (log) => getModule(log) === filter
        );

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Employee Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Activity Logs
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review your recent account activity and interactions
                across the EmployeeMS portal.
              </p>
            </div>

            <button
              type="button"
              onClick={loadLogs}
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

              Refresh
            </button>
          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Unable to load activity
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              SUMMARY
          ===================================================== */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Activities
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {logs.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Recorded account activities
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
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4l3 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Modules
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {Math.max(modules.length - 1, 0)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Areas with activity
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Current View
                  </p>

                  <p className="mt-3 text-xl font-black text-slate-900">
                    {filteredLogs.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Activities shown
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              FILTER
          ===================================================== */}
          {modules.length > 1 && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Filter Activity
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    View activity from a specific system module.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {modules.map((module) => (
                    <button
                      key={module}
                      type="button"
                      onClick={() =>
                        setFilter(module)
                      }
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                        filter === module
                          ? "bg-orange-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"
                      }`}
                    >
                      {module}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              ACTIVITY LIST
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Recent Activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  A record of your recent interactions with EmployeeMS.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {filteredLogs.length}{" "}
                {filteredLogs.length === 1
                  ? "Activity"
                  : "Activities"}
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-2xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v4l3 2" />
                    </svg>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No activity found
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                    Your account activity will appear here as you use
                    the EmployeeMS portal.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute bottom-4 left-5 top-4 hidden w-px bg-slate-200 sm:block" />

                  <div className="space-y-4">
                    {filteredLogs.map(
                      (log, index) => {
                        const id =
                          log.id ||
                          log.activity_id ||
                          log._id ||
                          `activity-${index}`;

                        const action =
                          getAction(log);

                        const module =
                          getModule(log);

                        return (
                          <div
                            key={id}
                            className="relative flex gap-4 rounded-2xl border border-slate-100 p-5 transition hover:border-orange-100 hover:bg-orange-50/20"
                          >
                            {/* Icon */}
                            <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                              {getActionIcon(action)}
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-sm font-extrabold text-slate-900">
                                      {action}
                                    </h3>

                                    <span
                                      className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${getModuleStyle(
                                        module
                                      )}`}
                                    >
                                      {module}
                                    </span>
                                  </div>

                                  <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {getDescription(
                                      log
                                    )}
                                  </p>
                                </div>

                                <span className="shrink-0 text-[10px] font-medium text-slate-400">
                                  {formatDate(
                                    getTimestamp(
                                      log
                                    )
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Activity Logs
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ActivityLogs;