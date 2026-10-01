import { useState } from "react";

function Performance() {
  const [performance, setPerformance] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Performance
        </h1>

        {/* Performance Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Performance Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Overall Score
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-2">
                {performance?.score !== undefined
                  ? `${performance.score}%`
                  : "--"}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Rating
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-2">
                {performance?.rating || "--"}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Last Evaluation
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-2">
                {performance?.lastEvaluation || "--"}
              </p>
            </div>

          </div>

        </div>

        {/* Feedback */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Manager Feedback
          </h2>

          <p className="text-gray-500">
            Performance feedback will be loaded from the backend.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Performance;