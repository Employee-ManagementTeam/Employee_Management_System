import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getNotifications,
  markNotificationRead,
} from "../../api/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      setNotifications(
        response?.notifications ||
          response?.data ||
          (Array.isArray(response) ? response : [])
      );
    } catch (err) {
      setError(
        err.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notification) => {
    const id =
      notification.id || notification._id;

    try {
      setError("");
      setMessage("");

      await markNotificationRead(id);

      setMessage("Notification marked as read.");
      await loadNotifications();
    } catch (err) {
      setError(
        err.message ||
          "Failed to update notification."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="mt-1 text-gray-500">
            View your notifications.
          </p>

          {message && (
            <div className="mt-5 rounded-lg bg-green-50 p-4 text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-xl bg-white p-8 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-gray-500">
                No notifications found.
              </div>
            ) : (
              notifications.map((notification, index) => {
                const isRead =
                  notification.read === true ||
                  notification.is_read === true;

                return (
                  <div
                    key={
                      notification.id ||
                      notification._id ||
                      index
                    }
                    className="rounded-xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-gray-800">
                          {notification.title || "Notification"}
                        </h2>

                        <p className="mt-2 text-gray-600">
                          {notification.message || "-"}
                        </p>

                        {notification.created_at && (
                          <p className="mt-2 text-xs text-gray-400">
                            {notification.created_at}
                          </p>
                        )}
                      </div>

                      {!isRead && (
                        <button
                          onClick={() =>
                            markAsRead(notification)
                          }
                          className="rounded-lg bg-[#FFF8E7] px-4 py-2 text-sm text-[#B7792B]"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notifications;