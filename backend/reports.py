from flask import Blueprint, request, jsonify
from database import get_connection


reports = Blueprint("reports", __name__)


# ============================================================
# ATTENDANCE REPORT
# ============================================================

@reports.route(
    "/api/reports/attendance",
    methods=["GET"]
)
def attendance_report():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        employee_id = request.args.get("employee_id")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        query = """
            SELECT
                attendance.id,
                attendance.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                attendance.attendance_date,
                attendance.check_in,
                attendance.check_out,
                attendance.status
            FROM attendance
            INNER JOIN employees
                ON attendance.employee_id = employees.id
            WHERE 1 = 1
        """

        parameters = []

        if employee_id:

            query += """
                AND attendance.employee_id = ?
            """

            parameters.append(employee_id)

        if start_date:

            query += """
                AND attendance.attendance_date >= ?
            """

            parameters.append(start_date)

        if end_date:

            query += """
                AND attendance.attendance_date <= ?
            """

            parameters.append(end_date)

        query += """
            ORDER BY attendance.attendance_date DESC
        """

        cursor.execute(
            query,
            parameters
        )

        records = cursor.fetchall()

        attendance_list = []

        for record in records:

            attendance_list.append({
                "id": record["id"],
                "employee_id":
                    record["employee_id"],
                "employee_code":
                    record["employee_code"],
                "employee_name":
                    record["first_name"]
                    + " "
                    + record["last_name"],
                "attendance_date":
                    record["attendance_date"],
                "check_in":
                    record["check_in"],
                "check_out":
                    record["check_out"],
                "status":
                    record["status"]
            })

        total_records = len(
            attendance_list
        )

        present_count = sum(
            1
            for item in attendance_list
            if item["status"] == "Present"
        )

        absent_count = sum(
            1
            for item in attendance_list
            if item["status"] == "Absent"
        )

        return jsonify({
            "success": True,
            "summary": {
                "total_records":
                    total_records,
                "present":
                    present_count,
                "absent":
                    absent_count
            },
            "records":
                attendance_list
        }), 200

    finally:

        connection.close()


# ============================================================
# LEAVE REPORT
# ============================================================

@reports.route(
    "/api/reports/leaves",
    methods=["GET"]
)
def leave_report():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        employee_id = request.args.get(
            "employee_id"
        )

        status = request.args.get(
            "status"
        )

        query = """
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
                leaves.applied_at
            FROM leaves
            INNER JOIN employees
                ON leaves.employee_id = employees.id
            WHERE 1 = 1
        """

        parameters = []

        if employee_id:

            query += """
                AND leaves.employee_id = ?
            """

            parameters.append(employee_id)

        if status:

            query += """
                AND leaves.status = ?
            """

            parameters.append(status)

        query += """
            ORDER BY leaves.id DESC
        """

        cursor.execute(
            query,
            parameters
        )

        records = cursor.fetchall()

        leave_list = []

        for record in records:

            leave_list.append({
                "id":
                    record["id"],
                "employee_id":
                    record["employee_id"],
                "employee_code":
                    record["employee_code"],
                "employee_name":
                    record["first_name"]
                    + " "
                    + record["last_name"],
                "leave_type":
                    record["leave_type"],
                "start_date":
                    record["start_date"],
                "end_date":
                    record["end_date"],
                "reason":
                    record["reason"],
                "status":
                    record["status"],
                "applied_at":
                    record["applied_at"]
            })

        total = len(leave_list)

        pending = sum(
            1
            for item in leave_list
            if item["status"] == "Pending"
        )

        approved = sum(
            1
            for item in leave_list
            if item["status"] == "Approved"
        )

        rejected = sum(
            1
            for item in leave_list
            if item["status"] == "Rejected"
        )

        return jsonify({
            "success": True,
            "summary": {
                "total":
                    total,
                "pending":
                    pending,
                "approved":
                    approved,
                "rejected":
                    rejected
            },
            "records":
                leave_list
        }), 200

    finally:

        connection.close()


# ============================================================
# TASK REPORT
# ============================================================

@reports.route(
    "/api/reports/tasks",
    methods=["GET"]
)
def task_report():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        employee_id = request.args.get(
            "employee_id"
        )

        status = request.args.get(
            "status"
        )

        query = """
            SELECT
                tasks.id,
                tasks.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                tasks.title,
                tasks.description,
                tasks.priority,
                tasks.due_date,
                tasks.status,
                tasks.created_at
            FROM tasks
            INNER JOIN employees
                ON tasks.employee_id = employees.id
            WHERE 1 = 1
        """

        parameters = []

        if employee_id:

            query += """
                AND tasks.employee_id = ?
            """

            parameters.append(employee_id)

        if status:

            query += """
                AND tasks.status = ?
            """

            parameters.append(status)

        query += """
            ORDER BY tasks.id DESC
        """

        cursor.execute(
            query,
            parameters
        )

        records = cursor.fetchall()

        task_list = []

        for record in records:

            task_list.append({
                "id":
                    record["id"],
                "employee_id":
                    record["employee_id"],
                "employee_code":
                    record["employee_code"],
                "employee_name":
                    record["first_name"]
                    + " "
                    + record["last_name"],
                "title":
                    record["title"],
                "description":
                    record["description"],
                "priority":
                    record["priority"],
                "due_date":
                    record["due_date"],
                "status":
                    record["status"],
                "created_at":
                    record["created_at"]
            })

        total = len(task_list)

        pending = sum(
            1
            for item in task_list
            if item["status"] == "Pending"
        )

        in_progress = sum(
            1
            for item in task_list
            if item["status"] == "In Progress"
        )

        completed = sum(
            1
            for item in task_list
            if item["status"] == "Completed"
        )

        return jsonify({
            "success": True,
            "summary": {
                "total":
                    total,
                "pending":
                    pending,
                "in_progress":
                    in_progress,
                "completed":
                    completed
            },
            "records":
                task_list
        }), 200

    finally:

        connection.close()


