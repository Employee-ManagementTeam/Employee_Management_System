import { useEffect, useMemo, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import {
  getEmployees,
  getEmployeeLeaves,
  createLeave,
} from "../../api/api";

function Leave() {
  const [employeeId, setEmployeeId] = useState("");
  const [leaves, setLeaves] = useState([]);

  const [form, setForm] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      const employeesResponse = await getEmployees();

      const employees = Array.isArray(employeesResponse)
        ? employeesResponse
        : employeesResponse.employees ||
          employeesResponse.data ||
          [];

      const employee = employees.find(
        (item) =>
          String(item.user_id) === String(userId) ||
          String(item.userId) === String(userId)
      );

      const id =
        employee?.id ||
        employee?.employee_id ||
        employee?._id;

      if (!id) {
        throw new Error(
          "Employee profile was not found."
        );
      }

      setEmployeeId(id);

      const response = await getEmployeeLeaves(id);

      setLeaves(
        Array.isArray(response)
          ? response
          : response.leaves ||
            response.data ||
            []
      );
    } catch (err) {
      setError(
        err.message || "Failed to load leaves."
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await createLeave({
        employee_id: employeeId,
        leave_type: form.leave_type,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason,
      });

      setForm({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
      });

      setMessage(
        "Your leave application has been submitted successfully."
      );

      await loadLeaves();
    } catch (err) {
      setError(
        err.message || "Failed to submit leave."
      );
    } finally {
      setSubmitting(false);
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

  const leaveDays = useMemo(() => {
    if (!form.start_date || !form.end_date) {
      return 0;
    }

    const start = new Date(form.start_date);
    const end = new Date(form.end_date);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 0;
    }

    if (end < start) {
      return 0;
    }

    const difference =
      end.getTime() - start.getTime();

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  }, [form.start_date, form.end_date]);

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

  const formatStatus = (status) => {
    if (!status) {
      return "Not specified";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

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
                Leave Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Submit leave applications, track their status, and
                review your leave history from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={loadLeaves}
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
              ERROR / SUCCESS
          ===================================================== */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Something went wrong
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                ✓
              </span>

              <div>
                <p className="text-sm font-bold">
                  Application submitted
                </p>

                <p className="mt-1 text-xs leading-5 text-green-600">
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              SUMMARY CARDS
          ===================================================== */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Requests
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {leaves.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Leave applications
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
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="17"
                      rx="2"
                    />
                    <path d="M7 2v4M17 2v4M3 9h18" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Pending
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {pendingLeaves.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Awaiting review
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
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Approved
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {approvedLeaves.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Approved requests
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Rejected
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {rejectedLeaves.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Declined requests
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M7 7l10 10" />
                    <path d="M17 7L7 17" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              APPLICATION FORM
          ===================================================== */}
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
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Apply for Leave
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Submit a new leave request for manager review.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Leave type */}
                <div>
                  <label
                    htmlFor="leave_type"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    Leave Type
                  </label>

                  <input
                    id="leave_type"
                    name="leave_type"
                    value={form.leave_type}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Casual Leave"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Days preview */}
                <div className="rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
                    Requested Duration
                  </p>

                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-2xl font-black text-orange-600">
                      {leaveDays}
                    </span>

                    <span className="pb-1 text-xs font-semibold text-orange-700">
                      {leaveDays === 1
                        ? "day"
                        : "days"}
                    </span>
                  </div>
                </div>

                {/* Start date */}
                <div>
                  <label
                    htmlFor="start_date"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    Start Date
                  </label>

                  <input
                    id="start_date"
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* End date */}
                <div>
                  <label
                    htmlFor="end_date"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    End Date
                  </label>

                  <input
                    id="end_date"
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    min={form.start_date || undefined}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Reason */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="reason"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    Reason
                  </label>

                  <textarea
                    id="reason"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Please provide a brief reason for your leave request..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center lg:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-30"
                          />

                          <path
                            d="M21 12a9 9 0 0 0-9-9"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                        </svg>

                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M22 2L11 13" />
                          <path d="M22 2l-7 20-4-9-9-4z" />
                        </svg>

                        Submit Leave Request
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        leave_type: "",
                        start_date: "",
                        end_date: "",
                        reason: "",
                      })
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* =====================================================
              LEAVE HISTORY
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Leave History
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Track all your submitted leave requests.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {leaves.length}{" "}
                {leaves.length === 1
                  ? "Request"
                  : "Requests"}
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : leaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
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
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No leave records found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Your submitted leave requests will appear here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100 text-left">
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Leave Type
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Start Date
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            End Date
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Reason
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {leaves.map((leave, index) => (
                          <tr
                            key={
                              leave.id ||
                              leave.leave_id ||
                              leave._id ||
                              `leave-${index}`
                            }
                            className="border-b border-slate-50 transition hover:bg-orange-50/30"
                          >
                            <td className="px-4 py-4">
                              <p className="text-sm font-bold text-slate-800">
                                {leave.leave_type ||
                                  "Not specified"}
                              </p>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {leave.start_date ||
                                "Not provided"}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {leave.end_date ||
                                "Not provided"}
                            </td>

                            <td className="max-w-xs px-4 py-4">
                              <p className="truncate text-sm text-slate-500">
                                {leave.reason ||
                                  "No reason provided"}
                              </p>
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                  leave.status
                                )}`}
                              >
                                {formatStatus(
                                  leave.status
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="space-y-3 md:hidden">
                    {leaves.map((leave, index) => (
                      <div
                        key={
                          leave.id ||
                          leave.leave_id ||
                          leave._id ||
                          `leave-mobile-${index}`
                        }
                        className="rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {leave.leave_type ||
                                "Not specified"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {leave.start_date ||
                                "N/A"}{" "}
                              →{" "}
                              {leave.end_date ||
                                "N/A"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(
                              leave.status
                            )}`}
                          >
                            {formatStatus(
                              leave.status
                            )}
                          </span>
                        </div>

                        <div className="mt-3 rounded-lg bg-slate-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Reason
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-600">
                            {leave.reason ||
                              "No reason provided"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Leave Management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Leave;