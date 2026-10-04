from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId
from datetime import datetime
from authorization import get_current_user


attendance = Blueprint("attendance", __name__)


# =========================================================
# HELPER FUNCTION
# =========================================================

def attendance_response(record, employee=None):
    """
    Convert MongoDB attendance document into JSON response.
    """

    response = {
        "id": str(record["_id"]),
        "employee_id": str(record["employee_id"]),
        "attendance_date": record.get("attendance_date"),
        "check_in": record.get("check_in"),
        "check_out": record.get("check_out"),
        "status": record.get("status", "Present"),
        "created_at": record.get("created_at")
    }

    # Add employee information when available
    if employee:
        response["employee_code"] = employee.get("employee_code")
        response["first_name"] = employee.get("first_name")
        response["last_name"] = employee.get("last_name")

    return response


# =========================================================
# AUTHORIZATION HELPER
# =========================================================

def employee_belongs_to_user(employee, user):
    """
    Check whether the employee record belongs to
    the currently logged-in user.
    """

    employee_user_id = employee.get("user_id")

    if not employee_user_id:
        return False

    return str(employee_user_id) == str(user["id"])


def get_employee_for_user(employee_id):
    """
    Find an employee by ID and return it.
    """

    if not ObjectId.is_valid(employee_id):
        return None

    db = get_db()
    employees_collection = db["employees"]

    return employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })


# =========================================================
# CHECK IN
# =========================================================

@attendance.route("/api/attendance/check-in", methods=["POST"])
def check_in():

    user = get_current_user()

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    employee_id = data.get("employee_id")

    if not employee_id:
        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    # Validate employee ObjectId
    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    attendance_collection = db["attendance"]

    try:

        # Check whether employee exists
        employee = employees_collection.find_one({
            "_id": ObjectId(employee_id)
        })

        if not employee:
            return jsonify({
                "success": False,
                "message": "Employee not found"
            }), 404

        # Employee can check in only for themselves
        if user["role"] == "employee":

            if not employee_belongs_to_user(employee, user):
                return jsonify({
                    "success": False,
                    "message": (
                        "Access denied. You can only "
                        "check in for yourself."
                    )
                }), 403

        today = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M:%S")

        # Check whether employee already checked in today
        existing_attendance = attendance_collection.find_one({
            "employee_id": ObjectId(employee_id),
            "attendance_date": today
        })

        if existing_attendance:
            return jsonify({
                "success": False,
                "message": "Employee already checked in today"
            }), 409

        # Create attendance record
        attendance_record = {
            "employee_id": ObjectId(employee_id),
            "attendance_date": today,
            "check_in": current_time,
            "check_out": None,
            "status": "Present",
            "created_at": datetime.now().isoformat()
        }

        result = attendance_collection.insert_one(
            attendance_record
        )

        return jsonify({
            "success": True,
            "message": "Check-in successful",
            "attendance_id": str(result.inserted_id),
            "employee_id": employee_id,
            "date": today,
            "check_in": current_time
        }), 201

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# CHECK OUT
# =========================================================

@attendance.route("/api/attendance/check-out", methods=["POST"])
def check_out():

    user = get_current_user()

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    employee_id = data.get("employee_id")

    if not employee_id:
        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    # Validate employee ObjectId
    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    attendance_collection = db["attendance"]

    try:

        # Check employee exists
        employee = employees_collection.find_one({
            "_id": ObjectId(employee_id)
        })

        if not employee:
            return jsonify({
                "success": False,
                "message": "Employee not found"
            }), 404

        # Employee can check out only for themselves
        if user["role"] == "employee":

            if not employee_belongs_to_user(employee, user):
                return jsonify({
                    "success": False,
                    "message": (
                        "Access denied. You can only "
                        "check out for yourself."
                    )
                }), 403

        today = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M:%S")

        attendance_record = attendance_collection.find_one({
            "employee_id": ObjectId(employee_id),
            "attendance_date": today
        })

        if not attendance_record:
            return jsonify({
                "success": False,
                "message": "Employee has not checked in today"
            }), 404

        if attendance_record.get("check_out"):
            return jsonify({
                "success": False,
                "message": "Employee already checked out today"
            }), 409

        attendance_collection.update_one(
            {
                "_id": attendance_record["_id"]
            },
            {
                "$set": {
                    "check_out": current_time
                }
            }
        )

        return jsonify({
            "success": True,
            "message": "Check-out successful",
            "employee_id": employee_id,
            "date": today,
            "check_out": current_time
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# GET ALL ATTENDANCE
# =========================================================

@attendance.route("/api/attendance", methods=["GET"])
def get_attendance():

    user = get_current_user()

    db = get_db()

    employees_collection = db["employees"]
    attendance_collection = db["attendance"]

    try:

        # Employee can see only their own attendance
        if user["role"] == "employee":

            employee = employees_collection.find_one({
                "user_id": ObjectId(user["id"])
            })

            if not employee:
                return jsonify({
                    "success": True,
                    "attendance": []
                }), 200

            attendance_data = attendance_collection.find({
                "employee_id": employee["_id"]
            }).sort(
                "attendance_date",
                -1
            )

            attendance_list = []

            for record in attendance_data:

                attendance_list.append(
                    attendance_response(
                        record,
                        employee
                    )
                )

            return jsonify({
                "success": True,
                "attendance": attendance_list
            }), 200

        # Admin and manager can see all attendance
        attendance_data = attendance_collection.find().sort(
            "_id",
            -1
        )

        attendance_list = []

        for record in attendance_data:

            employee = employees_collection.find_one({
                "_id": record["employee_id"]
            })

            attendance_list.append(
                attendance_response(
                    record,
                    employee
                )
            )

        return jsonify({
            "success": True,
            "attendance": attendance_list
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# GET EMPLOYEE ATTENDANCE
# =========================================================

@attendance.route(
    "/api/attendance/employee/<employee_id>",
    methods=["GET"]
)
def get_employee_attendance(employee_id):

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    attendance_collection = db["attendance"]

    try:

        # Check employee exists
        employee = employees_collection.find_one({
            "_id": ObjectId(employee_id)
        })

        if not employee:
            return jsonify({
                "success": False,
                "message": "Employee not found"
            }), 404

        user = get_current_user()

        # Employee can only view their own attendance
        if user["role"] == "employee":

            if not employee_belongs_to_user(employee, user):
                return jsonify({
                    "success": False,
                    "message": (
                        "Access denied. You can only "
                        "view your own attendance."
                    )
                }), 403

        attendance_data = attendance_collection.find({
            "employee_id": ObjectId(employee_id)
        }).sort(
            "attendance_date",
            -1
        )

        attendance_list = []

        for record in attendance_data:

            attendance_list.append(
                attendance_response(
                    record,
                    employee
                )
            )

        return jsonify({
            "success": True,
            "attendance": attendance_list
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500