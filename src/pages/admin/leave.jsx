import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getLeaves,
  approveLeave,
  rejectLeave,
} from "../../api/api";

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLeaves = async () => {
    try {
      setLoading(true);

      const response = await getLeaves();

      const data = Array.isArray(response)
        ? response
        : response?.leaves ||
          response?.data ||
          [];

      setLeaves(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveLeave(id);

      setMessage("Leave approved successfully.");

      await loadLeaves();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectLeave(id);

      setMessage("Leave rejected successfully.");

      await loadLeaves();
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
            Leave Management
          </h1>

          <p className="mb-8 text-gray-500">
            Review and manage employee leave requests
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

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            {loading ? (
              <p>Loading leaves...</p>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="p-3">Employee</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Start</th>
                      <th className="p-3">End</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.map((leave, index) => {

                      const id =
                        leave._id ||
                        leave.id;

                      const status =
                        leave.status || "Pending";

                      return (
                        <tr
                          key={id || index}
                          className="border-b hover:bg-orange-50"
                        >
                          <td className="p-3">
                            {leave.employee_id}
                          </td>

                          <td className="p-3">
                            {leave.leave_type}
                          </td>

                          <td className="p-3">
                            {leave.start_date}
                          </td>

                          <td className="p-3">
                            {leave.end_date}
                          </td>

                          <td className="p-3">
                            {leave.reason}
                          </td>

                          <td className="p-3">
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                              {status}
                            </span>
                          </td>

                          <td className="p-3">

                            {String(status).toLowerCase() ===
                              "pending" && (
                              <div className="flex gap-2">

                                <button
                                  onClick={() =>
                                    handleApprove(id)
                                  }
                                  className="rounded-lg bg-green-100 px-3 py-2 text-green-700"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() =>
                                    handleReject(id)
                                  }
                                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600"
                                >
                                  Reject
                                </button>

                              </div>
                            )}

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

export default Leave;