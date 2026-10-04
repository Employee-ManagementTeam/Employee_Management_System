import { apiRequest } from "./api";

// Get all employees
export async function getEmployees() {
  return await apiRequest("/api/employees", {
    method: "GET",
  });
}

// Get single employee
export async function getEmployee(employeeId) {
  return await apiRequest(`/api/employees/${employeeId}`, {
    method: "GET",
  });
}

// Create employee
export async function createEmployee(employeeData) {
  return await apiRequest("/api/employees", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });
}

// Update employee
export async function updateEmployee(employeeId, employeeData) {
  return await apiRequest(`/api/employees/${employeeId}`, {
    method: "PUT",
    body: JSON.stringify(employeeData),
  });
}

// Delete employee
export async function deleteEmployee(employeeId) {
  return await apiRequest(`/api/employees/${employeeId}`, {
    method: "DELETE",
  });
}