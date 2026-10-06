import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getAttendance,
  getEmployees,
  checkIn,
  checkOut,
} from "../../api/api";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getArray = (data, keys = []) => {
    if (Array.isArray(data)) return data;

    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    for (const key of keys) {
      if (data && Array.isArray(data[key])) {
        return data[key];
      }
    }

    return [];
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [employeesResponse, attendanceResponse] =
        await Promise.all([
          getEmployees(),
          getAttendance(),
        ]);

      setEmployees(
        getArray(employeesResponse, ["employees"])
      );

      setAttendance(
        getArray(attendanceResponse, [
          "attendance",
          "records",
        ])
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to load attendance data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshAttendance = async () => {
    try {
      setError("");

      const response = await getAttendance();

      setAttendance(
        getArray(response, [
          "attendance",
          "records",
        ])
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to refresh attendance."
      );
    }
  };

  const handleCheckIn = async () => {
    const id = employeeId.trim();

    if (!id) {
      setError("Please enter an employee ID.");
      setMessage("");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await checkIn(id);

      setMessage(
        `Employee ${id} checked in successfully.`
      );

      setEmployeeId("");
      await refreshAttendance();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Check-in failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    const id = employeeId.trim();

    if (!id) {
      setError("Please enter an employee ID.");
      setMessage("");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await checkOut(id);

      setMessage(
        `Employee ${id} checked out successfully.`
      );

      setEmployeeId("");
      await refreshAttendance();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Check-out failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getEmployeeId = (employee) =>
    employee.employee_id ||
    employee.id ||
    employee._id ||
    employee.employee_code ||
    "";

  const getEmployeeName = (employee) => {
    if (employee.name) return employee.name;

    const fullName = `${employee.first_name || ""} ${
      employee.last_name || ""
    }`.trim();

    return (
      fullName ||
      employee.username ||
      "Unknown Employee"
    );
  };

  const getAttendanceEmployeeId = (record) => {
    if (record.employee_id) {
      return String(record.employee_id);
    }

    if (record.employeeId) {
      return String(record.employeeId);
    }

    if (record.employee) {
      if (typeof record.employee === "object") {
        return String(
          record.employee.employee_id ||
            record.employee.id ||
            record.employee._id ||
            ""
        );
      }

      return String(record.employee);
    }

    return "";
  };

  const getAttendanceDate = (record) =>
    record?.date ||
    record?.attendance_date ||
    record?.check_in_date ||
    record?.created_at ||
    record?.createdAt ||
    "";

  const getAttendanceStatus = (record) => {
    const status = String(
      record?.status || ""
    ).toLowerCase();

    if (status === "present") return "Present";
    if (status === "absent") return "Absent";
    if (status === "leave") return "Leave";

    if (record?.check_out || record?.checkout_time) {
      return "Checked Out";
    }

    if (record?.check_in || record?.checkin_time) {
      return "Present";
    }

    return "Not Marked";
  };

  const filteredEmployees = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return employees.filter((employee) => {
      const id = String(
        getEmployeeId(employee)
      ).toLowerCase();

      const name =
        getEmployeeName(employee).toLowerCase();

      return (
        !searchValue ||
        id.includes(searchValue) ||
        name.includes(searchValue)
      );
    });
  }, [employees, search]);

  const getEmployeeAttendance = (employee) => {
    const id = String(
      getEmployeeId(employee)
    );

    let records = attendance.filter(
      (record) =>
        getAttendanceEmployeeId(record) === id
    );

    if (selectedDate) {
      records = records.filter((record) => {
        const recordDate =
          getAttendanceDate(record);

        return (
          recordDate &&
          String(recordDate).startsWith(
            selectedDate
          )
        );
      });
    }

    return records.length
      ? records[records.length - 1]
      : null;
  };

  const getCount = (status) =>
    employees.filter((employee) => {
      const record =
        getEmployeeAttendance(employee);

      return (
        record &&
        getAttendanceStatus(record) === status
      );
    }).length;

  const presentCount = getCount("Present");
  const checkedOutCount = getCount("Checked Out");
  const leaveCount = getCount("Leave");
  const absentCount = getCount("Absent");

  const notMarkedCount = Math.max(
    0,
    employees.length -
      presentCount -
      checkedOutCount -
      leaveCount -
      absentCount
  );

  const getStatusStyle = (status) => {
    if (status === "Present") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "Checked Out") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "Leave") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    if (status === "Absent") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
                Workforce Management
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Attendance Management
              </h1>

              <p className="mt-2 text-slate-500">
                Track employee check-in, check-out and daily attendance.
              </p>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
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

          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryCard
              title="Total Employees"
              value={employees.length}
              icon="👥"
            />
            <SummaryCard
              title="Present"
              value={presentCount}
              icon="✓"
            />
            <SummaryCard
              title="Checked Out"
              value={checkedOutCount}
              icon="↗"
            />
            <SummaryCard
              title="On Leave"
              value={leaveCount}
              icon="📅"
            />
            <SummaryCard
              title="Not Marked"
              value={notMarkedCount}
              icon="−"
            />
          </div>

          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Attendance Control
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Mark Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter an employee ID to record check-in or check-out.
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-3 lg:flex-row">
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) =>
                    setEmployeeId(e.target.value)
                  }
                  placeholder="Enter Employee ID"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />

                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading}
                  className="rounded-xl bg-orange-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading
                    ? "Processing..."
                    : "Check In"}
                </button>

                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  className="rounded-xl bg-slate-800 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading
                    ? "Processing..."
                    : "Check Out"}
                </button>
              </div>
            </div>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Search Employee
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by employee ID or name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="w-full lg:max-w-xs">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Attendance Date
                </label>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {(search || selectedDate) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedDate("");
                  }}
                  className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Employee Attendance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredEmployees.length} employee
                    {filteredEmployees.length !== 1
                      ? "s"
                      : ""}{" "}
                    displayed
                  </p>
                </div>

                <span className="w-fit rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  Live Records
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

                <p className="text-sm text-slate-500">
                  Loading attendance...
                </p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                  👥
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No employees found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or date filter.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-6 py-4">
                          Employee
                        </th>
                        <th className="px-6 py-4">
                          Department
                        </th>
                        <th className="px-6 py-4">
                          Check In
                        </th>
                        <th className="px-6 py-4">
                          Check Out
                        </th>
                        <th className="px-6 py-4">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEmployees.map(
                        (employee) => {
                          const record =
                            getEmployeeAttendance(
                              employee
                            );

                          const status = record
                            ? getAttendanceStatus(
                                record
                              )
                            : "Not Marked";

                          const checkInTime =
                            record?.check_in ||
                            record?.checkin_time ||
                            record?.check_in_time ||
                            "-";

                          const checkOutTime =
                            record?.check_out ||
                            record?.checkout_time ||
                            record?.check_out_time ||
                            "-";

                          return (
                            <tr
                              key={String(
                                getEmployeeId(employee)
                              )}
                              className="border-b border-slate-100 transition hover:bg-orange-50/40"
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-orange-600">
                                    {getEmployeeName(
                                      employee
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <p className="font-semibold text-slate-800">
                                      {getEmployeeName(
                                        employee
                                      )}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                      {getEmployeeId(
                                        employee
                                      ) || "-"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-5 text-sm text-slate-600">
                                {employee.department ||
                                  "-"}
                              </td>

                              <td className="px-6 py-5 text-sm text-slate-600">
                                {checkInTime}
                              </td>

                              <td className="px-6 py-5 text-sm text-slate-600">
                                {checkOutTime}
                              </td>

                              <td className="px-6 py-5">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                    status
                                  )}`}
                                >
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 p-4 lg:hidden">
                  {filteredEmployees.map(
                    (employee) => {
                      const record =
                        getEmployeeAttendance(
                          employee
                        );

                      const status = record
                        ? getAttendanceStatus(
                            record
                          )
                        : "Not Marked";

                      return (
                        <div
                          key={String(
                            getEmployeeId(employee)
                          )}
                          className="rounded-2xl border border-slate-200 p-5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 font-bold text-orange-600">
                                {getEmployeeName(
                                  employee
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {getEmployeeName(
                                    employee
                                  )}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {getEmployeeId(
                                    employee
                                  ) || "-"}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-4">
                            <InfoItem
                              label="Department"
                              value={
                                employee.department ||
                                "-"
                              }
                            />

                            <InfoItem
                              label="Check In"
                              value={
                                record?.check_in ||
                                record?.checkin_time ||
                                record?.check_in_time ||
                                "-"
                              }
                            />

                            <InfoItem
                              label="Check Out"
                              value={
                                record?.check_out ||
                                record?.checkout_time ||
                                record?.check_out_time ||
                                "-"
                              }
                            />

                            <InfoItem
                              label="Date"
                              value={
                                selectedDate ||
                                getAttendanceDate(
                                  record
                                ) ||
                                "-"
                              }
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default Attendance;
