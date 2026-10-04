import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getSalary,
  createSalary,
  updateSalary,
  deleteSalary,
} from "../../api/api";

function Salary() {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    basic_salary: "",
    allowances: "",
    deductions: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSalary = async () => {
    try {
      const response = await getSalary();

      const data = Array.isArray(response)
        ? response
        : response?.salary ||
          response?.records ||
          response?.data ||
          [];

      setRecords(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadSalary();
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
      const payload = {
        employee_id: form.employee_id,
        basic_salary: Number(
          form.basic_salary
        ),
        allowances: Number(
          form.allowances
        ),
        deductions: Number(
          form.deductions
        ),
      };

      if (editingId) {
        await updateSalary(
          editingId,
          payload
        );

        setMessage(
          "Salary updated successfully."
        );
      } else {
        await createSalary(payload);

        setMessage(
          "Salary created successfully."
        );
      }

      setForm({
        employee_id: "",
        basic_salary: "",
        allowances: "",
        deductions: "",
      });

      setEditingId(null);

      await loadSalary();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (record) => {
    setEditingId(
      record._id || record.id
    );

    setForm({
      employee_id:
        record.employee_id || "",
      basic_salary:
        record.basic_salary || "",
      allowances:
        record.allowances || "",
      deductions:
        record.deductions || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete salary record?")) {
      return;
    }

    try {
      await deleteSalary(id);

      setMessage(
        "Salary deleted successfully."
      );

      await loadSalary();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Salary Management
          </h1>

          <p className="mb-8 text-gray-500">
            Manage employee salary records
          </p>

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
            <h2 className="mb-5 text-xl font-bold">
              {editingId
                ? "Edit Salary"
                : "Add Salary"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              <input
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                placeholder="Employee ID"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                name="basic_salary"
                type="number"
                value={form.basic_salary}
                onChange={handleChange}
                placeholder="Basic Salary"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                name="allowances"
                type="number"
                value={form.allowances}
                onChange={handleChange}
                placeholder="Allowances"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                name="deductions"
                type="number"
                value={form.deductions}
                onChange={handleChange}
                placeholder="Deductions"
                className="rounded-xl border px-4 py-3"
                required
              />

            </div>

            <button className="mt-5 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
              {editingId
                ? "Update Salary"
                : "Add Salary"}
            </button>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold">
              Salary Records
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Basic</th>
                    <th className="p-3">Allowances</th>
                    <th className="p-3">Deductions</th>
                    <th className="p-3">Net</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record, index) => {

                    const id =
                      record._id ||
                      record.id ||
                      index;

                    const net =
                      Number(record.basic_salary || 0) +
                      Number(record.allowances || 0) -
                      Number(record.deductions || 0);

                    return (
                      <tr
                        key={id}
                        className="border-b hover:bg-orange-50"
                      >
                        <td className="p-3">
                          {record.employee_id}
                        </td>

                        <td className="p-3">
                          ₹{record.basic_salary}
                        </td>

                        <td className="p-3">
                          ₹{record.allowances}
                        </td>

                        <td className="p-3">
                          ₹{record.deductions}
                        </td>

                        <td className="p-3 font-bold text-orange-600">
                          ₹{net}
                        </td>

                        <td className="p-3">
                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                handleEdit(record)
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

          </div>

        </div>
      </main>
    </div>
  );
}

export default Salary;