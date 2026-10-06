import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth as firebaseAuth } from "../firebase";
import { apiRequest } from "./api";

/*
|--------------------------------------------------------------------------
| Save EMS session
|--------------------------------------------------------------------------
*/

function saveUserSession(user, fallbackEmail = "") {
  if (!user) {
    return;
  }

  const userId = user._id || user.id || user.user_id;

  const role = String(user.role || "employee")
    .trim()
    .toLowerCase();

  if (userId) {
    localStorage.setItem("userId", String(userId));
  }

  localStorage.setItem("userRole", role);

  localStorage.setItem(
    "userEmail",
    user.email || fallbackEmail || ""
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

/*
|--------------------------------------------------------------------------
| Email / Password Login
|--------------------------------------------------------------------------
*/

export async function loginUser(email, password) {
  try {
    const cleanEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!cleanEmail || !password) {
      throw new Error(
        "Please enter your email and password."
      );
    }

    /*
     * Step 1:
     * Authenticate with Firebase Email/Password.
     */
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      cleanEmail,
      password
    );

    /*
     * Step 2:
     * Get Firebase ID token.
     */
    const idToken = await credential.user.getIdToken();

    /*
     * Step 3:
     * Send token to Flask.
     */
    const data = await apiRequest(
      "/auth/firebase-login",
      {
        method: "POST",
        body: JSON.stringify({
          id_token: idToken,
        }),
      }
    );

    /*
     * Step 4:
     * Flask returns the MongoDB user and role.
     */
    if (data?.success && data?.user) {
      saveUserSession(data.user, cleanEmail);
    }

    return data;
  } catch (error) {
    console.error(
      "Firebase email login error:",
      error
    );

    /*
     * Firebase errors
     */

    if (
      error?.code === "auth/invalid-credential"
    ) {
      throw new Error(
        "Invalid email or password."
      );
    }

    if (
      error?.code === "auth/invalid-email"
    ) {
      throw new Error(
        "Please enter a valid email address."
      );
    }

    if (
      error?.code === "auth/user-not-found"
    ) {
      throw new Error(
        "No account was found with this email."
      );
    }

    if (
      error?.code === "auth/wrong-password"
    ) {
      throw new Error(
        "Invalid email or password."
      );
    }

    if (
      error?.code === "auth/too-many-requests"
    ) {
      throw new Error(
        "Too many login attempts. Please try again later."
      );
    }

    /*
     * Backend errors
     */
    throw new Error(
      error?.message ||
        "Unable to sign in. Please try again."
    );
  }
}

/*
|--------------------------------------------------------------------------
| Google Login
|--------------------------------------------------------------------------
*/

export async function loginWithGoogle() {
  try {
    /*
     * Create Google provider.
     */
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    /*
     * Step 1:
     * Open Google's login popup.
     */
    const credential = await signInWithPopup(
      firebaseAuth,
      provider
    );

    /*
     * Step 2:
     * Get Firebase ID token.
     */
    const idToken = await credential.user.getIdToken();

    /*
     * Step 3:
     * Send token to Flask.
     */
    const data = await apiRequest(
      "/auth/google",
      {
        method: "POST",
        body: JSON.stringify({
          id_token: idToken,
        }),
      }
    );

    /*
     * Step 4:
     * Save MongoDB user + role.
     */
    if (data?.success && data?.user) {
      saveUserSession(
        data.user,
        credential.user.email || ""
      );
    }

    return data;
  } catch (error) {
    console.error(
      "Google login error:",
      error
    );

    /*
     * Google/Firebase popup errors
     */

    if (
      error?.code ===
      "auth/popup-closed-by-user"
    ) {
      throw new Error(
        "Google sign-in was cancelled."
      );
    }

    if (
      error?.code ===
      "auth/popup-blocked"
    ) {
      throw new Error(
        "The Google sign-in popup was blocked by your browser."
      );
    }

    if (
      error?.code ===
      "auth/cancelled-popup-request"
    ) {
      throw new Error(
        "Google sign-in was cancelled."
      );
    }

    if (
      error?.code ===
      "auth/account-exists-with-different-credential"
    ) {
      throw new Error(
        "This email already has another Firebase sign-in method. Please use the original sign-in method."
      );
    }

    if (
      error?.code ===
      "auth/unauthorized-domain"
    ) {
      throw new Error(
        "This website domain is not authorized in Firebase."
      );
    }

    /*
     * Backend / Flask errors
     */
    throw new Error(
      error?.message ||
        "Google authentication failed."
    );
  }
}

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export async function registerUser(
  username,
  email,
  password,
  role
) {
  return await apiRequest(
    "/register",
    {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        role,
      }),
    }
  );
}

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export async function sendResetEmail(email) {
  try {
    const cleanEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!cleanEmail) {
      throw new Error(
        "Please enter your email address."
      );
    }

    await sendPasswordResetEmail(
      firebaseAuth,
      cleanEmail
    );

    return {
      success: true,
      message:
        "Password reset email sent successfully.",
    };
  } catch (error) {
    console.error(
      "Password reset error:",
      error
    );

    if (
      error?.code ===
      "auth/invalid-email"
    ) {
      throw new Error(
        "Please enter a valid email address."
      );
    }

    if (
      error?.code ===
      "auth/user-not-found"
    ) {
      throw new Error(
        "No Firebase account was found with this email."
      );
    }

    throw new Error(
      error?.message ||
        "Unable to send password reset email."
    );
  }
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export async function logoutUser() {
  try {
    await firebaseAuth.signOut();
  } catch (error) {
    console.error(
      "Firebase logout error:",
      error
    );
  }

  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("currentUser");

  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
}

/*
|--------------------------------------------------------------------------
| Get Current EMS User
|--------------------------------------------------------------------------
*/

export function getCurrentUser() {
  const currentUserText =
    localStorage.getItem("currentUser");

  let currentUser = null;

  try {
    currentUser = currentUserText
      ? JSON.parse(currentUserText)
      : null;
  } catch {
    currentUser = null;
  }

  return {
    id:
      localStorage.getItem("userId") ||
      currentUser?.id ||
      currentUser?._id ||
      null,

    username:
      localStorage.getItem("userName") ||
      currentUser?.username ||
      currentUser?.name ||
      localStorage.getItem("username") ||
      "",

    email:
      localStorage.getItem("userEmail") ||
      currentUser?.email ||
      localStorage.getItem("email") ||
      "",

    role:
      localStorage.getItem("userRole") ||
      currentUser?.role ||
      localStorage.getItem("role") ||
      "",
  };
}