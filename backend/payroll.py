from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime


payroll = Blueprint(
    "payroll",
    __name__
)


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


    employee_id = data.get(
        "employee_id"
    )

    basic_salary = data.get(
        "basic_salary"
    )

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


    try:

        basic_salary = float(
            basic_salary
        )

        housing_allowance = float(
            housing_allowance
        )

        transport_allowance = float(
            transport_allowance
        )

        other_allowance = float(
            other_allowance
        )

        deductions = float(
            deductions
        )

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
            INSERT INTO salary (
                employee_id,
                basic_salary,
                housing_allowance,
                transport_allowance,
                other_allowance,
                deductions,
                effective_from,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            employee_id,
            basic_salary,
            housing_allowance,
            transport_allowance,
            other_allowance,
            deductions,
            effective_from,
            status
        ))


        connection.commit()

        salary_id = cursor.lastrowid


        return jsonify({

            "success": True,

            "message":
                "Salary record created successfully",

            "salary_id":
                salary_id

        }), 201


    except Exception as error:

        connection.rollback()

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500


    finally:

        connection.close()


# =========================================================
# GET ALL SALARY RECORDS
# =========================================================

@payroll.route(
    "/api/salary",
    methods=["GET"]
)
def get_salary_records():

    connection = get_connection()
    cursor = connection.cursor()


    try:

        cursor.execute("""
            SELECT
                salary.id,
                salary.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                salary.basic_salary,
                salary.housing_allowance,
                salary.transport_allowance,
                salary.other_allowance,
                salary.deductions,
                salary.effective_from,
                salary.status,
                salary.created_at,
                salary.updated_at

            FROM salary

            INNER JOIN employees
                ON salary.employee_id =
                   employees.id

            ORDER BY salary.id DESC
        """)


        records = cursor.fetchall()

        salary_list = []


        for record in records:

            salary_list.append({

                "id":
                    record["id"],

                "employee_id":
                    record["employee_id"],

                "employee_code":
                    record["employee_code"],

                "first_name":
                    record["first_name"],

                "last_name":
                    record["last_name"],

                "basic_salary":
                    record["basic_salary"],

                "housing_allowance":
                    record["housing_allowance"],

                "transport_allowance":
                    record["transport_allowance"],

                "other_allowance":
                    record["other_allowance"],

                "deductions":
                    record["deductions"],

                "effective_from":
                    record["effective_from"],

                "status":
                    record["status"],

                "created_at":
                    record["created_at"],

                "updated_at":
                    record["updated_at"]
            })


        return jsonify({

            "success": True,

            "salary":
                salary_list

        }), 200


    finally:

        connection.close()


# =========================================================
# GET EMPLOYEE SALARY
# =========================================================

@payroll.route(
    "/api/salary/employee/<int:employee_id>",
    methods=["GET"]
)
def get_employee_salary(employee_id):

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

                "message":
                    "Employee not found"

            }), 404


        cursor.execute("""
            SELECT *
            FROM salary
            WHERE employee_id = ?
            ORDER BY id DESC
        """, (employee_id,))


        records = cursor.fetchall()

        salary_list = []


        for record in records:

            salary_list.append({

                "id":
                    record["id"],

                "employee_id":
                    record["employee_id"],

                "basic_salary":
                    record["basic_salary"],

                "housing_allowance":
                    record["housing_allowance"],

                "transport_allowance":
                    record["transport_allowance"],

                "other_allowance":
                    record["other_allowance"],

                "deductions":
                    record["deductions"],

                "effective_from":
                    record["effective_from"],

                "status":
                    record["status"],

                "created_at":
                    record["created_at"],

                "updated_at":
                    record["updated_at"]
            })


        return jsonify({

            "success": True,

            "salary":
                salary_list

        }), 200


    finally:

        connection.close()


# =========================================================
# UPDATE SALARY
# =========================================================

