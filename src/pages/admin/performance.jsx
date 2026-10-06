import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getPerformance,
  createPerformance,
  updatePerformance,
  deletePerformance,
} from "../../api/api";

const emptyForm = {
  employee_id: "",
  rating: 5,
  review: "",
  review_period: "",
  status: "Completed",
};

function Performance() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getArray = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    return (
      response?.performance ||
      response?.records ||
      response?.data ||
      []
    );
  };

  const loadPerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPerformance();

      setRecords(getArray(response));
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load performance records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformance();
  }, []);

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rating = Number(form.rating);

    if (rating < 1 || rating > 5) {
      setError(
        "Rating must be between 1 and 5."
      );

      setMessage("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        rating,
      };

      if (editingId) {
        await updatePerformance(
          editingId,
          payload
        );

        setMessage(
          "Performance record updated successfully."
        );
      } else {
        await createPerformance(payload);

        setMessage(
          "Performance record created successfully."
        );
      }

      resetForm();

      await loadPerformance();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save performance record."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(
      record._id || record.id
    );

    setForm({
      employee_id:
        record.employee_id || "",
      rating: record.rating || 5,
      review:
        record.review || "",
      review_period:
        record.review_period || "",
      status:
        record.status || "Completed",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError(
        "Performance record ID not found."
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

      setMessage(
        "Performance record deleted successfully."
      );

      await loadPerformance();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete performance record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const text = `
        ${record.employee_id || ""}
        ${record.review || ""}
        ${record.review_period || ""}
        ${record.status || ""}
      `.toLowerCase();

      const matchesSearch =
        text.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "All" ||
        String(record.status || "")
          .toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    records,
    search,
    statusFilter,
  ]);

  const completedCount = records.filter(
    (record) =>
      String(record.status || "")
        .toLowerCase() === "completed"
  ).length;

  const pendingCount = records.filter(
    (record) =>
      String(record.status || "")
        .toLowerCase() === "pending"
  ).length;

  const averageRating =
    records.length > 0
      ? (
          records.reduce(
            (sum, record) =>
              sum +
              Number(record.rating || 0),
            0
          ) / records.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
                Talent & Development
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Performance
              </h1>

              <p className="mt-2 text-slate-500">
                Manage employee reviews, ratings and performance history.
              </p>
            </div>

            <button
              onClick={loadPerformance}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* SUMMARY */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              title="Total Reviews"
              value={records.length}
              icon="📋"
            />

            <SummaryCard
              title="Average Rating"
              value={`${averageRating} / 5`}
              icon="★"
            />

            <SummaryCard
              title="Completed"
              value={completedCount}
              icon="✓"
            />

            <SummaryCard
              title="Pending"
              value={pendingCount}
              icon="⏳"
            />

          </div>

          {/* ALERTS */}
          {message && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* FORM */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Performance Review
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {editingId
                  ? "Edit Performance Review"
                  : "Add Performance Review"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Record employee performance and review feedback.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Employee ID
                  </label>

                  <input
                    name="employee_id"
                    value={form.employee_id}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Rating
                  </label>

                  <div className="flex items-center gap-3">

                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      step="1"
                      value={form.rating}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                    />

                    <div className="shrink-0 rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-600">
                      {Number(form.rating) || 0} / 5
                    </div>

                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Review Period
                  </label>

                  <input
                    name="review_period"
                    value={form.review_period}
                    onChange={handleChange}
                    placeholder="Example: 2026-Q3"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Pending">
                      Pending
                    </option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Performance Review
                  </label>

                  <textarea
                    name="review"
                    value={form.review}
                    onChange={handleChange}
                    placeholder="Write the employee performance review..."
                    rows={5}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Review"
                    : "Add Review"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setMessage("");
                      setError("");
                    }}
                    className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                )}

              </div>
            </form>

          </section>

          {/* FILTERS */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-1 items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  🔎
                </div>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search employee, review or period..."
                  className="w-full max-w-md rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

              </div>

              <div className="flex flex-wrap gap-2">

                {[
                  "All",
                  "Completed",
                  "Pending",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter(status)
                    }
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      statusFilter === status
                        ? "bg-orange-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}

              </div>

            </div>
          </section>

          {/* RECORDS */}
          <section>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Performance Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredRecords.length} record
                {filteredRecords.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

                <p className="text-sm text-slate-500">
                  Loading performance records...
                </p>

              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                  ⭐
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No performance records found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add a review or change your filters.
                </p>

              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {filteredRecords.map(
                  (record, index) => {
                    const id =
                      record._id ||
                      record.id ||
                      index;

                    const rating = Number(
                      record.rating || 0
                    );

                    const status =
                      record.status ||
                      "Completed";

                    return (
                      <article
                        key={id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Employee
                            </p>

                            <h3 className="mt-1 font-bold text-slate-900">
                              {record.employee_id ||
                                "-"}
                            </h3>
                          </div>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              String(status)
                                .toLowerCase() ===
                              "completed"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                          >
                            {status}
                          </span>

                        </div>

                        <div className="mt-5 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <span
                                key={star}
                                className={
                                  star <= rating
                                    ? "text-orange-500"
                                    : "text-slate-200"
                                }
                              >
                                ★
                              </span>
                            )
                          )}

                          <span className="ml-2 text-sm font-semibold text-slate-600">
                            {rating.toFixed(1)} / 5
                          </span>
                        </div>

                        <div className="mt-5 rounded-xl bg-slate-50 p-4">
                          <p className="text-sm leading-6 text-slate-600">
                            {record.review ||
                              "No review provided."}
                          </p>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Review Period
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {record.review_period ||
                              "-"}
                          </p>
                        </div>

                        <div className="mt-5 flex gap-2">

                          <button
                            onClick={() =>
                              handleEdit(record)
                            }
                            className="flex-1 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(id)
                            }
                            disabled={
                              deletingId === id
                            }
                            className="flex-1 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-lg font-bold text-orange-600">
          {icon}
        </div>

      </div>
    </div>
  );
}

export default Performance;