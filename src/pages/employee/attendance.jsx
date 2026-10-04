import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function Attendance() {
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState("");

  const API_BASE_URL = "http://127.0.0.1:5000";

  // Start QR Scanner
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

  // Check In
  const handleCheckIn = async () => {
    if (!scanResult) {
      setError("Please scan a QR code first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/attendance/qr-check-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: scanResult,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Check-in failed.");
      }

      setMessage(data.message || "Attendance checked in successfully.");
      setScanMode("check-in");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Check Out
  const handleCheckOut = async () => {
    if (!scanResult) {
      setError("Please scan a QR code first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/attendance/qr-check-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: scanResult,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Check-out failed.");
      }

      setMessage(data.message || "Attendance checked out successfully.");
      setScanMode("check-out");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Attendance
          </h1>

          <p className="text-gray-500 mt-1">
            Scan the QR code to mark your attendance.
          </p>
        </div>

        {/* Attendance Card */}
        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            QR Attendance Scanner
          </h2>

          {/* QR Scanner */}
          <div className="flex justify-center mb-6">
            <div
              id="qr-reader"
              className="w-full max-w-md"
            ></div>
          </div>

          {/* Scanned Result */}
          {scanResult && (
            <div className="bg-gray-50 border rounded-lg p-4 mb-5">
              <p className="text-sm text-gray-500 mb-1">
                Scanned QR Data
              </p>

              <p className="text-gray-800 font-medium break-all">
                {scanResult}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={handleCheckIn}
              disabled={loading || !scanResult}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {loading && scanMode !== "check-out"
                ? "Checking In..."
                : "Check In"}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={loading || !scanResult}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {loading && scanMode === "check-out"
                ? "Checking Out..."
                : "Check Out"}
            </button>

          </div>

          {/* Success Message */}
          {message && (
            <div className="mt-5 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-5 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            How to use
          </h2>

          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Allow camera access when requested.</li>
            <li>Point the camera at the employee QR code.</li>
            <li>Wait until the QR code is detected.</li>
            <li>Click <b>Check In</b> when starting work.</li>
            <li>Click <b>Check Out</b> when leaving work.</li>
          </ol>

        </div>

      </div>
    </div>
  );
}

export default Attendance;