import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import StatCard from "../../components/statcard";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    attendance: null,
    leaveBalance: null,
    pendingTasks: null,
    performance: null,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const data = JSON.parse(savedUser);
      setUser(data.user);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <Sidebar role={user?.role || "employee"} />

      {/* Main Content */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar user={user} />

        <main className="p-6">

          {/* Welcome */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.username || "User"} 👋
            </h1>

            <p className="text-gray-500 mt-1">
              Here's your employee dashboard.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard
              title="Attendance"
              value={
                dashboardData.attendance !== null
                  ? `${dashboardData.attendance}%`
                  : "--"
              }
            />

            <StatCard
              title="Leave Balance"
              value={
                dashboardData.leaveBalance !== null
                  ? `${dashboardData.leaveBalance} Days`
                  : "--"
              }
            />

            <StatCard
              title="Pending Tasks"
              value={
                dashboardData.pendingTasks !== null
                  ? dashboardData.pendingTasks
                  : "--"
              }
            />

            <StatCard
              title="Performance"
              value={
                dashboardData.performance !== null
                  ? `${dashboardData.performance}%`
                  : "--"
              }
            />

          </div>

          {/* Future API Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Tasks
              </h2>

              <p className="text-gray-500 mt-3">
                Tasks will appear here from the backend.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Notifications
              </h2>

              <p className="text-gray-500 mt-3">
                Notifications will appear here from the backend.
              </p>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;