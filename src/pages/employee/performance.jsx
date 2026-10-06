import { useEffect, useMemo, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import { getEmployees, getPerformance } from "../../api/api";

function Performance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      const employeesResponse = await getEmployees();

      const employees = Array.isArray(employeesResponse)
        ? employeesResponse
        : employeesResponse.employees ||
          employeesResponse.data ||
          [];

      const employee = employees.find(
        (item) =>
          String(item.user_id) === String(userId) ||
          String(item.userId) === String(userId)
      );

      const employeeId =
        employee?.id ||
        employee?.employee_id ||
        employee?._id;

      if (!employeeId) {
        throw new Error(
          "Employee profile was not found."
        );
      }

      const response = await getPerformance();

      const performance = Array.isArray(response)
        ? response
        : response.performance ||
          response.data ||
          [];

      const mine = performance.filter(
        (item) =>
          String(item.employee_id) === String(employeeId) ||
          String(item.user_id) === String(userId)
      );

      setRecords(mine);
    } catch (err) {
      setError(
        err.message || "Failed to load performance."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRatingValue = (record) => {
    const value =
      record.rating ??
      record.score ??
      null;

    const numericValue = Number(value);

    return Number.isFinite(numericValue)
      ? numericValue
      : null;
  };

  const averageRating = useMemo(() => {
    const ratings = records
      .map(getRatingValue)
      .filter((value) => value !== null);

    if (ratings.length === 0) {
      return null;
    }

    const average =
      ratings.reduce(
        (total, value) => total + value,
        0
      ) / ratings.length;

    return Number(average.toFixed(1));
  }, [records]);

  const completedReviews = records.filter(
    (record) =>
      String(record.status || "").toLowerCase() ===
      "completed"
  ).length;

  const draftReviews = records.filter(
    (record) =>
      String(record.status || "").toLowerCase() ===
      "draft"
  ).length;

  const getStatusStyle = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (
      normalized === "completed" ||
      normalized === "complete"
    ) {
      return "border-green-100 bg-green-50 text-green-700";
    }

    if (normalized === "draft") {
      return "border-orange-100 bg-orange-50 text-orange-700";
    }

    if (
      normalized === "pending" ||
      normalized === "in progress"
    ) {
      return "border-amber-100 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Not specified";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getRatingLabel = (rating) => {
    if (rating === null) {
      return "Not rated";
    }

    if (rating >= 4.5) {
      return "Excellent";
    }

    if (rating >= 3.5) {
      return "Very Good";
    }

    if (rating >= 2.5) {
      return "Good";
    }

    if (rating >= 1.5) {
      return "Needs Improvement";
    }

    return "Needs Attention";
  };

  const getRatingWidth = (rating) => {
    if (rating === null) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(0, (rating / 5) * 100)
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Employee Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Performance
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review your performance evaluations, ratings,
                feedback, and review status in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={loadPerformance}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* =====================================================
              ERROR
          ===================================================== */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Unable to load performance
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              SUMMARY CARDS
          ===================================================== */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Reviews */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Reviews
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {records.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Performance records
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 19V5" />
                    <path d="M4 19h16" />
                    <path d="M8 16v-4M12 16V8M16 16v-7M20 16V5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Average Rating
                  </p>

                  <div className="mt-3 flex items-end gap-2">
                    <p className="text-3xl font-black text-slate-900">
                      {averageRating !== null
                        ? averageRating
                        : "--"}
                    </p>

                    {averageRating !== null && (
                      <span className="pb-1 text-sm text-slate-400">
                        / 5
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    {getRatingLabel(averageRating)}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Completed
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {completedReviews}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Completed evaluations
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Draft */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Draft Reviews
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {draftReviews}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Reviews in draft
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              PERFORMANCE SUMMARY
          ===================================================== */}
          {averageRating !== null && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1.5 bg-orange-600" />

              <div className="grid gap-6 p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-3xl font-black text-orange-600">
                  {averageRating}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Overall Performance
                    </h2>

                    <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                      {getRatingLabel(averageRating)}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Average rating calculated from available performance
                    records.
                  </p>

                  <div className="mt-4 h-2.5 max-w-xl overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-orange-600 transition-all duration-500"
                      style={{
                        width: `${getRatingWidth(
                          averageRating
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Rating Scale
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-800">
                    1.0 – 5.0
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              PERFORMANCE RECORDS
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Performance Records
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Your evaluation history and manager feedback.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {records.length}{" "}
                {records.length === 1
                  ? "Record"
                  : "Records"}
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-48 animate-pulse rounded-2xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path d="M4 19V5" />
                      <path d="M4 19h16" />
                      <path d="M8 16v-4M12 16V8M16 16v-7M20 16V5" />
                    </svg>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No performance records found
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                    Performance evaluations will appear here once
                    your manager or administrator creates them.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {records.map((record, index) => {
                    const rating = getRatingValue(record);

                    const reviewDate =
                      record.review_date ||
                      record.date ||
                      "Not provided";

                    const status =
                      record.status ||
                      "Not provided";

                    const feedback =
                      record.feedback ||
                      record.comments ||
                      "No feedback provided.";

                    return (
                      <div
                        key={
                          record.id ||
                          record.performance_id ||
                          record._id ||
                          `performance-${index}`
                        }
                        className="overflow-hidden rounded-2xl border border-slate-200 transition hover:border-orange-200 hover:shadow-sm"
                      >
                        <div className="h-1 bg-orange-600" />

                        <div className="p-6">

                          {/* Header */}
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex gap-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl font-black text-orange-600">
                                {rating !== null
                                  ? rating
                                  : "--"}
                              </div>

                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Performance Review
                                </p>

                                <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                                  Evaluation{" "}
                                  {records.length -
                                    index}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                  Review date:{" "}
                                  {reviewDate}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                status
                              )}`}
                            >
                              {formatStatus(
                                status
                              )}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Rating
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-slate-800">
                                    {rating !== null
                                      ? `${rating} / 5`
                                      : "Not provided"}
                                  </p>
                                </div>

                                {rating !== null && (
                                  <span className="text-xs font-semibold text-orange-600">
                                    {getRatingLabel(
                                      rating
                                    )}
                                  </span>
                                )}
                              </div>

                              {rating !== null && (
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                                  <div
                                    className="h-full rounded-full bg-orange-600"
                                    style={{
                                      width: `${getRatingWidth(
                                        rating
                                      )}%`,
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Review Date
                              </p>

                              <p className="mt-2 text-sm font-bold text-slate-800">
                                {reviewDate}
                              </p>
                            </div>
                          </div>

                          {/* Feedback */}
                          <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                >
                                  <path d="M4 5h16v11H8l-4 4z" />
                                </svg>
                              </div>

                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Manager Feedback
                              </p>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Performance Management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Performance;