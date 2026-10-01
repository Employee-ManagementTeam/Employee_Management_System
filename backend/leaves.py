from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime


leaves = Blueprint("leaves", __name__)


# =========================================================
# APPLY FOR LEAVE
# =========================================================

@leaves.route("/api/leaves", methods=["POST"])
def apply_leave():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    employee_id = data.get("employee_id")
    leave_type = data.get("leave_type")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    reason = data.get("reason")

    # Required fields
    if not employee_id:
        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    if not leave_type:
        return jsonify({
            "success": False,
            "message": "Leave type is required"
        }), 400

    if not start_date:
        return jsonify({
            "success": False,
            "message": "Start date is required"
        }), 400

    if not end_date:
        return jsonify({
            "success": False,
            "message": "End date is required"
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
        # Validate dates
        # -------------------------------------------------

        try:

            start = datetime.strptime(
                start_date,
                "%Y-%m-%d"
            )

            end = datetime.strptime(
                end_date,
                "%Y-%m-%d"
            )

        except ValueError:

            return jsonify({
                "success": False,
                "message": "Date format must be YYYY-MM-DD"
            }), 400

        if end < start:

            return jsonify({
                "success": False,
                "message": "End date cannot be before start date"
            }), 400

        # -------------------------------------------------
        # Check overlapping leave
        # -------------------------------------------------

        cursor.execute("""
            SELECT *
            FROM leaves
            WHERE employee_id = ?
            AND status != 'Rejected'
            AND start_date <= ?
            AND end_date >= ?
        """, (
            employee_id,
            end_date,
            start_date
        ))

        existing_leave = cursor.fetchone()

        if existing_leave:

            return jsonify({
                "success": False,
                "message": "Employee already has leave during these dates"
            }), 409

        # -------------------------------------------------
        # Insert leave
        # -------------------------------------------------

        cursor.execute("""
            INSERT INTO leaves (
                employee_id,
                leave_type,
                start_date,
                end_date,
                reason,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            employee_id,
            leave_type,
            start_date,
            end_date,
            reason,
            "Pending"
        ))

        connection.commit()

        leave_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Leave application submitted successfully",
            "leave_id": leave_id,
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
# GET ALL LEAVES
# =========================================================

@leaves.route("/api/leaves", methods=["GET"])
def get_leaves():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                leaves.id,
                leaves.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                leaves.leave_type,
                leaves.start_date,
                leaves.end_date,
                leaves.reason,
                leaves.status,
                leaves.applied_at,
                leaves.approved_by,
                leaves.approved_at
            FROM leaves
            INNER JOIN employees
                ON leaves.employee_id = employees.id
            ORDER BY leaves.id DESC
        """)

        leave_data = cursor.fetchall()

        leaves_list = []

        for leave in leave_data:

            leaves_list.append({
                "id": leave["id"],
                "employee_id": leave["employee_id"],
                "employee_code": leave["employee_code"],
                "first_name": leave["first_name"],
                "last_name": leave["last_name"],
                "leave_type": leave["leave_type"],
                "start_date": leave["start_date"],
                "end_date": leave["end_date"],
                "reason": leave["reason"],
                "status": leave["status"],
                "applied_at": leave["applied_at"],
                "approved_by": leave["approved_by"],
                "approved_at": leave["approved_at"]
            })

        return jsonify({
            "success": True,
            "leaves": leaves_list
        }), 200

    finally:

        connection.close()


# =========================================================
# GET EMPLOYEE LEAVES
# =========================================================

@leaves.route(
    "/api/leaves/employee/<int:employee_id>",
    methods=["GET"]
)
def get_employee_leaves(employee_id):

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
        # Get employee leaves
        # -------------------------------------------------

        cursor.execute("""
            SELECT
                leaves.id,
                leaves.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                leaves.leave_type,
                leaves.start_date,
                leaves.end_date,
                leaves.reason,
                leaves.status,
                leaves.applied_at,
                leaves.approved_by,
                leaves.approved_at
            FROM leaves
            INNER JOIN employees
                ON leaves.employee_id = employees.id
            WHERE leaves.employee_id = ?
            ORDER BY leaves.id DESC
        """, (employee_id,))

        leave_data = cursor.fetchall()

        leaves_list = []

        for leave in leave_data:

            leaves_list.append({
                "id": leave["id"],
                "employee_id": leave["employee_id"],
                "employee_code": leave["employee_code"],
                "first_name": leave["first_name"],
                "last_name": leave["last_name"],
                "leave_type": leave["leave_type"],
                "start_date": leave["start_date"],
                "end_date": leave["end_date"],
                "reason": leave["reason"],
                "status": leave["status"],
                "applied_at": leave["applied_at"],
                "approved_by": leave["approved_by"],
                "approved_at": leave["approved_at"]
            })

        return jsonify({
            "success": True,
            "leaves": leaves_list
        }), 200

    finally:

        connection.close()


# =========================================================
# APPROVE LEAVE
# =========================================================

@leaves.route(
    "/api/leaves/<int:leave_id>/approve",
    methods=["PUT"]
)
def approve_leave(leave_id):

    data = request.get_json(silent=True) or {}

    approved_by = data.get("approved_by")

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # Check leave exists
        # -------------------------------------------------

        cursor.execute("""
            SELECT *
            FROM leaves
            WHERE id = ?
        """, (leave_id,))

        leave = cursor.fetchone()

        if not leave:

            return jsonify({
                "success": False,
                "message": "Leave application not found"
            }), 404

        # -------------------------------------------------
        # Check current status
        # -------------------------------------------------

        if leave["status"] != "Pending":

            return jsonify({
                "success": False,
                "message": "Only pending leave applications can be approved"
            }), 409

        # -------------------------------------------------
        # Validate approver if provided
        # -------------------------------------------------

        if approved_by:

            cursor.execute("""
                SELECT *
                FROM users
                WHERE id = ?
            """, (approved_by,))

            approver = cursor.fetchone()

            if not approver:

                return jsonify({
                    "success": False,
                    "message": "Approver user not found"
                }), 404

        # -------------------------------------------------
        # Approve leave
        # -------------------------------------------------

        approved_at = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        cursor.execute("""
            UPDATE leaves
            SET
                status = ?,
                approved_by = ?,
                approved_at = ?
            WHERE id = ?
        """, (
            "Approved",
            approved_by,
            approved_at,
            leave_id
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Leave approved successfully",
            "leave_id": leave_id,
            "status": "Approved",
            "approved_by": approved_by,
            "approved_at": approved_at
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
# REJECT LEAVE
# =========================================================

@leaves.route(
    "/api/leaves/<int:leave_id>/reject",
    methods=["PUT"]
)
def reject_leave(leave_id):

    data = request.get_json(silent=True) or {}

    approved_by = data.get("approved_by")

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # Check leave exists
        # -------------------------------------------------

        cursor.execute("""
            SELECT *
            FROM leaves
            WHERE id = ?
        """, (leave_id,))

        leave = cursor.fetchone()

        if not leave:

            return jsonify({
                "success": False,
                "message": "Leave application not found"
            }), 404

        # -------------------------------------------------
        # Check current status
        # -------------------------------------------------

        if leave["status"] != "Pending":

            return jsonify({
                "success": False,
                "message": "Only pending leave applications can be rejected"
            }), 409

        # -------------------------------------------------
        # Validate approver if provided
        # -------------------------------------------------

        if approved_by:

            cursor.execute("""
                SELECT *
                FROM users
                WHERE id = ?
            """, (approved_by,))

            approver = cursor.fetchone()

            if not approver:

                return jsonify({
                    "success": False,
                    "message": "Approver user not found"
                }), 404

        # -------------------------------------------------
        # Reject leave
        # -------------------------------------------------

        approved_at = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        cursor.execute("""
            UPDATE leaves
            SET
                status = ?,
                approved_by = ?,
                approved_at = ?
            WHERE id = ?
        """, (
            "Rejected",
            approved_by,
            approved_at,
            leave_id
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Leave rejected successfully",
            "leave_id": leave_id,
            "status": "Rejected",
            "approved_by": approved_by,
            "approved_at": approved_at
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:

        connection.close()