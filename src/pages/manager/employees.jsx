import { useEffect, useMemo, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getEmployees,
  updateEmployee,
} from "../../api/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEmployees();

      const data =
        response?.employees ||
        response?.data ||
        (Array.isArray(response)
          ? response
          : []);

      setEmployees(data);
    } catch (err) {
      setError(
        err.message || "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (employee) => {
    setEditingEmployee(employee);

    setForm({
      first_name: employee.first_name || "",
      last_name: employee.last_name || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joining_date: employee.joining_date || "",
      address: employee.address || "",
      employment_status:
        employee.employment_status || "",
    });

    setMessage("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const saveEmployee = async (e) => {
    e.preventDefault();

    if (!editingEmployee) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await updateEmployee(
        editingEmployee.id ||
          editingEmployee.employee_id ||
          editingEmployee._id,
        form
      );

      setMessage(
        "Employee information updated successfully."
      );

      setEditingEmployee(null);

      await loadEmployees();
    } catch (err) {
      setError(
        err.message || "Failed to update employee."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = [
        employee.first_name,
        employee.last_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const code = String(
        employee.employee_code || ""
      ).toLowerCase();

      const department = String(
        employee.department || ""
      ).toLowerCase();

      const designation = String(
        employee.designation || ""
      ).toLowerCase();

      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        code.includes(searchValue) ||
        department.includes(searchValue) ||
        designation.includes(searchValue);

      const status = String(
        employee.employment_status || ""
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const activeEmployees = employees.filter(
    (employee) =>
      String(
        employee.employment_status || ""
      ).toLowerCase() === "active"
  );

  const inactiveEmployees = employees.filter(
    (employee) =>
      String(
        employee.employment_status || ""
      ).toLowerCase() === "inactive"
  );

  const getStatusStyle = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (normalized === "active") {
      return "border-green-100 bg-green-50 text-green-700";
    }

    if (
      normalized === "inactive" ||
      normalized === "terminated"
    ) {
      return "border-red-100 bg-red-50 text-red-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  const getInitials = (employee) => {
    const first = String(
      employee.first_name || ""
    ).charAt(0);

    const last = String(
      employee.last_name || ""
    ).charAt(0);

    const initials =
      `${first}${last}`.trim();

    return initials
      ? initials.toUpperCase()
      : "EM";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* =====================================================
              HEADER
          ===================================================== */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Manager Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Employees
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                View and manage employee information within your
                team workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={loadEmployees}
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
              MESSAGE
          ===================================================== */}
          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                ✓
              </span>

              <div>
                <p className="text-sm font-bold">
                  Update successful
                </p>

                <p className="mt-1 text-xs text-green-600">
                  {message}
                </p>
              </div>
            </div>
          )}

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
                  Employee action failed
                </p>

                <p className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              SUMMARY
          ===================================================== */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <SummaryCard
              title="Total Employees"
              value={employees.length}
              subtitle="Employees available"
              icon="employees"
            />

            <SummaryCard
              title="Active Employees"
              value={activeEmployees.length}
              subtitle="Currently active"
              icon="active"
              success
            />

            <SummaryCard
              title="Inactive Employees"
              value={inactiveEmployees.length}
              subtitle="Inactive records"
              icon="inactive"
              danger
            />
          </div>

          {/* =====================================================
              EDIT EMPLOYEE
          ===================================================== */}
          {editingEmployee && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1.5 bg-orange-600" />

              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
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

                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        Edit Employee
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Update employee information and save the
                        latest details.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingEmployee(null)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>

              <form
                onSubmit={saveEmployee}
                className="p-6"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {[
                    ["first_name", "First Name"],
                    ["last_name", "Last Name"],
                    ["phone", "Phone"],
                    ["department", "Department"],
                    ["designation", "Designation"],
                    ["joining_date", "Joining Date"],
                    ["address", "Address"],
                    [
                      "employment_status",
                      "Employment Status",
                    ],
                  ].map(([name, label]) => (
                    <div key={name}>
                      <label
                        htmlFor={name}
                        className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500"
                      >
                        {label}
                      </label>

                      <input
                        id={name}
                        type={
                          name === "joining_date"
                            ? "date"
                            : "text"
                        }
                        name={name}
                        value={form[name] || ""}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {saving ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-30"
                          />
                          <path
                            d="M21 12a9 9 0 0 0-9-9"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M5 12l4 4L19 6" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingEmployee(null)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =====================================================
              SEARCH + FILTER
          ===================================================== */}
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
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by name, employee code, department or designation..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Active", "Inactive"].map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setStatusFilter(status)
                      }
                      className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                        statusFilter === status
                          ? "bg-orange-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* =====================================================
              EMPLOYEE TABLE
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Employee Directory
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredEmployees.length} employee
                  {filteredEmployees.length === 1
                    ? ""
                    : "s"} shown
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {employees.length} Total
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-4-4" />
                    </svg>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No employees found
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                    Try changing your search or status filter.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Employee
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Code
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Department
                          </th>

                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Designation
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
                        {filteredEmployees.map(
                          (employee, index) => {
                            const fullName = [
                              employee.first_name,
                              employee.last_name,
                            ]
                              .filter(Boolean)
                              .join(" ");

                            return (
                              <tr
                                key={
                                  employee.id ||
                                  employee._id ||
                                  index
                                }
                                className="border-b border-slate-50 transition hover:bg-orange-50/30"
                              >
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xs font-black text-orange-600">
                                      {getInitials(
                                        employee
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-sm font-bold text-slate-800">
                                        {fullName ||
                                          "Unnamed Employee"}
                                      </p>

                                      <p className="mt-1 text-[10px] text-slate-400">
                                        {employee.phone ||
                                          "No phone"}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                                    {employee.employee_code ||
                                      "-"}
                                  </span>
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-600">
                                  {employee.department ||
                                    "-"}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-600">
                                  {employee.designation ||
                                    "-"}
                                </td>

                                <td className="px-4 py-4">
                                  <span
                                    className={`rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                      employee.employment_status
                                    )}`}
                                  >
                                    {employee.employment_status ||
                                      "Not provided"}
                                  </span>
                                </td>

                                <td className="px-4 py-4">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEdit(
                                        employee
                                      )
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-600 hover:text-white"
                                  >
                                    <svg
                                      viewBox="0 0 24 24"
                                      className="h-3.5 w-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                    >
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
                                    </svg>
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="space-y-3 md:hidden">
                    {filteredEmployees.map(
                      (employee, index) => {
                        const fullName = [
                          employee.first_name,
                          employee.last_name,
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <div
                            key={
                              employee.id ||
                              employee._id ||
                              `employee-${index}`
                            }
                            className="rounded-2xl border border-slate-100 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xs font-black text-orange-600">
                                  {getInitials(
                                    employee
                                  )}
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-slate-800">
                                    {fullName ||
                                      "Unnamed Employee"}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-400">
                                    {employee.employee_code ||
                                      "No code"}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${getStatusStyle(
                                  employee.employment_status
                                )}`}
                              >
                                {employee.employment_status ||
                                  "Unknown"}
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  Department
                                </p>

                                <p className="mt-1 text-xs font-semibold text-slate-700">
                                  {employee.department ||
                                    "-"}
                                </p>
                              </div>

                              <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  Designation
                                </p>

                                <p className="mt-1 text-xs font-semibold text-slate-700">
                                  {employee.designation ||
                                    "-"}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                startEdit(employee)
                              }
                              className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white"
                            >
                              Edit Employee
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Manager Employee Management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  success = false,
  danger = false,
}) {
  let iconContent;

  if (icon === "employees") {
    iconContent = (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (icon === "active") {
    iconContent = (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M5 12l4 4L19 6" />
      </svg>
    );
  }

  if (icon === "inactive") {
    iconContent = (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M7 7l10 10" />
        <path d="M17 7L7 17" />
      </svg>
    );
  }

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-50 text-red-600"
              : success
              ? "bg-green-50 text-green-600"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          {iconContent}
        </div>
      </div>
    </div>
  );
}

export default Employees;