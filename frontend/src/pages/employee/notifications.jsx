import { useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Notifications
        </h1>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No notifications available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border rounded-xl p-4"
                >
                  <h3 className="font-semibold text-gray-800">
                    {notification.title}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {notification.date}
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

export default Notifications;