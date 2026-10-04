import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getPayroll,
  createPayroll,
} from "../../api/api";

function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPayroll = async () => {
    try {
      const response = await getPayroll();

      const data = Array.isArray(response)
        ? response
        : response?.payroll ||
          response?.data ||
          [];

      setPayroll(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  const generatePayroll = async (e) => {
    e.preventDefault();

    try {
      await createPayroll(employeeId);

      setMessage(
        "Payroll generated successfully."
      );

      setEmployeeId("");

      await loadPayroll();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Payroll
          </h1>

          <p className="mb-8 text-gray-500">
            Generate and view payroll information
          </p>

          {message && (
            <div className="mb-4 rounded-xl bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={generatePayroll}
            className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-bold">
              Generate Payroll
            </h2>

            <div className="flex gap-3">

              <input
                value={employeeId}
                onChange={(e) =>
                  setEmployeeId(e.target.value)
                }
                placeholder="Employee ID"
                className="w-80 rounded-xl border px-4 py-3"
                required
              />

              <button className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
                Generate
              </button>

            </div>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold">
              Payroll Records
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Basic Salary</th>
                    <th className="p-3">Allowances</th>
                    <th className="p-3">Deductions</th>
                    <th className="p-3">Net Salary</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payroll.map((item, index) => {

                    const id =
                      item._id ||
                      item.id ||
                      index;

                    return (
                      <tr
                        key={id}
                        className="border-b hover:bg-orange-50"
                      >
                        <td className="p-3">
                          {item.employee_id || "-"}
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

                        <td className="p-3">
                          {item.status || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Payroll;