import { useEffect, useMemo, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getLeaves,
  approveLeave,
  rejectLeave,
} from "../../api/api";

function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeaves();

      setLeaves(
        response?.leaves ||
          response?.data ||
          (Array.isArray(response)
            ? response
            : [])
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this leave request?")) {
      return;
    }

    try {
      setProcessingId(id);
      setError("");
      setMessage("");

      await approveLeave(id);

      setMessage(
        "Leave approved successfully."
      );

      await loadLeaves();
    } catch (err) {
      setError(
        err.message || "Failed to approve leave."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this leave request?")) {
      return;
    }

    try {
      setProcessingId(id);
      setError("");
      setMessage("");

      await rejectLeave(id);

      setMessage(
        "Leave rejected successfully."
      );

      await loadLeaves();
    } catch (err) {
      setError(
        err.message || "Failed to reject leave."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const pendingLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() ===
      "pending"
  );

  const approvedLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() ===
      "approved"
  );

  const rejectedLeaves = leaves.filter(
    (leave) =>
      String(leave.status || "").toLowerCase() ===
      "rejected"
  );

  const filteredLeaves = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leaves.filter((leave) => {
      const employee = String(
        leave.employee_name ||
          leave.employee_id ||
          ""
      ).toLowerCase();

      const type = String(
        leave.leave_type || ""
      ).toLowerCase();

      const reason = String(
        leave.reason || ""
      ).toLowerCase();

      const status = String(
        leave.status || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        employee.includes(query) ||
        type.includes(query) ||
        reason.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [leaves, search, statusFilter]);

  const getStatusStyle = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (normalized === "approved") {
      return "border-green-100 bg-green-50 text-green-700";
    }

    if (normalized === "pending") {
      return "border-orange-100 bg-orange-50 text-orange-700";
    }

    if (normalized === "rejected") {
      return "border-red-100 bg-red-50 text-red-700";
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
                Leave Approvals
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review employee leave requests and approve or reject
                pending applications.
              </p>
            </div>

            <button
              type="button"
              onClick={loadLeaves}
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
                  Action completed
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
                  Leave action failed
                </p>
                <p className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Summary
              title="Total Requests"
              value={leaves.length}
              subtitle="All leave applications"
            />

            <Summary
              title="Pending"
              value={pendingLeaves.length}
              subtitle="Need your action"
              orange
            />

            <Summary
              title="Approved"
              value={approvedLeaves.length}
              subtitle="Approved requests"
              green
            />

            <Summary
              title="Rejected"
              value={rejectedLeaves.length}
              subtitle="Rejected requests"
              red
            />
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
                  placeholder="Search employee, leave type or reason..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Pending",
                  "Approved",
                  "Rejected",
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

          {/* Records */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-extrabold text-slate-900">
                Leave Requests
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredLeaves.length} requests shown
              </p>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-20 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredLeaves.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-sm font-bold text-slate-700">
                    No leave requests found
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    No records match the current filters.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Type
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Period
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Reason
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
                      {filteredLeaves.map(
                        (leave, index) => {
                          const id =
                            leave.id ||
                            leave._id ||
                            index;

                          const status = String(
                            leave.status || ""
                          ).toLowerCase();

                          const processing =
                            processingId === id;

                          return (
                            <tr
                              key={id}
                              className="border-b border-slate-50 hover:bg-orange-50/30"
                            >
                              <td className="px-4 py-4">
                                <p className="text-sm font-bold text-slate-800">
                                  {leave.employee_name ||
                                    leave.employee_id ||
                                    "-"}
                                </p>
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {leave.leave_type ||
                                  "-"}
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {leave.start_date ||
                                  "-"}{" "}
                                →{" "}
                                {leave.end_date ||
                                  "-"}
                              </td>

                              <td className="max-w-xs px-4 py-4">
                                <p className="truncate text-sm text-slate-500">
                                  {leave.reason ||
                                    "-"}
                                </p>
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                    status
                                  )}`}
                                >
                                  {status ||
                                    "Unknown"}
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                {status === "pending" ? (
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      disabled={
                                        processing
                                      }
                                      onClick={() =>
                                        handleApprove(
                                          id
                                        )
                                      }
                                      className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 hover:bg-green-100 disabled:opacity-50"
                                    >
                                      Approve
                                    </button>

                                    <button
                                      type="button"
                                      disabled={
                                        processing
                                      }
                                      onClick={() =>
                                        handleReject(
                                          id
                                        )
                                      }
                                      className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    No action
                                  </span>
                                )}
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

function Summary({
  title,
  value,
  subtitle,
  orange,
  green,
  red,
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
            : green
            ? "text-green-600"
            : red
            ? "text-red-600"
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
  if (status === "approved") {
    return "border-green-100 bg-green-50 text-green-700";
  }

  if (status === "pending") {
    return "border-orange-100 bg-orange-50 text-orange-700";
  }

  if (status === "rejected") {
    return "border-red-100 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default LeaveApprovals;