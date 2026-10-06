import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8Qsqworj-uWjp1YxVuj41X6PYOXOJao0",
  authDomain: "employee-management-syst-43345.firebaseapp.com",
  projectId: "employee-management-syst-43345",
  storageBucket: "employee-management-syst-43345.firebasestorage.app",
  messagingSenderId: "704425078204",
  appId: "1:704425078204:web:3e47d61814b117b9b64fb9",
  measurementId: "G-1SR3DY9S78"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;