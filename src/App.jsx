import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Authentication */
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";

/* ================= ADMIN ================= */

import AdminDashboard from "./pages/admin/dashboard";
import Employees from "./pages/admin/employees";
import Departments from "./pages/admin/departments";
import Attendance from "./pages/admin/attendance";
import Leave from "./pages/admin/leave";
import Tasks from "./pages/admin/tasks";
import Performance from "./pages/admin/performance";
import Documents from "./pages/admin/documents";
import Payroll from "./pages/admin/payroll";

/* ================= MANAGER ================= */

import ManagerDashboard from "./pages/manager/dashboard";
import ManagerEmployees from "./pages/manager/employees";
import ManagerDepartments from "./pages/manager/departments";
import ManagerAttendance from "./pages/manager/attendance";
import LeaveApprovals from "./pages/manager/leaveapprovals";
import ManagerTasks from "./pages/manager/tasks";
import ManagerPerformance from "./pages/manager/performance";

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
          element={<Employees />}
        />

        <Route
          path="/admin/departments"
          element={<Departments />}
        />

        <Route
          path="/admin/attendance"
          element={<Attendance />}
        />

        <Route
          path="/admin/leave-management"
          element={<Leave />}
        />

        <Route
          path="/admin/tasks"
          element={<Tasks />}
        />

        <Route
          path="/admin/performance"
          element={<Performance />}
        />

        <Route
          path="/admin/documents"
          element={<Documents />}
        />

        <Route
          path="/admin/payroll"
          element={<Payroll />}
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
          element={<LeaveApprovals />}
        />

        <Route
          path="/manager/tasks"
          element={<ManagerTasks />}
        />

        <Route
          path="/manager/performance"
          element={<ManagerPerformance />}
        />


        {/* ================= EMPLOYEE ================= */}

        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/attendance"
          element={<EmployeeAttendance />}
        />

        <Route
          path="/employee/documents"
          element={<EmployeeDocuments />}
        />

        <Route
          path="/employee/leave"
          element={<EmployeeLeave />}
        />

        <Route
          path="/employee/notifications"
          element={<EmployeeNotifications />}
        />

        <Route
          path="/employee/payroll"
          element={<EmployeePayroll />}
        />

        <Route
          path="/employee/performance"
          element={<EmployeePerformance />}
        />

        <Route
          path="/employee/profile"
          element={<EmployeeProfile />}
        />

        <Route
          path="/employee/tasks"
          element={<EmployeeTasks />}
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