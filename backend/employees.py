from flask import Blueprint, request, jsonify
from database import get_connection


employees = Blueprint("employees", __name__)


# =========================================================
# CREATE EMPLOYEE
# =========================================================

@employees.route("/api/employees", methods=["POST"])
def create_employee():

    data = request.get_json()

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

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            INSERT INTO employees (
                user_id,
                employee_code,
                first_name,
                last_name,
                phone,
                department,
                designation,
                joining_date,
                address,
                employment_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            employee_code,
            first_name,
            last_name,
            phone,
            department,
            designation,
            joining_date,
            address,
            employment_status
        ))

        connection.commit()

        employee_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Employee created successfully",
            "employee_id": employee_id
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
# GET ALL EMPLOYEES
# =========================================================

@employees.route("/api/employees", methods=["GET"])
def get_employees():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM employees
        ORDER BY id DESC
    """)

    employees_data = cursor.fetchall()

    connection.close()

    employees_list = []

    for employee in employees_data:

        employees_list.append({
            "id": employee["id"],
            "user_id": employee["user_id"],
            "employee_code": employee["employee_code"],
            "first_name": employee["first_name"],
            "last_name": employee["last_name"],
            "phone": employee["phone"],
            "department": employee["department"],
            "designation": employee["designation"],
            "joining_date": employee["joining_date"],
            "address": employee["address"],
            "employment_status": employee["employment_status"],
            "created_at": employee["created_at"]
        })

    return jsonify({
        "success": True,
        "employees": employees_list
    }), 200


# =========================================================
# GET SINGLE EMPLOYEE
# =========================================================

@employees.route("/api/employees/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM employees
        WHERE id = ?
    """, (employee_id,))

    employee = cursor.fetchone()

    connection.close()

    if not employee:

        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    return jsonify({
        "success": True,
        "employee": {
            "id": employee["id"],
            "user_id": employee["user_id"],
            "employee_code": employee["employee_code"],
            "first_name": employee["first_name"],
            "last_name": employee["last_name"],
            "phone": employee["phone"],
            "department": employee["department"],
            "designation": employee["designation"],
            "joining_date": employee["joining_date"],
            "address": employee["address"],
            "employment_status": employee["employment_status"],
            "created_at": employee["created_at"]
        }
    }), 200


# =========================================================
# UPDATE EMPLOYEE
# =========================================================

@employees.route("/api/employees/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):

    data = request.get_json()

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM employees
        WHERE id = ?
    """, (employee_id,))

    employee = cursor.fetchone()

    if not employee:

        connection.close()

        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    employee_code = data.get(
        "employee_code",
        employee["employee_code"]
    )

    first_name = data.get(
        "first_name",
        employee["first_name"]
    )

    last_name = data.get(
        "last_name",
        employee["last_name"]
    )

    user_id = data.get(
        "user_id",
        employee["user_id"]
    )

    phone = data.get(
        "phone",
        employee["phone"]
    )

    department = data.get(
        "department",
        employee["department"]
    )

    designation = data.get(
        "designation",
        employee["designation"]
    )

    joining_date = data.get(
        "joining_date",
        employee["joining_date"]
    )

    address = data.get(
        "address",
        employee["address"]
    )

    employment_status = data.get(
        "employment_status",
        employee["employment_status"]
    )

    try:

        cursor.execute("""
            UPDATE employees
            SET
                user_id = ?,
                employee_code = ?,
                first_name = ?,
                last_name = ?,
                phone = ?,
                department = ?,
                designation = ?,
                joining_date = ?,
                address = ?,
                employment_status = ?
            WHERE id = ?
        """, (
            user_id,
            employee_code,
            first_name,
            last_name,
            phone,
            department,
            designation,
            joining_date,
            address,
            employment_status,
            employee_id
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Employee updated successfully"
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
# DELETE EMPLOYEE
# =========================================================

@employees.route("/api/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM employees
        WHERE id = ?
    """, (employee_id,))

    employee = cursor.fetchone()

    if not employee:

        connection.close()

        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    try:

        cursor.execute("""
            DELETE FROM employees
            WHERE id = ?
        """, (employee_id,))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Employee deleted successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()