import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import { getEmployees, getEmployee } from "../../api/api";

function Profile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await getEmployees();

      const employees =
        Array.isArray(response)
          ? response
          : response.employees ||
            response.data ||
            [];

      const current = employees.find(
        (item) =>
          String(item.user_id) === String(userId) ||
          String(item.userId) === String(userId)
      );

      if (!current) {
        throw new Error(
          "Employee profile was not found."
        );
      }

      const employeeId =
        current.id ||
        current.employee_id ||
        current._id;

      const detailed = await getEmployee(employeeId);

      setEmployee(
        detailed.employee ||
          detailed.data ||
          detailed
      );
    } catch (err) {
      setError(
        err.message || "Failed to load profile."
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
            My Profile
          </h1>

          <p className="mt-1 text-gray-500">
            Your employee information.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading profile...
            </p>
          ) : employee ? (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-500">
                    Employee Code
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.employee_code ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    First Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.first_name ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Last Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.last_name ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.phone ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Department
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.department ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Designation
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.designation ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Joining Date
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.joining_date ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Employment Status
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.employment_status ||
                      "Not provided"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">
                    Address
                  </p>

                  <p className="mt-1 font-semibold">
                    {employee.address ||
                      "Not provided"}
                  </p>
                </div>

              </div>

            </div>
          ) : null}

        </div>
      </main>
    </div>
  );
}

export default Profile;