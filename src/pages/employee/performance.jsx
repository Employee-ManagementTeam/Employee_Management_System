import { useEffect, useState } from "react";

function Performance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = () => {
    const email = localStorage.getItem("email");

    const employees =
      JSON.parse(localStorage.getItem("emsEmployees")) || [];

    const employee = employees.find(
      (item) => item.email === email
    );

    const name =
      employee?.name ||
      localStorage.getItem("username") ||
      "Employee";

    const saved =
      JSON.parse(localStorage.getItem("emsPerformance")) || [];

    setRecords(
      saved.filter(
        (item) => item.employee === name
      )
    );
  };

  const average =
    records.length > 0
      ? (
          records.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0
          ) / records.length
        ).toFixed(1)
      : "0";

  return (
    <div style={styles.page}>

      <h1>My Performance</h1>

      <p style={styles.subtitle}>
        View your performance evaluations
      </p>

      <div style={styles.summary}>

        <p>Average Rating</p>

        <h2>
          ⭐ {average}/5
        </h2>

      </div>

      <div style={styles.grid}>

        {records.map((item) => (
          <div
            key={item.id}
            style={styles.card}
          >

            <h2>{item.period}</h2>

            <p>
              <strong>Rating:</strong>{" "}
              ⭐ {item.rating}/5
            </p>

            <p>
              <strong>Feedback:</strong>
            </p>

            <p>{item.feedback}</p>

          </div>
        ))}

      </div>

      {records.length === 0 && (
        <div style={styles.empty}>
          No performance records available.
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

  summary: {
    background: "white",
    padding: "20px",
    margin: "25px 0",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    maxWidth: "300px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  empty: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    color: "#6b7280",
  },
};

export default Performance;