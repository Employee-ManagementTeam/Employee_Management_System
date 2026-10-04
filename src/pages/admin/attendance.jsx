
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

  // Convert different backend response formats into an array
  const getArray = (data, keys = []) => {
    if (Array.isArray(data)) {
      return data;
    }

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

  // Load employees and attendance
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [employeesResponse, attendanceResponse] = await Promise.all([
        getEmployees(),
        getAttendance(),
      ]);

      const employeeList = getArray(employeesResponse, [
        "employees",
      ]);

      const attendanceList = getArray(attendanceResponse, [
        "attendance",
        "records",
      ]);

      setEmployees(employeeList);
      setAttendance(attendanceList);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Refresh attendance only
  const refreshAttendance = async () => {
    try {
      const response = await getAttendance();

      const attendanceList = getArray(response, [
        "attendance",
        "records",
      ]);

      setAttendance(attendanceList);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to refresh attendance.");
    }
  };

  // Check in
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
        "Employee " + id + " checked in successfully."
      );

      setEmployeeId("");

      await refreshAttendance();
    } catch (err) {
      console.error(err);
      setError(err.message || "Check-in failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Check out
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
        "Employee " + id + " checked out successfully."
      );

      setEmployeeId("");

      await refreshAttendance();
    } catch (err) {
      console.error(err);
      setError(err.message || "Check-out failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Get employee ID from different possible backend field names
  const getEmployeeId = (employee) => {
    return (
      employee.employee_id ||
      employee.id ||
      employee._id ||
      employee.employee_code ||
      ""
    );
  };

  // Get employee name
  const getEmployeeName = (employee) => {
    if (employee.name) {
      return employee.name;
    }

    const firstName = employee.first_name || "";
    const lastName = employee.last_name || "";

    const fullName = (firstName + " " + lastName).trim();

    if (fullName) {
      return fullName;
    }

    return employee.username || "Unknown Employee";
  };

  // Get attendance employee ID
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

  // Get attendance date
  const getAttendanceDate = (record) => {
    return (
      record.date ||
      record.attendance_date ||
      record.check_in_date ||
      record.created_at ||
      record.createdAt ||
      ""
    );
  };

  // Get attendance status
  const getAttendanceStatus = (record) => {
    const status = String(record.status || "").toLowerCase();

    if (status === "present") {
      return "Present";
    }

    if (status === "absent") {
      return "Absent";
    }

    if (status === "leave") {
      return "Leave";
    }

    if (record.check_out || record.checkout_time) {
      return "Checked Out";
    }

    if (record.check_in || record.checkin_time) {
      return "Present";
    }

    return "Not Marked";
  };

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const id = String(getEmployeeId(employee)).toLowerCase();
      const name = getEmployeeName(employee).toLowerCase();

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        id.includes(searchValue) ||
        name.includes(searchValue);

      return matchesSearch;
    });
  }, [employees, search]);

  // Find attendance record for employee
  const getEmployeeAttendance = (employee) => {
    const id = String(getEmployeeId(employee));

    let records = attendance.filter((record) => {
      return getAttendanceEmployeeId(record) === id;
    });

    if (selectedDate) {
      records = records.filter((record) => {
        const recordDate = getAttendanceDate(record);

        if (!recordDate) {
          return false;
        }

        return String(recordDate).startsWith(selectedDate);
      });
    }

    if (records.length === 0) {
      return null;
    }

    return records[records.length - 1];
  };

  // Summary calculations
  const presentCount = employees.filter((employee) => {
    const record = getEmployeeAttendance(employee);

    if (!record) {
      return false;
    }

    const status = getAttendanceStatus(record);

    return status === "Present";
  }).length;

  const checkedOutCount = employees.filter((employee) => {
    const record = getEmployeeAttendance(employee);

    if (!record) {
      return false;
    }

    return getAttendanceStatus(record) === "Checked Out";
  }).length;

  const notMarkedCount =
    employees.length - presentCount - checkedOutCount;

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <Navbar />

      <main className="ml-64 pt-20 min-h-screen">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Attendance Management
            </h1>

            <p className="mt-1 text-gray-500">
              Track employee check-in and check-out records
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-4">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total Employees
              </p>

              <h2 className="mt-2 text-3xl font-bold text-orange-600">
                {employees.length}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Present
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {presentCount}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Checked Out
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-600">
                {checkedOutCount}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Not Marked
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-600">
                {notMarkedCount}
              </h2>
            </div>
          </div>

          {/* Manual Check In / Check Out */}
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Mark Attendance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the employee ID to check in or check out.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />

              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Processing..." : "Check In"}
              </button>

              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Processing..." : "Check Out"}
              </button>

              <button
                onClick={loadData}
                disabled={loading}
                className="rounded-lg border border-orange-500 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 disabled:opacity-60"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Search and Date */}
          <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Search Employee
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by employee ID or name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Attendance Date
                </label>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-xl font-bold text-gray-800">
                Employee Attendance
              </h2>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading attendance...
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No employees found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-orange-50 text-left">
                      <th className="px-6 py-4 text-sm font-bold text-gray-700">
                        Employee ID
                      </th>

                      <th className="px-6 py-4 text-sm font-bold text-gray-700">
                        Employee Name
                      </th>

                      <th className="px-6 py-4 text-sm font-bold text-gray-700">
                        Department
                      </th>

                      <th className="px-6 py-4 text-sm font-bold text-gray-700">
                        Check In
                      </th>

                      <th className="px-6 py-4 text-sm font-bold text-gray-700">
                        Check Out
                      </th>

                      <th className="px-6 py-4 text-sm font-bold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.map((employee) => {
                      const record =
                        getEmployeeAttendance(employee);

                      const status = record
                        ? getAttendanceStatus(record)
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

                      let statusClass =
                        "bg-gray-100 text-gray-600";

                      if (status === "Present") {
                        statusClass =
                          "bg-green-100 text-green-700";
                      } else if (status === "Checked Out") {
                        statusClass =
                          "bg-blue-100 text-blue-700";
                      } else if (status === "Leave") {
                        statusClass =
                          "bg-yellow-100 text-yellow-700";
                      } else if (status === "Absent") {
                        statusClass =
                          "bg-red-100 text-red-700";
                      }

                      return (
                        <tr
                          key={String(
                            getEmployeeId(employee)
                          )}
                          className="border-t border-gray-100 hover:bg-orange-50"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {getEmployeeId(employee) || "-"}
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            {getEmployeeName(employee)}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {employee.department || "-"}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {checkInTime}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {checkOutTime}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={
                                "inline-flex rounded-full px-3 py-1 text-xs font-bold " +
                                statusClass
                              }
                            >
                              {status}
                            </span>
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

export default Attendance;

