import { useState } from "react";

function Documents() {
  const [documents, setDocuments] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Documents
        </h1>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Upload Document
          </h2>

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="file"
              className="border border-gray-300 rounded-lg px-4 py-3"
            />

            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              onClick={() => {
                console.log("Document upload will be connected to backend");
              }}
            >
              Upload
            </button>

          </div>

        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            My Documents
          </h2>

          {documents.length === 0 ? (
            <p className="text-gray-500">
              Documents will appear here after they are uploaded.
            </p>
          ) : (
            <div className="space-y-4">

              {documents.map((document) => (
                <div
                  key={document.id}
                  className="border rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {document.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {document.type}
                    </p>
                  </div>

                  <button className="text-blue-600 font-semibold">
                    View
                  </button>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Documents;