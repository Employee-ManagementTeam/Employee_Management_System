import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getNotifications,
  createNotification,
  markNotificationRead,
} from "../../api/api";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [form, setForm] = useState({
    user_id: "",
    title: "",
    message: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      const response =
        await getNotifications();

      const data = Array.isArray(response)
        ? response
        : response?.notifications ||
          response?.data ||
          [];

      setNotifications(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createNotification(form);

      setMessage(
        "Notification created successfully."
      );

      setForm({
        user_id: "",
        title: "",
        message: "",
      });

      await loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);

      setMessage(
        "Notification marked as read."
      );

      await loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="mb-8 text-gray-500">
            Send and manage notifications
          </p>

          {message && (
            <div className="mb-4 rounded-xl bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-bold">
              Create Notification
            </h2>

            <div className="grid gap-4">

              <input
                value={form.user_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    user_id: e.target.value,
                  })
                }
                placeholder="User ID"
                className="rounded-xl border px-4 py-3"
                required
              />

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Notification title"
                className="rounded-xl border px-4 py-3"
                required
              />

              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                placeholder="Notification message"
                className="rounded-xl border px-4 py-3"
                required
              />

            </div>

            <button className="mt-5 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
              Send Notification
            </button>
          </form>

          <div className="grid gap-5 md:grid-cols-2">

            {notifications.map(
              (notification, index) => {

                const id =
                  notification._id ||
                  notification.id ||
                  index;

                return (
                  <div
                    key={id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">

                      <div>
                        <h3 className="text-lg font-bold">
                          {notification.title}
                        </h3>

                        <p className="mt-2 text-gray-600">
                          {notification.message}
                        </p>
                      </div>

                      <span className="text-2xl">
                        🔔
                      </span>

                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                      User:{" "}
                      {notification.user_id ||
                        "-"}
                    </p>

                    <button
                      onClick={() =>
                        markRead(id)
                      }
                      className="mt-4 rounded-lg bg-orange-100 px-4 py-2 text-orange-700"
                    >
                      Mark as Read
                    </button>
                  </div>
                );
              }
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Notifications;