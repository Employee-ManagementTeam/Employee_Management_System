from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId
from datetime import datetime


notifications = Blueprint(
    "notifications",
    __name__
)


# ============================================================
# HELPER FUNCTION
# ============================================================

def notification_response(record):

    return {
        "id": str(record["_id"]),
        "user_id": str(record["user_id"]),
        "title": record.get("title"),
        "message": record.get("message"),
        "notification_type":
            record.get(
                "notification_type",
                "General"
            ),
        "is_read":
            bool(record.get("is_read", False)),
        "created_at":
            record.get("created_at")
    }


# ============================================================
# GET ALL NOTIFICATIONS
# ============================================================

@notifications.route(
    "/api/notifications",
    methods=["GET"]
)
def get_notifications():

    user_id = request.args.get(
        "user_id"
    )

    db = get_db()

    notifications_collection = db[
        "notifications"
    ]

    query = {}

    if user_id:

        if not ObjectId.is_valid(user_id):

            return jsonify({
                "success": False,
                "message": "Invalid user ID"
            }), 400

        query["user_id"] = ObjectId(
            user_id
        )

    records = notifications_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    notification_list = []

    for record in records:

        notification_list.append(
            notification_response(record)
        )

    return jsonify({
        "success": True,
        "notifications":
            notification_list
    }), 200


# ============================================================
# GET SINGLE NOTIFICATION
# ============================================================

@notifications.route(
    "/api/notifications/<notification_id>",
    methods=["GET"]
)
def get_notification(notification_id):

    if not ObjectId.is_valid(
        notification_id
    ):

        return jsonify({
            "success": False,
            "message": "Invalid notification ID"
        }), 400

    db = get_db()

    notifications_collection = db[
        "notifications"
    ]

    record = notifications_collection.find_one({
        "_id": ObjectId(notification_id)
    })

    if not record:

        return jsonify({
            "success": False,
            "message":
                "Notification not found"
        }), 404

    notification = notification_response(
        record
    )

    return jsonify({
        "success": True,
        "notification":
            notification
    }), 200


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
            "message":
                "Request body is required"
        }), 400

    user_id = data.get(
        "user_id"
    )

    title = data.get(
        "title"
    )

    message = data.get(
        "message"
    )

    notification_type = data.get(
        "notification_type",
        "General"
    )

    if not user_id:

        return jsonify({
            "success": False,
            "message":
                "User ID is required"
        }), 400

    if not title:

        return jsonify({
            "success": False,
            "message":
                "Title is required"
        }), 400

    if not message:

        return jsonify({
            "success": False,
            "message":
                "Message is required"
        }), 400

    if not ObjectId.is_valid(
        user_id
    ):

        return jsonify({
            "success": False,
            "message":
                "Invalid user ID"
        }), 400

    db = get_db()

    users_collection = db[
        "users"
    ]

    notifications_collection = db[
        "notifications"
    ]

    # --------------------------------------------------------
    # Check user exists
    # --------------------------------------------------------

    user = users_collection.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:

        return jsonify({
            "success": False,
            "message":
                "User not found"
        }), 404

    try:

        notification_record = {

            "user_id":
                ObjectId(user_id),

            "title":
                title,

            "message":
                message,

            "notification_type":
                notification_type,

            "is_read":
                False,

            "created_at":
                datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
        }

        result = notifications_collection.insert_one(
            notification_record
        )

        return jsonify({
            "success": True,
            "message":
                "Notification created successfully",
            "notification_id":
                str(result.inserted_id)
        }), 201

    except Exception as error:

        return jsonify({
            "success": False,
            "message":
                str(error)
        }), 500


# ============================================================
# MARK NOTIFICATION AS READ
# ============================================================

@notifications.route(
    "/api/notifications/<notification_id>/read",
    methods=["PUT"]
)
def mark_notification_read(
    notification_id
):

    if not ObjectId.is_valid(
        notification_id
    ):

        return jsonify({
            "success": False,
            "message":
                "Invalid notification ID"
        }), 400

    db = get_db()

    notifications_collection = db[
        "notifications"
    ]

    record = notifications_collection.find_one({
        "_id": ObjectId(notification_id)
    })

    if not record:

        return jsonify({
            "success": False,
            "message":
                "Notification not found"
        }), 404

    try:

        notifications_collection.update_one(
            {
                "_id":
                    ObjectId(notification_id)
            },
            {
                "$set": {
                    "is_read": True
                }
            }
        )

        return jsonify({
            "success": True,
            "message":
                "Notification marked as read"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message":
                str(error)
        }), 500


# ============================================================
# MARK NOTIFICATION AS UNREAD
# ============================================================

@notifications.route(
    "/api/notifications/<notification_id>/unread",
    methods=["PUT"]
)
def mark_notification_unread(
    notification_id
):

    if not ObjectId.is_valid(
        notification_id
    ):

        return jsonify({
            "success": False,
            "message":
                "Invalid notification ID"
        }), 400

    db = get_db()

    notifications_collection = db[
        "notifications"
    ]

    record = notifications_collection.find_one({
        "_id": ObjectId(notification_id)
    })

    if not record:

        return jsonify({
            "success": False,
            "message":
                "Notification not found"
        }), 404

    try:

        notifications_collection.update_one(
            {
                "_id":
                    ObjectId(notification_id)
            },
            {
                "$set": {
                    "is_read": False
                }
            }
        )

        return jsonify({
            "success": True,
            "message":
                "Notification marked as unread"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message":
                str(error)
        }), 500


# ============================================================
# DELETE NOTIFICATION
# ============================================================

@notifications.route(
    "/api/notifications/<notification_id>",
    methods=["DELETE"]
)
def delete_notification(
    notification_id
):

    if not ObjectId.is_valid(
        notification_id
    ):

        return jsonify({
            "success": False,
            "message":
                "Invalid notification ID"
        }), 400

    db = get_db()

    notifications_collection = db[
        "notifications"
    ]

    record = notifications_collection.find_one({
        "_id": ObjectId(notification_id)
    })

    if not record:

        return jsonify({
            "success": False,
            "message":
                "Notification not found"
        }), 404

    try:

        notifications_collection.delete_one({
            "_id":
                ObjectId(notification_id)
        })

        return jsonify({
            "success": True,
            "message":
                "Notification deleted successfully"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message":
                str(error)
        }), 500