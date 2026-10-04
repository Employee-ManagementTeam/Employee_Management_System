import { apiRequest } from "./api";

// Get departments
export async function getDepartments() {
  return await apiRequest("/api/departments", {
    method: "GET",
  });
}

// Create department
export async function createDepartment(departmentData) {
  return await apiRequest("/api/departments", {
    method: "POST",
    body: JSON.stringify(departmentData),
  });
}

// Update department
export async function updateDepartment(departmentId, departmentData) {
  return await apiRequest(`/api/departments/${departmentId}`, {
    method: "PUT",
    body: JSON.stringify(departmentData),
  });
}

// Delete department
export async function deleteDepartment(departmentId) {
  return await apiRequest(`/api/departments/${departmentId}`, {
    method: "DELETE",
  });
}