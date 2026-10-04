import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import { getPayroll } from "../../api/api";

function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayroll();
  }, []);

  const loadPayroll = async () => {
    try {
      const response = await getPayroll();

      const records =
        Array.isArray(response)
          ? response
          : response.payroll ||
            response.data ||
            [];

      const userId = localStorage.getItem("userId");

      const filtered = records.filter(
        (item) =>
          String(item.user_id) === String(userId) ||
          String(item.employee_user_id) === String(userId)
      );

      setPayroll(filtered.length ? filtered : records);
    } catch (err) {
      setError(
        err.message || "Failed to load payroll."
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
            Payroll
          </h1>

          <p className="mt-1 text-gray-500">
            Your payroll records.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading payroll...
            </p>
          ) : payroll.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No payroll records found.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="p-3">Period</th>
                    <th className="p-3">Basic Salary</th>
                    <th className="p-3">Gross Salary</th>
                    <th className="p-3">Net Salary</th>
                  </tr>
                </thead>

                <tbody>
                  {payroll.map((record) => (
                    <tr
                      key={
                        record.id ||
                        record.payroll_id ||
                        record._id
                      }
                      className="border-b"
                    >
                      <td className="p-3">
                        {record.month ||
                          record.period ||
                          record.pay_period ||
                          "Not provided"}
                      </td>

                      <td className="p-3">
                        {record.basic_salary ??
                          "Not provided"}
                      </td>

                      <td className="p-3">
                        {record.gross_salary ??
                          "Not provided"}
                      </td>

                      <td className="p-3 font-semibold text-orange-600">
                        {record.net_salary ??
                          "Not provided"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Payroll;