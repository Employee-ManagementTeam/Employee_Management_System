import { apiRequest } from "./api";

export async function loginUser(email, password) {
  const data = await apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (data.success && data.user) {
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("role", data.user.role);
  }

  return data;
}

export async function registerUser(
  username,
  email,
  password,
  role
) {
  return await apiRequest("/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      role,
    }),
  });
}

export function logoutUser() {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
}

export function getCurrentUser() {
  return {
    id: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  };
}