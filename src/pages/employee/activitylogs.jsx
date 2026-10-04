import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import { getActivityLogs } from "../../api/api";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await getActivityLogs();

      const data =
        Array.isArray(response)
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

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Activity Logs
          </h1>

          <p className="mt-1 text-gray-500">
            Your account activity.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading activity logs...
            </p>
          ) : logs.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No activity logs found.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

              <div className="space-y-5">
                {logs.map((log) => (
                  <div
                    key={
                      log.id ||
                      log.activity_id ||
                      log._id
                    }
                    className="border-l-4 border-orange-500 pl-5"
                  >
                    <p className="font-bold text-gray-800">
                      {log.action ||
                        "Activity"}
                    </p>

                    <p className="mt-1 text-gray-600">
                      {log.description ||
                        "No description provided."}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {log.module ||
                        "Module not provided"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {log.created_at ||
                        log.timestamp ||
                        ""}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default ActivityLogs;