import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/Navbar";

import {
  getPerformance,
  createPerformance,
  updatePerformance,
  deletePerformance,
} from "../../api/api";

function Performance() {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    rating: "",
    review_date: "",
    status: "",
    feedback: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPerformance();

      setRecords(
        response?.performance ||
          response?.data ||
          (Array.isArray(response) ? response : [])
      );
    } catch (err) {
      setError(
        err.message || "Failed to load performance records."
      );
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
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updatePerformance(editingId, form);
        setMessage("Performance updated successfully.");
      } else {
        await createPerformance(form);
        setMessage("Performance created successfully.");
      }

      setForm({
        employee_id: "",
        rating: "",
        review_date: "",
        status: "",
        feedback: "",
      });

      setEditingId(null);

      await loadPerformance();
    } catch (err) {
      setError(
        err.message || "Performance operation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const editRecord = (record) => {
    setEditingId(record.id || record._id);

    setForm({
      employee_id: record.employee_id || "",
      rating: record.rating ?? "",
      review_date: record.review_date || "",
      status: record.status || "",
      feedback: record.feedback || "",
    });
  };

  const removeRecord = async (record) => {
    const id = record.id || record._id;

    if (!window.confirm("Delete this performance record?")) {
      return;
    }

    try {
      setError("");

      await deletePerformance(id);

      setMessage("Performance record deleted successfully.");
      await loadPerformance();
    } catch (err) {
      setError(
        err.message || "Failed to delete performance record."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Performance
          </h1>

          <p className="mt-1 text-gray-500">
            Manage employee performance evaluations.
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

          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-lg font-semibold">
              {editingId
                ? "Edit Performance"
                : "Add Performance"}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                placeholder="Employee ID"
                className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />

              <input
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="Rating"
                className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />

              <input
                type="date"
                name="review_date"
                value={form.review_date}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />

              <input
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="Status"
                className="rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />

              <textarea
                name="feedback"
                value={form.feedback}
                onChange={handleChange}
                placeholder="Feedback"
                className="md:col-span-2 rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#B7792B] px-6 py-2.5 text-white"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update"
                  : "Create"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);

                    setForm({
                      employee_id: "",
                      rating: "",
                      review_date: "",
                      status: "",
                      feedback: "",
                    });
                  }}
                  className="rounded-lg bg-gray-100 px-6 py-2.5 text-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading performance...
              </div>
            ) : records.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No performance records found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Rating</th>
                    <th className="px-5 py-3">Review Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record, index) => (
                    <tr
                      key={record.id || record._id || index}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4">
                        {record.employee_name ||
                          record.employee_id ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {record.rating ?? "-"}
                      </td>

                      <td className="px-5 py-4">
                        {record.review_date || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {record.status || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editRecord(record)}
                            className="rounded-lg bg-[#FFF8E7] px-3 py-2 text-sm text-[#B7792B]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              removeRecord(record)
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500"
                          >
                            Delete
                          </button>
                        </div>
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

export default Performance;