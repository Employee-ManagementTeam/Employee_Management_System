from functools import wraps

from flask import request, jsonify

from database import get_connection


PUBLIC_ROUTES = {
    "/",
    "/api/register",
    "/api/login"
}


ROLE_PERMISSIONS = {

    "admin": {
        "employees",
        "departments",
        "attendance",
        "leaves",
        "tasks",
        "performance",
        "documents",
        "salary",
        "payroll",
        "notifications",
        "reports",
        "activity_logs"
    },

    "manager": {
        "employees",
        "departments",
        "attendance",
        "leaves",
        "tasks",
        "performance",
        "documents",
        "notifications",
        "reports",
        "activity_logs"
    },

    "employee": {
        "employees",
        "attendance",
        "leaves",
        "tasks",
        "performance",
        "documents",
        "payroll",
        "notifications",
        "activity_logs"
    }
}


def get_current_user():

    user_id = request.headers.get("X-User-ID")

    if not user_id:
        return None

    try:
        user_id = int(user_id)

    except ValueError:
        return None

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                id,
                username,
                email,
                role
            FROM users
            WHERE id = ?
        """, (user_id,))

        user = cursor.fetchone()

        if not user:
            return None

        return {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }

    finally:

        connection.close()


def get_api_module(path):

    if path.startswith("/api/employees"):
        return "employees"

    if path.startswith("/api/departments"):
        return "departments"

    if path.startswith("/api/attendance"):
        return "attendance"

    if path.startswith("/api/leaves"):
        return "leaves"

    if path.startswith("/api/tasks"):
        return "tasks"

    if path.startswith("/api/performance"):
        return "performance"

    if path.startswith("/api/documents"):
        return "documents"

    if path.startswith("/api/salary"):
        return "salary"

    if path.startswith("/api/payroll"):
        return "payroll"

    if path.startswith("/api/notifications"):
        return "notifications"

    if path.startswith("/api/reports"):
        return "reports"

    if path.startswith("/api/activity-logs"):
        return "activity_logs"

    return None


def check_authorization():

    path = request.path

    if path in PUBLIC_ROUTES:
        return None

    if not path.startswith("/api/"):
        return None

    module = get_api_module(path)

    if module is None:
        return None

    user = get_current_user()

    if user is None:

        return jsonify({
            "success": False,
            "message":
                "Authentication required. "
                "Provide a valid X-User-ID header."
        }), 401

    role = user["role"]

    permissions = ROLE_PERMISSIONS.get(
        role,
        set()
    )

    if module not in permissions:

        return jsonify({
            "success": False,
            "message":
                "Access denied. "
                "Your role does not have permission "
                "to access this module."
        }), 403

    request.current_user = user

    return None


def roles_required(*allowed_roles):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            user = get_current_user()

            if user is None:

                return jsonify({
                    "success": False,
                    "message":
                        "Authentication required."
                }), 401

            if user["role"] not in allowed_roles:

                return jsonify({
                    "success": False,
                    "message":
                        "Access denied."
                }), 403

            request.current_user = user

            return function(*args, **kwargs)

        return wrapper

    return decorator