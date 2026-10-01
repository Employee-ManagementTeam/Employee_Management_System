import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/employee/Dashboard";
import Profile from "./pages/employee/profile";
import Attendance from "./pages/employee/attendance";
import Leave from "./pages/employee/leave";
import Tasks from "./pages/employee/tasks";
import Performance from "./pages/employee/performance";
import Documents from "./pages/employee/documents";
import Payroll from "./pages/employee/payroll";
import Notifications from "./pages/employee/notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee */}
        <Route
          path="/employee/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/employee/profile"
          element={<Profile />}
        />

        <Route
          path="/employee/attendance"
          element={<Attendance />}
        />

        <Route
          path="/employee/leave"
          element={<Leave />}
        />

        <Route
          path="/employee/tasks"
          element={<Tasks />}
        />

        <Route
          path="/employee/performance"
          element={<Performance />}
        />

        <Route
          path="/employee/documents"
          element={<Documents />}
        />

        <Route
          path="/employee/payroll"
          element={<Payroll />}
        />

        <Route
          path="/employee/notifications"
          element={<Notifications />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;