from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId
from authorization import get_current_user


employees = Blueprint("employees", __name__)


# =========================================================
# HELPER FUNCTION
# =========================================================

def employee_response(employee):
    """
    Convert MongoDB employee document into JSON response format.
    """

    return {
        "id": str(employee["_id"]),
        "user_id": (
            str(employee["user_id"])
            if isinstance(employee.get("user_id"), ObjectId)
            else employee.get("user_id")
        ),
        "employee_code": employee.get("employee_code"),
        "first_name": employee.get("first_name"),
        "last_name": employee.get("last_name"),
        "phone": employee.get("phone"),
        "department": employee.get("department"),
        "designation": employee.get("designation"),
        "joining_date": employee.get("joining_date"),
        "address": employee.get("address"),
        "employment_status": employee.get(
            "employment_status",
            "Active"
        ),
        "created_at": employee.get("created_at")
    }


# =========================================================
# AUTHORIZATION HELPER
# =========================================================

def employee_belongs_to_user(employee, user):
    """
    Check whether an employee record belongs to
    the currently logged-in user.
    """

    employee_user_id = employee.get("user_id")

    if not employee_user_id:
        return False

    return str(employee_user_id) == str(user["id"])


# =========================================================
# CREATE EMPLOYEE
# =========================================================

@employees.route("/api/employees", methods=["POST"])
def create_employee():

    user = get_current_user()

    # Only admin and manager can create employees
    if user["role"] not in ["admin", "manager"]:
        return jsonify({
            "success": False,
            "message": "Only admin or manager can create employees"
        }), 403

    data = request.get_json() or {}

    employee_code = data.get("employee_code")
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    user_id = data.get("user_id")
    phone = data.get("phone")
    department = data.get("department")
    designation = data.get("designation")
    joining_date = data.get("joining_date")
    address = data.get("address")

    employment_status = data.get(
        "employment_status",
        "Active"
    )

    # Required fields
    if not employee_code or not first_name or not last_name:
        return jsonify({
            "success": False,
            "message": "Employee code, first name and last name are required"
        }), 400

    db = get_db()
    employees_collection = db["employees"]

    # Check duplicate employee code
    existing_employee = employees_collection.find_one({
        "employee_code": employee_code
    })

    if existing_employee:
        return jsonify({
            "success": False,
            "message": "Employee code already exists"
        }), 409

    # Convert user_id to ObjectId if supplied
    if user_id:
        if not ObjectId.is_valid(user_id):
            return jsonify({
                "success": False,
                "message": "Invalid user ID"
            }), 400

        user_id = ObjectId(user_id)

    employee = {
        "user_id": user_id,
        "employee_code": employee_code,
        "first_name": first_name,
        "last_name": last_name,
        "phone": phone,
        "department": department,
        "designation": designation,
        "joining_date": joining_date,
        "address": address,
        "employment_status": employment_status
    }

    try:

        result = employees_collection.insert_one(employee)

        return jsonify({
            "success": True,
            "message": "Employee created successfully",
            "employee_id": str(result.inserted_id)
        }), 201

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 409


# =========================================================
# GET ALL EMPLOYEES
# =========================================================

@employees.route("/api/employees", methods=["GET"])
def get_employees():

    user = get_current_user()

    db = get_db()
    employees_collection = db["employees"]

    # Employee can see only their own employee record
    if user["role"] == "employee":

        employee = employees_collection.find_one({
            "user_id": ObjectId(user["id"])
        })

        if not employee:
            return jsonify({
                "success": True,
                "employees": []
            }), 200

        return jsonify({
            "success": True,
            "employees": [
                employee_response(employee)
            ]
        }), 200

    # Admin and manager can see all employees
    employees_data = employees_collection.find().sort(
        "_id",
        -1
    )

    employees_list = []

    for employee in employees_data:
        employees_list.append(
            employee_response(employee)
        )

    return jsonify({
        "success": True,
        "employees": employees_list
    }), 200


# =========================================================
# GET SINGLE EMPLOYEE
# =========================================================

@employees.route("/api/employees/<employee_id>", methods=["GET"])
def get_employee(employee_id):

    # Validate MongoDB ObjectId
    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()
    employees_collection = db["employees"]

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:

        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    user = get_current_user()

    # Employee can only view their own record
    if user["role"] == "employee":

        if not employee_belongs_to_user(employee, user):
            return jsonify({
                "success": False,
                "message": (
                    "Access denied. You can only view "
                    "your own employee record."
                )
            }), 403

    return jsonify({
        "success": True,
        "employee": employee_response(employee)
    }), 200


# =========================================================
# UPDATE EMPLOYEE
# =========================================================

@employees.route("/api/employees/<employee_id>", methods=["PUT"])
def update_employee(employee_id):

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    data = request.get_json() or {}

    db = get_db()
    employees_collection = db["employees"]

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:

        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    user = get_current_user()

    # Only admin and manager can update employee records
    if user["role"] not in ["admin", "manager"]:
        return jsonify({
            "success": False,
            "message": "Employees cannot update employee records"
        }), 403

    # Keep existing values if fields are not provided
    employee_code = data.get(
        "employee_code",
        employee.get("employee_code")
    )

    first_name = data.get(
        "first_name",
        employee.get("first_name")
    )

    last_name = data.get(
        "last_name",
        employee.get("last_name")
    )

    user_id = data.get(
        "user_id",
        employee.get("user_id")
    )

    phone = data.get(
        "phone",
        employee.get("phone")
    )

    department = data.get(
        "department",
        employee.get("department")
    )

    designation = data.get(
        "designation",
        employee.get("designation")
    )

    joining_date = data.get(
        "joining_date",
        employee.get("joining_date")
    )

    address = data.get(
        "address",
        employee.get("address")
    )

    employment_status = data.get(
        "employment_status",
        employee.get("employment_status", "Active")
    )

    # Convert user_id to ObjectId
    if user_id:

        if not ObjectId.is_valid(str(user_id)):
            return jsonify({
                "success": False,
                "message": "Invalid user ID"
            }), 400

        user_id = ObjectId(str(user_id))

    # Check duplicate employee code
    duplicate = employees_collection.find_one({
        "employee_code": employee_code,
        "_id": {
            "$ne": ObjectId(employee_id)
        }
    })

    if duplicate:
        return jsonify({
            "success": False,
            "message": "Employee code already exists"
        }), 409

    update_data = {
        "user_id": user_id,
        "employee_code": employee_code,
        "first_name": first_name,
        "last_name": last_name,
        "phone": phone,
        "department": department,
        "designation": designation,
        "joining_date": joining_date,
        "address": address,
        "employment_status": employment_status
    }

    try:

        employees_collection.update_one(
            {
                "_id": ObjectId(employee_id)
            },
            {
                "$set": update_data
            }
        )

        return jsonify({
            "success": True,
            "message": "Employee updated successfully"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 409


# =========================================================
# DELETE EMPLOYEE
# =========================================================

@employees.route("/api/employees/<employee_id>", methods=["DELETE"])
def delete_employee(employee_id):

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()
    employees_collection = db["employees"]

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:

        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    user = get_current_user()

    # Only admin can delete employees
    if user["role"] != "admin":
        return jsonify({
            "success": False,
            "message": "Only admin can delete employees"
        }), 403

    try:

        employees_collection.delete_one({
            "_id": ObjectId(employee_id)
        })

        return jsonify({
            "success": True,
            "message": "Employee deleted successfully"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500