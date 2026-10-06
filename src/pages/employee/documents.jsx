import { useEffect, useRef, useState } from "react";
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
  const [deleting, setDeleting] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      const employeesResponse = await getEmployees();

      const employees = Array.isArray(employeesResponse)
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

      if (!id) {
        throw new Error(
          "Employee profile was not found."
        );
      }

      setEmployeeId(id);

      const response = await getDocuments();

      const allDocuments = Array.isArray(response)
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

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0] || null;

    setFile(selectedFile);
    setError("");
    setMessage("");
  };

  const clearSelectedFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      setMessage("");
      return;
    }

    if (!employeeId) {
      setError(
        "Employee profile was not found. Please login again."
      );
      setMessage("");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      await uploadDocument(employeeId, file);

      clearSelectedFile();

      setMessage(
        "Document uploaded successfully."
      );

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
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(documentId);
      setError("");
      setMessage("");

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

      setMessage(
        "Document deleted successfully."
      );
    } catch (err) {
      setError(
        err.message || "Failed to delete document."
      );
    } finally {
      setDeleting(null);
    }
  };

  const getDocumentName = (document) => {
    return (
      document.filename ||
      document.file_name ||
      document.name ||
      "Document"
    );
  };

  const getFileExtension = (name) => {
    const parts = String(name).split(".");

    if (parts.length < 2) {
      return "FILE";
    }

    return parts[parts.length - 1]
      .toUpperCase()
      .slice(0, 5);
  };

  const getFileIcon = (name) => {
    const extension = getFileExtension(name);

    if (extension === "PDF") {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 2h9l5 5v15H6z" />
          <path d="M14 2v6h6" />
          <path d="M9 15h6M9 11h3" />
        </svg>
      );
    }

    if (
      extension === "DOC" ||
      extension === "DOCX"
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 2h9l5 5v15H6z" />
          <path d="M14 2v6h6" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );
    }

    if (
      extension === "JPG" ||
      extension === "JPEG" ||
      extension === "PNG" ||
      extension === "WEBP"
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="2"
          />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="M21 16l-5-5L5 21" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M6 2h9l5 5v15H6z" />
        <path d="M14 2v6h6" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <EmployeeSidebar />
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
                  Employee Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Documents
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Upload, organize, and manage your employee documents
                securely from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDocuments}
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
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Document action failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                ✓
              </span>

              <div>
                <p className="text-sm font-bold">
                  Document update
                </p>

                <p className="mt-1 text-xs leading-5 text-green-600">
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              SUMMARY
          ===================================================== */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    My Documents
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {documents.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Uploaded files
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 2h9l5 5v15H6z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Upload Status
                  </p>

                  <p className="mt-3 text-lg font-black text-slate-900">
                    {uploading
                      ? "Uploading"
                      : file
                      ? "Ready"
                      : "No file selected"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Current upload session
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 19V5" />
                    <path d="M7 10l5-5 5 5" />
                    <path d="M5 19h14" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Secure Storage
                  </p>

                  <p className="mt-3 text-lg font-black text-slate-900">
                    Employee Only
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Records associated with your account
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3l8 4v5c0 4.5-3.1 7.8-8 9-4.9-1.2-8-4.5-8-9V7l8-4z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              UPLOAD SECTION
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-orange-600" />

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 19V5" />
                    <path d="M7 10l5-5 5 5" />
                    <path d="M5 19h14" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Upload Document
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Select a file and upload it to your employee record.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div
                className={`rounded-2xl border-2 border-dashed p-7 text-center transition ${
                  file
                    ? "border-orange-200 bg-orange-50/40"
                    : "border-slate-200 bg-slate-50/60 hover:border-orange-200"
                }`}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M12 3v12" />
                    <path d="M7 8l5-5 5 5" />
                    <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
                  </svg>
                </div>

                {file ? (
                  <>
                    <p className="mt-4 text-sm font-extrabold text-slate-800">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="mt-4 text-xs font-bold text-red-600 transition hover:text-red-700"
                    >
                      Remove selected file
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-sm font-bold text-slate-800">
                      Choose a document to upload
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Select a file from your computer.
                    </p>
                  </>
                )}

                <div className="mt-5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 19V5" />
                      <path d="M7 10l5-5 5 5" />
                    </svg>

                    {file
                      ? "Choose Another File"
                      : "Choose File"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-400">
                  Make sure the selected file is the correct document
                  before uploading.
                </p>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || !file}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {uploading ? (
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

                      Uploading...
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
                        <path d="M12 19V5" />
                        <path d="M7 10l5-5 5 5" />
                        <path d="M5 19h14" />
                      </svg>

                      Upload Document
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              DOCUMENT LIST
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  My Documents
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Documents associated with your employee profile.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {documents.length}{" "}
                {documents.length === 1
                  ? "Document"
                  : "Documents"}
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-20 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path d="M6 2h9l5 5v15H6z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No documents found
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                    Upload your employee documents using the upload section
                    above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((document, index) => {
                    const id =
                      document.id ||
                      document.document_id ||
                      document._id;

                    const name =
                      getDocumentName(document);

                    const extension =
                      getFileExtension(name);

                    return (
                      <div
                        key={
                          id ||
                          `document-${index}`
                        }
                        className="group flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-orange-100 hover:bg-orange-50/20 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            {getFileIcon(name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">
                              {name}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                                {extension}
                              </span>

                              <span className="text-[10px] text-slate-400">
                                Employee document
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(id)
                          }
                          disabled={deleting === id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deleting === id ? (
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
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Document Management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Documents;