import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";

const API_BASE_URL = "http://127.0.0.1:5000";

function Attendance() {
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const [loading, setLoading] = useState(false);

  // QR SCANNER
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        setMessage("QR code scanned successfully.");
        setError("");
      },
      () => {
        // Ignore continuous scanner errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  // CHECK IN
  const handleCheckIn = async () => {
    if (!scanResult) {
      setError("Please scan the employee QR code first.");
      setMessage("");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User ID not found. Please login again.");
      setMessage("");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/attendance/qr-check-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": userId,
          },
          body: JSON.stringify({
            employee_id: scanResult,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Check-in failed."
        );
      }

      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setCheckedIn(true);
      setCheckedOut(false);
      setCheckInTime(currentTime);

      setMessage(
        data.message || "Attendance check-in successful."
      );
    } catch (err) {
      setError(err.message || "Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // CHECK OUT
  const handleCheckOut = async () => {
    if (!scanResult) {
      setError("Please scan the employee QR code first.");
      setMessage("");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User ID not found. Please login again.");
      setMessage("");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/attendance/qr-check-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": userId,
          },
          body: JSON.stringify({
            employee_id: scanResult,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Check-out failed."
        );
      }

      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setCheckedOut(true);
      setCheckOutTime(currentTime);

      setMessage(
        data.message || "Attendance check-out successful."
      );
    } catch (err) {
      setError(err.message || "Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Employee Attendance
            </h1>

            <p className="mt-1 text-gray-500">
              Scan your employee QR code to mark attendance.
            </p>
          </div>

          {/* STATUS CARDS */}
          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Today's Status
              </p>

              <h2 className="mt-2 text-2xl font-bold text-orange-600">
                {checkedOut
                  ? "Completed"
                  : checkedIn
                  ? "Working"
                  : "Not Marked"}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Check In
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {checkInTime || "--:--"}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Check Out
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-600">
                {checkOutTime || "--:--"}
              </h2>
            </div>

          </div>

          {/* QR SCANNER */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-2 text-xl font-bold text-gray-800">
              QR Attendance Scanner
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Scan the employee QR code using your camera.
            </p>

            <div className="mb-6 flex justify-center">
              <div
                id="qr-reader"
                className="w-full max-w-md overflow-hidden rounded-xl border border-orange-200"
              ></div>
            </div>

            {/* SCAN RESULT */}
            {scanResult && (
              <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm text-gray-500">
                  Employee ID
                </p>

                <p className="mt-1 text-lg font-bold text-orange-600">
                  {scanResult}
                </p>
              </div>
            )}

            {/* BUTTONS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <button
                onClick={handleCheckIn}
                disabled={loading || checkedIn}
                className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Processing..."
                  : checkedIn
                  ? "Checked In ✓"
                  : "Check In"}
              </button>

              <button
                onClick={handleCheckOut}
                disabled={loading || !checkedIn || checkedOut}
                className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Processing..."
                  : checkedOut
                  ? "Checked Out ✓"
                  : "Check Out"}
              </button>

            </div>

            {/* SUCCESS */}
            {message && (
              <div className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-medium text-green-700">
                ✓ {message}
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-medium text-red-700">
                ⚠ {error}
              </div>
            )}

          </div>

          {/* INSTRUCTIONS */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-bold text-gray-800">
              How to Mark Attendance
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

              <div className="rounded-xl bg-orange-50 p-4">
                <div className="text-2xl">📷</div>
                <p className="mt-2 font-bold">1. Allow Camera</p>
                <p className="text-sm text-gray-500">
                  Allow camera permission.
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <div className="text-2xl">🔳</div>
                <p className="mt-2 font-bold">2. Scan QR</p>
                <p className="text-sm text-gray-500">
                  Scan your employee QR code.
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <div className="text-2xl">🟢</div>
                <p className="mt-2 font-bold">3. Check In</p>
                <p className="text-sm text-gray-500">
                  Start your work attendance.
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <div className="text-2xl">🔴</div>
                <p className="mt-2 font-bold">4. Check Out</p>
                <p className="text-sm text-gray-500">
                  End your work attendance.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Attendance;