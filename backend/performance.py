from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId
from datetime import datetime


performance = Blueprint("performance", __name__)


# =========================================================
# HELPER FUNCTION
# =========================================================

def performance_response(record, employee=None, reviewer=None):
    response = {
        "id": str(record["_id"]),
        "employee_id": str(record["employee_id"]),
        "reviewer_id": (
            str(record["reviewer_id"])
            if record.get("reviewer_id")
            else None
        ),
        "reviewer_username": (
            reviewer.get("username")
            if reviewer
            else None
        ),
        "review_period": record.get("review_period"),
        "rating": record.get("rating"),
        "strengths": record.get("strengths"),
        "areas_for_improvement": record.get(
            "areas_for_improvement"
        ),
        "comments": record.get("comments"),
        "status": record.get("status", "Completed"),
        "created_at": record.get("created_at"),
        "updated_at": record.get("updated_at")
    }

    if employee:
        response["employee_code"] = employee.get(
            "employee_code"
        )
        response["first_name"] = employee.get(
            "first_name"
        )
        response["last_name"] = employee.get(
            "last_name"
        )

    return response


# =========================================================
# CREATE PERFORMANCE RECORD
# =========================================================

@performance.route("/api/performance", methods=["POST"])
def create_performance():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    employee_id = data.get("employee_id")
    reviewer_id = data.get("reviewer_id")
    review_period = data.get("review_period")
    rating = data.get("rating")
    strengths = data.get("strengths")
    areas_for_improvement = data.get(
        "areas_for_improvement"
    )
    comments = data.get("comments")
    status = data.get("status", "Completed")

    # -----------------------------------------------------
    # Required fields
    # -----------------------------------------------------

    if not employee_id:
        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    if not review_period:
        return jsonify({
            "success": False,
            "message": "Review period is required"
        }), 400

    if rating is None:
        return jsonify({
            "success": False,
            "message": "Rating is required"
        }), 400

    # -----------------------------------------------------
    # Validate employee ID
    # -----------------------------------------------------

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    # -----------------------------------------------------
    # Validate rating
    # -----------------------------------------------------

    try:
        rating = float(rating)
    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Rating must be a number"
        }), 400

    if rating < 1 or rating > 5:
        return jsonify({
            "success": False,
            "message": "Rating must be between 1 and 5"
        }), 400

    # -----------------------------------------------------
    # Validate status
    # -----------------------------------------------------

    allowed_statuses = [
        "Draft",
        "Completed"
    ]

    if status not in allowed_statuses:
        return jsonify({
            "success": False,
            "message": "Invalid performance status"
        }), 400

    db = get_db()

    performance_collection = db["performance"]
    employees_collection = db["employees"]
    users_collection = db["users"]

    # -----------------------------------------------------
    # Check employee
    # -----------------------------------------------------

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    # -----------------------------------------------------
    # Check reviewer
    # -----------------------------------------------------

    reviewer_object_id = None

    if reviewer_id:

        if not ObjectId.is_valid(reviewer_id):
            return jsonify({
                "success": False,
                "message": "Invalid reviewer ID"
            }), 400

        reviewer = users_collection.find_one({
            "_id": ObjectId(reviewer_id)
        })

        if not reviewer:
            return jsonify({
                "success": False,
                "message": "Reviewer user not found"
            }), 404

        reviewer_object_id = ObjectId(reviewer_id)

    # -----------------------------------------------------
    # Create performance record
    # -----------------------------------------------------

    current_time = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    record = {
        "employee_id": ObjectId(employee_id),
        "reviewer_id": reviewer_object_id,
        "review_period": review_period,
        "rating": rating,
        "strengths": strengths,
        "areas_for_improvement": areas_for_improvement,
        "comments": comments,
        "status": status,
        "created_at": current_time,
        "updated_at": None
    }

    result = performance_collection.insert_one(record)

    return jsonify({
        "success": True,
        "message": "Performance record created successfully",
        "performance_id": str(result.inserted_id),
        "status": status
    }), 201


# =========================================================
# GET ALL PERFORMANCE RECORDS
# =========================================================

@performance.route("/api/performance", methods=["GET"])
def get_performance_records():

    db = get_db()

    performance_collection = db["performance"]
    employees_collection = db["employees"]
    users_collection = db["users"]

    records = performance_collection.find().sort(
        "_id",
        -1
    )

    performance_list = []

    for record in records:

        employee = employees_collection.find_one({
            "_id": record["employee_id"]
        })

        reviewer = None

        if record.get("reviewer_id"):
            reviewer = users_collection.find_one({
                "_id": record["reviewer_id"]
            })

        performance_list.append(
            performance_response(
                record,
                employee,
                reviewer
            )
        )

    return jsonify({
        "success": True,
        "performance": performance_list
    }), 200


# =========================================================
# GET SINGLE PERFORMANCE RECORD
# =========================================================

@performance.route(
    "/api/performance/<performance_id>",
    methods=["GET"]
)
def get_performance(performance_id):

    if not ObjectId.is_valid(performance_id):
        return jsonify({
            "success": False,
            "message": "Invalid performance ID"
        }), 400

    db = get_db()

    performance_collection = db["performance"]
    employees_collection = db["employees"]
    users_collection = db["users"]

    record = performance_collection.find_one({
        "_id": ObjectId(performance_id)
    })

    if not record:
        return jsonify({
            "success": False,
            "message": "Performance record not found"
        }), 404

    employee = employees_collection.find_one({
        "_id": record["employee_id"]
    })

    reviewer = None

    if record.get("reviewer_id"):
        reviewer = users_collection.find_one({
            "_id": record["reviewer_id"]
        })

    return jsonify({
        "success": True,
        "performance": performance_response(
            record,
            employee,
            reviewer
        )
    }), 200


