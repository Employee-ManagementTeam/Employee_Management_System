const API_BASE_URL = "http://127.0.0.1:5000";

export async function apiRequest(endpoint, options = {}) {
  const userId = localStorage.getItem("userId");

  const headers = {
    ...(options.headers || {}),
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  // Don't set Content-Type manually for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

export { API_BASE_URL };