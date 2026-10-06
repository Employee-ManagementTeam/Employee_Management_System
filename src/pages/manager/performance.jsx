import { useEffect, useMemo, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getPerformance,
  createPerformance,
  updatePerformance,
  deletePerformance,
} from "../../api/api";

const emptyForm = {
  employee_id: "",
  rating: "",
  review_date: "",
  status: "",
  feedback: "",
};

function Performance() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
          (Array.isArray(response)
            ? response
            : [])
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load performance records."
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

    setError("");
    setMessage("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employee_id.trim()) {
      setError("Employee ID is required.");
      return;
    }

    if (
      form.rating !== "" &&
      (Number(form.rating) < 1 ||
        Number(form.rating) > 5)
    ) {
      setError(
        "Rating must be between 1 and 5."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updatePerformance(
          editingId,
          form
        );

        setMessage(
          "Performance updated successfully."
        );
      } else {
        await createPerformance(form);

        setMessage(
          "Performance created successfully."
        );
      }

      resetForm();
      await loadPerformance();
    } catch (err) {
      setError(
        err.message ||
          "Performance operation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const editRecord = (record) => {
    setEditingId(
      record.id ||
        record.performance_id ||
        record._id
    );

    setForm({
      employee_id:
        record.employee_id || "",
      rating:
        record.rating ?? "",
      review_date:
        record.review_date || "",
      status:
        record.status || "",
      feedback:
        record.feedback || "",
    });

    setError("");
    setMessage("");
  };

  const removeRecord = async (record) => {
    const id =
      record.id ||
      record.performance_id ||
      record._id;

    if (!id) {
      setError(
        "Performance record ID was not found."
      );
      return;
    }

    if (
      !window.confirm(
        "Delete this performance record?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await deletePerformance(id);

      if (
        String(editingId) === String(id)
      ) {
        resetForm();
      }

      setMessage(
        "Performance record deleted successfully."
      );

      await loadPerformance();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete performance record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const completedCount = records.filter(
    (record) =>
      String(record.status || "").toLowerCase() ===
      "completed"
  ).length;

  const draftCount = records.filter(
    (record) =>
      String(record.status || "").toLowerCase() ===
      "draft"
  ).length;

  const averageRating = useMemo(() => {
    const ratings = records
      .map((record) => {
        const value = Number(
          record.rating ?? record.score
        );

        return Number.isFinite(value)
          ? value
          : null;
      })
      .filter((value) => value !== null);

    if (!ratings.length) {
      return null;
    }

    return Number(
      (
        ratings.reduce(
          (total, value) => total + value,
          0
        ) / ratings.length
      ).toFixed(1)
    );
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const employee = String(
        record.employee_name ||
          record.employee_id ||
          ""
      ).toLowerCase();

      const status = String(
        record.status || ""
      ).toLowerCase();

      const feedback = String(
        record.feedback ||
          record.comments ||
          ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        employee.includes(query) ||
        feedback.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [
    records,
    search,
    statusFilter,
  ]);

  const getStatusStyle = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (normalized === "completed") {
      return "border-green-100 bg-green-50 text-green-700";
    }

    if (normalized === "draft") {
      return "border-orange-100 bg-orange-50 text-orange-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Manager Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Performance
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Create, review, update, and manage employee performance
                evaluations.
              </p>
            </div>

            <button
              type="button"
              onClick={loadPerformance}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-orange-200 hover:text-orange-600 disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20 11a8 8 0 1 0 2 5" />
                <path d="M20 5v6h-6" />
              </svg>
              Refresh
            </button>
          </div>

          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                ✓
              </span>
              <div>
                <p className="text-sm font-bold">
                  Performance action completed
                </p>
                <p className="mt-1 text-xs text-green-600">
                  {message}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>
              <div>
                <p className="text-sm font-bold">
                  Performance action failed
                </p>
                <p className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Summary
              title="Total Reviews"
              value={records.length}
              subtitle="Performance records"
            />

            <Summary
              title="Average Rating"
              value={
                averageRating !== null
                  ? `${averageRating}/5`
                  : "—"
              }
              subtitle="Across available ratings"
              orange
            />

            <Summary
              title="Completed"
              value={completedCount}
              subtitle="Completed evaluations"
              green
            />

            <Summary
              title="Draft"
              value={draftCount}
              subtitle="Draft evaluations"
              amber
            />
          </div>

          {/* Form */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-orange-600" />

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 19V5" />
                    <path d="M4 17l5-5 4 3 7-8" />
                    <path d="M16 7h4v4" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingId
                      ? "Edit Performance"
                      : "Add Performance"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Record an employee performance evaluation.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Field
                  label="Employee ID"
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                />

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="1 - 5"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Review Date
                  </label>

                  <input
                    type="date"
                    name="review_date"
                    value={form.review_date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">
                      Select status
                    </option>
                    <option value="Draft">
                      Draft
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Feedback
                  </label>

                  <textarea
                    name="feedback"
                    value={form.feedback}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter manager feedback..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:bg-slate-300"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Performance"
                    : "Create Performance"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:border-orange-200 hover:text-orange-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Search / filters */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xl">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" />
                </svg>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search employee or feedback..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Draft",
                  "Completed",
                ].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(status)
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
                      statusFilter === status
                        ? "bg-orange-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Records */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-extrabold text-slate-900">
                Performance Records
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredRecords.length} records shown
              </p>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-sm font-bold text-slate-700">
                    No performance records found
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try changing your search or filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Rating
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Review Date
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Status
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRecords.map(
                        (record, index) => {
                          const id =
                            record.id ||
                            record.performance_id ||
                            record._id ||
                            index;

                          const rating =
                            record.rating ??
                            record.score ??
                            null;

                          return (
                            <tr
                              key={id}
                              className="border-b border-slate-50 hover:bg-orange-50/30"
                            >
                              <td className="px-4 py-4">
                                <p className="text-sm font-bold text-slate-800">
                                  {record.employee_name ||
                                    record.employee_id ||
                                    "-"}
                                </p>

                                {record.feedback && (
                                  <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                                    {record.feedback}
                                  </p>
                                )}
                              </td>

                              <td className="px-4 py-4">
                                <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
                                  {rating ?? "-"}
                                  {rating !== null
                                    ? " / 5"
                                    : ""}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {record.review_date ||
                                  "-"}
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                    record.status
                                  )}`}
                                >
                                  {record.status ||
                                    "Not specified"}
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      editRecord(
                                        record
                                      )
                                    }
                                    className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-600 hover:text-white"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      deletingId === id
                                    }
                                    onClick={() =>
                                      removeRecord(
                                        record
                                      )
                                    }
                                    className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                  >
                                    {deletingId === id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}

function Summary({
  title,
  value,
  subtitle,
  orange,
  amber,
  green,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p
        className={`mt-3 text-2xl font-black ${
          orange
            ? "text-orange-600"
            : amber
            ? "text-amber-600"
            : green
            ? "text-green-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

function getStatusStyle(status) {
  const normalized = String(
    status || ""
  ).toLowerCase();

  if (normalized === "completed") {
    return "border-green-100 bg-green-50 text-green-700";
  }

  if (normalized === "draft") {
    return "border-orange-100 bg-orange-50 text-orange-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default Performance;