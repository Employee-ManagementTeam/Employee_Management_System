import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";
import { apiRequest } from "./api";

export async function loginUser(email, password) {
  try {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Authenticate email + password with Firebase
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      cleanEmail,
      password
    );

    // 2. Get Firebase ID token
    const idToken = await credential.user.getIdToken();

    // 3. Send Firebase token to Flask
    const data = await apiRequest("/auth/firebase-login", {
      method: "POST",
      body: JSON.stringify({
        id_token: idToken,
      }),
    });

    // 4. Keep the session data used by the application
    if (data?.success && data?.user) {
      const user = data.user;

      const userId = user._id || user.id || user.user_id;

      if (userId) {
        localStorage.setItem("userId", String(userId));
      }

      localStorage.setItem(
        "userRole",
        String(user.role || "").trim().toLowerCase()
      );

      localStorage.setItem(
        "userEmail",
        user.email || cleanEmail
      );

      localStorage.setItem(
        "userName",
        user.username || user.name || ""
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );
    }

    return data;
  } catch (error) {
    console.error("Firebase login error:", error);

    if (error?.code === "auth/invalid-credential") {
      throw new Error("Invalid email or password.");
    }

    if (error?.code === "auth/invalid-email") {
      throw new Error("Please enter a valid email address.");
    }

    if (error?.code === "auth/user-not-found") {
      throw new Error("No account was found with this email.");
    }

    if (error?.code === "auth/wrong-password") {
      throw new Error("Invalid email or password.");
    }

    if (error?.code === "auth/too-many-requests") {
      throw new Error(
        "Too many login attempts. Please try again later."
      );
    }

    throw new Error(
      error?.message || "Unable to sign in. Please try again."
    );
  }
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
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("currentUser");

  // Remove old session keys too
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
}

export function getCurrentUser() {
  return {
    id: localStorage.getItem("userId"),
    username:
      localStorage.getItem("userName") ||
      localStorage.getItem("username"),
    email:
      localStorage.getItem("userEmail") ||
      localStorage.getItem("email"),
    role:
      localStorage.getItem("userRole") ||
      localStorage.getItem("role"),
  };
}