import { useEffect, useState } from "react";

function Payroll() {
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    loadPayroll();
  }, []);

  const loadPayroll = () => {
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
      JSON.parse(localStorage.getItem("emsPayroll")) || [];

    setPayroll(
      saved.filter(
        (item) => item.employee === name
      )
    );
  };

  const total = payroll.reduce(
    (sum, item) =>
      sum + Number(item.netSalary || 0),
    0
  );

  return (
    <div style={styles.page}>

      <h1>My Payroll</h1>

      <p style={styles.subtitle}>
        View your salary records
      </p>

      <div style={styles.summary}>
        <p>Total Net Salary Records</p>
        <h2>₹{total.toLocaleString()}</h2>
      </div>

      <div style={styles.tableCard}>

        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>Month</th>
              <th style={styles.th}>Basic Salary</th>
              <th style={styles.th}>Allowances</th>
              <th style={styles.th}>Deductions</th>
              <th style={styles.th}>Net Salary</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>

            {payroll.map((item) => (
              <tr key={item.id}>

                <td style={styles.td}>
                  {item.month}
                </td>

                <td style={styles.td}>
                  ₹{Number(item.basicSalary).toLocaleString()}
                </td>

                <td style={styles.td}>
                  ₹{Number(item.allowances).toLocaleString()}
                </td>

                <td style={styles.td}>
                  ₹{Number(item.deductions).toLocaleString()}
                </td>

                <td style={styles.td}>
                  ₹{Number(item.netSalary).toLocaleString()}
                </td>

                <td style={styles.td}>
                  {item.status}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

        {payroll.length === 0 && (
          <p style={styles.empty}>
            No payroll records available.
          </p>
        )}

      </div>

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
    maxWidth: "350px",
  },

  tableCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    overflow: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "13px",
    textAlign: "left",
    background: "#f9fafb",
  },

  td: {
    padding: "13px",
    borderTop: "1px solid #e5e7eb",
  },

  empty: {
    color: "#6b7280",
  },
};

export default Payroll;