# ============================================================
# PERFORMANCE REPORT
# ============================================================

@reports.route(
    "/api/reports/performance",
    methods=["GET"]
)
def performance_report():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        employee_id = request.args.get(
            "employee_id"
        )

        query = """
            SELECT
                performance.id,
                performance.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                performance.review_period,
                performance.rating,
                performance.strengths,
                performance.areas_for_improvement,
                performance.comments,
                performance.status,
                performance.created_at
            FROM performance
            INNER JOIN employees
                ON performance.employee_id = employees.id
            WHERE 1 = 1
        """

        parameters = []

        if employee_id:

            query += """
                AND performance.employee_id = ?
            """

            parameters.append(employee_id)

        query += """
            ORDER BY performance.id DESC
        """

        cursor.execute(
            query,
            parameters
        )

        records = cursor.fetchall()

        performance_list = []

        for record in records:

            performance_list.append({
                "id":
                    record["id"],
                "employee_id":
                    record["employee_id"],
                "employee_code":
                    record["employee_code"],
                "employee_name":
                    record["first_name"]
                    + " "
                    + record["last_name"],
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
                    record["created_at"]
            })

        total_reviews = len(
            performance_list
        )

        average_rating = 0

        if total_reviews > 0:

            average_rating = round(
                sum(
                    item["rating"]
                    for item in performance_list
                ) / total_reviews,
                2
            )

        return jsonify({
            "success": True,
            "summary": {
                "total_reviews":
                    total_reviews,
                "average_rating":
                    average_rating
            },
            "records":
                performance_list
        }), 200

    finally:

        connection.close()


# ============================================================
# PAYROLL REPORT
# ============================================================

@reports.route(
    "/api/reports/payroll",
    methods=["GET"]
)
def payroll_report():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        employee_id = request.args.get(
            "employee_id"
        )

        payroll_month = request.args.get(
            "payroll_month"
        )

        query = """
            SELECT
                payroll.id,
                payroll.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                payroll.payroll_month,
                payroll.basic_salary,
                payroll.allowances,
                payroll.deductions,
                payroll.gross_salary,
                payroll.net_salary,
                payroll.payment_status,
                payroll.payment_date,
                payroll.created_at
            FROM payroll
            INNER JOIN employees
                ON payroll.employee_id = employees.id
            WHERE 1 = 1
        """

        parameters = []

        if employee_id:

            query += """
                AND payroll.employee_id = ?
            """

            parameters.append(employee_id)

        if payroll_month:

            query += """
                AND payroll.payroll_month = ?
            """

            parameters.append(payroll_month)

        query += """
            ORDER BY payroll.id DESC
        """

        cursor.execute(
            query,
            parameters
        )

        records = cursor.fetchall()

        payroll_list = []

        for record in records:

            payroll_list.append({
                "id":
                    record["id"],
                "employee_id":
                    record["employee_id"],
                "employee_code":
                    record["employee_code"],
                "employee_name":
                    record["first_name"]
                    + " "
                    + record["last_name"],
                "payroll_month":
                    record["payroll_month"],
                "basic_salary":
                    record["basic_salary"],
                "allowances":
                    record["allowances"],
                "deductions":
                    record["deductions"],
                "gross_salary":
                    record["gross_salary"],
                "net_salary":
                    record["net_salary"],
                "payment_status":
                    record["payment_status"],
                "payment_date":
                    record["payment_date"],
                "created_at":
                    record["created_at"]
            })

        total_records = len(
            payroll_list
        )

        total_gross = round(
            sum(
                item["gross_salary"]
                for item in payroll_list
            ),
            2
        )

        total_net = round(
            sum(
                item["net_salary"]
                for item in payroll_list
            ),
            2
        )

        total_deductions = round(
            sum(
                item["deductions"]
                for item in payroll_list
            ),
            2
        )

        return jsonify({
            "success": True,
            "summary": {
                "total_records":
                    total_records,
                "total_gross_salary":
                    total_gross,
                "total_net_salary":
                    total_net,
                "total_deductions":
                    total_deductions
            },
            "records":
                payroll_list
        }), 200

    finally:

        connection.close()