from flask import Blueprint, request, jsonify
from database import get_db
from bson import ObjectId
from datetime import datetime


payroll = Blueprint(
    "payroll",
    __name__
)


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def valid_object_id(value):
    return ObjectId.is_valid(value)


def salary_response(record):
    return {
        "id": str(record["_id"]),
        "employee_id": str(record["employee_id"]),
        "basic_salary": record.get("basic_salary", 0),
        "housing_allowance": record.get("housing_allowance", 0),
        "transport_allowance": record.get("transport_allowance", 0),
        "other_allowance": record.get("other_allowance", 0),
        "deductions": record.get("deductions", 0),
        "effective_from": record.get("effective_from"),
        "status": record.get("status"),
        "created_at": record.get("created_at"),
        "updated_at": record.get("updated_at")
    }


def payroll_response(record, employee=None):
    response = {
        "id": str(record["_id"]),
        "employee_id": str(record["employee_id"]),
        "salary_id": (
            str(record["salary_id"])
            if record.get("salary_id")
            else None
        ),
        "payroll_month": record.get("payroll_month"),
        "basic_salary": record.get("basic_salary", 0),
        "allowances": record.get("allowances", 0),
        "deductions": record.get("deductions", 0),
        "gross_salary": record.get("gross_salary", 0),
        "net_salary": record.get("net_salary", 0),
        "payment_status": record.get("payment_status"),
        "payment_date": record.get("payment_date"),
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
# CREATE SALARY RECORD
# =========================================================

@payroll.route(
    "/api/salary",
    methods=["POST"]
)
def create_salary():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    employee_id = data.get("employee_id")
    basic_salary = data.get("basic_salary")
    housing_allowance = data.get(
        "housing_allowance",
        0
    )
    transport_allowance = data.get(
        "transport_allowance",
        0
    )
    other_allowance = data.get(
        "other_allowance",
        0
    )
    deductions = data.get(
        "deductions",
        0
    )
    effective_from = data.get(
        "effective_from"
    )
    status = data.get(
        "status",
        "Active"
    )

    if not employee_id:
        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    if basic_salary is None:
        return jsonify({
            "success": False,
            "message": "Basic salary is required"
        }), 400

    if not valid_object_id(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    try:
        basic_salary = float(basic_salary)
        housing_allowance = float(housing_allowance)
        transport_allowance = float(transport_allowance)
        other_allowance = float(other_allowance)
        deductions = float(deductions)
    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Salary values must be numbers"
        }), 400

    if basic_salary < 0:
        return jsonify({
            "success": False,
            "message": "Basic salary cannot be negative"
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    salary_collection = db["salary"]

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    try:

        now = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        salary_record = {
            "employee_id": ObjectId(employee_id),
            "basic_salary": basic_salary,
            "housing_allowance": housing_allowance,
            "transport_allowance": transport_allowance,
            "other_allowance": other_allowance,
            "deductions": deductions,
            "effective_from": effective_from,
            "status": status,
            "created_at": now,
            "updated_at": now
        }

        result = salary_collection.insert_one(
            salary_record
        )

        return jsonify({
            "success": True,
            "message":
                "Salary record created successfully",
            "salary_id":
                str(result.inserted_id)
        }), 201

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# GET ALL SALARY RECORDS
# =========================================================

@payroll.route(
    "/api/salary",
    methods=["GET"]
)
def get_salary_records():

    db = get_db()

    salary_collection = db["salary"]
    employees_collection = db["employees"]

    records = salary_collection.find().sort(
        "_id",
        -1
    )

    salary_list = []

    for record in records:

        employee = employees_collection.find_one({
            "_id": record["employee_id"]
        })

        response = salary_response(record)

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

        salary_list.append(response)

    return jsonify({
        "success": True,
        "salary": salary_list
    }), 200


# =========================================================
# GET EMPLOYEE SALARY
# =========================================================

@payroll.route(
    "/api/salary/employee/<employee_id>",
    methods=["GET"]
)
def get_employee_salary(employee_id):

    if not valid_object_id(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    salary_collection = db["salary"]

    employee_object_id = ObjectId(employee_id)

    employee = employees_collection.find_one({
        "_id": employee_object_id
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    records = salary_collection.find({
        "employee_id": employee_object_id
    }).sort(
        "_id",
        -1
    )

    salary_list = []

    for record in records:
        salary_list.append(
            salary_response(record)
        )

    return jsonify({
        "success": True,
        "salary": salary_list
    }), 200


# =========================================================
# UPDATE SALARY
# =========================================================

@payroll.route(
    "/api/salary/<salary_id>",
    methods=["PUT"]
)
def update_salary(salary_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    if not valid_object_id(salary_id):
        return jsonify({
            "success": False,
            "message": "Invalid salary ID"
        }), 400

    db = get_db()

    salary_collection = db["salary"]
    employees_collection = db["employees"]

    salary_object_id = ObjectId(salary_id)

    record = salary_collection.find_one({
        "_id": salary_object_id
    })

    if not record:
        return jsonify({
            "success": False,
            "message": "Salary record not found"
        }), 404

    employee_id = data.get(
        "employee_id",
        str(record["employee_id"])
    )

    basic_salary = data.get(
        "basic_salary",
        record["basic_salary"]
    )

    housing_allowance = data.get(
        "housing_allowance",
        record["housing_allowance"]
    )

    transport_allowance = data.get(
        "transport_allowance",
        record["transport_allowance"]
    )

    other_allowance = data.get(
        "other_allowance",
        record["other_allowance"]
    )

    deductions = data.get(
        "deductions",
        record["deductions"]
    )

    effective_from = data.get(
        "effective_from",
        record.get("effective_from")
    )

    status = data.get(
        "status",
        record.get("status")
    )

    if not valid_object_id(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    try:

        basic_salary = float(basic_salary)
        housing_allowance = float(housing_allowance)
        transport_allowance = float(transport_allowance)
        other_allowance = float(other_allowance)
        deductions = float(deductions)

    except (TypeError, ValueError):

        return jsonify({
            "success": False,
            "message": "Salary values must be numbers"
        }), 400

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    updated_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    try:

        salary_collection.update_one(
            {
                "_id": salary_object_id
            },
            {
                "$set": {
                    "employee_id":
                        ObjectId(employee_id),
                    "basic_salary":
                        basic_salary,
                    "housing_allowance":
                        housing_allowance,
                    "transport_allowance":
                        transport_allowance,
                    "other_allowance":
                        other_allowance,
                    "deductions":
                        deductions,
                    "effective_from":
                        effective_from,
                    "status":
                        status,
                    "updated_at":
                        updated_at
                }
            }
        )

        return jsonify({
            "success": True,
            "message":
                "Salary record updated successfully",
            "salary_id":
                salary_id
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# DELETE SALARY
# =========================================================

@payroll.route(
    "/api/salary/<salary_id>",
    methods=["DELETE"]
)
def delete_salary(salary_id):

    if not valid_object_id(salary_id):
        return jsonify({
            "success": False,
            "message": "Invalid salary ID"
        }), 400

    db = get_db()

    salary_collection = db["salary"]

    salary_object_id = ObjectId(salary_id)

    record = salary_collection.find_one({
        "_id": salary_object_id
    })

    if not record:
        return jsonify({
            "success": False,
            "message": "Salary record not found"
        }), 404

    try:

        salary_collection.delete_one({
            "_id": salary_object_id
        })

        return jsonify({
            "success": True,
            "message":
                "Salary record deleted successfully"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# CREATE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll",
    methods=["POST"]
)
def create_payroll():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    employee_id = data.get(
        "employee_id"
    )

    salary_id = data.get(
        "salary_id"
    )

    payroll_month = data.get(
        "payroll_month"
    )

    basic_salary = data.get(
        "basic_salary"
    )

    allowances = data.get(
        "allowances",
        0
    )

    deductions = data.get(
        "deductions",
        0
    )

    payment_status = data.get(
        "payment_status",
        "Pending"
    )

    payment_date = data.get(
        "payment_date"
    )

    if not employee_id:
        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    if not payroll_month:
        return jsonify({
            "success": False,
            "message": "Payroll month is required"
        }), 400

    if basic_salary is None:
        return jsonify({
            "success": False,
            "message": "Basic salary is required"
        }), 400

    if not valid_object_id(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    if salary_id and not valid_object_id(salary_id):
        return jsonify({
            "success": False,
            "message": "Invalid salary ID"
        }), 400

    try:

        basic_salary = float(
            basic_salary
        )

        allowances = float(
            allowances
        )

        deductions = float(
            deductions
        )

    except (TypeError, ValueError):

        return jsonify({
            "success": False,
            "message":
                "Payroll values must be numbers"
        }), 400

    gross_salary = (
        basic_salary
        + allowances
    )

    net_salary = (
        gross_salary
        - deductions
    )

    db = get_db()

    employees_collection = db["employees"]
    salary_collection = db["salary"]
    payroll_collection = db["payroll"]

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    if salary_id:

        salary = salary_collection.find_one({
            "_id": ObjectId(salary_id)
        })

        if not salary:
            return jsonify({
                "success": False,
                "message": "Salary record not found"
            }), 404

    try:

        now = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        payroll_record = {
            "employee_id":
                ObjectId(employee_id),

            "salary_id":
                ObjectId(salary_id)
                if salary_id
                else None,

            "payroll_month":
                payroll_month,

            "basic_salary":
                basic_salary,

            "allowances":
                allowances,

            "deductions":
                deductions,

            "gross_salary":
                gross_salary,

            "net_salary":
                net_salary,

            "payment_status":
                payment_status,

            "payment_date":
                payment_date,

            "created_at":
                now,

            "updated_at":
                now
        }

        result = payroll_collection.insert_one(
            payroll_record
        )

        return jsonify({
            "success": True,
            "message":
                "Payroll created successfully",
            "payroll_id":
                str(result.inserted_id),
            "gross_salary":
                gross_salary,
            "net_salary":
                net_salary,
            "payment_status":
                payment_status
        }), 201

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# GET ALL PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll",
    methods=["GET"]
)
def get_all_payroll():

    db = get_db()

    payroll_collection = db["payroll"]
    employees_collection = db["employees"]

    records = payroll_collection.find().sort(
        "_id",
        -1
    )

    payroll_list = []

    for record in records:

        employee = employees_collection.find_one({
            "_id": record["employee_id"]
        })

        payroll_list.append(
            payroll_response(
                record,
                employee
            )
        )

    return jsonify({
        "success": True,
        "payroll": payroll_list
    }), 200


# =========================================================
# GET SINGLE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll/<payroll_id>",
    methods=["GET"]
)
def get_single_payroll(payroll_id):

    if not valid_object_id(payroll_id):
        return jsonify({
            "success": False,
            "message": "Invalid payroll ID"
        }), 400

    db = get_db()

    payroll_collection = db["payroll"]
    employees_collection = db["employees"]

    record = payroll_collection.find_one({
        "_id": ObjectId(payroll_id)
    })

    if not record:
        return jsonify({
            "success": False,
            "message": "Payroll record not found"
        }), 404

    employee = employees_collection.find_one({
        "_id": record["employee_id"]
    })

    return jsonify({
        "success": True,
        "payroll":
            payroll_response(
                record,
                employee
            )
    }), 200


# =========================================================
# GET EMPLOYEE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll/employee/<employee_id>",
    methods=["GET"]
)
def get_employee_payroll(employee_id):

    if not valid_object_id(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    payroll_collection = db["payroll"]

    employee_object_id = ObjectId(
        employee_id
    )

    employee = employees_collection.find_one({
        "_id": employee_object_id
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    records = payroll_collection.find({
        "employee_id": employee_object_id
    }).sort(
        "_id",
        -1
    )

    payroll_list = []

    for record in records:

        payroll_list.append(
            payroll_response(record)
        )

    return jsonify({
        "success": True,
        "payroll": payroll_list
    }), 200


# =========================================================
# UPDATE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll/<payroll_id>",
    methods=["PUT"]
)
def update_payroll(payroll_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    if not valid_object_id(payroll_id):
        return jsonify({
            "success": False,
            "message": "Invalid payroll ID"
        }), 400

    db = get_db()

    payroll_collection = db["payroll"]
    employees_collection = db["employees"]
    salary_collection = db["salary"]

    payroll_object_id = ObjectId(
        payroll_id
    )

    record = payroll_collection.find_one({
        "_id": payroll_object_id
    })

    if not record:
        return jsonify({
            "success": False,
            "message": "Payroll record not found"
        }), 404

    employee_id = data.get(
        "employee_id",
        str(record["employee_id"])
    )

    salary_id = data.get(
        "salary_id",
        (
            str(record["salary_id"])
            if record.get("salary_id")
            else None
        )
    )

    payroll_month = data.get(
        "payroll_month",
        record["payroll_month"]
    )

    basic_salary = data.get(
        "basic_salary",
        record["basic_salary"]
    )

    allowances = data.get(
        "allowances",
        record["allowances"]
    )

    deductions = data.get(
        "deductions",
        record["deductions"]
    )

    payment_status = data.get(
        "payment_status",
        record["payment_status"]
    )

    payment_date = data.get(
        "payment_date",
        record.get("payment_date")
    )

    if not valid_object_id(employee_id):
        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    if salary_id and not valid_object_id(salary_id):
        return jsonify({
            "success": False,
            "message": "Invalid salary ID"
        }), 400

    try:

        basic_salary = float(
            basic_salary
        )

        allowances = float(
            allowances
        )

        deductions = float(
            deductions
        )

    except (TypeError, ValueError):

        return jsonify({
            "success": False,
            "message":
                "Payroll values must be numbers"
        }), 400

    gross_salary = (
        basic_salary
        + allowances
    )

    net_salary = (
        gross_salary
        - deductions
    )

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    if salary_id:

        salary = salary_collection.find_one({
            "_id": ObjectId(salary_id)
        })

        if not salary:
            return jsonify({
                "success": False,
                "message": "Salary record not found"
            }), 404

    updated_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    try:

        payroll_collection.update_one(
            {
                "_id": payroll_object_id
            },
            {
                "$set": {
                    "employee_id":
                        ObjectId(employee_id),

                    "salary_id":
                        ObjectId(salary_id)
                        if salary_id
                        else None,

                    "payroll_month":
                        payroll_month,

                    "basic_salary":
                        basic_salary,

                    "allowances":
                        allowances,

                    "deductions":
                        deductions,

                    "gross_salary":
                        gross_salary,

                    "net_salary":
                        net_salary,

                    "payment_status":
                        payment_status,

                    "payment_date":
                        payment_date,

                    "updated_at":
                        updated_at
                }
            }
        )

        return jsonify({
            "success": True,
            "message":
                "Payroll updated successfully",
            "payroll_id":
                payroll_id,
            "gross_salary":
                gross_salary,
            "net_salary":
                net_salary
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# DELETE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll/<payroll_id>",
    methods=["DELETE"]
)
def delete_payroll(payroll_id):

    if not valid_object_id(payroll_id):
        return jsonify({
            "success": False,
            "message": "Invalid payroll ID"
        }), 400

    db = get_db()

    payroll_collection = db["payroll"]

    payroll_object_id = ObjectId(
        payroll_id
    )

    record = payroll_collection.find_one({
        "_id": payroll_object_id
    })

    if not record:
        return jsonify({
            "success": False,
            "message": "Payroll record not found"
        }), 404

    try:

        payroll_collection.delete_one({
            "_id": payroll_object_id
        })

        return jsonify({
            "success": True,
            "message":
                "Payroll deleted successfully"
        }), 200

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500