@payroll.route(
    "/api/salary/<int:salary_id>",
    methods=["PUT"]
)
def update_salary(salary_id):

    data = request.get_json()


    if not data:

        return jsonify({

            "success": False,

            "message":
                "Request body is required"

        }), 400


    connection = get_connection()
    cursor = connection.cursor()


    try:

        cursor.execute("""
            SELECT *
            FROM salary
            WHERE id = ?
        """, (salary_id,))

        record = cursor.fetchone()


        if not record:

            return jsonify({

                "success": False,

                "message":
                    "Salary record not found"

            }), 404


        employee_id = data.get(
            "employee_id",
            record["employee_id"]
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
            record["effective_from"]
        )

        status = data.get(
            "status",
            record["status"]
        )


        try:

            basic_salary = float(
                basic_salary
            )

            housing_allowance = float(
                housing_allowance
            )

            transport_allowance = float(
                transport_allowance
            )

            other_allowance = float(
                other_allowance
            )

            deductions = float(
                deductions
            )

        except (TypeError, ValueError):

            return jsonify({

                "success": False,

                "message":
                    "Salary values must be numbers"

            }), 400


        cursor.execute("""
            SELECT *
            FROM employees
            WHERE id = ?
        """, (employee_id,))

        employee = cursor.fetchone()


        if not employee:

            return jsonify({

                "success": False,

                "message":
                    "Employee not found"

            }), 404


        updated_at = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )


        cursor.execute("""
            UPDATE salary

            SET
                employee_id = ?,
                basic_salary = ?,
                housing_allowance = ?,
                transport_allowance = ?,
                other_allowance = ?,
                deductions = ?,
                effective_from = ?,
                status = ?,
                updated_at = ?

            WHERE id = ?
        """, (
            employee_id,
            basic_salary,
            housing_allowance,
            transport_allowance,
            other_allowance,
            deductions,
            effective_from,
            status,
            updated_at,
            salary_id
        ))


        connection.commit()


        return jsonify({

            "success": True,

            "message":
                "Salary record updated successfully",

            "salary_id":
                salary_id

        }), 200


    except Exception as error:

        connection.rollback()

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500


    finally:

        connection.close()


# =========================================================
# DELETE SALARY
# =========================================================

