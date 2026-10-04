import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import {
  getNotifications,
  markNotificationRead,
} from "../../api/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await getNotifications();

      const data =
        Array.isArray(response)
          ? response
          : response.notifications ||
            response.data ||
            [];

      setNotifications(data);
    } catch (err) {
      setError(
        err.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);

      setNotifications((current) =>
        current.map((notification) => {
          const notificationId =
            notification.id ||
            notification.notification_id ||
            notification._id;

          if (String(notificationId) === String(id)) {
            return {
              ...notification,
              read: true,
              is_read: true,
            };
          }

          return notification;
        })
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to mark notification as read."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="mt-1 text-gray-500">
            Your notifications.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No notifications found.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {notifications.map((notification) => {
                const id =
                  notification.id ||
                  notification.notification_id ||
                  notification._id;

                const read =
                  notification.read ||
                  notification.is_read;

                return (
                  <div
                    key={id}
                    className={`rounded-2xl bg-white p-6 shadow-sm ${
                      !read
                        ? "border-l-4 border-orange-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-5">

                      <div>
                        <h2 className="font-bold text-gray-800">
                          {notification.title}
                        </h2>

                        <p className="mt-2 text-gray-600">
                          {notification.message}
                        </p>
                      </div>

                      {!read && (
                        <button
                          onClick={() => markAsRead(id)}
                          className="whitespace-nowrap rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                          Mark as read
                        </button>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Notifications;