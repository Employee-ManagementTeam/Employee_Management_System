import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";

import {
  getDocuments,
  getEmployees,
  uploadDocument,
  deleteDocument,
} from "../../api/api";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const employeesResponse = await getEmployees();

      const employees =
        Array.isArray(employeesResponse)
          ? employeesResponse
          : employeesResponse.employees ||
            employeesResponse.data ||
            [];

      const employee = employees.find(
        (item) =>
          String(item.user_id) === String(userId) ||
          String(item.userId) === String(userId)
      );

      const id =
        employee?.id ||
        employee?.employee_id ||
        employee?._id;

      setEmployeeId(id);

      const response = await getDocuments();

      const allDocuments =
        Array.isArray(response)
          ? response
          : response.documents ||
            response.data ||
            [];

      const mine = allDocuments.filter(
        (document) =>
          String(document.employee_id) === String(id)
      );

      setDocuments(mine);
    } catch (err) {
      setError(
        err.message || "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      await uploadDocument(employeeId, file);

      setFile(null);
      setMessage("Document uploaded successfully.");

      await loadDocuments();
    } catch (err) {
      setError(
        err.message || "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);

      setDocuments((current) =>
        current.filter(
          (document) =>
            String(
              document.id ||
                document.document_id ||
                document._id
            ) !== String(documentId)
        )
      );
    } catch (err) {
      setError(
        err.message || "Failed to delete document."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Documents
          </h1>

          <p className="mt-1 text-gray-500">
            Upload and manage your documents.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-bold">
              Upload Document
            </h2>

            <div className="flex flex-col gap-4 md:flex-row">
              <input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="flex-1 rounded-xl border border-gray-200 p-3"
              />

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-gray-400"
              >
                {uploading
                  ? "Uploading..."
                  : "Upload"}
              </button>
            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold">
              My Documents
            </h2>

            {loading ? (
              <p className="text-gray-500">
                Loading documents...
              </p>
            ) : documents.length === 0 ? (
              <p className="text-gray-500">
                No documents found.
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((document) => {
                  const id =
                    document.id ||
                    document.document_id ||
                    document._id;

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {document.filename ||
                            document.file_name ||
                            document.name ||
                            "Document"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(id)}
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
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

export default Documents;