import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";

import { getEmployees } from "../../api/api";

const API_BASE_URL = "http://127.0.0.1:5000";

function ClockIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3z" />
      <path d="M18 18h3v3h-3z" />
      <path d="M14 19h2" />
    </svg>
  );
}

function Attendance() {
  const [employee, setEmployee] = useState(null);

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const [scanResult, setScanResult] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // GET ARRAY FROM BACKEND RESPONSE
  // =========================================================

  const getArray = (response, keys = []) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    for (const key of keys) {
      if (Array.isArray(response?.[key])) {
        return response[key];
      }
    }

    return [];
  };

  // =========================================================
  // GET CURRENT EMPLOYEE
  // =========================================================

  const loadEmployee = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User ID not found. Please login again.");
        return;
      }

      const response = await getEmployees();

      const employees = getArray(response, ["employees"]);

      const currentEmployee = employees.find(
        (item) =>
          String(item.user_id || "") ===
          String(userId)
      );

      if (!currentEmployee) {
        setError(
          "Employee profile could not be found for this account."
        );
        return;
      }

      setEmployee(currentEmployee);

      await loadTodayAttendance(
        currentEmployee._id ||
          currentEmployee.id ||
          currentEmployee.employee_id
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load employee attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD TODAY ATTENDANCE
  // =========================================================

  const loadTodayAttendance = async (employeeId) => {
    const userId = localStorage.getItem("userId");

    if (!employeeId || !userId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/attendance/employee/${employeeId}`,
        {
          method: "GET",
          headers: {
            "X-User-ID": userId,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      const records = Array.isArray(data)
        ? data
        : data?.attendance ||
          data?.records ||
          data?.data ||
          [];

      if (!records.length) {
        setCheckedIn(false);
        setCheckedOut(false);
        setCheckInTime("");
        setCheckOutTime("");
        return;
      }

      // Use the latest record
      const latest =
        records[records.length - 1];

      const checkIn =
        latest.check_in ||
        latest.checkin_time ||
        latest.check_in_time ||
        "";

      const checkOut =
        latest.check_out ||
        latest.checkout_time ||
        latest.check_out_time ||
        "";

      setCheckInTime(checkIn);
      setCheckOutTime(checkOut);

      if (checkIn) {
        setCheckedIn(true);
      }

      if (checkOut) {
        setCheckedOut(true);
      }
    } catch (err) {
      console.error(
        "Attendance load error:",
        err
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadEmployee();
  }, []);

  // =========================================================
  // QR SCANNER
  // =========================================================

  useEffect(() => {
  if (loading) {
    return;
  }

  const qrElement = document.getElementById("qr-reader");

  if (!qrElement) {
    return;
  }

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
}, [loading]);
  // =========================================================
  // GET EMPLOYEE ID
  // =========================================================

  const getEmployeeId = () => {
    if (!employee) {
      return "";
    }

    return (
      employee._id ||
      employee.id ||
      employee.employee_id ||
      ""
    );
  };

  // =========================================================
  // TAP IN
  // =========================================================

  const handleTapIn = async () => {
    const userId =
      localStorage.getItem("userId");

    const employeeId = getEmployeeId();

    if (!userId) {
      setError(
        "User ID not found. Please login again."
      );
      return;
    }

    if (!employeeId) {
      setError(
        "Employee ID not found."
      );
      return;
    }

    setActionLoading(true);
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
            employee_id: employeeId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Tap In failed."
        );
      }

      const currentTime =
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      setCheckedIn(true);
      setCheckedOut(false);

      setCheckInTime(currentTime);

      setMessage(
        data.message ||
          "You have successfully tapped in."
      );

      await loadTodayAttendance(
        employeeId
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to complete Tap In."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // TAP OUT
  // =========================================================

  const handleTapOut = async () => {
    const userId =
      localStorage.getItem("userId");

    const employeeId = getEmployeeId();

    if (!userId) {
      setError(
        "User ID not found. Please login again."
      );
      return;
    }

    if (!employeeId) {
      setError(
        "Employee ID not found."
      );
      return;
    }

    setActionLoading(true);
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
            employee_id: employeeId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Tap Out failed."
        );
      }

      const currentTime =
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      setCheckedOut(true);

      setCheckOutTime(
        currentTime
      );

      setMessage(
        data.message ||
          "You have successfully tapped out."
      );

      await loadTodayAttendance(
        employeeId
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to complete Tap Out."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // QR CHECK IN
  // =========================================================

  const handleQrCheckIn = async () => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) {
      setError(
        "User ID not found. Please login again."
      );
      return;
    }

    if (!scanResult) {
      setError(
        "Please scan the employee QR code first."
      );
      return;
    }

    setActionLoading(true);
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
          data.message ||
            data.error ||
            "QR check-in failed."
        );
      }

      const currentTime =
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      setCheckedIn(true);
      setCheckedOut(false);
      setCheckInTime(currentTime);

      setMessage(
        data.message ||
          "QR check-in successful."
      );

      setScanResult("");

      await loadTodayAttendance(
        getEmployeeId()
      );
    } catch (err) {
      setError(
        err.message ||
          "QR check-in failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // QR CHECK OUT
  // =========================================================

  const handleQrCheckOut = async () => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) {
      setError(
        "User ID not found. Please login again."
      );
      return;
    }

    if (!scanResult) {
      setError(
        "Please scan the employee QR code first."
      );
      return;
    }

    setActionLoading(true);
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
          data.message ||
            data.error ||
            "QR check-out failed."
        );
      }

      const currentTime =
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      setCheckedOut(true);
      setCheckOutTime(currentTime);

      setMessage(
        data.message ||
          "QR check-out successful."
      );

      setScanResult("");

      await loadTodayAttendance(
        getEmployeeId()
      );
    } catch (err) {
      setError(
        err.message ||
          "QR check-out failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getStatus = () => {
    if (checkedOut) {
      return "Completed";
    }

    if (checkedIn) {
      return "Working";
    }

    return "Not Marked";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <EmployeeSidebar />

      <Navbar />

      <main className="ml-64 pt-20">

        <div className="p-6 lg:p-8">

          <div className="mx-auto max-w-7xl">


            {/* HEADER */}

            <div className="mb-8">

              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                People Portal
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Attendance
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Tap in when you start work and tap out when
                your working day is complete.
              </p>

            </div>


            {/* MESSAGES */}

            {message && (

              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                {message}
              </div>

            )}


            {error && (

              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {error}
              </div>

            )}


            {loading ? (

              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading attendance...
                </p>

              </div>

            ) : (

              <>

                {/* =====================================================
                    TOP ATTENDANCE CARD
                ===================================================== */}

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                    {/* EMPLOYEE */}

                    <div className="flex items-center gap-4">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-700">

                        {(
                          `${employee?.first_name || ""} ${
                            employee?.last_name || ""
                          }`.trim() ||
                          employee?.username ||
                          "E"
                        )
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <div>

                        <p className="text-sm text-slate-400">
                          Today's attendance
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-slate-900">

                          {employee?.first_name || ""}
                          {" "}
                          {employee?.last_name || ""}

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                          {employee?.designation ||
                            "Employee"}

                          {employee?.department
                            ? ` • ${employee.department}`
                            : ""}

                        </p>

                      </div>

                    </div>


                    {/* STATUS */}

                    <div className="rounded-2xl bg-slate-50 px-6 py-5">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Current Status
                      </p>

                      <div className="mt-2 flex items-center gap-3">

                        <span
                          className={`h-3 w-3 rounded-full ${
                            checkedOut
                              ? "bg-blue-500"
                              : checkedIn
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                        />

                        <span className="text-lg font-bold text-slate-900">
                          {getStatus()}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* TIMES */}

                  <div className="mt-8 grid gap-4 md:grid-cols-2">

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <ClockIcon />
                        </div>

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                            Tap In
                          </p>

                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            {checkInTime || "--:--"}
                          </p>

                        </div>

                      </div>

                    </div>


                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                          <LogOutIcon />
                        </div>

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            Tap Out
                          </p>

                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            {checkOutTime || "--:--"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* TAP BUTTONS */}

                  <div className="mt-8 grid gap-4 md:grid-cols-2">

                    <button
                      type="button"
                      onClick={handleTapIn}
                      disabled={
                        actionLoading ||
                        checkedIn
                      }
                      className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-orange-600 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <CheckIcon />

                      {actionLoading
                        ? "Processing..."
                        : checkedIn
                        ? "Already Tapped In"
                        : "Tap In"}

                    </button>


                    <button
                      type="button"
                      onClick={handleTapOut}
                      disabled={
                        actionLoading ||
                        !checkedIn ||
                        checkedOut
                      }
                      className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <LogOutIcon />

                      {checkedOut
                        ? "Already Tapped Out"
                        : "Tap Out"}

                    </button>

                  </div>

                </div>


                {/* =====================================================
                    QR SECTION
                ===================================================== */}

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.75fr]">

                  {/* SCANNER */}

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="mb-6 flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <QrIcon />
                      </div>

                      <div>

                        <h2 className="text-xl font-bold text-slate-900">
                          QR Attendance
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Use your employee QR code as an alternative
                          attendance method.
                        </p>

                      </div>

                    </div>


                    <div
                      id="qr-reader"
                      className="overflow-hidden rounded-2xl border border-slate-200"
                    />


                    {scanResult && (

                      <div className="mt-5 rounded-xl bg-slate-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Scanned Employee ID
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                          {scanResult}
                        </p>

                      </div>

                    )}


                    <div className="mt-5 grid gap-3 sm:grid-cols-2">

                      <button
                        type="button"
                        onClick={handleQrCheckIn}
                        disabled={
                          actionLoading ||
                          !scanResult
                        }
                        className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        QR Check In
                      </button>


                      <button
                        type="button"
                        onClick={handleQrCheckOut}
                        disabled={
                          actionLoading ||
                          !scanResult
                        }
                        className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        QR Check Out
                      </button>

                    </div>

                  </div>


                  {/* INFORMATION */}

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-orange-600">
                      How it works
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      Simple attendance
                    </h2>


                    <div className="mt-7 space-y-5">

                      <div className="flex gap-4">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                          1
                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-900">
                            Start your day
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            Press Tap In when you begin your working day.
                          </p>

                        </div>

                      </div>


                      <div className="flex gap-4">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                          2
                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-900">
                            Continue working
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            Your attendance status remains active while
                            you are working.
                          </p>

                        </div>

                      </div>


                      <div className="flex gap-4">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                          3
                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-900">
                            Finish your day
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            Press Tap Out when your working day is complete.
                          </p>

                        </div>

                      </div>

                    </div>


                    <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-5">

                      <p className="text-sm font-semibold text-orange-800">
                        Attendance security
                      </p>

                      <p className="mt-1 text-sm leading-6 text-orange-700">
                        Attendance actions are tied to your logged-in
                        employee account.
                      </p>

                    </div>

                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Attendance;