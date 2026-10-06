import { useEffect, useMemo, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDepartments();

      const data =
        response?.departments ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setDepartments(data);
    } catch (err) {
      setError(
        err.message || "Failed to load departments."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Department name is required.");
      setMessage("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateDepartment(editingId, {
          name: name.trim(),
        });

        setMessage(
          "Department updated successfully."
        );
      } else {
        await createDepartment({
          name: name.trim(),
        });

        setMessage(
          "Department created successfully."
        );
      }

      setName("");
      setEditingId(null);

      await loadDepartments();
    } catch (err) {
      setError(err.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (department) => {
    setEditingId(
      department.id ||
        department._id
    );

    setName(
      department.name ||
        department.department_name ||
        ""
    );

    setMessage("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setMessage("");
    setError("");
  };

  const removeDepartment = async (department) => {
    const id =
      department.id ||
      department._id;

    if (!id) {
      setError(
        "Department ID was not found."
      );
      return;
    }

    const departmentName =
      department.name ||
      department.department_name ||
      "this department";

    const confirmed = window.confirm(
      `Delete "${departmentName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await deleteDepartment(id);

      setMessage(
        "Department deleted successfully."
      );

      if (
        String(editingId) === String(id)
      ) {
        cancelEdit();
      }

      await loadDepartments();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete department."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDepartments = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return departments;
    }

    return departments.filter(
      (department) => {
        const departmentName = String(
          department.name ||
            department.department_name ||
            ""
        ).toLowerCase();

        return departmentName.includes(value);
      }
    );
  }, [departments, search]);

  const getDepartmentName = (department) => {
    return (
      department.name ||
      department.department_name ||
      "Unnamed Department"
    );
  };

  const getInitials = (department) => {
    const name = getDepartmentName(
      department
    );

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return name
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <ManagerSidebar />
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
                  Manager Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Departments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Organize and maintain the departments available
                within your organization.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDepartments}
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
              MESSAGES
          ===================================================== */}
          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                ✓
              </span>

              <div>
                <p className="text-sm font-bold">
                  Operation successful
                </p>

                <p className="mt-1 text-xs text-green-600">
                  {message}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Department action failed
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
              title="Total Departments"
              value={departments.length}
              subtitle="Available departments"
              type="total"
            />

            <SummaryCard
              title="Visible Results"
              value={filteredDepartments.length}
              subtitle="Matching current search"
              type="visible"
            />

            <SummaryCard
              title="Current Mode"
              value={editingId ? "Edit" : "Add"}
              subtitle={
                editingId
                  ? "Updating department"
                  : "Create new department"
              }
              type="mode"
            />
          </div>

          {/* =====================================================
              ADD / EDIT FORM
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-orange-600" />

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  {editingId ? (
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
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingId
                      ? "Edit Department"
                      : "Add Department"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {editingId
                      ? "Update the department name and save your changes."
                      : "Create a new department for your organization."}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                  </svg>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                      setMessage("");
                    }}
                    placeholder="Enter department name"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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
                  ) : editingId ? (
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

                      Update Department
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
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>

                      Add Department
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* =====================================================
              SEARCH
          ===================================================== */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Department Directory
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Search and manage your organization&apos;s departments.
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
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
                  placeholder="Search departments..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              DEPARTMENT LIST
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Departments
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {filteredDepartments.length}{" "}
                    {filteredDepartments.length === 1
                      ? "department"
                      : "departments"}{" "}
                    shown
                  </p>
                </div>

                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {departments.length} Total
                </span>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-20 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredDepartments.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
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
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
                    </svg>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No departments found
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                    Create a department or change the search term
                    to see results.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDepartments.map(
                    (department, index) => {
                      const id =
                        department.id ||
                        department._id ||
                        index;

                      const departmentName =
                        getDepartmentName(
                          department
                        );

                      return (
                        <div
                          key={id}
                          className="group flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-orange-100 hover:bg-orange-50/20 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-orange-600">
                              {getInitials(
                                department
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-extrabold text-slate-800">
                                {departmentName}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                Department #{index + 1}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                startEdit(
                                  department
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2.5 text-xs font-bold text-orange-700 transition hover:bg-orange-600 hover:text-white"
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

                            <button
                              type="button"
                              onClick={() =>
                                removeDepartment(
                                  department
                                )
                              }
                              disabled={
                                deletingId === id
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === id ? (
                                <>
                                  <svg
                                    className="h-3.5 w-3.5 animate-spin"
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

                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                  >
                                    <path d="M4 7h16" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M6 7l1 14h10l1-14" />
                                    <path d="M9 7V4h6v3" />
                                  </svg>

                                  Delete
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Manager Department Management
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
  type,
}) {
  let icon = null;

  if (type === "total") {
    icon = (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
      </svg>
    );
  }

  if (type === "visible") {
    icon = (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
    );
  }

  if (type === "mode") {
    icon = (
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
    );
  }

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-2xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default Departments;