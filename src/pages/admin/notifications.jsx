import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

import {
  getNotifications,
  createNotification,
  markNotificationRead,
} from "../../api/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [form, setForm] = useState({
    user_id: "",
    title: "",
    message: "",
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [readLoading, setReadLoading] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getArray = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    return (
      response?.notifications ||
      response?.data ||
      []
    );
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      setNotifications(getArray(response));
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      setError("");
      setMessage("");

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
      console.error(err);

      setError(
        err.message || "Failed to create notification."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const markRead = async (notification) => {
    const id =
      notification._id ||
      notification.id;

    if (!id) {
      setError("Notification ID not found.");
      return;
    }

    try {
      setReadLoading(id);
      setError("");
      setMessage("");

      await markNotificationRead(id);

      setMessage(
        "Notification marked as read."
      );

      await loadNotifications();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to update notification."
      );
    } finally {
      setReadLoading(null);
    }
  };

  const isRead = (notification) =>
    notification.read === true ||
    notification.is_read === true;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const text = `
        ${notification.title || ""}
        ${notification.message || ""}
        ${notification.user_id || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const read = isRead(notification);

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !read) ||
        (filter === "read" && read);

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const unreadCount = notifications.filter(
    (notification) => !isRead(notification)
  ).length;

  const readCount = notifications.filter(
    (notification) => isRead(notification)
  ).length;

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">

          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
                Communication Center
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Notifications
              </h1>

              <p className="mt-2 text-slate-500">
                Send announcements and manage system notifications.
              </p>
            </div>

            <button
              onClick={loadNotifications}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

            <SummaryCard
              title="Total Notifications"
              value={notifications.length}
              icon="🔔"
            />

            <SummaryCard
              title="Unread"
              value={unreadCount}
              icon="📬"
            />

            <SummaryCard
              title="Read"
              value={readCount}
              icon="✓"
            />

          </div>

          {/* ALERTS */}
          {message && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* CREATE NOTIFICATION */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                New Message
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Create Notification
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Send a message directly to a user.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    User ID
                  </label>

                  <input
                    name="user_id"
                    value={form.user_id}
                    onChange={handleChange}
                    placeholder="Enter user ID"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Notification Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter notification title"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write notification message..."
                    rows={4}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitLoading
                    ? "Sending..."
                    : "Send Notification"}
                </button>
              </div>
            </form>
          </section>

          {/* FILTERS */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-1 items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg">
                  🔎
                </div>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search notifications..."
                  className="w-full max-w-md rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

              </div>

              <div className="flex flex-wrap gap-2">

                {[
                  ["all", "All"],
                  ["unread", "Unread"],
                  ["read", "Read"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() =>
                      setFilter(value)
                    }
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      filter === value
                        ? "bg-orange-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}

              </div>

            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section>

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Notification Center
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1
                    ? "s"
                    : ""}{" "}
                  displayed
                </p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
                <p className="text-sm text-slate-500">
                  Loading notifications...
                </p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                  🔔
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No notifications found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filter.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">

                {filteredNotifications.map(
                  (notification, index) => {
                    const id =
                      notification._id ||
                      notification.id ||
                      index;

                    const read =
                      isRead(notification);

                    return (
                      <article
                        key={id}
                        className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                          read
                            ? "border-slate-200"
                            : "border-orange-200 bg-orange-50/20"
                        }`}
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex min-w-0 items-start gap-4">

                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                                read
                                  ? "bg-slate-100"
                                  : "bg-orange-100"
                              }`}
                            >
                              🔔
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="truncate text-lg font-bold text-slate-900">
                                  {notification.title ||
                                    "Notification"}
                                </h3>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    read
                                      ? "bg-slate-100 text-slate-500"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {read ? "Read" : "Unread"}
                                </span>

                              </div>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {notification.message || "-"}
                              </p>
                            </div>

                          </div>

                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

                            <span>
                              <span className="font-semibold text-slate-700">
                                User:
                              </span>{" "}
                              {notification.user_id || "-"}
                            </span>

                            {notification.created_at && (
                              <span>
                                {formatDate(
                                  notification.created_at
                                )}
                              </span>
                            )}

                          </div>

                          {!read && (
                            <button
                              onClick={() =>
                                markRead(notification)
                              }
                              disabled={
                                readLoading === id
                              }
                              className="mt-4 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {readLoading === id
                                ? "Updating..."
                                : "Mark as Read"}
                            </button>
                          )}
                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl">
          {icon}
        </div>

      </div>
    </div>
  );
}

export default Notifications;