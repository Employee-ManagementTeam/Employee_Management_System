import { useEffect, useState } from "react";

function Documents() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const employeeName =
      localStorage.getItem("username") || "";

    const saved =
      JSON.parse(localStorage.getItem("emsDocuments")) || [];

    const employees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    const email = localStorage.getItem("email");

    const employee = employees.find(
      (item) => item.email === email
    );

    const name = employee?.name || employeeName;

    setDocuments(
      saved.filter(
        (document) => document.employee === name
      )
    );
  };

  return (
    <div style={styles.page}>

      <h1>My Documents</h1>

      <p style={styles.subtitle}>
        View your submitted documents
      </p>

      <div style={styles.grid}>

        {documents.map((document) => (
          <div
            key={document.id}
            style={styles.card}
          >

            <div style={styles.icon}>📄</div>

            <h2>{document.documentName}</h2>

            <p>
              <strong>Type:</strong>{" "}
              {document.documentType}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {document.status}
            </p>

          </div>
        ))}

      </div>

      {documents.length === 0 && (
        <div style={styles.empty}>
          No documents available.
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  subtitle: {
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
    marginTop: "25px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  icon: {
    fontSize: "35px",
  },

  empty: {
    marginTop: "25px",
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    color: "#6b7280",
  },
};

export default Documents;