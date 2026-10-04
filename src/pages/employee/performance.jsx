import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import { getEmployees, getPerformance } from "../../api/api";

function Performance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
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

      const employeeId =
        employee?.id ||
        employee?.employee_id ||
        employee?._id;

      const response = await getPerformance();

      const performance =
        Array.isArray(response)
          ? response
          : response.performance ||
            response.data ||
            [];

      const mine = performance.filter(
        (item) =>
          String(item.employee_id) === String(employeeId) ||
          String(item.user_id) === String(userId)
      );

      setRecords(mine);
    } catch (err) {
      setError(
        err.message || "Failed to load performance."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Performance
          </h1>

          <p className="mt-1 text-gray-500">
            Your performance evaluation records.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading performance...
            </p>
          ) : records.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No performance records found.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {records.map((record) => (
                <div
                  key={
                    record.id ||
                    record.performance_id ||
                    record._id
                  }
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    <div>
                      <p className="text-sm text-gray-500">
                        Rating
                      </p>

                      <p className="mt-1 text-2xl font-bold text-orange-600">
                        {record.rating ??
                          record.score ??
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Review Date
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {record.review_date ||
                          record.date ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Status
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {record.status ||
                          "Not provided"}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-gray-500">
                      Feedback
                    </p>

                    <p className="mt-2 text-gray-700">
                      {record.feedback ||
                        record.comments ||
                        "No feedback provided."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Performance;