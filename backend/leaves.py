from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId
from datetime import datetime
from authorization import get_current_user


leaves = Blueprint("leaves", __name__)


# =========================================================
# HELPER FUNCTION
# =========================================================

def leave_response(leave):
    return {
        "id": str(leave["_id"]),
        "employee_id": str(leave["employee_id"]),
        "leave_type": leave.get("leave_type"),
        "start_date": leave.get("start_date"),
        "end_date": leave.get("end_date"),
        "reason": leave.get("reason"),
        "status": leave.get("status", "Pending"),
        "approved_by": (
            str(leave["approved_by"])
            if leave.get("approved_by")
            else None
        ),
        "created_at": leave.get("created_at")
    }


def employee_belongs_to_user(employee, user):
    employee_user_id = employee.get("user_id")

    if not employee_user_id:
        return False

    return str(employee_user_id) == str(user["id"])


# =========================================================
# APPLY FOR LEAVE
# =========================================================

@leaves.route("/api/leaves", methods=["POST"])
def create_leave():

    user = get_current_user()
    data = request.get_json() or {}

    employee_id = data.get("employee_id")
    leave_type = data.get("leave_type")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    reason = data.get("reason")

    if not employee_id:
        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    if not leave_type or not start_date or not end_date:
        return jsonify({
            "success": False,
            "message": (
                "Leave type, start date and end date are required"
            )
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    leaves_collection = db["leaves"]

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    # Employee can apply only for their own leave
    if user["role"] == "employee":

        if not employee_belongs_to_user(employee, user):

            return jsonify({
                "success": False,
                "message": (
                    "Access denied. You can only "
                    "apply leave for yourself."
                )
            }), 403

    # Check overlapping pending/approved leave
    overlapping_leave = leaves_collection.find_one({
        "employee_id": ObjectId(employee_id),
        "status": {
            "$in": ["Pending", "Approved"]
        },
        "start_date": {
            "$lte": end_date
        },
        "end_date": {
            "$gte": start_date
        }
    })

    if overlapping_leave:

        return jsonify({
            "success": False,
            "message": (
                "Employee already has a leave "
                "request for the selected dates"
            )
        }), 409

    leave_record = {
        "employee_id": ObjectId(employee_id),
        "leave_type": leave_type,
        "start_date": start_date,
        "end_date": end_date,
        "reason": reason,
        "status": "Pending",
        "approved_by": None,
        "created_at": datetime.now().isoformat()
    }

    try:

        result = leaves_collection.insert_one(
            leave_record
        )

        return jsonify({
            "success": True,
            "message": "Leave request submitted successfully",
            "leave_id": str(result.inserted_id)
        }), 201

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# GET LEAVES
# =========================================================

@leaves.route("/api/leaves", methods=["GET"])
def get_leaves():

    user = get_current_user()

    db = get_db()

    leaves_collection = db["leaves"]
    employees_collection = db["employees"]

    try:

        if user["role"] == "employee":

            employee = employees_collection.find_one({
                "user_id": ObjectId(user["id"])
            })

            if not employee:

                return jsonify({
                    "success": True,
                    "leaves": []
                }), 200

            leave_data = leaves_collection.find({
                "employee_id": employee["_id"]
            }).sort("_id", -1)

        else:

            leave_data = leaves_collection.find().sort(
                "_id",
                -1
            )

        leaves_list = []

        for leave in leave_data:

            leaves_list.append(
                leave_response(leave)
            )

        return jsonify({
            "success": True,
            "leaves": leaves_list
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# GET SINGLE LEAVE
# =========================================================

@leaves.route("/api/leaves/<leave_id>", methods=["GET"])
def get_leave(leave_id):

    if not ObjectId.is_valid(leave_id):

        return jsonify({
            "success": False,
            "message": "Invalid leave ID"
        }), 400

    db = get_db()

    leaves_collection = db["leaves"]
    employees_collection = db["employees"]

    leave = leaves_collection.find_one({
        "_id": ObjectId(leave_id)
    })

    if not leave:

        return jsonify({
            "success": False,
            "message": "Leave request not found"
        }), 404

    user = get_current_user()

    if user["role"] == "employee":

        employee = employees_collection.find_one({
            "_id": leave["employee_id"]
        })

        if not employee or not employee_belongs_to_user(
            employee,
            user
        ):

            return jsonify({
                "success": False,
                "message": (
                    "Access denied. You can only view "
                    "your own leave requests."
                )
            }), 403

    return jsonify({
        "success": True,
        "leave": leave_response(leave)
    }), 200


# =========================================================
# GET EMPLOYEE LEAVES
# =========================================================

@leaves.route(
    "/api/leaves/employee/<employee_id>",
    methods=["GET"]
)
def get_employee_leaves(employee_id):

    if not ObjectId.is_valid(employee_id):

        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    leaves_collection = db["leaves"]

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:

        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    user = get_current_user()

    if user["role"] == "employee":

        if not employee_belongs_to_user(
            employee,
            user
        ):

            return jsonify({
                "success": False,
                "message": (
                    "Access denied. You can only view "
                    "your own leave requests."
                )
            }), 403

    try:

        leave_data = leaves_collection.find({
            "employee_id": ObjectId(employee_id)
        }).sort(
            "_id",
            -1
        )

        leaves_list = []

        for leave in leave_data:

            leaves_list.append(
                leave_response(leave)
            )

        return jsonify({
            "success": True,
            "leaves": leaves_list
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# APPROVE LEAVE
# =========================================================

@leaves.route(
    "/api/leaves/<leave_id>/approve",
    methods=["PUT"]
)
def approve_leave(leave_id):

    user = get_current_user()

    if user["role"] not in ["admin", "manager"]:

        return jsonify({
            "success": False,
            "message": (
                "Only admin or manager can approve leaves"
            )
        }), 403

    if not ObjectId.is_valid(leave_id):

        return jsonify({
            "success": False,
            "message": "Invalid leave ID"
        }), 400

    db = get_db()

    leaves_collection = db["leaves"]

    leave = leaves_collection.find_one({
        "_id": ObjectId(leave_id)
    })

    if not leave:

        return jsonify({
            "success": False,
            "message": "Leave request not found"
        }), 404

    if leave.get("status") != "Pending":

        return jsonify({
            "success": False,
            "message": (
                "Only pending leave requests "
                "can be approved"
            )
        }), 409

    leaves_collection.update_one(
        {
            "_id": ObjectId(leave_id)
        },
        {
            "$set": {
                "status": "Approved",
                "approved_by": ObjectId(user["id"])
            }
        }
    )

    return jsonify({
        "success": True,
        "message": "Leave approved successfully"
    }), 200


# =========================================================
# REJECT LEAVE
# =========================================================

@leaves.route(
    "/api/leaves/<leave_id>/reject",
    methods=["PUT"]
)
def reject_leave(leave_id):

    user = get_current_user()

    if user["role"] not in ["admin", "manager"]:

        return jsonify({
            "success": False,
            "message": (
                "Only admin or manager can reject leaves"
            )
        }), 403

    if not ObjectId.is_valid(leave_id):

        return jsonify({
            "success": False,
            "message": "Invalid leave ID"
        }), 400

    db = get_db()

    leaves_collection = db["leaves"]

    leave = leaves_collection.find_one({
        "_id": ObjectId(leave_id)
    })

    if not leave:

        return jsonify({
            "success": False,
            "message": "Leave request not found"
        }), 404

    if leave.get("status") != "Pending":

        return jsonify({
            "success": False,
            "message": (
                "Only pending leave requests "
                "can be rejected"
            )
        }), 409

    leaves_collection.update_one(
        {
            "_id": ObjectId(leave_id)
        },
        {
            "$set": {
                "status": "Rejected",
                "approved_by": ObjectId(user["id"])
            }
        }
    )

    return jsonify({
        "success": True,
        "message": "Leave rejected successfully"
    }), 200