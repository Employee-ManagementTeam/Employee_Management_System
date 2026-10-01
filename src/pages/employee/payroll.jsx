import { useState } from "react";

function Payroll() {
  const [payroll, setPayroll] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Payroll
        </h1>

        {/* Salary Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Basic Salary
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              {payroll?.basicSalary
                ? `₹${payroll.basicSalary}`
                : "--"}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Allowances
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              {payroll?.allowances
                ? `₹${payroll.allowances}`
                : "--"}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Net Salary
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              {payroll?.netSalary
                ? `₹${payroll.netSalary}`
                : "--"}
            </h2>
          </div>

        </div>

        {/* Payroll History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Salary History
          </h2>

          <p className="text-gray-500">
            Payroll records will be loaded from the backend.
          </p>

        </div>

      </div>
    </div>
  );
}

export default Payroll;