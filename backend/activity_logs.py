from flask import Blueprint, request, jsonify
from database import get_connection


activity_logs = Blueprint("activity_logs", __name__)


@activity_logs.route("/api/activity-logs", methods=["POST"])
def create_activity_log():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    user_id = data.get("user_id")
    action = data.get("action")
    description = data.get("description")

    if not user_id:
        return jsonify({
            "success": False,
            "message": "User ID is required"
        }), 400

    if not action:
        return jsonify({
            "success": False,
            "message": "Action is required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:

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
            INSERT INTO activity_logs (
                user_id,
                action,
                description
            )
            VALUES (?, ?, ?)
        """, (
            user_id,
            action,
            description
        ))

        connection.commit()

        activity_log_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Activity log created successfully",
            "activity_log_id": activity_log_id
        }), 201

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()


@activity_logs.route("/api/activity-logs", methods=["GET"])
def get_activity_logs():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        user_id = request.args.get("user_id")

        if user_id:

            cursor.execute("""
                SELECT
                    activity_logs.id,
                    activity_logs.user_id,
                    users.username,
                    users.email,
                    users.role,
                    activity_logs.action,
                    activity_logs.description,
                    activity_logs.created_at
                FROM activity_logs
                INNER JOIN users
                    ON activity_logs.user_id = users.id
                WHERE activity_logs.user_id = ?
                ORDER BY activity_logs.id DESC
            """, (user_id,))

        else:

            cursor.execute("""
                SELECT
                    activity_logs.id,
                    activity_logs.user_id,
                    users.username,
                    users.email,
                    users.role,
                    activity_logs.action,
                    activity_logs.description,
                    activity_logs.created_at
                FROM activity_logs
                INNER JOIN users
                    ON activity_logs.user_id = users.id
                ORDER BY activity_logs.id DESC
            """)

        records = cursor.fetchall()

        activity_list = []

        for record in records:

            activity_list.append({
                "id": record["id"],
                "user_id": record["user_id"],
                "username": record["username"],
                "email": record["email"],
                "role": record["role"],
                "action": record["action"],
                "description": record["description"],
                "created_at": record["created_at"]
            })

        return jsonify({
            "success": True,
            "activity_logs": activity_list
        }), 200

    finally:

        connection.close()


@activity_logs.route(
    "/api/activity-logs/user/<int:user_id>",
    methods=["GET"]
)
def get_user_activity_logs(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                activity_logs.id,
                activity_logs.user_id,
                users.username,
                users.email,
                users.role,
                activity_logs.action,
                activity_logs.description,
                activity_logs.created_at
            FROM activity_logs
            INNER JOIN users
                ON activity_logs.user_id = users.id
            WHERE activity_logs.user_id = ?
            ORDER BY activity_logs.id DESC
        """, (user_id,))

        records = cursor.fetchall()

        activity_list = []

        for record in records:

            activity_list.append({
                "id": record["id"],
                "user_id": record["user_id"],
                "username": record["username"],
                "email": record["email"],
                "role": record["role"],
                "action": record["action"],
                "description": record["description"],
                "created_at": record["created_at"]
            })

        return jsonify({
            "success": True,
            "user_id": user_id,
            "activity_logs": activity_list
        }), 200

    finally:

        connection.close()


@activity_logs.route(
    "/api/activity-logs/<int:activity_log_id>",
    methods=["GET"]
)
def get_activity_log(activity_log_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                activity_logs.id,
                activity_logs.user_id,
                users.username,
                users.email,
                users.role,
                activity_logs.action,
                activity_logs.description,
                activity_logs.created_at
            FROM activity_logs
            INNER JOIN users
                ON activity_logs.user_id = users.id
            WHERE activity_logs.id = ?
        """, (activity_log_id,))

        record = cursor.fetchone()

        if not record:

            return jsonify({
                "success": False,
                "message": "Activity log not found"
            }), 404

        activity = {
            "id": record["id"],
            "user_id": record["user_id"],
            "username": record["username"],
            "email": record["email"],
            "role": record["role"],
            "action": record["action"],
            "description": record["description"],
            "created_at": record["created_at"]
        }

        return jsonify({
            "success": True,
            "activity_log": activity
        }), 200

    finally:

        connection.close()


@activity_logs.route(
    "/api/activity-logs/<int:activity_log_id>",
    methods=["DELETE"]
)
def delete_activity_log(activity_log_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT id
            FROM activity_logs
            WHERE id = ?
        """, (activity_log_id,))

        record = cursor.fetchone()

        if not record:

            return jsonify({
                "success": False,
                "message": "Activity log not found"
            }), 404

        cursor.execute("""
            DELETE FROM activity_logs
            WHERE id = ?
        """, (activity_log_id,))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Activity log deleted successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()