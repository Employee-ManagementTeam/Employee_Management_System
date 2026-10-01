import { useState } from "react";

function Attendance() {
  const [attendance, setAttendance] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Attendance
        </h1>

        {/* Today's Attendance */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Today's Attendance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-1">
                {attendance?.status || "--"}
              </p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Check In
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-1">
                {attendance?.checkIn || "--"}
              </p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Check Out
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-1">
                {attendance?.checkOut || "--"}
              </p>
            </div>

          </div>

        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Attendance History
          </h2>

          <p className="text-gray-500">
            Attendance records will be loaded from the backend.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Attendance;