import { useEffect, useMemo, useState } from "react";
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
      setLoading(true);
      setError("");

      const response = await getPayroll();

      const records = Array.isArray(response)
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

      setPayroll(
        filtered.length > 0 ? filtered : records
      );
    } catch (err) {
      setError(
        err.message || "Failed to load payroll."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
      return numericValue.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return String(value);
  };

  const getPeriod = (record) => {
    return (
      record.month ||
      record.period ||
      record.pay_period ||
      "Not provided"
    );
  };

  const totalNetSalary = useMemo(() => {
    return payroll.reduce((total, record) => {
      const value = Number(record.net_salary);

      return Number.isFinite(value)
        ? total + value
        : total;
    }, 0);
  }, [payroll]);

  const totalGrossSalary = useMemo(() => {
    return payroll.reduce((total, record) => {
      const value = Number(record.gross_salary);

      return Number.isFinite(value)
        ? total + value
        : total;
    }, 0);
  }, [payroll]);

  const latestRecord =
    payroll.length > 0 ? payroll[0] : null;

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
                Payroll
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                View your salary records, payroll periods, and
                net earnings from your employee account.
              </p>
            </div>

            <button
              type="button"
              onClick={loadPayroll}
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
                  Unable to load payroll
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

            {/* Total records */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Payroll Records
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {payroll.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Available periods
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
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="M3 10h18" />
                    <path d="M7 15h4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Latest net salary */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Latest Net Salary
                  </p>

                  <p className="mt-3 text-2xl font-black text-slate-900">
                    ₹
                    {latestRecord
                      ? formatAmount(
                          latestRecord.net_salary
                        )
                      : "—"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {latestRecord
                      ? getPeriod(latestRecord)
                      : "No record"}
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
                    <path d="M12 2v20" />
                    <path d="M17 7.5c0-2-2.2-3.5-5-3.5s-5 1.5-5 3.5 2.2 3.5 5 3.5 5 1.5 5 3.5-2.2 3.5-5 3.5-5-1.5-5-3.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total gross */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Gross
                  </p>

                  <p className="mt-3 text-2xl font-black text-slate-900">
                    ₹{formatAmount(totalGrossSalary)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Across available records
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

            {/* Total net */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Net Paid
                  </p>

                  <p className="mt-3 text-2xl font-black text-slate-900">
                    ₹{formatAmount(totalNetSalary)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Across available records
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
                    <path d="M12 3l8 4v5c0 4.5-3.1 7.8-8 9-4.9-1.2-8-4.5-8-9V7l8-4z" />
                    <path d="M8 12l3 3 5-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              LATEST PAYROLL HIGHLIGHT
          ===================================================== */}
          {latestRecord && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1.5 bg-orange-600" />

              <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Latest Payroll Statement
                    </h2>

                    <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                      {getPeriod(latestRecord)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Summary of your most recent available payroll
                    record.
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-50 px-6 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
                    Net Salary
                  </p>

                  <p className="mt-1 text-2xl font-black text-orange-600">
                    ₹
                    {formatAmount(
                      latestRecord.net_salary
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-6 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Basic Salary
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    ₹
                    {formatAmount(
                      latestRecord.basic_salary
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Gross Salary
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    ₹
                    {formatAmount(
                      latestRecord.gross_salary
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                    Net Salary
                  </p>

                  <p className="mt-2 text-sm font-bold text-green-700">
                    ₹
                    {formatAmount(
                      latestRecord.net_salary
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              PAYROLL RECORDS
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Payroll Records
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Review your available salary history.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {payroll.length}{" "}
                {payroll.length === 1
                  ? "Record"
                  : "Records"}
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : payroll.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />
                      <path d="M3 10h18" />
                    </svg>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No payroll records found
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                    Payroll information will appear here when records
                    are available for your employee account.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100 text-left">
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Period
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Basic Salary
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Gross Salary
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Net Salary
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {payroll.map((record, index) => (
                          <tr
                            key={
                              record.id ||
                              record.payroll_id ||
                              record._id ||
                              `payroll-${index}`
                            }
                            className="border-b border-slate-50 transition hover:bg-orange-50/30"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                  >
                                    <rect
                                      x="3"
                                      y="4"
                                      width="18"
                                      height="17"
                                      rx="2"
                                    />
                                    <path d="M7 2v4M17 2v4M3 9h18" />
                                  </svg>
                                </div>

                                <span className="text-sm font-bold text-slate-800">
                                  {getPeriod(record)}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-slate-600">
                              ₹
                              {formatAmount(
                                record.basic_salary
                              )}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-slate-600">
                              ₹
                              {formatAmount(
                                record.gross_salary
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                                ₹
                                {formatAmount(
                                  record.net_salary
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-3 md:hidden">
                    {payroll.map((record, index) => (
                      <div
                        key={
                          record.id ||
                          record.payroll_id ||
                          record._id ||
                          `payroll-mobile-${index}`
                        }
                        className="rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {getPeriod(record)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Payroll record
                            </p>
                          </div>

                          <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                            ₹
                            {formatAmount(
                              record.net_salary
                            )}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Basic
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              ₹
                              {formatAmount(
                                record.basic_salary
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Gross
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              ₹
                              {formatAmount(
                                record.gross_salary
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Payroll Management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Payroll;