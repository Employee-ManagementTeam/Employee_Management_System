from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId
from datetime import datetime


activity_logs = Blueprint(
    "activity_logs",
    __name__
)


# ============================================================
# HELPER FUNCTION
# ============================================================

def activity_log_response(record, user):
    return {
        "id": str(record["_id"]),
        "user_id": str(record["user_id"]),
        "username": user.get("username"),
        "email": user.get("email"),
        "role": user.get("role"),
        "action": record.get("action"),
        "description": record.get("description"),
        "created_at": record.get("created_at")
    }


# ============================================================
# CREATE ACTIVITY LOG
# ============================================================

@activity_logs.route(
    "/api/activity-logs",
    methods=["POST"]
)
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

    if not ObjectId.is_valid(user_id):
        return jsonify({
            "success": False,
            "message": "Invalid user ID"
        }), 400

    db = get_db()

    users_collection = db["users"]
    activity_collection = db["activity_logs"]

    try:

        # ----------------------------------------------------
        # Check user exists
        # ----------------------------------------------------

        user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        # ----------------------------------------------------
        # Create activity log
        # ----------------------------------------------------

        activity_record = {
            "user_id": ObjectId(user_id),
            "action": action,
            "description": description,
            "created_at":
                datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
        }

        result = activity_collection.insert_one(
            activity_record
        )

        return jsonify({
            "success": True,
            "message":
                "Activity log created successfully",
            "activity_log_id":
                str(result.inserted_id)
        }), 201

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# ============================================================
# GET ALL ACTIVITY LOGS
# ============================================================

@activity_logs.route(
    "/api/activity-logs",
    methods=["GET"]
)
def get_activity_logs():

    user_id = request.args.get("user_id")

    db = get_db()

    users_collection = db["users"]
    activity_collection = db["activity_logs"]

    query = {}

    # --------------------------------------------------------
    # Optional user filter
    # --------------------------------------------------------

    if user_id:

        if not ObjectId.is_valid(user_id):
            return jsonify({
                "success": False,
                "message": "Invalid user ID"
            }), 400

        query["user_id"] = ObjectId(user_id)

    records = activity_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    activity_list = []

    for record in records:

        user = users_collection.find_one({
            "_id": record.get("user_id")
        })

        if not user:
            continue

        activity_list.append(
            activity_log_response(
                record,
                user
            )
        )

    return jsonify({
        "success": True,
        "activity_logs":
            activity_list
    }), 200


# ============================================================
# GET USER ACTIVITY LOGS
# ============================================================

@activity_logs.route(
    "/api/activity-logs/user/<user_id>",
    methods=["GET"]
)
def get_user_activity_logs(user_id):

    if not ObjectId.is_valid(user_id):
        return jsonify({
            "success": False,
            "message": "Invalid user ID"
        }), 400

    db = get_db()

    users_collection = db["users"]
    activity_collection = db["activity_logs"]

    # --------------------------------------------------------
    # Check user exists
    # --------------------------------------------------------

    user = users_collection.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    records = activity_collection.find({
        "user_id": ObjectId(user_id)
    }).sort(
        "_id",
        -1
    )

    activity_list = []

    for record in records:

        activity_list.append(
            activity_log_response(
                record,
                user
            )
        )

    return jsonify({
        "success": True,
        "user_id": user_id,
        "activity_logs":
            activity_list
    }), 200


# ============================================================
# GET SINGLE ACTIVITY LOG
# ============================================================

@activity_logs.route(
    "/api/activity-logs/<activity_log_id>",
    methods=["GET"]
)
def get_activity_log(activity_log_id):

    if not ObjectId.is_valid(
        activity_log_id
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid activity log ID"
        }), 400

    db = get_db()

    users_collection = db["users"]
    activity_collection = db["activity_logs"]

    record = activity_collection.find_one({
        "_id": ObjectId(activity_log_id)
    })

    if not record:
        return jsonify({
            "success": False,
            "message":
                "Activity log not found"
        }), 404

    user = users_collection.find_one({
        "_id": record.get("user_id")
    })

    if not user:
        return jsonify({
            "success": False,
            "message":
                "User not found"
        }), 404

    activity = activity_log_response(
        record,
        user
    )

    return jsonify({
        "success": True,
        "activity_log":
            activity
    }), 200


# ============================================================
# DELETE ACTIVITY LOG
# ============================================================

@activity_logs.route(
    "/api/activity-logs/<activity_log_id>",
    methods=["DELETE"]
)
def delete_activity_log(activity_log_id):

    if not ObjectId.is_valid(
        activity_log_id
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid activity log ID"
        }), 400

    db = get_db()

    activity_collection = db[
        "activity_logs"
    ]

    record = activity_collection.find_one({
        "_id": ObjectId(activity_log_id)
    })

    if not record:
        return jsonify({
            "success": False,
            "message":
                "Activity log not found"
        }), 404

    try:

        activity_collection.delete_one({
            "_id":
                ObjectId(activity_log_id)
        })

        return jsonify({
            "success": True,
            "message":
                "Activity log deleted successfully"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500