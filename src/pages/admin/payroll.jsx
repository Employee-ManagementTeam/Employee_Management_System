import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getPayroll,
  createPayroll,
} from "../../api/api";

function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPayroll = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPayroll();

      const data = Array.isArray(response)
        ? response
        : response?.payroll ||
          response?.data ||
          [];

      setPayroll(data);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load payroll."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  const generatePayroll = async (e) => {
    e.preventDefault();

    try {
      setGenerateLoading(true);
      setError("");
      setMessage("");

      await createPayroll(employeeId.trim());

      setMessage(
        "Payroll generated successfully."
      );

      setEmployeeId("");

      await loadPayroll();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to generate payroll."
      );
    } finally {
      setGenerateLoading(false);
    }
  };

  const getAmount = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  const formatCurrency = (value) => {
    return getAmount(value).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    );
  };

  const getNetSalary = (item) => {
    return (
      item.net_salary ??
      item.total_salary ??
      0
    );
  };

  const filteredPayroll = useMemo(() => {
    return payroll.filter((item) => {
      const employee = String(
        item.employee_id || ""
      ).toLowerCase();

      const status = String(
        item.status || ""
      ).toLowerCase();

      const query = search.toLowerCase();

      return (
        employee.includes(query) ||
        status.includes(query)
      );
    });
  }, [payroll, search]);

  const totalNetSalary = payroll.reduce(
    (total, item) =>
      total + getAmount(getNetSalary(item)),
    0
  );

  const paidCount = payroll.filter((item) => {
    const status = String(
      item.status || ""
    ).toLowerCase();

    return (
      status === "paid" ||
      status === "completed"
    );
  }).length;

  const pendingCount = payroll.filter((item) => {
    const status = String(
      item.status || ""
    ).toLowerCase();

    return (
      status === "pending" ||
      status === "processing"
    );
  }).length;

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value === "paid" ||
      value === "completed"
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (
      value === "pending" ||
      value === "processing"
    ) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  };

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
                Finance & Compensation
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Payroll
              </h1>

              <p className="mt-2 text-slate-500">
                Generate and monitor employee payroll records.
              </p>
            </div>

            <button
              onClick={loadPayroll}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* SUMMARY */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              title="Payroll Records"
              value={payroll.length}
              icon="💼"
            />

            <SummaryCard
              title="Total Net Payroll"
              value={formatCurrency(
                totalNetSalary
              )}
              icon="₹"
            />

            <SummaryCard
              title="Paid / Completed"
              value={paidCount}
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

          {/* GENERATE PAYROLL */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Payroll Processing
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Generate Payroll
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create payroll information for an employee.
              </p>
            </div>

            <form
              onSubmit={generatePayroll}
              className="p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row">

                <input
                  value={employeeId}
                  onChange={(e) =>
                    setEmployeeId(e.target.value)
                  }
                  placeholder="Enter Employee ID"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 md:max-w-md"
                />

                <button
                  type="submit"
                  disabled={generateLoading}
                  className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {generateLoading
                    ? "Generating..."
                    : "Generate Payroll"}
                </button>

              </div>
            </form>

          </section>

          {/* RECORDS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-6">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Payroll Records
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    View salary and payment information.
                  </p>
                </div>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search employee or status..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 lg:w-72"
                />

              </div>

            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

                <p className="text-sm text-slate-500">
                  Loading payroll records...
                </p>
              </div>
            ) : filteredPayroll.length === 0 ? (
              <div className="p-12 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                  💳
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No payroll records found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Generate payroll or change your search.
                </p>

              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full text-left">

                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-6 py-4">
                          Employee
                        </th>

                        <th className="px-6 py-4">
                          Basic Salary
                        </th>

                        <th className="px-6 py-4">
                          Allowances
                        </th>

                        <th className="px-6 py-4">
                          Deductions
                        </th>

                        <th className="px-6 py-4">
                          Net Salary
                        </th>

                        <th className="px-6 py-4">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPayroll.map(
                        (item, index) => {
                          const id =
                            item._id ||
                            item.id ||
                            index;

                          return (
                            <tr
                              key={id}
                              className="border-b border-slate-100 transition hover:bg-orange-50/40"
                            >
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800">
                                  {item.employee_id ||
                                    "-"}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-600">
                                {formatCurrency(
                                  item.basic_salary
                                )}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-600">
                                {formatCurrency(
                                  item.allowances
                                )}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-600">
                                {formatCurrency(
                                  item.deductions
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <span className="font-bold text-orange-600">
                                  {formatCurrency(
                                    getNetSalary(item)
                                  )}
                                </span>
                              </td>

                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                    item.status
                                  )}`}
                                >
                                  {item.status ||
                                    "Unknown"}
                                </span>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>

                  </table>
                </div>

                {/* MOBILE */}
                <div className="space-y-4 p-4 lg:hidden">
                  {filteredPayroll.map(
                    (item, index) => {
                      const id =
                        item._id ||
                        item.id ||
                        index;

                      return (
                        <div
                          key={id}
                          className="rounded-2xl border border-slate-200 p-5"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Employee
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                {item.employee_id ||
                                  "-"}
                              </p>
                            </div>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                item.status
                              )}`}
                            >
                              {item.status ||
                                "Unknown"}
                            </span>

                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-4">

                            <InfoItem
                              label="Basic Salary"
                              value={formatCurrency(
                                item.basic_salary
                              )}
                            />

                            <InfoItem
                              label="Allowances"
                              value={formatCurrency(
                                item.allowances
                              )}
                            />

                            <InfoItem
                              label="Deductions"
                              value={formatCurrency(
                                item.deductions
                              )}
                            />

                            <InfoItem
                              label="Net Salary"
                              value={formatCurrency(
                                getNetSalary(item)
                              )}
                              highlight
                            />

                          </div>

                        </div>
                      );
                    }
                  )}
                </div>
              </>
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

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg font-bold text-orange-600">
          {icon}
        </div>

      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  highlight = false,
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold ${
          highlight
            ? "text-orange-600"
            : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default Payroll;