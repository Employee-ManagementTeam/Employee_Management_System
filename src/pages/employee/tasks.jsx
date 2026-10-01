import { useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Tasks
        </h1>

        {/* Task Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Total Tasks
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {tasks.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {tasks.filter((task) => task.status === "completed").length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {tasks.filter((task) => task.status === "pending").length}
            </h2>
          </div>

        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Assigned Tasks
          </h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">
              Tasks will appear here when they are assigned to you.
            </p>
          ) : (
            <div className="space-y-4">

              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-xl p-4"
                >
                  <h3 className="font-semibold text-gray-800">
                    {task.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {task.description}
                  </p>

                  <p className="text-sm mt-2">
                    Status: {task.status}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Tasks;