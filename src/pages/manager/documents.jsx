import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getDocuments,
  deleteDocument,
} from "../../api/api";

function Documents() {
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDocuments();

      setDocuments(
        response?.documents ||
          response?.data ||
          (Array.isArray(response) ? response : [])
      );
    } catch (err) {
      setError(
        err.message || "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = async (document) => {
    const id =
      document.id || document._id;

    if (!window.confirm("Delete this document?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteDocument(id);

      setMessage("Document deleted successfully.");
      await loadDocuments();
    } catch (err) {
      setError(
        err.message || "Failed to delete document."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Documents
          </h1>

          <p className="mt-1 text-gray-500">
            View employee documents.
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

          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading documents...
              </div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No documents found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="px-5 py-3">
                      Employee
                    </th>

                    <th className="px-5 py-3">
                      File Name
                    </th>

                    <th className="px-5 py-3">
                      Uploaded
                    </th>

                    <th className="px-5 py-3">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {documents.map((document, index) => (
                    <tr
                      key={
                        document.id ||
                        document._id ||
                        index
                      }
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4">
                        {document.employee_name ||
                          document.employee_id ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {document.file_name ||
                          document.filename ||
                          document.name ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {document.created_at ||
                          document.uploaded_at ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            removeDocument(document)
                          }
                          className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500"
                        >
                          Delete
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

export default Documents;