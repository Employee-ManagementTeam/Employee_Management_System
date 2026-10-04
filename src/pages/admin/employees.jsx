import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/api";

const emptyForm = {
  employee_code: "",
  first_name: "",
  last_name: "",
  phone: "",
  department: "",
  designation: "",
  joining_date: "",
  address: "",
  employment_status: "Active",
  user_id: "",
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const toArray = (response) => {
    if (Array.isArray(response)) return response;

    return (
      response?.employees ||
      response?.data ||
      []
    );
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const response = await getEmployees();

      setEmployees(toArray(response));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      if (editingId) {
        await updateEmployee(editingId, {
          phone: form.phone,
          designation: form.designation,
          address: form.address,
        });

        setMessage("Employee updated successfully.");
      } else {
        await createEmployee(form);

        setMessage("Employee created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id || employee.id);

    setForm({
      employee_code: employee.employee_code || "",
      first_name: employee.first_name || "",
      last_name: employee.last_name || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joining_date: employee.joining_date || "",
      address: employee.address || "",
      employment_status:
        employee.employment_status || "Active",
      user_id: employee.user_id || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) {
      return;
    }

    try {
      await deleteEmployee(id);

      setMessage("Employee deleted successfully.");

      await loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const value = `${employee.first_name || ""} ${
      employee.last_name || ""
    } ${employee.employee_code || ""} ${
      employee.department || ""
    }`.toLowerCase();

    return value.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Employees
            </h1>

            <p className="text-gray-500">
              Manage employee records
            </p>
          </div>

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
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              {editingId
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {[
                ["employee_code", "Employee Code"],
                ["first_name", "First Name"],
                ["last_name", "Last Name"],
                ["phone", "Phone"],
                ["department", "Department"],
                ["designation", "Designation"],
                ["joining_date", "Joining Date"],
                ["address", "Address"],
                ["user_id", "User ID"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                  </label>

                  <input
                    type={name === "joining_date" ? "date" : "text"}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    disabled={
                      editingId &&
                      !["phone", "designation", "address"].includes(name)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                    required={
                      !editingId &&
                      name !== "user_id"
                    }
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Employment Status
                </label>

                <select
                  name="employment_status"
                  value={form.employment_status}
                  onChange={handleChange}
                  disabled={Boolean(editingId)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                type="submit"
                className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                {editingId
                  ? "Update Employee"
                  : "Add Employee"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">
                Employee List
              </h2>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-72 rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            {loading ? (
              <p>Loading employees...</p>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="p-3">Code</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Designation</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.map((employee) => {

                      const id =
                        employee._id ||
                        employee.id;

                      return (
                        <tr
                          key={id}
                          className="border-b hover:bg-orange-50"
                        >
                          <td className="p-3">
                            {employee.employee_code}
                          </td>

                          <td className="p-3 font-medium">
                            {employee.first_name}{" "}
                            {employee.last_name}
                          </td>

                          <td className="p-3">
                            {employee.department}
                          </td>

                          <td className="p-3">
                            {employee.designation}
                          </td>

                          <td className="p-3">
                            {employee.phone}
                          </td>

                          <td className="p-3">
                            {employee.employment_status}
                          </td>

                          <td className="p-3">
                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  handleEdit(employee)
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Employees;