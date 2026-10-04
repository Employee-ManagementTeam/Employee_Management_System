from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId


departments = Blueprint("departments", __name__)


# =========================================================
# HELPER FUNCTION
# =========================================================

def department_response(department):
    """
    Convert MongoDB department document into JSON response format.
    """

    return {
        "id": str(department["_id"]),
        "department_name": department.get("department_name"),
        "description": department.get("description"),
        "status": department.get("status", "Active"),
        "created_at": department.get("created_at")
    }


# =========================================================
# CREATE DEPARTMENT
# =========================================================

@departments.route("/api/departments", methods=["POST"])
def create_department():

    data = request.get_json() or {}

    department_name = data.get("department_name")
    description = data.get("description")
    status = data.get("status", "Active")

    if not department_name:
        return jsonify({
            "success": False,
            "message": "Department name is required"
        }), 400

    db = get_db()
    departments_collection = db["departments"]

    # Check duplicate department name
    existing_department = departments_collection.find_one({
        "department_name": department_name
    })

    if existing_department:
        return jsonify({
            "success": False,
            "message": "Department name already exists"
        }), 409

    department = {
        "department_name": department_name,
        "description": description,
        "status": status
    }

    try:

        result = departments_collection.insert_one(department)

        return jsonify({
            "success": True,
            "message": "Department created successfully",
            "department_id": str(result.inserted_id)
        }), 201

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 409


# =========================================================
# GET ALL DEPARTMENTS
# =========================================================

@departments.route("/api/departments", methods=["GET"])
def get_departments():

    db = get_db()
    departments_collection = db["departments"]

    departments_data = departments_collection.find().sort(
        "_id",
        -1
    )

    departments_list = []

    for department in departments_data:
        departments_list.append(
            department_response(department)
        )

    return jsonify({
        "success": True,
        "departments": departments_list
    }), 200


# =========================================================
# GET SINGLE DEPARTMENT
# =========================================================

@departments.route("/api/departments/<department_id>", methods=["GET"])
def get_department(department_id):

    if not ObjectId.is_valid(department_id):
        return jsonify({
            "success": False,
            "message": "Invalid department ID"
        }), 400

    db = get_db()
    departments_collection = db["departments"]

    department = departments_collection.find_one({
        "_id": ObjectId(department_id)
    })

    if not department:

        return jsonify({
            "success": False,
            "message": "Department not found"
        }), 404

    return jsonify({
        "success": True,
        "department": department_response(department)
    }), 200


# =========================================================
# UPDATE DEPARTMENT
# =========================================================

@departments.route("/api/departments/<department_id>", methods=["PUT"])
def update_department(department_id):

    if not ObjectId.is_valid(department_id):
        return jsonify({
            "success": False,
            "message": "Invalid department ID"
        }), 400

    data = request.get_json() or {}

    db = get_db()
    departments_collection = db["departments"]

    department = departments_collection.find_one({
        "_id": ObjectId(department_id)
    })

    if not department:

        return jsonify({
            "success": False,
            "message": "Department not found"
        }), 404

    department_name = data.get(
        "department_name",
        department.get("department_name")
    )

    description = data.get(
        "description",
        department.get("description")
    )

    status = data.get(
        "status",
        department.get("status", "Active")
    )

    # Check duplicate department name
    duplicate = departments_collection.find_one({
        "department_name": department_name,
        "_id": {
            "$ne": ObjectId(department_id)
        }
    })

    if duplicate:
        return jsonify({
            "success": False,
            "message": "Department name already exists"
        }), 409

    update_data = {
        "department_name": department_name,
        "description": description,
        "status": status
    }

    try:

        departments_collection.update_one(
            {
                "_id": ObjectId(department_id)
            },
            {
                "$set": update_data
            }
        )

        return jsonify({
            "success": True,
            "message": "Department updated successfully"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 409


# =========================================================
# DELETE DEPARTMENT
# =========================================================

@departments.route("/api/departments/<department_id>", methods=["DELETE"])
def delete_department(department_id):

    if not ObjectId.is_valid(department_id):
        return jsonify({
            "success": False,
            "message": "Invalid department ID"
        }), 400

    db = get_db()
    departments_collection = db["departments"]

    department = departments_collection.find_one({
        "_id": ObjectId(department_id)
    })

    if not department:

        return jsonify({
            "success": False,
            "message": "Department not found"
        }), 404

    try:

        departments_collection.delete_one({
            "_id": ObjectId(department_id)
        })

        return jsonify({
            "success": True,
            "message": "Department deleted successfully"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500