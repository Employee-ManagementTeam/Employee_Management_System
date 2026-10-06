import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
} from "../../api/api";

function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);

  const [reportType, setReportType] = useState("attendance");

  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const [generatedAt, setGeneratedAt] = useState(null);

  /* =========================================================
     HELPERS
  ========================================================= */

  const toArray = (response, keys = []) => {
    if (Array.isArray(response)) {
      return response;
    }

    for (const key of keys) {
      if (Array.isArray(response?.[key])) {
        return response[key];
      }
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  const normalize = (value) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  };

  const getEmployeeValue = (item) => {
    return (
      item?.employee_name ||
      item?.employee ||
      item?.employee_code ||
      item?.employee_id ||
      item?.username ||
      item?.name ||
      "-"
    );
  };

  const getDepartmentValue = (item) => {
    return (
      item?.department ||
      item?.department_name ||
      item?.department_id ||
      "-"
    );
  };

  const getStatusValue = (item) => {
    return item?.status || "-";
  };

  const getAttendanceDate = (item) => {
    return (
      item?.date ||
      item?.attendance_date ||
      item?.created_at ||
      ""
    );
  };

  const getLeaveStartDate = (item) => {
    return (
      item?.start_date ||
      item?.leave_start ||
      item?.created_at ||
      ""
    );
  };

  const safeDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  const formatDate = (value) => {
    const date = safeDate(value);

    if (!date) {
      return value || "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMoney = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return value ?? "-";
    }

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const isWithinDateRange = (value) => {
    const date = safeDate(value);

    if (!fromDate && !toDate) {
      return true;
    }

    if (!date) {
      return false;
    }

    const current = new Date(date);
    current.setHours(0, 0, 0, 0);

    if (fromDate) {
      const start = new Date(`${fromDate}T00:00:00`);

      if (current < start) {
        return false;
      }
    }

    if (toDate) {
      const end = new Date(`${toDate}T23:59:59`);

      if (current > end) {
        return false;
      }
    }

    return true;
  };

  const downloadCsv = (rows, filename) => {
    if (!rows.length) {
      return;
    }

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(value ?? "").replace(/"/g, '""');
            return `"${safeValue}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =========================================================
     LOAD REPORTS
  ========================================================= */

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        attendanceResponse,
        leavesResponse,
        payrollResponse,
      ] = await Promise.all([
        getAttendanceReport(),
        getLeaveReport(),
        getPayrollReport(),
      ]);

      setAttendance(
        toArray(attendanceResponse, [
          "attendance",
          "report",
        ])
      );

      setLeaves(
        toArray(leavesResponse, [
          "leaves",
          "report",
        ])
      );

      setPayroll(
        toArray(payrollResponse, [
          "payroll",
          "report",
        ])
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load report data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  /* =========================================================
     DYNAMIC FILTER OPTIONS
  ========================================================= */

  const currentData = useMemo(() => {
    if (reportType === "attendance") {
      return attendance;
    }

    if (reportType === "leave") {
      return leaves;
    }

    return payroll;
  }, [reportType, attendance, leaves, payroll]);

  const employeeOptions = useMemo(() => {
    return Array.from(
      new Set(
        currentData
          .map((item) => getEmployeeValue(item))
          .filter(
            (value) =>
              value &&
              value !== "-"
          )
          .map(String)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [currentData]);

  const departmentOptions = useMemo(() => {
    return Array.from(
      new Set(
        currentData
          .map((item) => getDepartmentValue(item))
          .filter(
            (value) =>
              value &&
              value !== "-"
          )
          .map(String)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [currentData]);

  const statusOptions = useMemo(() => {
    return Array.from(
      new Set(
        currentData
          .map((item) => getStatusValue(item))
          .filter(
            (value) =>
              value &&
              value !== "-"
          )
          .map(String)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [currentData]);

  /* =========================================================
     FILTERED DATA
  ========================================================= */

  const filteredData = useMemo(() => {
    const searchValue = normalize(search);

    return currentData.filter((item) => {
      const employee = normalize(
        getEmployeeValue(item)
      );

      const department = normalize(
        getDepartmentValue(item)
      );

      const status = normalize(
        getStatusValue(item)
      );

      let dateValue = "";

      if (reportType === "attendance") {
        dateValue = getAttendanceDate(item);
      } else if (reportType === "leave") {
        dateValue = getLeaveStartDate(item);
      } else {
        dateValue =
          item?.month ||
          item?.payroll_date ||
          item?.created_at ||
          "";
      }

      const matchesEmployee =
        employeeFilter === "all" ||
        normalize(employeeFilter) === employee;

      const matchesDepartment =
        departmentFilter === "all" ||
        normalize(departmentFilter) === department;

      const matchesStatus =
        statusFilter === "all" ||
        normalize(statusFilter) === status;

      const matchesSearch =
        !searchValue ||
        employee.includes(searchValue) ||
        department.includes(searchValue) ||
        status.includes(searchValue);

      const matchesDate =
        isWithinDateRange(dateValue);

      return (
        matchesEmployee &&
        matchesDepartment &&
        matchesStatus &&
        matchesSearch &&
        matchesDate
      );
    });
  }, [
    currentData,
    employeeFilter,
    departmentFilter,
    statusFilter,
    search,
    fromDate,
    toDate,
    reportType,
  ]);

  /* =========================================================
     GENERATE REPORT
  ========================================================= */

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");

    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );

    setGeneratedAt(new Date());
    setGenerating(false);
  };

  /* =========================================================
     SUMMARY
  ========================================================= */

  const summary = useMemo(() => {
    const total = filteredData.length;

    if (reportType === "attendance") {
      const present = filteredData.filter(
        (item) => {
          const status = normalize(
            item?.status
          );

          return (
            status === "present" ||
            status === "checked in" ||
            status === "checked-in"
          );
        }
      ).length;

      const absent = filteredData.filter(
        (item) =>
          normalize(item?.status) ===
          "absent"
      ).length;

      const leave = filteredData.filter(
        (item) =>
          normalize(item?.status) ===
          "leave"
      ).length;

      const attendanceRate =
        total > 0
          ? Math.round(
              (present / total) * 100
            )
          : 0;

      return {
        card1: {
          label: "Total Records",
          value: total,
        },
        card2: {
          label: "Present",
          value: present,
        },
        card3: {
          label: "Absent",
          value: absent,
        },
        card4: {
          label: "Attendance Rate",
          value: `${attendanceRate}%`,
        },
      };
    }

    if (reportType === "leave") {
      const approved = filteredData.filter(
        (item) =>
          normalize(item?.status) ===
          "approved"
      ).length;

      const pending = filteredData.filter(
        (item) =>
          normalize(item?.status) ===
          "pending"
      ).length;

      const rejected = filteredData.filter(
        (item) =>
          normalize(item?.status) ===
          "rejected"
      ).length;

      return {
        card1: {
          label: "Total Requests",
          value: total,
        },
        card2: {
          label: "Approved",
          value: approved,
        },
        card3: {
          label: "Pending",
          value: pending,
        },
        card4: {
          label: "Rejected",
          value: rejected,
        },
      };
    }

    const netSalary = filteredData.reduce(
      (sum, item) => {
        const value =
          Number(
            item?.net_salary ??
              item?.total_salary ??
              0
          );

        return sum + (Number.isNaN(value) ? 0 : value);
      },
      0
    );

    const basicSalary = filteredData.reduce(
      (sum, item) => {
        const value = Number(
          item?.basic_salary ?? 0
        );

        return sum + (Number.isNaN(value) ? 0 : value);
      },
      0
    );

    return {
      card1: {
        label: "Payroll Records",
        value: total,
      },
      card2: {
        label: "Basic Salary",
        value: `₹${formatMoney(basicSalary)}`,
      },
      card3: {
        label: "Net Payroll",
        value: `₹${formatMoney(netSalary)}`,
      },
      card4: {
        label: "Employees",
        value: new Set(
          filteredData.map((item) =>
            String(getEmployeeValue(item))
          )
        ).size,
      },
    };
  }, [filteredData, reportType]);

  /* =========================================================
     EXPORT
  ========================================================= */

  const handleExportCsv = () => {
    let rows = [];

    if (reportType === "attendance") {
      rows = [
        [
          "Employee",
          "Department",
          "Date",
          "Check In",
          "Check Out",
          "Status",
        ],
        ...filteredData.map((item) => [
          getEmployeeValue(item),
          getDepartmentValue(item),
          getAttendanceDate(item),
          item?.check_in || "-",
          item?.check_out || "-",
          item?.status || "-",
        ]),
      ];
    }

    if (reportType === "leave") {
      rows = [
        [
          "Employee",
          "Department",
          "Leave Type",
          "Start",
          "End",
          "Status",
        ],
        ...filteredData.map((item) => [
          getEmployeeValue(item),
          getDepartmentValue(item),
          item?.leave_type || "-",
          item?.start_date || "-",
          item?.end_date || "-",
          item?.status || "-",
        ]),
      ];
    }

    if (reportType === "payroll") {
      rows = [
        [
          "Employee",
          "Department",
          "Basic Salary",
          "Allowances",
          "Deductions",
          "Net Salary",
        ],
        ...filteredData.map((item) => [
          getEmployeeValue(item),
          getDepartmentValue(item),
          item?.basic_salary ?? "-",
          item?.allowances ?? "-",
          item?.deductions ?? "-",
          item?.net_salary ??
            item?.total_salary ??
            "-",
        ]),
      ];
    }

    downloadCsv(
      rows,
      `EMS_${reportType}_report.csv`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const statusClass = (status) => {
    const value = normalize(status);

    if (
      value === "approved" ||
      value === "present" ||
      value === "completed" ||
      value === "active"
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (
      value === "pending" ||
      value === "draft" ||
      value === "leave"
    ) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (
      value === "rejected" ||
      value === "absent" ||
      value === "inactive"
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">

      <div className="print:hidden">
        <Sidebar />
        <Navbar />
      </div>

      <main className="ml-64 pt-20 print:ml-0 print:pt-0">
        <div className="p-8 print:p-4">

          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Administration
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Report Center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Generate filtered workforce reports for attendance,
                leave management and payroll operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 print:hidden">
              <button
                onClick={loadReports}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-60"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>

              <button
                onClick={handlePrint}
                disabled={!generatedAt || filteredData.length === 0}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Print / PDF
              </button>

              <button
                onClick={handleExportCsv}
                disabled={!generatedAt || filteredData.length === 0}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* FILTER PANEL */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm print:hidden">
            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                Report Configuration
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Build your report
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the report type and filters, then generate the
                latest report.
              </p>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">

              {/* Report type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Report Type
                </label>

                <select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setEmployeeFilter("all");
                    setDepartmentFilter("all");
                    setStatusFilter("all");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                >
                  <option value="attendance">
                    Attendance
                  </option>

                  <option value="leave">
                    Leave
                  </option>

                  <option value="payroll">
                    Payroll
                  </option>
                </select>
              </div>

              {/* Employee */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Employee
                </label>

                <select
                  value={employeeFilter}
                  onChange={(e) =>
                    setEmployeeFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                >
                  <option value="all">
                    All Employees
                  </option>

                  {employeeOptions.map((employee) => (
                    <option
                      key={employee}
                      value={employee}
                    >
                      {employee}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department
                </label>

                <select
                  value={departmentFilter}
                  onChange={(e) =>
                    setDepartmentFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                >
                  <option value="all">
                    All Departments
                  </option>

                  {departmentOptions.map((department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                >
                  <option value="all">
                    All Statuses
                  </option>

                  {statusOptions.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* From */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    setFromDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />
              </div>

              {/* To */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                    setToDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Search
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search employee, department or status..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setEmployeeFilter("all");
                  setDepartmentFilter("all");
                  setStatusFilter("all");
                  setFromDate("");
                  setToDate("");
                  setSearch("");
                  setGeneratedAt(null);
                }}
                className="text-sm font-semibold text-slate-500 transition hover:text-orange-600"
              >
                Clear filters
              </button>

              <button
                onClick={handleGenerate}
                disabled={generating || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}

                {generating
                  ? "Generating..."
                  : "Generate Report"}
              </button>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />

              <p className="font-semibold text-slate-700">
                Loading report data...
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Connecting to the employee management system.
              </p>
            </div>
          ) : !generatedAt ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600">
                ↗
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Ready to generate your report
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Configure the filters above and click
                <span className="font-semibold text-slate-700">
                  {" "}Generate Report{" "}
                </span>
                to create the latest {reportType} report.
              </p>
            </div>
          ) : (
            <>
              {/* REPORT HEADER */}
              <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                      Generated Report
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      {reportType === "attendance"
                        ? "Attendance Report"
                        : reportType === "leave"
                        ? "Leave Report"
                        : "Payroll Report"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {filteredData.length} matching records
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Generated
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {generatedAt.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* SUMMARY */}
              <section className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  summary.card1,
                  summary.card2,
                  summary.card3,
                  summary.card4,
                ].map((card, index) => (
                  <div
                    key={`${card.label}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>

                    <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                      {card.value}
                    </p>
                  </div>
                ))}
              </section>

              {/* REPORT TABLE */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Report Details
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Filtered system records
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                      {filteredData.length} Records
                    </span>
                  </div>
                </div>

                {filteredData.length === 0 ? (
                  <div className="p-14 text-center">
                    <p className="font-semibold text-slate-700">
                      No matching records
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your filters and generate the
                      report again.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">

                      {/* ATTENDANCE */}
                      {reportType === "attendance" && (
                        <>
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left">
                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Employee
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Department
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Date
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Check In
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Check Out
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredData.map(
                              (item, index) => (
                                <tr
                                  key={
                                    item?._id ||
                                    item?.id ||
                                    index
                                  }
                                  className="border-b border-slate-100 transition hover:bg-slate-50"
                                >
                                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                    {getEmployeeValue(
                                      item
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {getDepartmentValue(
                                      item
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {formatDate(
                                      getAttendanceDate(
                                        item
                                      )
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {item?.check_in ||
                                      "-"}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {item?.check_out ||
                                      "-"}
                                  </td>

                                  <td className="px-6 py-4">
                                    <span
                                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                                        item?.status
                                      )}`}
                                    >
                                      {item?.status ||
                                        "-"}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </>
                      )}

                      {/* LEAVE */}
                      {reportType === "leave" && (
                        <>
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left">
                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Employee
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Department
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Leave Type
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Start
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                End
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredData.map(
                              (item, index) => (
                                <tr
                                  key={
                                    item?._id ||
                                    item?.id ||
                                    index
                                  }
                                  className="border-b border-slate-100 transition hover:bg-slate-50"
                                >
                                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                    {getEmployeeValue(
                                      item
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {getDepartmentValue(
                                      item
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {item?.leave_type ||
                                      "-"}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {formatDate(
                                      item?.start_date
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {formatDate(
                                      item?.end_date
                                    )}
                                  </td>

                                  <td className="px-6 py-4">
                                    <span
                                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                                        item?.status
                                      )}`}
                                    >
                                      {item?.status ||
                                        "-"}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </>
                      )}

                      {/* PAYROLL */}
                      {reportType === "payroll" && (
                        <>
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left">
                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Employee
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Department
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Basic
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Allowances
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Deductions
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Net Salary
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredData.map(
                              (item, index) => (
                                <tr
                                  key={
                                    item?._id ||
                                    item?.id ||
                                    index
                                  }
                                  className="border-b border-slate-100 transition hover:bg-slate-50"
                                >
                                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                    {getEmployeeValue(
                                      item
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    {getDepartmentValue(
                                      item
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    ₹
                                    {formatMoney(
                                      item?.basic_salary
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    ₹
                                    {formatMoney(
                                      item?.allowances
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm text-slate-600">
                                    ₹
                                    {formatMoney(
                                      item?.deductions
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-sm font-bold text-orange-600">
                                    ₹
                                    {formatMoney(
                                      item?.net_salary ??
                                        item?.total_salary
                                    )}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </>
                      )}

                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reports;