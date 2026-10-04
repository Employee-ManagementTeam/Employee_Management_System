from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId


reports = Blueprint("reports", __name__)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def valid_object_id(value):
    return ObjectId.is_valid(value)


def employee_details(db, employee_id):
    """
    Get employee details for report records.
    """
    if not employee_id:
        return None

    employee = db["employees"].find_one({
        "_id": employee_id
    })

    if not employee:
        return None

    return {
        "employee_code":
            employee.get("employee_code", ""),
        "employee_name":
            (
                str(employee.get("first_name", ""))
                + " "
                + str(employee.get("last_name", ""))
            ).strip()
    }


# ============================================================
# ATTENDANCE REPORT
# ============================================================

@reports.route(
    "/api/reports/attendance",
    methods=["GET"]
)
def attendance_report():

    employee_id = request.args.get(
        "employee_id"
    )

    start_date = request.args.get(
        "start_date"
    )

    end_date = request.args.get(
        "end_date"
    )

    db = get_db()

    attendance_collection = db[
        "attendance"
    ]

    query = {}

    # --------------------------------------------------------
    # Employee filter
    # --------------------------------------------------------

    if employee_id:

        if not valid_object_id(employee_id):

            return jsonify({
                "success": False,
                "message": "Invalid employee ID"
            }), 400

        query["employee_id"] = ObjectId(
            employee_id
        )

    # --------------------------------------------------------
    # Date filters
    # --------------------------------------------------------

    if start_date or end_date:

        query["attendance_date"] = {}

        if start_date:
            query["attendance_date"]["$gte"] = start_date

        if end_date:
            query["attendance_date"]["$lte"] = end_date

    records = attendance_collection.find(
        query
    ).sort(
        "attendance_date",
        -1
    )

    attendance_list = []

    for record in records:

        employee = employee_details(
            db,
            record.get("employee_id")
        )

        if not employee:
            continue

        attendance_list.append({
            "id":
                str(record["_id"]),

            "employee_id":
                str(record["employee_id"]),

            "employee_code":
                employee["employee_code"],

            "employee_name":
                employee["employee_name"],

            "attendance_date":
                record.get("attendance_date"),

            "check_in":
                record.get("check_in"),

            "check_out":
                record.get("check_out"),

            "status":
                record.get("status")
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


# ============================================================
# LEAVE REPORT
# ============================================================

@reports.route(
    "/api/reports/leaves",
    methods=["GET"]
)
def leave_report():

    employee_id = request.args.get(
        "employee_id"
    )

    status = request.args.get(
        "status"
    )

    db = get_db()

    leaves_collection = db[
        "leaves"
    ]

    query = {}

    # --------------------------------------------------------
    # Employee filter
    # --------------------------------------------------------

    if employee_id:

        if not valid_object_id(employee_id):

            return jsonify({
                "success": False,
                "message": "Invalid employee ID"
            }), 400

        query["employee_id"] = ObjectId(
            employee_id
        )

    # --------------------------------------------------------
    # Status filter
    # --------------------------------------------------------

    if status:

        query["status"] = status

    records = leaves_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    leave_list = []

    for record in records:

        employee = employee_details(
            db,
            record.get("employee_id")
        )

        if not employee:
            continue

        leave_list.append({
            "id":
                str(record["_id"]),

            "employee_id":
                str(record["employee_id"]),

            "employee_code":
                employee["employee_code"],

            "employee_name":
                employee["employee_name"],

            "leave_type":
                record.get("leave_type"),

            "start_date":
                record.get("start_date"),

            "end_date":
                record.get("end_date"),

            "reason":
                record.get("reason"),

            "status":
                record.get("status"),

            "applied_at":
                record.get("applied_at")
        })

    total = len(
        leave_list
    )

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


# ============================================================
# TASK REPORT
# ============================================================

@reports.route(
    "/api/reports/tasks",
    methods=["GET"]
)
def task_report():

    employee_id = request.args.get(
        "employee_id"
    )

    status = request.args.get(
        "status"
    )

    db = get_db()

    tasks_collection = db[
        "tasks"
    ]

    query = {}

    # --------------------------------------------------------
    # Employee filter
    # --------------------------------------------------------

    if employee_id:

        if not valid_object_id(employee_id):

            return jsonify({
                "success": False,
                "message": "Invalid employee ID"
            }), 400

        query["employee_id"] = ObjectId(
            employee_id
        )

    # --------------------------------------------------------
    # Status filter
    # --------------------------------------------------------

    if status:

        query["status"] = status

    records = tasks_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    task_list = []

    for record in records:

        employee = employee_details(
            db,
            record.get("employee_id")
        )

        if not employee:
            continue

        task_list.append({
            "id":
                str(record["_id"]),

            "employee_id":
                str(record["employee_id"]),

            "employee_code":
                employee["employee_code"],

            "employee_name":
                employee["employee_name"],

            "title":
                record.get("title"),

            "description":
                record.get("description"),

            "priority":
                record.get("priority"),

            "due_date":
                record.get("due_date"),

            "status":
                record.get("status"),

            "created_at":
                record.get("created_at")
        })

    total = len(
        task_list
    )

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


# ============================================================
# PERFORMANCE REPORT
# ============================================================

@reports.route(
    "/api/reports/performance",
    methods=["GET"]
)
def performance_report():

    employee_id = request.args.get(
        "employee_id"
    )

    db = get_db()

    performance_collection = db[
        "performance"
    ]

    query = {}

    # --------------------------------------------------------
    # Employee filter
    # --------------------------------------------------------

    if employee_id:

        if not valid_object_id(employee_id):

            return jsonify({
                "success": False,
                "message": "Invalid employee ID"
            }), 400

        query["employee_id"] = ObjectId(
            employee_id
        )

    records = performance_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    performance_list = []

    for record in records:

        employee = employee_details(
            db,
            record.get("employee_id")
        )

        if not employee:
            continue

        performance_list.append({
            "id":
                str(record["_id"]),

            "employee_id":
                str(record["employee_id"]),

            "employee_code":
                employee["employee_code"],

            "employee_name":
                employee["employee_name"],

            "review_period":
                record.get("review_period"),

            "rating":
                record.get("rating"),

            "strengths":
                record.get("strengths"),

            "areas_for_improvement":
                record.get(
                    "areas_for_improvement"
                ),

            "comments":
                record.get("comments"),

            "status":
                record.get("status"),

            "created_at":
                record.get("created_at")
        })

    total_reviews = len(
        performance_list
    )

    average_rating = 0

    if total_reviews > 0:

        ratings = [
            float(item["rating"])
            for item in performance_list
            if item["rating"] is not None
        ]

        if ratings:

            average_rating = round(
                sum(ratings) / len(ratings),
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


# ============================================================
# PAYROLL REPORT
# ============================================================

@reports.route(
    "/api/reports/payroll",
    methods=["GET"]
)
def payroll_report():

    employee_id = request.args.get(
        "employee_id"
    )

    payroll_month = request.args.get(
        "payroll_month"
    )

    db = get_db()

    payroll_collection = db[
        "payroll"
    ]

    query = {}

    # --------------------------------------------------------
    # Employee filter
    # --------------------------------------------------------

    if employee_id:

        if not valid_object_id(employee_id):

            return jsonify({
                "success": False,
                "message": "Invalid employee ID"
            }), 400

        query["employee_id"] = ObjectId(
            employee_id
        )

    # --------------------------------------------------------
    # Payroll month filter
    # --------------------------------------------------------

    if payroll_month:

        query["payroll_month"] = payroll_month

    records = payroll_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    payroll_list = []

    for record in records:

        employee = employee_details(
            db,
            record.get("employee_id")
        )

        if not employee:
            continue

        payroll_list.append({
            "id":
                str(record["_id"]),

            "employee_id":
                str(record["employee_id"]),

            "employee_code":
                employee["employee_code"],

            "employee_name":
                employee["employee_name"],

            "payroll_month":
                record.get("payroll_month"),

            "basic_salary":
                record.get("basic_salary", 0),

            "allowances":
                record.get("allowances", 0),

            "deductions":
                record.get("deductions", 0),

            "gross_salary":
                record.get("gross_salary", 0),

            "net_salary":
                record.get("net_salary", 0),

            "payment_status":
                record.get("payment_status"),

            "payment_date":
                record.get("payment_date"),

            "created_at":
                record.get("created_at")
        })

    total_records = len(
        payroll_list
    )

    total_gross = round(
        sum(
            float(item["gross_salary"] or 0)
            for item in payroll_list
        ),
        2
    )

    total_net = round(
        sum(
            float(item["net_salary"] or 0)
            for item in payroll_list
        ),
        2
    )

    total_deductions = round(
        sum(
            float(item["deductions"] or 0)
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