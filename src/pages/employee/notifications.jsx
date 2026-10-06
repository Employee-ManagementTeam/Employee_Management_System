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
  const [markingRead, setMarkingRead] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      const data = Array.isArray(response)
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
      setMarkingRead(id);
      setError("");

      await markNotificationRead(id);

      setNotifications((current) =>
        current.map((notification) => {
          const notificationId =
            notification.id ||
            notification.notification_id ||
            notification._id;

          if (
            String(notificationId) === String(id)
          ) {
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
    } finally {
      setMarkingRead(null);
    }
  };

  const isRead = (notification) => {
    return (
      notification.read === true ||
      notification.is_read === true
    );
  };

  const unreadNotifications = notifications.filter(
    (notification) => !isRead(notification)
  );

  const readNotifications = notifications.filter(
    (notification) => isRead(notification)
  );

  const getNotificationIcon = (notification) => {
    const title = String(
      notification.title || ""
    ).toLowerCase();

    if (
      title.includes("leave") ||
      title.includes("holiday")
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="2"
          />
          <path d="M7 2v4M17 2v4M3 9h18" />
        </svg>
      );
    }

    if (
      title.includes("task") ||
      title.includes("assignment")
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    }

    if (
      title.includes("attendance") ||
      title.includes("check")
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    }

    if (
      title.includes("performance") ||
      title.includes("review")
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 19V5" />
          <path d="M4 17l5-5 4 3 7-8" />
          <path d="M16 7h4v4" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    );
  };

  const getNotificationKey = (notification, index) =>
    notification.id ||
    notification.notification_id ||
    notification._id ||
    `notification-${index}`;

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Employee Portal
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Stay updated with important employee, attendance,
                leave, task, and performance notifications.
              </p>
            </div>

            <button
              type="button"
              onClick={loadNotifications}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20 11a8 8 0 1 0 2 5" />
                <path d="M20 5v6h-6" />
              </svg>

              Refresh
            </button>
          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Notification action failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              SUMMARY CARDS
          ===================================================== */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* All */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Notifications
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {notifications.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    All received updates
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Unread */}
            <div className="group rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Unread
                  </p>

                  <p className="mt-3 text-3xl font-black text-orange-600">
                    {unreadNotifications.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Require your attention
                  </p>
                </div>

                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                  </svg>

                  {unreadNotifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[8px] font-bold text-white">
                      {unreadNotifications.length > 9
                        ? "9+"
                        : unreadNotifications.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Read */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Read
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {readNotifications.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Already reviewed
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              NOTIFICATION LIST
          ===================================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Your Notifications
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Review your latest system and employee updates.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {notifications.length}{" "}
                {notifications.length === 1
                  ? "Notification"
                  : "Notifications"}
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-2xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                      <path d="M10 21h4" />
                    </svg>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No notifications found
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                    You&apos;re all caught up. New notifications will
                    appear here when they are available.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map(
                    (notification, index) => {
                      const id = getNotificationKey(
                        notification,
                        index
                      );

                      const read =
                        isRead(notification);

                      const date =
                        formatDate(
                          notification.created_at ||
                            notification.createdAt ||
                            notification.date ||
                            notification.timestamp
                        );

                      return (
                        <div
                          key={id}
                          className={`rounded-2xl border p-5 transition ${
                            read
                              ? "border-slate-100 bg-white hover:border-slate-200"
                              : "border-orange-100 bg-orange-50/40 shadow-sm"
                          }`}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            {/* Notification content */}
                            <div className="flex min-w-0 gap-4">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                  read
                                    ? "bg-slate-100 text-slate-500"
                                    : "bg-orange-100 text-orange-600"
                                }`}
                              >
                                {getNotificationIcon(
                                  notification
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3
                                    className={`text-sm font-extrabold ${
                                      read
                                        ? "text-slate-800"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {notification.title ||
                                      "Notification"}
                                  </h3>

                                  {!read && (
                                    <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                                      New
                                    </span>
                                  )}
                                </div>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                  {notification.message ||
                                    "You have received a new notification."}
                                </p>

                                {date && (
                                  <p className="mt-2 text-[10px] text-slate-400">
                                    {date}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action */}
                            {!read && (
                              <button
                                type="button"
                                onClick={() =>
                                  markAsRead(id)
                                }
                                disabled={
                                  markingRead === id
                                }
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                              >
                                {markingRead ===
                                id ? (
                                  <>
                                    <svg
                                      className="h-3.5 w-3.5 animate-spin"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        className="opacity-30"
                                      />

                                      <path
                                        d="M21 12a9 9 0 0 0-9-9"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                      />
                                    </svg>

                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      viewBox="0 0 24 24"
                                      className="h-3.5 w-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                    >
                                      <path d="M5 12l4 4L19 6" />
                                    </svg>

                                    Mark as read
                                  </>
                                )}
                              </button>
                            )}

                            {read && (
                              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Read
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400">
              EmployeeMS · Notifications
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notifications;