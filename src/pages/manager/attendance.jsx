import { useEffect, useMemo, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getAttendance,
  getEmployees,
} from "../../api/api";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        attendanceResponse,
        employeesResponse,
      ] = await Promise.all([
        getAttendance(),
        getEmployees(),
      ]);

      setAttendance(
        attendanceResponse?.attendance ||
          attendanceResponse?.data ||
          (Array.isArray(attendanceResponse)
            ? attendanceResponse
            : [])
      );

      setEmployees(
        employeesResponse?.employees ||
          employeesResponse?.data ||
          (Array.isArray(employeesResponse)
            ? employeesResponse
            : [])
      );
    } catch (err) {
      setError(
        err.message || "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (item) =>
        String(
          item.id ||
            item.employee_id ||
            item._id
        ) === String(employeeId)
    );

    if (!employee) {
      return employeeId || "-";
    }

    return (
      `${employee.first_name || ""} ${
        employee.last_name || ""
      }`.trim() ||
      employee.employee_code ||
      employeeId ||
      "-"
    );
  };

  const getStatusStyle = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (
      normalized === "present" ||
      normalized === "active"
    ) {
      return "border-green-100 bg-green-50 text-green-700";
    }

    if (
      normalized === "absent" ||
      normalized === "rejected"
    ) {
      return "border-red-100 bg-red-50 text-red-700";
    }

    if (
      normalized === "late" ||
      normalized === "pending"
    ) {
      return "border-orange-100 bg-orange-50 text-orange-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Not provided";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const presentCount = attendance.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "present"
  ).length;

  const absentCount = attendance.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "absent"
  ).length;

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendance.filter((item) => {
      const employeeName = getEmployeeName(
        item.employee_id
      ).toLowerCase();

      const employeeId = String(
        item.employee_id || ""
      ).toLowerCase();

      const date = String(
        item.date || ""
      ).toLowerCase();

      const status = String(
        item.status || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        employeeName.includes(query) ||
        employeeId.includes(query) ||
        date.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [
    attendance,
    search,
    statusFilter,
    employees,
  ]);

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
                Attendance
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor employee attendance, check-in,
                check-out, and daily attendance status.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAttendance}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-60"
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

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>
              <div>
                <p className="text-sm font-bold">
                  Unable to load attendance
                </p>
                <p className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Total Records"
              value={attendance.length}
              subtitle="Attendance entries"
              icon="total"
            />

            <SummaryCard
              title="Present"
              value={presentCount}
              subtitle="Present records"
              icon="present"
              success
            />

            <SummaryCard
              title="Absent"
              value={absentCount}
              subtitle="Absent records"
              icon="absent"
              danger
            />
          </div>

          {/* Search / Filter */}
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
                  placeholder="Search employee, ID or date..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Present",
                  "Absent",
                  "Late",
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

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Attendance Records
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {filteredAttendance.length} records shown
                  </p>
                </div>

                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {attendance.length} Total
                </span>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredAttendance.length === 0 ? (
                <EmptyState
                  title="No attendance records found"
                  description="Try changing your search or status filter."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Date
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Check In
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Check Out
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAttendance.map(
                        (item, index) => (
                          <tr
                            key={
                              item.id ||
                              item._id ||
                              index
                            }
                            className="border-b border-slate-50 hover:bg-orange-50/30"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-xs font-black text-orange-600">
                                  {String(
                                    index + 1
                                  ).padStart(2, "0")}
                                </div>

                                <span className="text-sm font-bold text-slate-800">
                                  {getEmployeeName(
                                    item.employee_id
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {item.date || "-"}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {item.check_in ||
                                item.check_in_time ||
                                "-"}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {item.check_out ||
                                item.check_out_time ||
                                "-"}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                  item.status
                                )}`}
                              >
                                {formatStatus(
                                  item.status
                                )}
                              </span>
                            </td>
                          </tr>
                        )
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

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  success,
  danger,
}) {
  const iconMap = {
    total: (
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
    ),
    present: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M5 12l4 4L19 6" />
      </svg>
    ),
    absent: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M7 7l10 10M17 7L7 17" />
      </svg>
    ),
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            success
              ? "bg-green-50 text-green-600"
              : danger
              ? "bg-red-50 text-red-600"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          {iconMap[icon]}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
      </div>

      <p className="mt-4 text-sm font-bold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default Attendance;