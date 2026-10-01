import { API_BASE_URL } from "./config";

export const getEmployeeDashboard = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/employee/dashboard`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load dashboard");
  }

  return data;
};