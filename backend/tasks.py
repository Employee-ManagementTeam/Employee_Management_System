from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId
from datetime import datetime


tasks = Blueprint("tasks", __name__)


# =========================================================
# HELPER FUNCTION
# =========================================================

def task_response(task, employee=None, assigned_user=None):
    response = {
        "id": str(task["_id"]),
        "employee_id": str(task["employee_id"]),
        "title": task.get("title"),
        "description": task.get("description"),
        "assigned_by": (
            str(task["assigned_by"])
            if task.get("assigned_by")
            else None
        ),
        "assigned_by_username": (
            assigned_user.get("username")
            if assigned_user
            else None
        ),
        "priority": task.get("priority", "Medium"),
        "due_date": task.get("due_date"),
        "status": task.get("status", "Pending"),
        "created_at": task.get("created_at"),
        "updated_at": task.get("updated_at")
    }

    if employee:
        response["employee_code"] = employee.get("employee_code")
        response["first_name"] = employee.get("first_name")
        response["last_name"] = employee.get("last_name")

    return response


# =========================================================
# CREATE TASK
# =========================================================

@tasks.route("/api/tasks", methods=["POST"])
def create_task():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    employee_id = data.get("employee_id")
    title = data.get("title")
    description = data.get("description")
    assigned_by = data.get("assigned_by")
    priority = data.get("priority", "Medium")
    due_date = data.get("due_date")

    # -----------------------------------------------------
    # Validate required fields
    # -----------------------------------------------------

    if not employee_id:
        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    if not title:
        return jsonify({
            "success": False,
            "message": "Task title is required"
        }), 400

    # -----------------------------------------------------
    # Validate priority
    # -----------------------------------------------------

    allowed_priorities = [
        "Low",
        "Medium",
        "High",
        "Urgent"
    ]

    if priority not in allowed_priorities:
        return jsonify({
            "success": False,
            "message": "Invalid priority. Use Low, Medium, High or Urgent"
        }), 400

    # -----------------------------------------------------
    # Validate employee ObjectId
    # -----------------------------------------------------

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    employee_object_id = ObjectId(employee_id)

    db = get_db()

    employees_collection = db["employees"]
    users_collection = db["users"]
    tasks_collection = db["tasks"]

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
    # Check assigned user exists
    # -----------------------------------------------------

    assigned_user = None

    if assigned_by:

        if not ObjectId.is_valid(assigned_by):
            return jsonify({
                "success": False,
                "message": "Invalid assigned user ID"
            }), 400

        assigned_user = users_collection.find_one({
            "_id": ObjectId(assigned_by)
        })

        if not assigned_user:
            return jsonify({
                "success": False,
                "message": "Assigned by user not found"
            }), 404

    # -----------------------------------------------------
    # Validate due date
    # -----------------------------------------------------

    if due_date:

        try:
            datetime.strptime(
                due_date,
                "%Y-%m-%d"
            )

        except ValueError:
            return jsonify({
                "success": False,
                "message": "Due date must be in YYYY-MM-DD format"
            }), 400

    # -----------------------------------------------------
    # Create task
    # -----------------------------------------------------

    current_time = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    task = {
        "employee_id": employee_object_id,
        "title": title,
        "description": description,
        "assigned_by": (
            ObjectId(assigned_by)
            if assigned_by
            else None
        ),
        "priority": priority,
        "due_date": due_date,
        "status": "Pending",
        "created_at": current_time,
        "updated_at": None
    }

    result = tasks_collection.insert_one(task)

    return jsonify({
        "success": True,
        "message": "Task created successfully",
        "task_id": str(result.inserted_id),
        "status": "Pending"
    }), 201


# =========================================================
# GET ALL TASKS
# =========================================================

@tasks.route("/api/tasks", methods=["GET"])
def get_tasks():

    db = get_db()

    tasks_collection = db["tasks"]
    employees_collection = db["employees"]
    users_collection = db["users"]

    tasks_data = tasks_collection.find().sort(
        "_id",
        -1
    )

    tasks_list = []

    for task in tasks_data:

        employee = employees_collection.find_one({
            "_id": task["employee_id"]
        })

        assigned_user = None

        if task.get("assigned_by"):
            assigned_user = users_collection.find_one({
                "_id": task["assigned_by"]
            })

        tasks_list.append(
            task_response(
                task,
                employee,
                assigned_user
            )
        )

    return jsonify({
        "success": True,
        "tasks": tasks_list
    }), 200


# =========================================================
# GET SINGLE TASK
# =========================================================

@tasks.route("/api/tasks/<task_id>", methods=["GET"])
def get_task(task_id):

    if not ObjectId.is_valid(task_id):
        return jsonify({
            "success": False,
            "message": "Invalid task ID"
        }), 400

    db = get_db()

    tasks_collection = db["tasks"]
    employees_collection = db["employees"]
    users_collection = db["users"]

    task = tasks_collection.find_one({
        "_id": ObjectId(task_id)
    })

    if not task:
        return jsonify({
            "success": False,
            "message": "Task not found"
        }), 404

    employee = employees_collection.find_one({
        "_id": task["employee_id"]
    })

    assigned_user = None

    if task.get("assigned_by"):
        assigned_user = users_collection.find_one({
            "_id": task["assigned_by"]
        })

    return jsonify({
        "success": True,
        "task": task_response(
            task,
            employee,
            assigned_user
        )
    }), 200


