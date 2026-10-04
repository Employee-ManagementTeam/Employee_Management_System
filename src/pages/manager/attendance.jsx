import { useEffect, useState } from "react";
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

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const [attendanceResponse, employeesResponse] =
        await Promise.all([
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
      setError(err.message || "Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (item) =>
        String(item.id || item._id) ===
        String(employeeId)
    );

    if (!employee) return employeeId || "-";

    return `${employee.first_name || ""} ${
      employee.last_name || ""
    }`.trim();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance
          </h1>

          <p className="mt-1 text-gray-500">
            View employee attendance records.
          </p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading attendance...
              </div>
            ) : attendance.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No attendance records found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Check In</th>
                    <th className="px-5 py-3">Check Out</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((item, index) => (
                    <tr
                      key={item.id || item._id || index}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4">
                        {getEmployeeName(
                          item.employee_id
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {item.date || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {item.check_in ||
                          item.check_in_time ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {item.check_out ||
                          item.check_out_time ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {item.status || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Attendance;