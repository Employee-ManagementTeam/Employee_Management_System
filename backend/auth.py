from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

import firebase_admin
from firebase_admin import auth as firebase_auth

from database import get_db


auth = Blueprint("auth", __name__)


# ---------------------------------------------------------
# Firebase Admin Initialization
# ---------------------------------------------------------

if not firebase_admin._apps:
    firebase_admin.initialize_app()


# ---------------------------------------------------------
# REGISTER
# ---------------------------------------------------------

@auth.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

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

    username = username.strip()
    email = email.strip().lower()

    if len(password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must be at least 6 characters long"
        }), 400

    db = get_db()
    users_collection = db["users"]

    # Check MongoDB duplicate
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

    # Check Firebase duplicate
    try:
        firebase_existing_user = firebase_auth.get_user_by_email(email)

        if firebase_existing_user:
            return jsonify({
                "success": False,
                "message": "This email is already registered in Firebase Authentication."
            }), 409

    except firebase_auth.UserNotFoundError:
        pass

    # Create Firebase account
    firebase_user = None

    try:
        firebase_user = firebase_auth.create_user(
            email=email,
            password=password,
            display_name=username,
            email_verified=False,
            disabled=False
        )

        firebase_uid = firebase_user.uid

    except firebase_auth.EmailAlreadyExistsError:
        return jsonify({
            "success": False,
            "message": "This email is already registered."
        }), 409

    except Exception as e:
        print("Firebase Registration Error:", str(e))

        return jsonify({
            "success": False,
            "message": "Unable to create Firebase account."
        }), 500

    # Create MongoDB user
    password_hash = generate_password_hash(password)

    user = {
        "username": username,
        "email": email,
        "password": password_hash,
        "role": role,
        "firebase_uid": firebase_uid,
        "auth_provider": "password"
    }

    try:
        result = users_collection.insert_one(user)

    except Exception as e:
        print("MongoDB Registration Error:", str(e))

        # Roll back Firebase account
        try:
            firebase_auth.delete_user(firebase_uid)
        except Exception as delete_error:
            print(
                "Firebase rollback failed:",
                str(delete_error)
            )

        return jsonify({
            "success": False,
            "message": "Unable to create EMS account."
        }), 500

    return jsonify({
        "success": True,
        "message": "Registration successful",
        "user_id": str(result.inserted_id),
        "firebase_uid": firebase_uid
    }), 201


# ---------------------------------------------------------
# OLD NORMAL LOGIN ENDPOINT
# ---------------------------------------------------------
# Kept for compatibility with existing backend/API code.
# The current React People Login page will use Firebase
# authentication instead.

@auth.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    email = email.strip().lower()

    db = get_db()
    users_collection = db["users"]

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    stored_password = user.get("password")

    if not stored_password:
        return jsonify({
            "success": False,
            "message": (
                "This account uses Google Login. "
                "Please continue with Google."
            )
        }), 401

    if check_password_hash(stored_password, password):
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": str(user["_id"]),
                "username": user.get("username", ""),
                "email": user.get("email", ""),
                "role": user.get("role", "employee")
            }
        }), 200

    return jsonify({
        "success": False,
        "message": "Invalid email or password"
    }), 401


# ---------------------------------------------------------
# FIREBASE EMAIL/PASSWORD LOGIN
# ---------------------------------------------------------

@auth.route("/api/auth/firebase-login", methods=["POST"])
def firebase_login():
    data = request.get_json(silent=True) or {}

    id_token = data.get("id_token")

    if not id_token:
        return jsonify({
            "success": False,
            "message": "Firebase ID token is required"
        }), 400

    try:
        # Verify token generated by Firebase client SDK.
        decoded_token = firebase_auth.verify_id_token(id_token)

        firebase_uid = decoded_token.get("uid")
        email = decoded_token.get("email")

        if not firebase_uid or not email:
            return jsonify({
                "success": False,
                "message": "Invalid Firebase account information"
            }), 401

        email = email.strip().lower()

        db = get_db()
        users_collection = db["users"]

        # Find corresponding EMS account.
        user = users_collection.find_one({
            "email": email
        })

        if not user:
            return jsonify({
                "success": False,
                "message": (
                    "No Employee Management System account is "
                    "registered with this email."
                )
            }), 404

        # Link Firebase UID if not already stored.
        users_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "firebase_uid": firebase_uid
                }
            }
        )

        role = str(
            user.get("role", "employee")
        ).strip().lower()

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": str(user["_id"]),
                "username": user.get("username", ""),
                "email": user.get("email", ""),
                "role": role
            }
        }), 200

    except firebase_auth.InvalidIdTokenError:
        return jsonify({
            "success": False,
            "message": "Invalid Firebase ID token"
        }), 401

    except firebase_auth.ExpiredIdTokenError:
        return jsonify({
            "success": False,
            "message": (
                "Firebase ID token has expired. "
                "Please sign in again."
            )
        }), 401

    except firebase_auth.RevokedIdTokenError:
        return jsonify({
            "success": False,
            "message": (
                "Firebase ID token has been revoked. "
                "Please sign in again."
            )
        }), 401

    except Exception as e:
        print(
            "Firebase Email Login Error:",
            str(e)
        )

        return jsonify({
            "success": False,
            "message": "Firebase authentication failed"
        }), 500


# ---------------------------------------------------------
# FIREBASE GOOGLE LOGIN
# ---------------------------------------------------------

@auth.route("/api/auth/google", methods=["POST"])
def google_login():
    data = request.get_json(silent=True) or {}

    id_token = data.get("id_token")

    if not id_token:
        return jsonify({
            "success": False,
            "message": "Firebase ID token is required"
        }), 400

    try:
        decoded_token = firebase_auth.verify_id_token(id_token)

        firebase_uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        email_verified = decoded_token.get(
            "email_verified",
            False
        )

        if not firebase_uid or not email:
            return jsonify({
                "success": False,
                "message": "Invalid Firebase account information"
            }), 401

        if not email_verified:
            return jsonify({
                "success": False,
                "message": "Google email is not verified"
            }), 401

        email = email.strip().lower()

        db = get_db()
        users_collection = db["users"]

        user = users_collection.find_one({
            "email": email
        })

        if not user:
            return jsonify({
                "success": False,
                "message": (
                    "No Employee Management System account is "
                    "registered with this Google email. "
                    "Please register first or contact the administrator."
                )
            }), 404

        users_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "firebase_uid": firebase_uid
                }
            }
        )

        role = str(
            user.get("role", "employee")
        ).strip().lower()

        return jsonify({
            "success": True,
            "message": "Google login successful",
            "user": {
                "id": str(user["_id"]),
                "username": user.get("username", ""),
                "email": user.get("email", ""),
                "role": role
            }
        }), 200

    except firebase_auth.InvalidIdTokenError:
        return jsonify({
            "success": False,
            "message": "Invalid Firebase ID token"
        }), 401

    except firebase_auth.ExpiredIdTokenError:
        return jsonify({
            "success": False,
            "message": (
                "Firebase ID token has expired. "
                "Please sign in again."
            )
        }), 401

    except firebase_auth.RevokedIdTokenError:
        return jsonify({
            "success": False,
            "message": (
                "Firebase ID token has been revoked. "
                "Please sign in again."
            )
        }), 401

    except Exception as e:
        print(
            "Firebase Google Login Error:",
            str(e)
        )

        return jsonify({
            "success": False,
            "message": "Google authentication failed"
        }), 500