import { apiRequest } from "./api";

function getArray(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.employees)) {
    return response.employees;
  }

  if (Array.isArray(response?.leaves)) {
    return response.leaves;
  }

  if (Array.isArray(response?.tasks)) {
    return response.tasks;
  }

  if (Array.isArray(response?.notifications)) {
    return response.notifications;
  }

  return [];
}

export async function getDashboardData() {
  const results = await Promise.allSettled([
    apiRequest("/api/employees"),
    apiRequest("/api/departments"),
    apiRequest("/api/attendance"),
    apiRequest("/api/leaves"),
    apiRequest("/api/tasks"),
    apiRequest("/api/notifications"),
  ]);

  return {
    employees: getArray(
      results[0].status === "fulfilled"
        ? results[0].value
        : []
    ),

    departments: getArray(
      results[1].status === "fulfilled"
        ? results[1].value
        : []
    ),

    attendance: getArray(
      results[2].status === "fulfilled"
        ? results[2].value
        : []
    ),

    leaves: getArray(
      results[3].status === "fulfilled"
        ? results[3].value
        : []
    ),

    tasks: getArray(
      results[4].status === "fulfilled"
        ? results[4].value
        : []
    ),

    notifications: getArray(
      results[5].status === "fulfilled"
        ? results[5].value
        : []
    ),
  };
}