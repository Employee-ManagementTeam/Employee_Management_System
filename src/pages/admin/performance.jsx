import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

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
    rating: 5,
    review: "",
    review_period: "",
    status: "Completed",
  });

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPerformance = async () => {
    try {
      const response = await getPerformance();

      const data = Array.isArray(response)
        ? response
        : response?.performance ||
          response?.records ||
          response?.data ||
          [];

      setRecords(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadPerformance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updatePerformance(
          editingId,
          form
        );

        setMessage(
          "Performance updated successfully."
        );
      } else {
        await createPerformance({
          ...form,
          rating: Number(form.rating),
        });

        setMessage(
          "Performance record created successfully."
        );
      }

      setForm({
        employee_id: "",
        rating: 5,
        review: "",
        review_period: "",
        status: "Completed",
      });

      setEditingId(null);

      await loadPerformance();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (record) => {
    setEditingId(
      record._id || record.id
    );

    setForm({
      employee_id: record.employee_id || "",
      rating: record.rating || 5,
      review: record.review || "",
      review_period:
        record.review_period || "",
      status:
        record.status || "Completed",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) {
      return;
    }

    try {
      await deletePerformance(id);

      setMessage(
        "Performance record deleted successfully."
      );

      await loadPerformance();
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
            Performance
          </h1>

          <p className="mb-8 text-gray-500">
            Manage employee performance reviews
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
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-bold">
              {editingId
                ? "Edit Performance"
                : "Add Performance"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                value={form.employee_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    employee_id:
                      e.target.value,
                  })
                }
                placeholder="Employee ID"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rating: e.target.value,
                  })
                }
                placeholder="Rating"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                value={form.review_period}
                onChange={(e) =>
                  setForm({
                    ...form,
                    review_period:
                      e.target.value,
                  })
                }
                placeholder="2026-Q3"
                className="rounded-xl border px-4 py-3"
                required
              />

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
                className="rounded-xl border px-4 py-3"
              >
                <option>Completed</option>
                <option>Pending</option>
              </select>

              <textarea
                value={form.review}
                onChange={(e) =>
                  setForm({
                    ...form,
                    review: e.target.value,
                  })
                }
                placeholder="Performance review"
                className="rounded-xl border px-4 py-3 md:col-span-2"
                required
              />

            </div>

            <div className="mt-5 flex gap-3">

              <button className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
                {editingId
                  ? "Update"
                  : "Add Performance"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);

                    setForm({
                      employee_id: "",
                      rating: 5,
                      review: "",
                      review_period: "",
                      status: "Completed",
                    });
                  }}
                  className="rounded-xl bg-gray-200 px-6 py-3"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {records.map((record, index) => {

              const id =
                record._id ||
                record.id ||
                index;

              return (
                <div
                  key={id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">

                    <h3 className="font-bold">
                      Employee{" "}
                      {record.employee_id}
                    </h3>

                    <span className="text-xl">
                      ⭐ {record.rating}
                    </span>

                  </div>

                  <p className="mt-3 text-gray-600">
                    {record.review}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    {record.review_period}
                  </p>

                  <div className="mt-5 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(record)
                      }
                      className="rounded-lg bg-orange-100 px-3 py-2 text-orange-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(id)
                      }
                      className="rounded-lg bg-red-100 px-3 py-2 text-red-600"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Performance;