# =========================================================
# GET EMPLOYEE PERFORMANCE
# =========================================================

@performance.route(
    "/api/performance/employee/<employee_id>",
    methods=["GET"]
)
def get_employee_performance(employee_id):

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    performance_collection = db["performance"]
    employees_collection = db["employees"]
    users_collection = db["users"]

    employee_object_id = ObjectId(employee_id)

    # -----------------------------------------------------
    # Check employee exists
    # -----------------------------------------------------

    employee = employees_collection.find_one({
        "_id": employee_object_id
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    # -----------------------------------------------------
    # Get employee performance records
    # -----------------------------------------------------

    records = performance_collection.find({
        "employee_id": employee_object_id
    }).sort(
        "_id",
        -1
    )

    performance_list = []

    for record in records:

        reviewer = None

        if record.get("reviewer_id"):
            reviewer = users_collection.find_one({
                "_id": record["reviewer_id"]
            })

        performance_list.append(
            performance_response(
                record,
                employee,
                reviewer
            )
        )

    return jsonify({
        "success": True,
        "performance": performance_list
    }), 200


# =========================================================
# UPDATE PERFORMANCE RECORD
# =========================================================

@performance.route(
    "/api/performance/<performance_id>",
    methods=["PUT"]
)
def update_performance(performance_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    if not ObjectId.is_valid(performance_id):
        return jsonify({
            "success": False,
            "message": "Invalid performance ID"
        }), 400

    db = get_db()

    performance_collection = db["performance"]
    employees_collection = db["employees"]
    users_collection = db["users"]

    # -----------------------------------------------------
    # Check record exists
    # -----------------------------------------------------

    record = performance_collection.find_one({
        "_id": ObjectId(performance_id)
    })

    if not record:
        return jsonify({
            "success": False,
            "message": "Performance record not found"
        }), 404

    # -----------------------------------------------------
    # Get updated values
    # -----------------------------------------------------

    employee_id = data.get(
        "employee_id",
        str(record["employee_id"])
    )

    reviewer_id = data.get(
        "reviewer_id",
        str(record["reviewer_id"])
        if record.get("reviewer_id")
        else None
    )

    review_period = data.get(
        "review_period",
        record.get("review_period")
    )

    rating = data.get(
        "rating",
        record.get("rating")
    )

    strengths = data.get(
        "strengths",
        record.get("strengths")
    )

    areas_for_improvement = data.get(
        "areas_for_improvement",
        record.get("areas_for_improvement")
    )

    comments = data.get(
        "comments",
        record.get("comments")
    )

    status = data.get(
        "status",
        record.get("status", "Completed")
    )

    # -----------------------------------------------------
    # Validate employee
    # -----------------------------------------------------

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    # -----------------------------------------------------
    # Validate reviewer
    # -----------------------------------------------------

    reviewer_object_id = None

    if reviewer_id:

        if not ObjectId.is_valid(reviewer_id):
            return jsonify({
                "success": False,
                "message": "Invalid reviewer ID"
            }), 400

        reviewer = users_collection.find_one({
            "_id": ObjectId(reviewer_id)
        })

        if not reviewer:
            return jsonify({
                "success": False,
                "message": "Reviewer user not found"
            }), 404

        reviewer_object_id = ObjectId(reviewer_id)

    # -----------------------------------------------------
    # Validate rating
    # -----------------------------------------------------

    try:
        rating = float(rating)
    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Rating must be a number"
        }), 400

    if rating < 1 or rating > 5:
        return jsonify({
            "success": False,
            "message": "Rating must be between 1 and 5"
        }), 400

    # -----------------------------------------------------
    # Validate status
    # -----------------------------------------------------

    allowed_statuses = [
        "Draft",
        "Completed"
    ]

    if status not in allowed_statuses:
        return jsonify({
            "success": False,
            "message": "Invalid performance status"
        }), 400

    # -----------------------------------------------------
    # Update record
    # -----------------------------------------------------

    updated_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    performance_collection.update_one(
        {
            "_id": ObjectId(performance_id)
        },
        {
            "$set": {
                "employee_id": ObjectId(employee_id),
                "reviewer_id": reviewer_object_id,
                "review_period": review_period,
                "rating": rating,
                "strengths": strengths,
                "areas_for_improvement":
                    areas_for_improvement,
                "comments": comments,
                "status": status,
                "updated_at": updated_at
            }
        }
    )

    return jsonify({
        "success": True,
        "message": "Performance record updated successfully",
        "performance_id": performance_id,
        "status": status
    }), 200


# =========================================================
# DELETE PERFORMANCE RECORD
# =========================================================

@performance.route(
    "/api/performance/<performance_id>",
    methods=["DELETE"]
)
def delete_performance(performance_id):

    if not ObjectId.is_valid(performance_id):
        return jsonify({
            "success": False,
            "message": "Invalid performance ID"
        }), 400

    db = get_db()

    performance_collection = db["performance"]

    # -----------------------------------------------------
    # Check record exists
    # -----------------------------------------------------

    record = performance_collection.find_one({
        "_id": ObjectId(performance_id)
    })

    if not record:
        return jsonify({
            "success": False,
            "message": "Performance record not found"
        }), 404

    # -----------------------------------------------------
    # Delete record
    # -----------------------------------------------------

    performance_collection.delete_one({
        "_id": ObjectId(performance_id)
    })

    return jsonify({
        "success": True,
        "message": "Performance record deleted successfully"
    }), 200