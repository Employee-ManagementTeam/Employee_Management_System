import { useEffect, useState } from "react";
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
        (Array.isArray(response) ? response : []);

      setEmployees(data);
    } catch (err) {
      setError(err.message || "Failed to load employees.");
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
      employment_status: employee.employment_status || "",
    });

    setMessage("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveEmployee = async (e) => {
    e.preventDefault();

    if (!editingEmployee) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await updateEmployee(
        editingEmployee.id || editingEmployee._id,
        form
      );

      setMessage("Employee updated successfully.");
      setEditingEmployee(null);

      await loadEmployees();
    } catch (err) {
      setError(err.message || "Failed to update employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Employees
          </h1>

          <p className="mt-1 text-gray-500">
            Manage employee information.
          </p>

          {message && (
            <div className="mt-5 rounded-lg bg-green-50 p-4 text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {editingEmployee && (
            <form
              onSubmit={saveEmployee}
              className="mt-6 rounded-xl bg-white p-6 shadow-sm"
            >
              <h2 className="mb-5 text-xl font-semibold">
                Edit Employee
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  ["first_name", "First Name"],
                  ["last_name", "Last Name"],
                  ["phone", "Phone"],
                  ["department", "Department"],
                  ["designation", "Designation"],
                  ["joining_date", "Joining Date"],
                  ["address", "Address"],
                  ["employment_status", "Employment Status"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      {label}
                    </label>

                    <input
                      type={
                        name === "joining_date"
                          ? "date"
                          : "text"
                      }
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#B7792B] px-5 py-2.5 font-medium text-white"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="rounded-lg bg-gray-100 px-5 py-2.5 font-medium text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading employees...
              </div>
            ) : employees.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No employees found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Designation</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee, index) => (
                    <tr
                      key={employee.id || employee._id || index}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4">
                        {employee.employee_code || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {employee.first_name || ""}{" "}
                        {employee.last_name || ""}
                      </td>

                      <td className="px-5 py-4">
                        {employee.department || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {employee.designation || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {employee.employment_status || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => startEdit(employee)}
                          className="rounded-lg bg-[#FFF8E7] px-4 py-2 text-sm font-medium text-[#B7792B]"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Employees;