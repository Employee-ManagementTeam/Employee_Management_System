import { useEffect, useState } from "react";

function Performance() {
  const [performance, setPerformance] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = () => {
    setPerformance(
      JSON.parse(localStorage.getItem("emsPerformance")) || []
    );
  };

  const filtered = performance.filter((item) =>
    `${item.employee} ${item.period} ${item.feedback}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const average =
    performance.length > 0
      ? (
          performance.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0
          ) / performance.length
        ).toFixed(1)
      : "0";

  const good = performance.filter(
    (item) => Number(item.rating) >= 4
  ).length;

  const improvement = performance.filter(
    (item) => Number(item.rating) <= 2
  ).length;

  return (
    <div style={styles.page}>

      <h1>Performance</h1>

      <p style={styles.subtitle}>
        Review employee performance
      </p>

      <div style={styles.cards}>

        <Stat
          title="Evaluations"
          value={performance.length}
        />

        <Stat
          title="Average Rating"
          value={average}
        />

        <Stat
          title="Good Performance"
          value={good}
        />

        <Stat
          title="Needs Improvement"
          value={improvement}
        />

      </div>

      <input
        placeholder="Search performance..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.grid}>

        {filtered.map((item) => (

          <div
            key={item.id}
            style={styles.card}
          >

            <h2>{item.employee}</h2>

            <p>
              <strong>Period:</strong>{" "}
              {item.period}
            </p>

            <p>
              <strong>Rating:</strong>{" "}
              ⭐ {item.rating}/5
            </p>

            <p>
              <strong>Feedback:</strong>{" "}
              {item.feedback}
            </p>

          </div>

        ))}

      </div>

      {filtered.length === 0 && (
        <div style={styles.empty}>
          No performance records found.
        </div>
      )}

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={styles.stat}>
      <p>{title}</p>
      <h2>{value}</h2>
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

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    margin: "25px 0",
  },

  stat: {
    background: "white",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  search: {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    marginBottom: "20px",
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
    padding: "20px",
    borderRadius: "10px",
    color: "#6b7280",
  },
};

export default Performance;