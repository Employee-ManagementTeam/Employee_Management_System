import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getLeaves,
  approveLeave,
  rejectLeave,
} from "../../api/api";

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeaves();

      const data = Array.isArray(response)
        ? response
        : response?.leaves ||
          response?.data ||
          [];

      setLeaves(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveLeave(id);

      setMessage("Leave approved successfully.");
      setError("");

      await loadLeaves();
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectLeave(id);

      setMessage("Leave rejected successfully.");
      setError("");

      await loadLeaves();
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "approved") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
    }

    if (value === "rejected") {
      return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200";
    }

    return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
              Human Resources
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Leave Management
            </h1>

            <p className="mt-2 text-slate-500">
              Review and manage employee leave requests
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

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Leave Requests
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {leaves.length} request
                    {leaves.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
                  Review
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />
                <p className="text-sm text-slate-500">
                  Loading leave requests...
                </p>
              </div>
            ) : leaves.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-base font-semibold text-slate-700">
                  No leave requests
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Leave requests will appear here when employees submit them.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Employee
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Leave Type
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Start
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        End
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reason
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.map((leave, index) => {
                      const id = leave._id || leave.id;
                      const status = leave.status || "Pending";

                      return (
                        <tr
                          key={id || index}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <div className="font-semibold text-slate-800">
                              {leave.employee_id || "—"}
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm font-medium text-slate-700">
                            {leave.leave_type || "—"}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {leave.start_date || "—"}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {leave.end_date || "—"}
                          </td>

                          <td className="max-w-[250px] px-6 py-5 text-sm text-slate-600">
                            <p className="truncate">
                              {leave.reason || "—"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            {String(status).toLowerCase() ===
                            "pending" ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprove(id)}
                                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() => handleReject(id)}
                                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs font-medium text-slate-400">
                                No action
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default Leave;