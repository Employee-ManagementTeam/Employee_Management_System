from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime


attendance = Blueprint("attendance", __name__)


# =========================================================
# CHECK IN
# =========================================================

@attendance.route("/api/attendance/check-in", methods=["POST"])
def check_in():

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

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # Check whether employee exists
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

        today = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M:%S")

        # Check whether employee already checked in today
        cursor.execute("""
            SELECT *
            FROM attendance
            WHERE employee_id = ?
            AND attendance_date = ?
        """, (employee_id, today))

        existing_attendance = cursor.fetchone()

        if existing_attendance:
            return jsonify({
                "success": False,
                "message": "Employee already checked in today"
            }), 409

        # Create attendance record
        cursor.execute("""
            INSERT INTO attendance (
                employee_id,
                attendance_date,
                check_in,
                status
            )
            VALUES (?, ?, ?, ?)
        """, (
            employee_id,
            today,
            current_time,
            "Present"
        ))

        connection.commit()

        attendance_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Check-in successful",
            "attendance_id": attendance_id,
            "employee_id": employee_id,
            "date": today,
            "check_in": current_time
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
# CHECK OUT
# =========================================================

@attendance.route("/api/attendance/check-out", methods=["POST"])
def check_out():

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

    connection = get_connection()
    cursor = connection.cursor()

    try:

        today = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M:%S")

        cursor.execute("""
            SELECT *
            FROM attendance
            WHERE employee_id = ?
            AND attendance_date = ?
        """, (employee_id, today))

        attendance_record = cursor.fetchone()

        if not attendance_record:
            return jsonify({
                "success": False,
                "message": "Employee has not checked in today"
            }), 404

        if attendance_record["check_out"]:
            return jsonify({
                "success": False,
                "message": "Employee already checked out today"
            }), 409

        cursor.execute("""
            UPDATE attendance
            SET check_out = ?
            WHERE id = ?
        """, (
            current_time,
            attendance_record["id"]
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Check-out successful",
            "employee_id": employee_id,
            "date": today,
            "check_out": current_time
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
# GET ALL ATTENDANCE
# =========================================================

@attendance.route("/api/attendance", methods=["GET"])
def get_attendance():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                attendance.id,
                attendance.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                attendance.attendance_date,
                attendance.check_in,
                attendance.check_out,
                attendance.status,
                attendance.created_at
            FROM attendance
            INNER JOIN employees
                ON attendance.employee_id = employees.id
            ORDER BY attendance.id DESC
        """)

        attendance_data = cursor.fetchall()

        attendance_list = []

        for record in attendance_data:

            attendance_list.append({
                "id": record["id"],
                "employee_id": record["employee_id"],
                "employee_code": record["employee_code"],
                "first_name": record["first_name"],
                "last_name": record["last_name"],
                "attendance_date": record["attendance_date"],
                "check_in": record["check_in"],
                "check_out": record["check_out"],
                "status": record["status"],
                "created_at": record["created_at"]
            })

        return jsonify({
            "success": True,
            "attendance": attendance_list
        }), 200

    finally:

        connection.close()


# =========================================================
# GET EMPLOYEE ATTENDANCE
# =========================================================

@attendance.route(
    "/api/attendance/employee/<int:employee_id>",
    methods=["GET"]
)
def get_employee_attendance(employee_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # Check employee exists
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

        cursor.execute("""
            SELECT
                attendance.id,
                attendance.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                attendance.attendance_date,
                attendance.check_in,
                attendance.check_out,
                attendance.status,
                attendance.created_at
            FROM attendance
            INNER JOIN employees
                ON attendance.employee_id = employees.id
            WHERE attendance.employee_id = ?
            ORDER BY attendance.attendance_date DESC
        """, (employee_id,))

        attendance_data = cursor.fetchall()

        attendance_list = []

        for record in attendance_data:

            attendance_list.append({
                "id": record["id"],
                "employee_id": record["employee_id"],
                "employee_code": record["employee_code"],
                "first_name": record["first_name"],
                "last_name": record["last_name"],
                "attendance_date": record["attendance_date"],
                "check_in": record["check_in"],
                "check_out": record["check_out"],
                "status": record["status"],
                "created_at": record["created_at"]
            })

        return jsonify({
            "success": True,
            "attendance": attendance_list
        }), 200

    finally:

        connection.close()