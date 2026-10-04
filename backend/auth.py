from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db

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

    db = get_db()
    users_collection = db["users"]

    # Check whether username or email already exists
    existing_user = users_collection.find_one({
        "$or": [
            {"username": username},
            {"email": email}
        ]
    })

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Username or email already exists"
        }), 409

    # Hash password before storing it
    password_hash = generate_password_hash(password)

    user = {
        "username": username,
        "email": email,
        "password": password_hash,
        "role": role
    }

    result = users_collection.insert_one(user)

    return jsonify({
        "success": True,
        "message": "Registration successful",
        "user_id": str(result.inserted_id)
    }), 201


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

    db = get_db()
    users_collection = db["users"]

    user = users_collection.find_one({
        "email": email
    })

    if user and check_password_hash(user["password"], password):
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    return jsonify({
        "success": False,
        "message": "Invalid email or password"
    }), 401