import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/Navbar";

import {
  getAttendanceReport,
  getLeavesReport,
  getPayrollReport,
} from "../../api/api";

function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        attendanceResponse,
        leavesResponse,
        payrollResponse,
      ] = await Promise.all([
        getAttendanceReport(),
        getLeavesReport(),
        getPayrollReport(),
      ]);

      setAttendance(
        attendanceResponse?.attendance ||
          attendanceResponse?.data ||
          (Array.isArray(attendanceResponse)
            ? attendanceResponse
            : [])
      );

      setLeaves(
        leavesResponse?.leaves ||
          leavesResponse?.data ||
          (Array.isArray(leavesResponse)
            ? leavesResponse
            : [])
      );

      setPayroll(
        payrollResponse?.payroll ||
          payrollResponse?.data ||
          (Array.isArray(payrollResponse)
            ? payrollResponse
            : [])
      );
    } catch (err) {
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Reports
          </h1>

          <p className="mt-1 text-gray-500">
            View attendance, leave and payroll reports.
          </p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-6 rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
              Loading reports...
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <ReportSection
                title="Attendance Report"
                data={attendance}
                columns={[
                  "employee_id",
                  "date",
                  "check_in",
                  "check_out",
                  "status",
                ]}
              />

              <ReportSection
                title="Leave Report"
                data={leaves}
                columns={[
                  "employee_id",
                  "leave_type",
                  "start_date",
                  "end_date",
                  "status",
                ]}
              />

              <ReportSection
                title="Payroll Report"
                data={payroll}
                columns={[
                  "employee_id",
                  "month",
                  "amount",
                  "status",
                ]}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ReportSection({ title, data, columns }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-800">
          {title}
        </h2>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No records found.
        </div>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-3">
                  {column.replaceAll("_", " ")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id || item._id || index}
                className="border-t border-gray-100"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-5 py-4"
                  >
                    {item[column] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reports;