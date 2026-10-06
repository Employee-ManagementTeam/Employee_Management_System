import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/api";

function Department() {
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      const response = await getDepartments();

      const data = Array.isArray(response)
        ? response
        : response?.departments ||
          response?.data ||
          [];

      setDepartments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      if (editingId) {
  await updateDepartment(editingId, {
    department_name: name,
    description,
  });
  setMessage("Department updated successfully.");
} else {
  await createDepartment({
    department_name: name,
    description,
  });
  setMessage("Department created successfully.");
}

      setName("");
      setDescription("");
      setEditingId(null);

      await loadDepartments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (department) => {
    setEditingId(
      department._id || department.id
    );

    setName(department.name || "");
    setDescription(
      department.description || ""
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) {
      return;
    }

    try {
      await deleteDepartment(id);

      setMessage("Department deleted successfully.");

      await loadDepartments();
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
            Departments
          </h1>

          <p className="mb-8 text-gray-500">
            Manage organization departments
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
                ? "Edit Department"
                : "Add Department"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Department name"
                className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                required
              />

              <input
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Description"
                className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                required
              />

            </div>

            <div className="mt-5 flex gap-3">

              <button
                className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
              >
                {editingId
                  ? "Update Department"
                  : "Add Department"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setDescription("");
                  }}
                  className="rounded-xl bg-gray-200 px-6 py-3"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {departments.map((department) => {

              const id =
                department._id ||
                department.id;

              return (
                <div
                  key={id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">
                      🏢
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">
                      Department
                    </span>

                  </div>

                  <h3 className="text-xl font-bold">
                    {department.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {department.description}
                  </p>

                  <div className="mt-5 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(department)
                      }
                      className="rounded-lg bg-orange-100 px-4 py-2 text-orange-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(id)
                      }
                      className="rounded-lg bg-red-100 px-4 py-2 text-red-600"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Department;