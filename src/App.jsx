import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= AUTH ================= */

import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";

/* ================= ADMIN ================= */

import AdminDashboard from "./pages/admin/dashboard";
import AdminEmployees from "./pages/admin/employees";
import AdminDepartments from "./pages/admin/departments";
import AdminAttendance from "./pages/admin/attendance";
import AdminLeave from "./pages/admin/leave";
import AdminTasks from "./pages/admin/tasks";
import AdminPerformance from "./pages/admin/performance";
import AdminDocuments from "./pages/admin/documents";
import AdminPayroll from "./pages/admin/payroll";
import AdminActivityLogs from "./pages/admin/activitylogs";
import AdminNotifications from "./pages/admin/notifications";
import AdminReports from "./pages/admin/reports";
import AdminSalary from "./pages/admin/salary";

/* ================= MANAGER ================= */

/* ================= MANAGER ================= */

import ManagerDashboard from "./pages/manager/dashboard";
import ManagerEmployees from "./pages/manager/employees";
import ManagerDepartments from "./pages/manager/departments";
import ManagerAttendance from "./pages/manager/attendance";
import ManagerLeaveApprovals from "./pages/manager/leaveapprovals";
import ManagerTasks from "./pages/manager/tasks";
import ManagerPerformance from "./pages/manager/performance";
import ManagerReports from "./pages/manager/reports";
import ManagerNotifications from "./pages/manager/notifications";
import ManagerDocuments from "./pages/manager/documents";

/* ================= EMPLOYEE ================= */

import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeAttendance from "./pages/employee/attendance";
import EmployeeDocuments from "./pages/employee/documents";
import EmployeeLeave from "./pages/employee/leave";
import EmployeeNotifications from "./pages/employee/notifications";
import EmployeePayroll from "./pages/employee/payroll";
import EmployeePerformance from "./pages/employee/performance";
import EmployeeProfile from "./pages/employee/profile";
import EmployeeTasks from "./pages/employee/tasks";
import EmployeeActivityLogs from "./pages/employee/activitylogs";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/employees"
          element={<AdminEmployees />}
        />

        <Route
          path="/admin/departments"
          element={<AdminDepartments />}
        />

        <Route
          path="/admin/attendance"
          element={<AdminAttendance />}
        />

        <Route
          path="/admin/leave-management"
          element={<AdminLeave />}
        />

        <Route
          path="/admin/tasks"
          element={<AdminTasks />}
        />

        <Route
          path="/admin/performance"
          element={<AdminPerformance />}
        />

        <Route
          path="/admin/documents"
          element={<AdminDocuments />}
        />

        <Route
          path="/admin/payroll"
          element={<AdminPayroll />}
        />

        <Route
          path="/admin/activity-logs"
          element={<AdminActivityLogs />}
        />

        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />

        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />

        <Route
          path="/admin/salary"
          element={<AdminSalary />}
        />


        {/* ================= MANAGER ================= */}

        <Route
  path="/manager/dashboard"
  element={<ManagerDashboard />}
/>

<Route
  path="/manager/employees"
  element={<ManagerEmployees />}
/>

<Route
  path="/manager/departments"
  element={<ManagerDepartments />}
/>

<Route
  path="/manager/attendance"
  element={<ManagerAttendance />}
/>

<Route
  path="/manager/leaveapprovals"
  element={<ManagerLeaveApprovals />}
/>

<Route
  path="/manager/tasks"
  element={<ManagerTasks />}
/>

<Route
  path="/manager/performance"
  element={<ManagerPerformance />}
/>

<Route
  path="/manager/reports"
  element={<ManagerReports />}
/>

<Route
  path="/manager/notifications"
  element={<ManagerNotifications />}
/>

<Route
  path="/manager/documents"
  element={<ManagerDocuments />}
/>

        {/* ================= EMPLOYEE ================= */}

        <Route
          path="/employee/Dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/attendance"
          element={<EmployeeAttendance />}
        />

        <Route
          path="/employee/tasks"
          element={<EmployeeTasks />}
        />

        <Route
          path="/employee/leave"
          element={<EmployeeLeave />}
        />

        <Route
          path="/employee/performance"
          element={<EmployeePerformance />}
        />

        <Route
          path="/employee/documents"
          element={<EmployeeDocuments />}
        />

        <Route
          path="/employee/payroll"
          element={<EmployeePayroll />}
        />

        <Route
          path="/employee/notifications"
          element={<EmployeeNotifications />}
        />

        <Route
          path="/employee/profile"
          element={<EmployeeProfile />}
        />

        <Route
          path="/employee/activitylogs"
          element={<EmployeeActivityLogs />}
        />


        {/* ================= DEFAULT ================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;