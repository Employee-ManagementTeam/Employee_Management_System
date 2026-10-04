import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getLeaves,
  approveLeave,
  rejectLeave,
} from "../../api/api";

function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeaves();

      setLeaves(
        response?.leaves ||
          response?.data ||
          (Array.isArray(response) ? response : [])
      );
    } catch (err) {
      setError(err.message || "Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      setError("");
      setMessage("");

      await approveLeave(id);

      setMessage("Leave approved successfully.");
      await loadLeaves();
    } catch (err) {
      setError(err.message || "Failed to approve leave.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(id);
      setError("");
      setMessage("");

      await rejectLeave(id);

      setMessage("Leave rejected successfully.");
      await loadLeaves();
    } catch (err) {
      setError(err.message || "Failed to reject leave.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Leave Approvals
          </h1>

          <p className="mt-1 text-gray-500">
            Review and manage employee leave requests.
          </p>

          {message && (
            <div className="mt-5 rounded-lg bg-green-50 p-4 text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading leave requests...
              </div>
            ) : leaves.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No leave requests found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Leave Type</th>
                    <th className="px-5 py-3">Start</th>
                    <th className="px-5 py-3">End</th>
                    <th className="px-5 py-3">Reason</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave, index) => {
                    const id =
                      leave.id || leave._id;

                    const status =
                      String(
                        leave.status || ""
                      ).toLowerCase();

                    return (
                      <tr
                        key={id || index}
                        className="border-t border-gray-100"
                      >
                        <td className="px-5 py-4">
                          {leave.employee_name ||
                            leave.employee_id ||
                            "-"}
                        </td>

                        <td className="px-5 py-4">
                          {leave.leave_type || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {leave.start_date || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {leave.end_date || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {leave.reason || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {leave.status || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                disabled={processingId === id}
                                onClick={() =>
                                  handleApprove(id)
                                }
                                className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600"
                              >
                                Approve
                              </button>

                              <button
                                disabled={processingId === id}
                                onClick={() =>
                                  handleReject(id)
                                }
                                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No action
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default LeaveApprovals;