import { useState } from "react";

function Leave() {
  const [leaveData, setLeaveData] = useState({
    balance: null,
    requests: [],
  });

  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Leave request:", form);

    // Backend API will be connected here later.
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Leave Management
        </h1>

        {/* Leave Balance */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <p className="text-sm text-gray-500">
            Available Leave Balance
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {leaveData.balance !== null
              ? `${leaveData.balance} Days`
              : "--"}
          </h2>
        </div>

        {/* Apply Leave */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            Apply for Leave
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type
                </label>

                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="earned">Earned Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>

                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>

                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>

                <input
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Enter reason"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Apply Leave
            </button>

          </form>
        </div>

        {/* Leave History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Leave History
          </h2>

          {leaveData.requests.length === 0 ? (
            <p className="text-gray-500">
              Leave records will appear here after connecting the backend.
            </p>
          ) : (
            <div>
              {/* API leave records will be displayed here */}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Leave;