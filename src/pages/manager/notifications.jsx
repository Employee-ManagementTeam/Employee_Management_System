import { useEffect, useMemo, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import Navbar from "../../components/navbar";

import {
  getNotifications,
  markNotificationRead,
} from "../../api/api";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [readLoading, setReadLoading] =
    useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getNotifications();

      setNotifications(
        response?.notifications ||
          response?.data ||
          (Array.isArray(response)
            ? response
            : [])
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const isRead = (notification) => {
    return (
      notification.read === true ||
      notification.is_read === true
    );
  };

  const markAsRead = async (notification) => {
    const id =
      notification.id ||
      notification._id;

    if (!id) {
      setError(
        "Notification ID not found."
      );
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

  const filteredNotifications =
    useMemo(() => {
      return notifications.filter(
        (notification) => {
          const text = `
            ${notification.title || ""}
            ${notification.message || ""}
            ${notification.created_at || ""}
          `.toLowerCase();

          const matchesSearch =
            text.includes(
              search.toLowerCase()
            );

          const read =
            isRead(notification);

          const matchesFilter =
            filter === "All" ||
            (filter === "Unread" && !read) ||
            (filter === "Read" && read);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      notifications,
      search,
      filter,
    ]);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !isRead(notification)
    ).length;

  const readCount =
    notifications.filter(
      (notification) =>
        isRead(notification)
    ).length;

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ManagerSidebar />
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
                Stay updated with employee and system notifications.
              </p>
            </div>

            <button
              onClick={loadNotifications}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-60"
            >
              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

          {/* SUMMARY */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

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

          {/* FILTERS */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-1 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
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
                  "All",
                  "Unread",
                  "Read",
                ].map((value) => (
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
                    {value}
                  </button>
                ))}

              </div>

            </div>

          </section>

          {/* NOTIFICATIONS */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

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
                You're all caught up or no results match your search.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {filteredNotifications.map(
                (notification, index) => {
                  const id =
                    notification.id ||
                    notification._id ||
                    index;

                  const read =
                    isRead(notification);

                  return (
                    <article
                      key={id}
                      className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                        read
                          ? "border-slate-200"
                          : "border-orange-200 bg-orange-50/20"
                      }`}
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                        <div className="flex items-start gap-4">

                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${
                              read
                                ? "bg-slate-100"
                                : "bg-orange-100"
                            }`}
                          >
                            🔔
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">

                              <h2 className="text-lg font-bold text-slate-900">
                                {notification.title ||
                                  "Notification"}
                              </h2>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  read
                                    ? "bg-slate-100 text-slate-500"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {read
                                  ? "Read"
                                  : "Unread"}
                              </span>

                            </div>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                              {notification.message ||
                                "-"}
                            </p>

                            {notification.created_at && (
                              <p className="mt-3 text-xs text-slate-400">
                                {formatDate(
                                  notification.created_at
                                )}
                              </p>
                            )}
                          </div>

                        </div>

                        {!read && (
                          <button
                            onClick={() =>
                              markAsRead(
                                notification
                              )
                            }
                            disabled={
                              readLoading === id
                            }
                            className="rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
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

        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-lg">
          {icon}
        </div>

      </div>
    </div>
  );
}

export default Notifications;