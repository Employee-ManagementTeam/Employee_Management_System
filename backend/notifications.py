from flask import Blueprint, request, jsonify
from database import get_connection


notifications = Blueprint("notifications", __name__)


# ============================================================
# GET ALL NOTIFICATIONS
# ============================================================

@notifications.route(
    "/api/notifications",
    methods=["GET"]
)
def get_notifications():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        user_id = request.args.get("user_id")

        if user_id:

            cursor.execute("""
                SELECT *
                FROM notifications
                WHERE user_id = ?
                ORDER BY id DESC
            """, (user_id,))

        else:

            cursor.execute("""
                SELECT *
                FROM notifications
                ORDER BY id DESC
            """)

        records = cursor.fetchall()

        notification_list = []

        for record in records:

            notification_list.append({
                "id": record["id"],
                "user_id": record["user_id"],
                "title": record["title"],
                "message": record["message"],
                "notification_type":
                    record["notification_type"],
                "is_read": bool(record["is_read"]),
                "created_at":
                    record["created_at"]
            })

        return jsonify({
            "success": True,
            "notifications":
                notification_list
        }), 200

    finally:

        connection.close()


# ============================================================
# GET SINGLE NOTIFICATION
# ============================================================

@notifications.route(
    "/api/notifications/<int:notification_id>",
    methods=["GET"]
)
def get_notification(notification_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT *
            FROM notifications
            WHERE id = ?
        """, (notification_id,))

        record = cursor.fetchone()

        if not record:

            return jsonify({
                "success": False,
                "message":
                    "Notification not found"
            }), 404

        notification = {
            "id": record["id"],
            "user_id": record["user_id"],
            "title": record["title"],
            "message": record["message"],
            "notification_type":
                record["notification_type"],
            "is_read": bool(record["is_read"]),
            "created_at":
                record["created_at"]
        }

        return jsonify({
            "success": True,
            "notification":
                notification
        }), 200

    finally:

        connection.close()


# ============================================================
# CREATE NOTIFICATION
# ============================================================

@notifications.route(
    "/api/notifications",
    methods=["POST"]
)
def create_notification():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    user_id = data.get("user_id")
    title = data.get("title")
    message = data.get("message")
    notification_type = data.get(
        "notification_type",
        "General"
    )

    if not user_id:

        return jsonify({
            "success": False,
            "message": "User ID is required"
        }), 400

    if not title:

        return jsonify({
            "success": False,
            "message": "Title is required"
        }), 400

    if not message:

        return jsonify({
            "success": False,
            "message": "Message is required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # Check user exists
        cursor.execute("""
            SELECT id
            FROM users
            WHERE id = ?
        """, (user_id,))

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        cursor.execute("""
            INSERT INTO notifications (
                user_id,
                title,
                message,
                notification_type
            )
            VALUES (?, ?, ?, ?)
        """, (
            user_id,
            title,
            message,
            notification_type
        ))

        connection.commit()

        notification_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message":
                "Notification created successfully",
            "notification_id":
                notification_id
        }), 201

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()


# ============================================================
# MARK NOTIFICATION AS READ
# ============================================================

@notifications.route(
    "/api/notifications/<int:notification_id>/read",
    methods=["PUT"]
)
def mark_notification_read(notification_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT id
            FROM notifications
            WHERE id = ?
        """, (notification_id,))

        notification = cursor.fetchone()

        if not notification:

            return jsonify({
                "success": False,
                "message":
                    "Notification not found"
            }), 404

        cursor.execute("""
            UPDATE notifications
            SET is_read = 1
            WHERE id = ?
        """, (notification_id,))

        connection.commit()

        return jsonify({
            "success": True,
            "message":
                "Notification marked as read"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()


# ============================================================
# MARK NOTIFICATION AS UNREAD
# ============================================================

@notifications.route(
    "/api/notifications/<int:notification_id>/unread",
    methods=["PUT"]
)
def mark_notification_unread(notification_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT id
            FROM notifications
            WHERE id = ?
        """, (notification_id,))

        notification = cursor.fetchone()

        if not notification:

            return jsonify({
                "success": False,
                "message":
                    "Notification not found"
            }), 404

        cursor.execute("""
            UPDATE notifications
            SET is_read = 0
            WHERE id = ?
        """, (notification_id,))

        connection.commit()

        return jsonify({
            "success": True,
            "message":
                "Notification marked as unread"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()


# ============================================================
# DELETE NOTIFICATION
# ============================================================

@notifications.route(
    "/api/notifications/<int:notification_id>",
    methods=["DELETE"]
)
def delete_notification(notification_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT id
            FROM notifications
            WHERE id = ?
        """, (notification_id,))

        notification = cursor.fetchone()

        if not notification:

            return jsonify({
                "success": False,
                "message":
                    "Notification not found"
            }), 404

        cursor.execute("""
            DELETE FROM notifications
            WHERE id = ?
        """, (notification_id,))

        connection.commit()

        return jsonify({
            "success": True,
            "message":
                "Notification deleted successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()