import { useEffect, useState } from "react";
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);

      const response = await getDepartments();

      const data =
        response?.departments ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setDepartments(data);
    } catch (err) {
      setError(err.message || "Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Department name is required.");
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

        setMessage("Department updated successfully.");
      } else {
        await createDepartment({
          name: name.trim(),
        });

        setMessage("Department created successfully.");
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
    setEditingId(department.id || department._id);
    setName(department.name || department.department_name || "");
  };

  const removeDepartment = async (department) => {
    const id = department.id || department._id;

    if (!window.confirm("Delete this department?")) return;

    try {
      setError("");
      await deleteDepartment(id);

      setMessage("Department deleted successfully.");
      await loadDepartments();
    } catch (err) {
      setError(err.message || "Failed to delete department.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Departments
          </h1>

          <p className="mt-1 text-gray-500">
            Manage company departments.
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

          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {editingId
                ? "Edit Department"
                : "Add Department"}
            </h2>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Department name"
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-[#B7792B]"
              />

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#B7792B] px-6 py-2.5 font-medium text-white"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update"
                  : "Add"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                  }}
                  className="rounded-lg bg-gray-100 px-6 py-2.5 text-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading departments...
              </div>
            ) : departments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No departments found.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {departments.map((department, index) => {
                  const id =
                    department.id ||
                    department._id ||
                    index;

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-5"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {department.name ||
                            department.department_name ||
                            "-"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(department)}
                          className="rounded-lg bg-[#FFF8E7] px-4 py-2 text-sm text-[#B7792B]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            removeDepartment(department)
                          }
                          className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Departments;