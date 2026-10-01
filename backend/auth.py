from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_connection

auth = Blueprint("auth", __name__)


@auth.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "employee")

    if not username or not email or not password:
        return jsonify({
            "success": False,
            "message": "Username, email and password are required"
        }), 400

    allowed_roles = ["admin", "manager", "employee"]

    if role not in allowed_roles:
        return jsonify({
            "success": False,
            "message": "Invalid role"
        }), 400

    password_hash = generate_password_hash(password)

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO users (username, email, password, role)
            VALUES (?, ?, ?, ?)
        """, (username, email, password_hash, role))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 201

    except Exception:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Username or email already exists"
        }), 409

    finally:
        connection.close()


@auth.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    )

    user = cursor.fetchone()
    connection.close()

    if user and check_password_hash(user["password"], password):
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    return jsonify({
        "success": False,
        "message": "Invalid email or password"
    }), 401