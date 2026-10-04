import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
} from "../../api/api";

function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toArray = (response, keys) => {
    if (Array.isArray(response)) {
      return response;
    }

    for (const key of keys) {
      if (Array.isArray(response?.[key])) {
        return response[key];
      }
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  const loadReports = async () => {
    try {
      setLoading(true);

      const [
        attendanceResponse,
        leavesResponse,
        payrollResponse,
      ] = await Promise.all([
        getAttendanceReport(),
        getLeaveReport(),
        getPayrollReport(),
      ]);

      setAttendance(
        toArray(attendanceResponse, [
          "attendance",
          "report",
        ])
      );

      setLeaves(
        toArray(leavesResponse, [
          "leaves",
          "report",
        ])
      );

      setPayroll(
        toArray(payrollResponse, [
          "payroll",
          "report",
        ])
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Reports
          </h1>

          <p className="mb-8 text-gray-500">
            Organization attendance, leave and payroll reports
          </p>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center">
              Loading reports...
            </div>
          ) : (
            <div className="space-y-8">

              {/* Attendance */}
              <section className="rounded-2xl bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center justify-between">

                  <h2 className="text-xl font-bold">
                    🕒 Attendance Report
                  </h2>

                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm text-orange-700">
                    {attendance.length} Records
                  </span>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>
                      <tr className="border-b text-left text-sm text-gray-500">
                        <th className="p-3">
                          Employee
                        </th>
                        <th className="p-3">
                          Date
                        </th>
                        <th className="p-3">
                          Check In
                        </th>
                        <th className="p-3">
                          Check Out
                        </th>
                        <th className="p-3">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendance.map(
                        (item, index) => (
                          <tr
                            key={
                              item._id ||
                              item.id ||
                              index
                            }
                            className="border-b"
                          >
                            <td className="p-3">
                              {item.employee_id ||
                                "-"}
                            </td>

                            <td className="p-3">
                              {item.date ||
                                item.attendance_date ||
                                "-"}
                            </td>

                            <td className="p-3">
                              {item.check_in ||
                                "-"}
                            </td>

                            <td className="p-3">
                              {item.check_out ||
                                "-"}
                            </td>

                            <td className="p-3">
                              {item.status ||
                                "-"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>

                </div>

              </section>

              {/* Leave */}
              <section className="rounded-2xl bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center justify-between">

                  <h2 className="text-xl font-bold">
                    📅 Leave Report
                  </h2>

                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm text-orange-700">
                    {leaves.length} Records
                  </span>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>
                      <tr className="border-b text-left text-sm text-gray-500">
                        <th className="p-3">
                          Employee
                        </th>
                        <th className="p-3">
                          Leave Type
                        </th>
                        <th className="p-3">
                          Start
                        </th>
                        <th className="p-3">
                          End
                        </th>
                        <th className="p-3">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaves.map(
                        (item, index) => (
                          <tr
                            key={
                              item._id ||
                              item.id ||
                              index
                            }
                            className="border-b"
                          >
                            <td className="p-3">
                              {item.employee_id ||
                                "-"}
                            </td>

                            <td className="p-3">
                              {item.leave_type ||
                                "-"}
                            </td>

                            <td className="p-3">
                              {item.start_date ||
                                "-"}
                            </td>

                            <td className="p-3">
                              {item.end_date ||
                                "-"}
                            </td>

                            <td className="p-3">
                              {item.status ||
                                "-"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>

                </div>

              </section>

              {/* Payroll */}
              <section className="rounded-2xl bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center justify-between">

                  <h2 className="text-xl font-bold">
                    💰 Payroll Report
                  </h2>

                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm text-orange-700">
                    {payroll.length} Records
                  </span>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>
                      <tr className="border-b text-left text-sm text-gray-500">
                        <th className="p-3">
                          Employee
                        </th>
                        <th className="p-3">
                          Basic
                        </th>
                        <th className="p-3">
                          Allowances
                        </th>
                        <th className="p-3">
                          Deductions
                        </th>
                        <th className="p-3">
                          Net Salary
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {payroll.map(
                        (item, index) => (
                          <tr
                            key={
                              item._id ||
                              item.id ||
                              index
                            }
                            className="border-b"
                          >
                            <td className="p-3">
                              {item.employee_id ||
                                "-"}
                            </td>

                            <td className="p-3">
                              ₹
                              {item.basic_salary ??
                                "-"}
                            </td>

                            <td className="p-3">
                              ₹
                              {item.allowances ??
                                "-"}
                            </td>

                            <td className="p-3">
                              ₹
                              {item.deductions ??
                                "-"}
                            </td>

                            <td className="p-3 font-bold text-orange-600">
                              ₹
                              {item.net_salary ??
                                item.total_salary ??
                                "-"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>

                </div>

              </section>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Reports;