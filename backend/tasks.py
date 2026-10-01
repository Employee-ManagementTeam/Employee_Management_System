from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime


tasks = Blueprint("tasks", __name__)


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

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # Check employee exists
        # -------------------------------------------------

        cursor.execute("""
            SELECT *
            FROM employees
            WHERE id = ?
        """, (employee_id,))

        employee = cursor.fetchone()

        if not employee:

            return jsonify({
                "success": False,
                "message": "Employee not found"
            }), 404

        # -------------------------------------------------
        # Check assigned user exists
        # -------------------------------------------------

        if assigned_by:

            cursor.execute("""
                SELECT *
                FROM users
                WHERE id = ?
            """, (assigned_by,))

            assigned_user = cursor.fetchone()

            if not assigned_user:

                return jsonify({
                    "success": False,
                    "message": "Assigned by user not found"
                }), 404

        # -------------------------------------------------
        # Validate due date
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Create task
        # -------------------------------------------------

        cursor.execute("""
            INSERT INTO tasks (
                employee_id,
                title,
                description,
                assigned_by,
                priority,
                due_date,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            employee_id,
            title,
            description,
            assigned_by,
            priority,
            due_date,
            "Pending"
        ))

        connection.commit()

        task_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Task created successfully",
            "task_id": task_id,
            "status": "Pending"
        }), 201

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()


# =========================================================
# GET ALL TASKS
# =========================================================

@tasks.route("/api/tasks", methods=["GET"])
def get_tasks():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                tasks.id,
                tasks.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                tasks.title,
                tasks.description,
                tasks.assigned_by,
                users.username AS assigned_by_username,
                tasks.priority,
                tasks.due_date,
                tasks.status,
                tasks.created_at,
                tasks.updated_at
            FROM tasks
            INNER JOIN employees
                ON tasks.employee_id = employees.id
            LEFT JOIN users
                ON tasks.assigned_by = users.id
            ORDER BY tasks.id DESC
        """)

        task_data = cursor.fetchall()

        tasks_list = []

        for task in task_data:

            tasks_list.append({
                "id": task["id"],
                "employee_id": task["employee_id"],
                "employee_code": task["employee_code"],
                "first_name": task["first_name"],
                "last_name": task["last_name"],
                "title": task["title"],
                "description": task["description"],
                "assigned_by": task["assigned_by"],
                "assigned_by_username": task["assigned_by_username"],
                "priority": task["priority"],
                "due_date": task["due_date"],
                "status": task["status"],
                "created_at": task["created_at"],
                "updated_at": task["updated_at"]
            })

        return jsonify({
            "success": True,
            "tasks": tasks_list
        }), 200

    finally:

        connection.close()


# =========================================================
# GET SINGLE TASK
# =========================================================