# =========================================================
# GET EMPLOYEE TASKS
# =========================================================

@tasks.route(
    "/api/tasks/employee/<employee_id>",
    methods=["GET"]
)
def get_employee_tasks(employee_id):

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    tasks_collection = db["tasks"]
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
    # Get employee tasks
    # -----------------------------------------------------

    tasks_data = tasks_collection.find({
        "employee_id": employee_object_id
    }).sort(
        "_id",
        -1
    )

    tasks_list = []

    for task in tasks_data:

        assigned_user = None

        if task.get("assigned_by"):
            assigned_user = users_collection.find_one({
                "_id": task["assigned_by"]
            })

        tasks_list.append(
            task_response(
                task,
                employee,
                assigned_user
            )
        )

    return jsonify({
        "success": True,
        "tasks": tasks_list
    }), 200


# =========================================================
# UPDATE TASK
# =========================================================

@tasks.route("/api/tasks/<task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    if not ObjectId.is_valid(task_id):
        return jsonify({
            "success": False,
            "message": "Invalid task ID"
        }), 400

    db = get_db()

    tasks_collection = db["tasks"]
    employees_collection = db["employees"]
    users_collection = db["users"]

    # -----------------------------------------------------
    # Check task exists
    # -----------------------------------------------------

    task = tasks_collection.find_one({
        "_id": ObjectId(task_id)
    })

    if not task:
        return jsonify({
            "success": False,
            "message": "Task not found"
        }), 404

    # -----------------------------------------------------
    # Get updated values
    # -----------------------------------------------------

    employee_id = data.get(
        "employee_id",
        str(task["employee_id"])
    )

    title = data.get(
        "title",
        task.get("title")
    )

    description = data.get(
        "description",
        task.get("description")
    )

    assigned_by = data.get(
        "assigned_by",
        str(task["assigned_by"])
        if task.get("assigned_by")
        else None
    )

    priority = data.get(
        "priority",
        task.get("priority", "Medium")
    )

    due_date = data.get(
        "due_date",
        task.get("due_date")
    )

    status = data.get(
        "status",
        task.get("status", "Pending")
    )

    # -----------------------------------------------------
    # Validate employee
    # -----------------------------------------------------

    if not ObjectId.is_valid(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    employee_object_id = ObjectId(employee_id)

    employee = employees_collection.find_one({
        "_id": employee_object_id
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    # -----------------------------------------------------
    # Validate priority
    # -----------------------------------------------------

    allowed_priorities = [
        "Low",
        "Medium",
        "High",
        "Urgent"
    ]

    if priority not in allowed_priorities:
        return jsonify({
            "success": False,
            "message": "Invalid priority"
        }), 400

    # -----------------------------------------------------
    # Validate status
    # -----------------------------------------------------

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Completed"
    ]

    if status not in allowed_statuses:
        return jsonify({
            "success": False,
            "message": "Invalid status"
        }), 400

    # -----------------------------------------------------
    # Validate assigned user
    # -----------------------------------------------------

    assigned_user_object_id = None

    if assigned_by:

        if not ObjectId.is_valid(assigned_by):
            return jsonify({
                "success": False,
                "message": "Invalid assigned user ID"
            }), 400

        assigned_user = users_collection.find_one({
            "_id": ObjectId(assigned_by)
        })

        if not assigned_user:
            return jsonify({
                "success": False,
                "message": "Assigned by user not found"
            }), 404

        assigned_user_object_id = ObjectId(assigned_by)

    # -----------------------------------------------------
    # Validate due date
    # -----------------------------------------------------

    if due_date:

        try:
            datetime.strptime(
                due_date,
                "%Y-%m-%d"
            )

        except ValueError:
            return jsonify({
                "success": False,
                "message": "Due date must be in YYYY-MM-DD format"
            }), 400

    # -----------------------------------------------------
    # Update task
    # -----------------------------------------------------

    updated_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    tasks_collection.update_one(
        {
            "_id": ObjectId(task_id)
        },
        {
            "$set": {
                "employee_id": employee_object_id,
                "title": title,
                "description": description,
                "assigned_by": assigned_user_object_id,
                "priority": priority,
                "due_date": due_date,
                "status": status,
                "updated_at": updated_at
            }
        }
    )

    return jsonify({
        "success": True,
        "message": "Task updated successfully",
        "task_id": task_id,
        "status": status
    }), 200


# =========================================================
# DELETE TASK
# =========================================================

@tasks.route("/api/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):

    if not ObjectId.is_valid(task_id):
        return jsonify({
            "success": False,
            "message": "Invalid task ID"
        }), 400

    db = get_db()

    tasks_collection = db["tasks"]

    # -----------------------------------------------------
    # Check task exists
    # -----------------------------------------------------

    task = tasks_collection.find_one({
        "_id": ObjectId(task_id)
    })

    if not task:
        return jsonify({
            "success": False,
            "message": "Task not found"
        }), 404

    # -----------------------------------------------------
    # Delete task
    # -----------------------------------------------------

    tasks_collection.delete_one({
        "_id": ObjectId(task_id)
    })

    return jsonify({
        "success": True,
        "message": "Task deleted successfully"
    }), 200