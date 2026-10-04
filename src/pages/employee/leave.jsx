import { useEffect, useState } from "react";
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
      const userId = localStorage.getItem("userId");

      const employeesResponse = await getEmployees();

      const employees =
        Array.isArray(employeesResponse)
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
          : response.leaves || response.data || []
      );
    } catch (err) {
      setError(err.message || "Failed to load leaves.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      setMessage("Leave application submitted successfully.");

      await loadLeaves();
    } catch (err) {
      setError(err.message || "Failed to submit leave.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Leave Application
          </h1>

          <p className="mt-1 text-gray-500">
            Apply for leave and view your leave history.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Apply for Leave
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Leave Type
                </label>

                <input
                  name="leave_type"
                  value={form.leave_type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Start Date
                </label>

                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  End Date
                </label>

                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-gray-400"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Leave"}
                </button>
              </div>

            </form>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Leave History
            </h2>

            {loading ? (
              <p className="text-gray-500">
                Loading leave history...
              </p>
            ) : leaves.length === 0 ? (
              <p className="text-gray-500">
                No leave records found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="p-3">Type</th>
                      <th className="p-3">Start</th>
                      <th className="p-3">End</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.map((leave) => (
                      <tr
                        key={
                          leave.id ||
                          leave.leave_id ||
                          leave._id
                        }
                        className="border-b"
                      >
                        <td className="p-3">
                          {leave.leave_type}
                        </td>

                        <td className="p-3">
                          {leave.start_date}
                        </td>

                        <td className="p-3">
                          {leave.end_date}
                        </td>

                        <td className="p-3 font-semibold">
                          {leave.status ||
                            "Not provided"}
                        </td>
                      </tr>
                    ))}
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

export default Leave;