@tasks.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                tasks.id,
                tasks.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                tasks.title,
                tasks.description,
                tasks.assigned_by,
                users.username AS assigned_by_username,
                tasks.priority,
                tasks.due_date,
                tasks.status,
                tasks.created_at,
                tasks.updated_at
            FROM tasks
            INNER JOIN employees
                ON tasks.employee_id = employees.id
            LEFT JOIN users
                ON tasks.assigned_by = users.id
            WHERE tasks.id = ?
        """, (task_id,))

        task = cursor.fetchone()

        if not task:

            return jsonify({
                "success": False,
                "message": "Task not found"
            }), 404

        return jsonify({
            "success": True,
            "task": {
                "id": task["id"],
                "employee_id": task["employee_id"],
                "employee_code": task["employee_code"],
                "first_name": task["first_name"],
                "last_name": task["last_name"],
                "title": task["title"],
                "description": task["description"],
                "assigned_by": task["assigned_by"],
                "assigned_by_username": task["assigned_by_username"],
                "priority": task["priority"],
                "due_date": task["due_date"],
                "status": task["status"],
                "created_at": task["created_at"],
                "updated_at": task["updated_at"]
            }
        }), 200

    finally:

        connection.close()


# =========================================================
# GET EMPLOYEE TASKS
# =========================================================

@tasks.route(
    "/api/tasks/employee/<int:employee_id>",
    methods=["GET"]
)
def get_employee_tasks(employee_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # Check employee exists
        # -------------------------------------------------

        cursor.execute("""
            SELECT *
            FROM employees
            WHERE id = ?
        """, (employee_id,))

        employee = cursor.fetchone()

        if not employee:

            return jsonify({
                "success": False,
                "message": "Employee not found"
            }), 404

        # -------------------------------------------------
        # Get employee tasks
        # -------------------------------------------------

        cursor.execute("""
            SELECT
                tasks.id,
                tasks.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                tasks.title,
                tasks.description,
                tasks.assigned_by,
                users.username AS assigned_by_username,
                tasks.priority,
                tasks.due_date,
                tasks.status,
                tasks.created_at,
                tasks.updated_at
            FROM tasks
            INNER JOIN employees
                ON tasks.employee_id = employees.id
            LEFT JOIN users
                ON tasks.assigned_by = users.id
            WHERE tasks.employee_id = ?
            ORDER BY tasks.id DESC
        """, (employee_id,))

        task_data = cursor.fetchall()

        tasks_list = []

        for task in task_data:

            tasks_list.append({
                "id": task["id"],
                "employee_id": task["employee_id"],
                "employee_code": task["employee_code"],
                "first_name": task["first_name"],
                "last_name": task["last_name"],
                "title": task["title"],
                "description": task["description"],
                "assigned_by": task["assigned_by"],
                "assigned_by_username": task["assigned_by_username"],
                "priority": task["priority"],
                "due_date": task["due_date"],
                "status": task["status"],
                "created_at": task["created_at"],
                "updated_at": task["updated_at"]
            })

        return jsonify({
            "success": True,
            "tasks": tasks_list
        }), 200

    finally:

        connection.close()


# =========================================================
# UPDATE TASK
# =========================================================

@tasks.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # Check task exists
        # -------------------------------------------------

        cursor.execute("""
            SELECT *
            FROM tasks
            WHERE id = ?
        """, (task_id,))

        task = cursor.fetchone()

        if not task:

            return jsonify({
                "success": False,
                "message": "Task not found"
            }), 404

        # -------------------------------------------------
        # Get updated values
        # -------------------------------------------------

        employee_id = data.get(
            "employee_id",
            task["employee_id"]
        )

        title = data.get(
            "title",
            task["title"]
        )

        description = data.get(
            "description",
            task["description"]
        )

        assigned_by = data.get(
            "assigned_by",
            task["assigned_by"]
        )

        priority = data.get(
            "priority",
            task["priority"]
        )

        due_date = data.get(
            "due_date",
            task["due_date"]
        )

        status = data.get(
            "status",
            task["status"]
        )

        # -------------------------------------------------
        # Validate employee
        # -------------------------------------------------

        cursor.execute("""
            SELECT *
            FROM employees
            WHERE id = ?
        """, (employee_id,))

        employee = cursor.fetchone()

        if not employee:

            return jsonify({
                "success": False,
                "message": "Employee not found"
            }), 404

        # -------------------------------------------------
        # Validate priority
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Validate status
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Validate assigned user
        # -------------------------------------------------

        if assigned_by:

            cursor.execute("""
                SELECT *
                FROM users
                WHERE id = ?
            """, (assigned_by,))

            assigned_user = cursor.fetchone()

            if not assigned_user:

                return jsonify({
                    "success": False,
                    "message": "Assigned by user not found"
                }), 404

        # -------------------------------------------------
        # Validate due date
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Update task
        # -------------------------------------------------

        updated_at = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        cursor.execute("""
            UPDATE tasks
            SET
                employee_id = ?,
                title = ?,
                description = ?,
                assigned_by = ?,
                priority = ?,
                due_date = ?,
                status = ?,
                updated_at = ?
            WHERE id = ?
        """, (
            employee_id,
            title,
            description,
            assigned_by,
            priority,
            due_date,
            status,
            updated_at,
            task_id
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Task updated successfully",
            "task_id": task_id,
            "status": status
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()


# =========================================================
# DELETE TASK
# =========================================================

@tasks.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # Check task exists
        # -------------------------------------------------

        cursor.execute("""
            SELECT *
            FROM tasks
            WHERE id = ?
        """, (task_id,))

        task = cursor.fetchone()

        if not task:

            return jsonify({
                "success": False,
                "message": "Task not found"
            }), 404

        # -------------------------------------------------
        # Delete task
        # -------------------------------------------------

        cursor.execute("""
            DELETE FROM tasks
            WHERE id = ?
        """, (task_id,))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Task deleted successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()