@payroll.route(
    "/api/salary/<int:salary_id>",
    methods=["DELETE"]
)
def delete_salary(salary_id):

    connection = get_connection()
    cursor = connection.cursor()


    try:

        cursor.execute("""
            SELECT *
            FROM salary
            WHERE id = ?
        """, (salary_id,))

        record = cursor.fetchone()


        if not record:

            return jsonify({

                "success": False,

                "message":
                    "Salary record not found"

            }), 404


        cursor.execute("""
            DELETE FROM salary
            WHERE id = ?
        """, (salary_id,))


        connection.commit()


        return jsonify({

            "success": True,

            "message":
                "Salary record deleted successfully"

        }), 200


    except Exception as error:

        connection.rollback()

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500


    finally:

        connection.close()


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

            "message":
                "Request body is required"

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

            "message":
                "Employee ID is required"

        }), 400


    if not payroll_month:

        return jsonify({

            "success": False,

            "message":
                "Payroll month is required"

        }), 400


    if basic_salary is None:

        return jsonify({

            "success": False,

            "message":
                "Basic salary is required"

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

                "message":
                    "Employee not found"

            }), 404


        if salary_id:

            cursor.execute("""
                SELECT *
                FROM salary
                WHERE id = ?
            """, (salary_id,))

            salary = cursor.fetchone()


            if not salary:

                return jsonify({

                    "success": False,

                    "message":
                        "Salary record not found"

                }), 404


        cursor.execute("""
            INSERT INTO payroll (

                employee_id,

                salary_id,

                payroll_month,

                basic_salary,

                allowances,

                deductions,

                gross_salary,

                net_salary,

                payment_status,

                payment_date

            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (

            employee_id,

            salary_id,

            payroll_month,

            basic_salary,

            allowances,

            deductions,

            gross_salary,

            net_salary,

            payment_status,

            payment_date
        ))


        connection.commit()

        payroll_id = cursor.lastrowid


        return jsonify({

            "success": True,

            "message":
                "Payroll created successfully",

            "payroll_id":
                payroll_id,

            "gross_salary":
                gross_salary,

            "net_salary":
                net_salary,

            "payment_status":
                payment_status

        }), 201


    except Exception as error:

        connection.rollback()

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500


    finally:

        connection.close()


# =========================================================
# GET ALL PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll",
    methods=["GET"]
)
def get_all_payroll():

    connection = get_connection()
    cursor = connection.cursor()


    try:

        cursor.execute("""
            SELECT

                payroll.id,

                payroll.employee_id,

                employees.employee_code,

                employees.first_name,

                employees.last_name,

                payroll.salary_id,

                payroll.payroll_month,

                payroll.basic_salary,

                payroll.allowances,

                payroll.deductions,

                payroll.gross_salary,

                payroll.net_salary,

                payroll.payment_status,

                payroll.payment_date,

                payroll.created_at,

                payroll.updated_at

            FROM payroll

            INNER JOIN employees

                ON payroll.employee_id =
                   employees.id

            ORDER BY payroll.id DESC
        """)


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

                "first_name":
                    record["first_name"],

                "last_name":
                    record["last_name"],

                "salary_id":
                    record["salary_id"],

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
                    record["created_at"],

                "updated_at":
                    record["updated_at"]
            })


        return jsonify({

            "success": True,

            "payroll":
                payroll_list

        }), 200


    finally:

        connection.close()


# =========================================================
# GET SINGLE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll/<int:payroll_id>",
    methods=["GET"]
)
def get_single_payroll(payroll_id):

    connection = get_connection()
    cursor = connection.cursor()


    try:

        cursor.execute("""
            SELECT

                payroll.id,

                payroll.employee_id,

                employees.employee_code,

                employees.first_name,

                employees.last_name,

                payroll.salary_id,

                payroll.payroll_month,

                payroll.basic_salary,

                payroll.allowances,

                payroll.deductions,

                payroll.gross_salary,

                payroll.net_salary,

                payroll.payment_status,

                payroll.payment_date,

                payroll.created_at,

                payroll.updated_at

            FROM payroll

            INNER JOIN employees

                ON payroll.employee_id =
                   employees.id

            WHERE payroll.id = ?
        """, (payroll_id,))


        record = cursor.fetchone()


        if not record:

            return jsonify({

                "success": False,

                "message":
                    "Payroll record not found"

            }), 404


        return jsonify({

            "success": True,

            "payroll": {

                "id":
                    record["id"],

                "employee_id":
                    record["employee_id"],

                "employee_code":
                    record["employee_code"],

                "first_name":
                    record["first_name"],

                "last_name":
                    record["last_name"],

                "salary_id":
                    record["salary_id"],

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
                    record["created_at"],

                "updated_at":
                    record["updated_at"]
            }

        }), 200


    finally:

        connection.close()


# =========================================================
# GET EMPLOYEE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll/employee/<int:employee_id>",
    methods=["GET"]
)
def get_employee_payroll(employee_id):

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

                "message":
                    "Employee not found"

            }), 404


        cursor.execute("""
            SELECT *

            FROM payroll

            WHERE employee_id = ?

            ORDER BY id DESC
        """, (employee_id,))


        records = cursor.fetchall()

        payroll_list = []


        for record in records:

            payroll_list.append({

                "id":
                    record["id"],

                "employee_id":
                    record["employee_id"],

                "salary_id":
                    record["salary_id"],

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
                    record["created_at"],

                "updated_at":
                    record["updated_at"]
            })


        return jsonify({

            "success": True,

            "payroll":
                payroll_list

        }), 200


    finally:

        connection.close()


# =========================================================
# UPDATE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll/<int:payroll_id>",
    methods=["PUT"]
)
def update_payroll(payroll_id):

    data = request.get_json()


    if not data:

        return jsonify({

            "success": False,

            "message":
                "Request body is required"

        }), 400


    connection = get_connection()
    cursor = connection.cursor()


    try:

        cursor.execute("""
            SELECT *
            FROM payroll
            WHERE id = ?
        """, (payroll_id,))

        record = cursor.fetchone()


        if not record:

            return jsonify({

                "success": False,

                "message":
                    "Payroll record not found"

            }), 404


        employee_id = data.get(
            "employee_id",
            record["employee_id"]
        )

        salary_id = data.get(
            "salary_id",
            record["salary_id"]
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
            record["payment_date"]
        )


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


        cursor.execute("""
            SELECT *
            FROM employees
            WHERE id = ?
        """, (employee_id,))

        employee = cursor.fetchone()


        if not employee:

            return jsonify({

                "success": False,

                "message":
                    "Employee not found"

            }), 404


        if salary_id:

            cursor.execute("""
                SELECT *
                FROM salary
                WHERE id = ?
            """, (salary_id,))

            salary = cursor.fetchone()


            if not salary:

                return jsonify({

                    "success": False,

                    "message":
                        "Salary record not found"

                }), 404


        updated_at = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )


        cursor.execute("""
            UPDATE payroll

            SET

                employee_id = ?,

                salary_id = ?,

                payroll_month = ?,

                basic_salary = ?,

                allowances = ?,

                deductions = ?,

                gross_salary = ?,

                net_salary = ?,

                payment_status = ?,

                payment_date = ?,

                updated_at = ?

            WHERE id = ?
        """, (

            employee_id,

            salary_id,

            payroll_month,

            basic_salary,

            allowances,

            deductions,

            gross_salary,

            net_salary,

            payment_status,

            payment_date,

            updated_at,

            payroll_id
        ))


        connection.commit()


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

        connection.rollback()

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500


    finally:

        connection.close()


# =========================================================
# DELETE PAYROLL
# =========================================================

@payroll.route(
    "/api/payroll/<int:payroll_id>",
    methods=["DELETE"]
)
def delete_payroll(payroll_id):

    connection = get_connection()
    cursor = connection.cursor()


    try:

        cursor.execute("""
            SELECT *
            FROM payroll
            WHERE id = ?
        """, (payroll_id,))

        record = cursor.fetchone()


        if not record:

            return jsonify({

                "success": False,

                "message":
                    "Payroll record not found"

            }), 404


        cursor.execute("""
            DELETE FROM payroll
            WHERE id = ?
        """, (payroll_id,))


        connection.commit()


        return jsonify({

            "success": True,

            "message":
                "Payroll deleted successfully"

        }), 200


    except Exception as error:

        connection.rollback()

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500


    finally:

        connection.close()