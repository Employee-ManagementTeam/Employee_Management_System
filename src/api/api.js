const API_BASE_URL = "http://127.0.0.1:5000/api";

const getUserId = () => localStorage.getItem("userId");

const request = async (endpoint, options = {}) => {
  const userId = getUserId();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

/* =====================================================
   EMPLOYEES
===================================================== */

export const getEmployees = () =>
  request("/employees");

export const getEmployee = (employeeId) =>
  request(`/employees/${employeeId}`);

export const createEmployee = (employeeData) =>
  request("/employees", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });

export const updateEmployee = (employeeId, employeeData) =>
  request(`/employees/${employeeId}`, {
    method: "PUT",
    body: JSON.stringify(employeeData),
  });

export const deleteEmployee = (employeeId) =>
  request(`/employees/${employeeId}`, {
    method: "DELETE",
  });

/* =====================================================
   DEPARTMENTS
===================================================== */

export const getDepartments = () =>
  request("/departments");

export const createDepartment = (departmentData) =>
  request("/departments", {
    method: "POST",
    body: JSON.stringify(departmentData),
  });

export const updateDepartment = (departmentId, departmentData) =>
  request(`/departments/${departmentId}`, {
    method: "PUT",
    body: JSON.stringify(departmentData),
  });

export const deleteDepartment = (departmentId) =>
  request(`/departments/${departmentId}`, {
    method: "DELETE",
  });

/* =====================================================
   ATTENDANCE
===================================================== */

export const getAttendance = () =>
  request("/attendance");

export const getEmployeeAttendance = (employeeId) =>
  request(`/attendance/employee/${employeeId}`);

export const checkIn = (employeeId) =>
  request("/attendance/check-in", {
    method: "POST",
    body: JSON.stringify({
      employee_id: employeeId,
    }),
  });

export const checkOut = (employeeId) =>
  request("/attendance/check-out", {
    method: "POST",
    body: JSON.stringify({
      employee_id: employeeId,
    }),
  });

/* =====================================================
   QR ATTENDANCE
===================================================== */

export const qrCheckIn = (employeeId) =>
  request("/attendance/qr-check-in", {
    method: "POST",
    body: JSON.stringify({
      employee_id: employeeId,
    }),
  });

export const qrCheckOut = (employeeId) =>
  request("/attendance/qr-check-out", {
    method: "POST",
    body: JSON.stringify({
      employee_id: employeeId,
    }),
  });

/* =====================================================
   LEAVES
===================================================== */

export const getLeaves = () =>
  request("/leaves");

export const getLeave = (leaveId) =>
  request(`/leaves/${leaveId}`);

export const getEmployeeLeaves = (employeeId) =>
  request(`/leaves/employee/${employeeId}`);

export const createLeave = (leaveData) =>
  request("/leaves", {
    method: "POST",
    body: JSON.stringify(leaveData),
  });

export const approveLeave = (leaveId) =>
  request(`/leaves/${leaveId}/approve`, {
    method: "PUT",
  });

export const rejectLeave = (leaveId) =>
  request(`/leaves/${leaveId}/reject`, {
    method: "PUT",
  });

/* =====================================================
   TASKS
===================================================== */

export const getTasks = () =>
  request("/tasks");

export const createTask = (taskData) =>
  request("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });

export const updateTask = (taskId, taskData) =>
  request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });

export const deleteTask = (taskId) =>
  request(`/tasks/${taskId}`, {
    method: "DELETE",
  });

/* =====================================================
   PERFORMANCE
===================================================== */

export const getPerformance = () =>
  request("/performance");

export const createPerformance = (performanceData) =>
  request("/performance", {
    method: "POST",
    body: JSON.stringify(performanceData),
  });

export const updatePerformance = (
  performanceId,
  performanceData
) =>
  request(`/performance/${performanceId}`, {
    method: "PUT",
    body: JSON.stringify(performanceData),
  });

export const deletePerformance = (performanceId) =>
  request(`/performance/${performanceId}`, {
    method: "DELETE",
  });

/* =====================================================
   DOCUMENTS
===================================================== */

export const getDocuments = () =>
  request("/documents");

export const uploadDocument = (employeeId, file) => {
  const formData = new FormData();

  formData.append("employee_id", employeeId);
  formData.append("file", file);

  return request("/documents", {
    method: "POST",
    body: formData,
  });
};

export const deleteDocument = (documentId) =>
  request(`/documents/${documentId}`, {
    method: "DELETE",
  });

/* =====================================================
   SALARY
===================================================== */

export const getSalary = () =>
  request("/salary");

export const createSalary = (salaryData) =>
  request("/salary", {
    method: "POST",
    body: JSON.stringify(salaryData),
  });

export const updateSalary = (salaryId, salaryData) =>
  request(`/salary/${salaryId}`, {
    method: "PUT",
    body: JSON.stringify(salaryData),
  });

export const deleteSalary = (salaryId) =>
  request(`/salary/${salaryId}`, {
    method: "DELETE",
  });

/* =====================================================
   PAYROLL
===================================================== */

export const getPayroll = () =>
  request("/payroll");

export const createPayroll = (employeeId) =>
  request("/payroll", {
    method: "POST",
    body: JSON.stringify({
      employee_id: employeeId,
    }),
  });

export const generatePayroll = (employeeId) =>
  request("/payroll", {
    method: "POST",
    body: JSON.stringify({
      employee_id: employeeId,
    }),
  });
/* =====================================================
   NOTIFICATIONS
===================================================== */

export const getNotifications = () =>
  request("/notifications");

export const createNotification = (notificationData) =>
  request("/notifications", {
    method: "POST",
    body: JSON.stringify(notificationData),
  });

export const markNotificationRead = (notificationId) =>
  request(`/notifications/${notificationId}/read`, {
    method: "PUT",
  });

/* =====================================================
   REPORTS
===================================================== */

export const getAttendanceReport = () =>
  request("/reports/attendance");

export const getLeavesReport = () =>
  request("/reports/leaves");
export const getLeaveReport = () =>
  request("/reports/leaves");

export const getPayrollReport = () =>
  request("/reports/payroll");

/* =====================================================
   ACTIVITY LOGS
===================================================== */

export const getActivityLogs = () =>
  request("/activity-logs");

export const createActivityLog = (activityData) =>
  request("/activity-logs", {
    method: "POST",
    body: JSON.stringify(activityData),
  });

/* =====================================================
   DEFAULT EXPORT
===================================================== */

export default request;