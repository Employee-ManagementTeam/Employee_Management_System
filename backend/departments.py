from flask import Blueprint, request, jsonify
from database import get_connection


departments = Blueprint("departments", __name__)


# =========================================================
# CREATE DEPARTMENT
# =========================================================

@departments.route("/api/departments", methods=["POST"])
def create_department():

    data = request.get_json()

    department_name = data.get("department_name")
    description = data.get("description")
    status = data.get("status", "Active")

    if not department_name:
        return jsonify({
            "success": False,
            "message": "Department name is required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            INSERT INTO departments (
                department_name,
                description,
                status
            )
            VALUES (?, ?, ?)
        """, (
            department_name,
            description,
            status
        ))

        connection.commit()

        department_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Department created successfully",
            "department_id": department_id
        }), 201

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 409

    finally:

        connection.close()


# =========================================================
# GET ALL DEPARTMENTS
# =========================================================

@departments.route("/api/departments", methods=["GET"])
def get_departments():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM departments
        ORDER BY id DESC
    """)

    departments_data = cursor.fetchall()

    connection.close()

    departments_list = []

    for department in departments_data:

        departments_list.append({
            "id": department["id"],
            "department_name": department["department_name"],
            "description": department["description"],
            "status": department["status"],
            "created_at": department["created_at"]
        })

    return jsonify({
        "success": True,
        "departments": departments_list
    }), 200


# =========================================================
# GET SINGLE DEPARTMENT
# =========================================================

@departments.route("/api/departments/<int:department_id>", methods=["GET"])
def get_department(department_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM departments
        WHERE id = ?
    """, (department_id,))

    department = cursor.fetchone()

    connection.close()

    if not department:

        return jsonify({
            "success": False,
            "message": "Department not found"
        }), 404

    return jsonify({
        "success": True,
        "department": {
            "id": department["id"],
            "department_name": department["department_name"],
            "description": department["description"],
            "status": department["status"],
            "created_at": department["created_at"]
        }
    }), 200


# =========================================================
# UPDATE DEPARTMENT
# =========================================================

@departments.route("/api/departments/<int:department_id>", methods=["PUT"])
def update_department(department_id):

    data = request.get_json()

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM departments
        WHERE id = ?
    """, (department_id,))

    department = cursor.fetchone()

    if not department:

        connection.close()

        return jsonify({
            "success": False,
            "message": "Department not found"
        }), 404

    department_name = data.get(
        "department_name",
        department["department_name"]
    )

    description = data.get(
        "description",
        department["description"]
    )

    status = data.get(
        "status",
        department["status"]
    )

    try:

        cursor.execute("""
            UPDATE departments
            SET
                department_name = ?,
                description = ?,
                status = ?
            WHERE id = ?
        """, (
            department_name,
            description,
            status,
            department_id
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Department updated successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 409

    finally:

        connection.close()


# =========================================================
# DELETE DEPARTMENT
# =========================================================

@departments.route("/api/departments/<int:department_id>", methods=["DELETE"])
def delete_department(department_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM departments
        WHERE id = ?
    """, (department_id,))

    department = cursor.fetchone()

    if not department:

        connection.close()

        return jsonify({
            "success": False,
            "message": "Department not found"
        }), 404

    try:

        cursor.execute("""
            DELETE FROM departments
            WHERE id = ?
        """, (department_id,))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Department deleted successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()