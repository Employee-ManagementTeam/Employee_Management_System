from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime


performance = Blueprint("performance", __name__)


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
    areas_for_improvement = data.get("areas_for_improvement")
    comments = data.get("comments")
    status = data.get("status", "Completed")

    # Required fields
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

    # Validate rating
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

    # Validate status
    allowed_statuses = [
        "Draft",
        "Completed"
    ]

    if status not in allowed_statuses:
        return jsonify({
            "success": False,
            "message": "Invalid performance status"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # Check employee
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

        # Check reviewer
        if reviewer_id:

            cursor.execute("""
                SELECT *
                FROM users
                WHERE id = ?
            """, (reviewer_id,))

            reviewer = cursor.fetchone()

            if not reviewer:
                return jsonify({
                    "success": False,
                    "message": "Reviewer user not found"
                }), 404

        # Insert performance record
        cursor.execute("""
            INSERT INTO performance (
                employee_id,
                reviewer_id,
                review_period,
                rating,
                strengths,
                areas_for_improvement,
                comments,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            employee_id,
            reviewer_id,
            review_period,
            rating,
            strengths,
            areas_for_improvement,
            comments,
            status
        ))

        connection.commit()

        performance_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Performance record created successfully",
            "performance_id": performance_id,
            "status": status
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
# GET ALL PERFORMANCE RECORDS
# =========================================================

@performance.route("/api/performance", methods=["GET"])
def get_performance_records():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                performance.id,
                performance.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                performance.reviewer_id,
                users.username AS reviewer_username,
                performance.review_period,
                performance.rating,
                performance.strengths,
                performance.areas_for_improvement,
                performance.comments,
                performance.status,
                performance.created_at,
                performance.updated_at

            FROM performance

            INNER JOIN employees
                ON performance.employee_id = employees.id

            LEFT JOIN users
                ON performance.reviewer_id = users.id

            ORDER BY performance.id DESC
        """)

        records = cursor.fetchall()

        performance_list = []

        for record in records:

            performance_list.append({
                "id": record["id"],
                "employee_id": record["employee_id"],
                "employee_code": record["employee_code"],
                "first_name": record["first_name"],
                "last_name": record["last_name"],
                "reviewer_id": record["reviewer_id"],
                "reviewer_username": record["reviewer_username"],
                "review_period": record["review_period"],
                "rating": record["rating"],
                "strengths": record["strengths"],
                "areas_for_improvement":
                    record["areas_for_improvement"],
                "comments": record["comments"],
                "status": record["status"],
                "created_at": record["created_at"],
                "updated_at": record["updated_at"]
            })

        return jsonify({
            "success": True,
            "performance": performance_list
        }), 200

    finally:
        connection.close()


# =========================================================
# GET SINGLE PERFORMANCE RECORD
# =========================================================

@performance.route(
    "/api/performance/<int:performance_id>",
    methods=["GET"]
)
def get_performance(performance_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                performance.id,
                performance.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                performance.reviewer_id,
                users.username AS reviewer_username,
                performance.review_period,
                performance.rating,
                performance.strengths,
                performance.areas_for_improvement,
                performance.comments,
                performance.status,
                performance.created_at,
                performance.updated_at

            FROM performance

            INNER JOIN employees
                ON performance.employee_id = employees.id

            LEFT JOIN users
                ON performance.reviewer_id = users.id

            WHERE performance.id = ?
        """, (performance_id,))

        record = cursor.fetchone()

        if not record:
            return jsonify({
                "success": False,
                "message": "Performance record not found"
            }), 404

        return jsonify({
            "success": True,
            "performance": {
                "id": record["id"],
                "employee_id": record["employee_id"],
                "employee_code": record["employee_code"],
                "first_name": record["first_name"],
                "last_name": record["last_name"],
                "reviewer_id": record["reviewer_id"],
                "reviewer_username":
                    record["reviewer_username"],
                "review_period":
                    record["review_period"],
                "rating":
                    record["rating"],
                "strengths":
                    record["strengths"],
                "areas_for_improvement":
                    record["areas_for_improvement"],
                "comments":
                    record["comments"],
                "status":
                    record["status"],
                "created_at":
                    record["created_at"],
                "updated_at":
                    record["updated_at"]
            }
        }), 200

    finally:
        connection.close()


# =========================================================
# GET EMPLOYEE PERFORMANCE
# =========================================================

@performance.route(
    "/api/performance/employee/<int:employee_id>",
    methods=["GET"]
)
def get_employee_performance(employee_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

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
                performance.id,
                performance.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                performance.reviewer_id,
                users.username AS reviewer_username,
                performance.review_period,
                performance.rating,
                performance.strengths,
                performance.areas_for_improvement,
                performance.comments,
                performance.status,
                performance.created_at,
                performance.updated_at

            FROM performance

            INNER JOIN employees
                ON performance.employee_id = employees.id

            LEFT JOIN users
                ON performance.reviewer_id = users.id

            WHERE performance.employee_id = ?

            ORDER BY performance.id DESC
        """, (employee_id,))

        records = cursor.fetchall()

        performance_list = []

        for record in records:

            performance_list.append({
                "id": record["id"],
                "employee_id": record["employee_id"],
                "employee_code": record["employee_code"],
                "first_name": record["first_name"],
                "last_name": record["last_name"],
                "reviewer_id": record["reviewer_id"],
                "reviewer_username":
                    record["reviewer_username"],
                "review_period":
                    record["review_period"],
                "rating":
                    record["rating"],
                "strengths":
                    record["strengths"],
                "areas_for_improvement":
                    record["areas_for_improvement"],
                "comments":
                    record["comments"],
                "status":
                    record["status"],
                "created_at":
                    record["created_at"],
                "updated_at":
                    record["updated_at"]
            })

        return jsonify({
            "success": True,
            "performance": performance_list
        }), 200

    finally:
        connection.close()


# =========================================================
# UPDATE PERFORMANCE RECORD
# =========================================================

@performance.route(
    "/api/performance/<int:performance_id>",
    methods=["PUT"]
)
def update_performance(performance_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT *
            FROM performance
            WHERE id = ?
        """, (performance_id,))

        record = cursor.fetchone()

        if not record:
            return jsonify({
                "success": False,
                "message": "Performance record not found"
            }), 404

        employee_id = data.get(
            "employee_id",
            record["employee_id"]
        )

        reviewer_id = data.get(
            "reviewer_id",
            record["reviewer_id"]
        )

        review_period = data.get(
            "review_period",
            record["review_period"]
        )

        rating = data.get(
            "rating",
            record["rating"]
        )

        strengths = data.get(
            "strengths",
            record["strengths"]
        )

        areas_for_improvement = data.get(
            "areas_for_improvement",
            record["areas_for_improvement"]
        )

        comments = data.get(
            "comments",
            record["comments"]
        )

        status = data.get(
            "status",
            record["status"]
        )

        # Check employee
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

        # Check reviewer
        if reviewer_id:

            cursor.execute("""
                SELECT *
                FROM users
                WHERE id = ?
            """, (reviewer_id,))

            reviewer = cursor.fetchone()

            if not reviewer:
                return jsonify({
                    "success": False,
                    "message": "Reviewer user not found"
                }), 404

        # Validate rating
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

        # Validate status
        allowed_statuses = [
            "Draft",
            "Completed"
        ]

        if status not in allowed_statuses:
            return jsonify({
                "success": False,
                "message": "Invalid performance status"
            }), 400

        updated_at = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        cursor.execute("""
            UPDATE performance
            SET
                employee_id = ?,
                reviewer_id = ?,
                review_period = ?,
                rating = ?,
                strengths = ?,
                areas_for_improvement = ?,
                comments = ?,
                status = ?,
                updated_at = ?
            WHERE id = ?
        """, (
            employee_id,
            reviewer_id,
            review_period,
            rating,
            strengths,
            areas_for_improvement,
            comments,
            status,
            updated_at,
            performance_id
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Performance record updated successfully",
            "performance_id": performance_id,
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
# DELETE PERFORMANCE RECORD
# =========================================================

@performance.route(
    "/api/performance/<int:performance_id>",
    methods=["DELETE"]
)
def delete_performance(performance_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT *
            FROM performance
            WHERE id = ?
        """, (performance_id,))

        record = cursor.fetchone()

        if not record:
            return jsonify({
                "success": False,
                "message": "Performance record not found"
            }), 404

        cursor.execute("""
            DELETE FROM performance
            WHERE id = ?
        """, (performance_id,))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Performance record deleted successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500

    finally:
        connection.close()