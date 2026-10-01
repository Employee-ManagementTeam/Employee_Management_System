from flask import Blueprint, request, jsonify, send_from_directory
from database import get_connection
from werkzeug.utils import secure_filename
import os
import uuid


documents = Blueprint("documents", __name__)


# =========================================================
# UPLOAD DIRECTORY
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# =========================================================
# ALLOWED FILE TYPES
# =========================================================

ALLOWED_EXTENSIONS = {
    "pdf",
    "doc",
    "docx",
    "jpg",
    "jpeg",
    "png"
}


def allowed_file(filename):

    return (
        "." in filename
        and
        filename.rsplit(
            ".",
            1
        )[1].lower()
        in ALLOWED_EXTENSIONS
    )


# =========================================================
# UPLOAD DOCUMENT
# =========================================================

@documents.route(
    "/api/documents/upload",
    methods=["POST"]
)
def upload_document():

    employee_id = request.form.get(
        "employee_id"
    )

    document_name = request.form.get(
        "document_name"
    )

    document_type = request.form.get(
        "document_type"
    )

    if not employee_id:

        return jsonify({
            "success": False,
            "message": "Employee ID is required"
        }), 400

    if not document_name:

        return jsonify({
            "success": False,
            "message": "Document name is required"
        }), 400

    if not document_type:

        return jsonify({
            "success": False,
            "message": "Document type is required"
        }), 400

    if "file" not in request.files:

        return jsonify({
            "success": False,
            "message": "File is required"
        }), 400

    file = request.files["file"]

    if file.filename == "":

        return jsonify({
            "success": False,
            "message": "No file selected"
        }), 400

    if not allowed_file(file.filename):

        return jsonify({
            "success": False,
            "message":
                "File type not allowed"
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


        # Secure original filename
        original_filename = secure_filename(
            file.filename
        )


        # Get extension
        extension = original_filename.rsplit(
            ".",
            1
        )[1].lower()


        # Generate unique filename
        unique_filename = (
            str(uuid.uuid4())
            + "."
            + extension
        )


        # Complete file path
        file_path = os.path.join(
            UPLOAD_DIR,
            unique_filename
        )


        # Save physical file
        file.save(file_path)


        # Save document information
        cursor.execute("""
            INSERT INTO documents (
                employee_id,
                document_name,
                document_type,
                file_name,
                file_path
            )
            VALUES (?, ?, ?, ?, ?)
        """, (
            employee_id,
            document_name,
            document_type,
            original_filename,
            unique_filename
        ))


        connection.commit()

        document_id = cursor.lastrowid


        return jsonify({

            "success": True,

            "message":
                "Document uploaded successfully",

            "document_id":
                document_id,

            "employee_id":
                int(employee_id),

            "document_name":
                document_name,

            "document_type":
                document_type,

            "file_name":
                original_filename

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
# GET ALL DOCUMENTS
# =========================================================

@documents.route(
    "/api/documents",
    methods=["GET"]
)
def get_documents():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT
                documents.id,
                documents.employee_id,
                employees.employee_code,
                employees.first_name,
                employees.last_name,
                documents.document_name,
                documents.document_type,
                documents.file_name,
                documents.created_at

            FROM documents

            INNER JOIN employees
                ON documents.employee_id =
                   employees.id

            ORDER BY documents.id DESC
        """)

        records = cursor.fetchall()

        document_list = []

        for record in records:

            document_list.append({

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

                "document_name":
                    record["document_name"],

                "document_type":
                    record["document_type"],

                "file_name":
                    record["file_name"],

                "created_at":
                    record["created_at"]
            })


        return jsonify({

            "success": True,

            "documents":
                document_list

        }), 200


    finally:

        connection.close()


# =========================================================
# GET EMPLOYEE DOCUMENTS
# =========================================================

@documents.route(
    "/api/documents/employee/<int:employee_id>",
    methods=["GET"]
)
def get_employee_documents(employee_id):

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

                "message":
                    "Employee not found"

            }), 404


        # Get documents
        cursor.execute("""
            SELECT
                id,
                employee_id,
                document_name,
                document_type,
                file_name,
                created_at

            FROM documents

            WHERE employee_id = ?

            ORDER BY id DESC
        """, (employee_id,))

        records = cursor.fetchall()

        document_list = []

        for record in records:

            document_list.append({

                "id":
                    record["id"],

                "employee_id":
                    record["employee_id"],

                "document_name":
                    record["document_name"],

                "document_type":
                    record["document_type"],

                "file_name":
                    record["file_name"],

                "created_at":
                    record["created_at"]
            })


        return jsonify({

            "success": True,

            "documents":
                document_list

        }), 200


    finally:

        connection.close()


# =========================================================
# DOWNLOAD DOCUMENT
# =========================================================

@documents.route(
    "/api/documents/download/<int:document_id>",
    methods=["GET"]
)
def download_document(document_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT *
            FROM documents
            WHERE id = ?
        """, (document_id,))

        document = cursor.fetchone()

        if not document:

            return jsonify({

                "success": False,

                "message":
                    "Document not found"

            }), 404

        file_name = document["file_path"]

    finally:

        connection.close()


    file_path = os.path.join(
        UPLOAD_DIR,
        file_name
    )


    if not os.path.exists(file_path):

        return jsonify({

            "success": False,

            "message":
                "File not found"

        }), 404


    return send_from_directory(

        UPLOAD_DIR,

        file_name,

        as_attachment=True

    )


# =========================================================
# DELETE DOCUMENT
# =========================================================

@documents.route(
    "/api/documents/<int:document_id>",
    methods=["DELETE"]
)
def delete_document(document_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("""
            SELECT *
            FROM documents
            WHERE id = ?
        """, (document_id,))

        document = cursor.fetchone()

        if not document:

            return jsonify({

                "success": False,

                "message":
                    "Document not found"

            }), 404


        file_name = document["file_path"]


        # Delete database record
        cursor.execute("""
            DELETE FROM documents
            WHERE id = ?
        """, (document_id,))


        connection.commit()


        # Delete physical file
        file_path = os.path.join(
            UPLOAD_DIR,
            file_name
        )


        if os.path.exists(file_path):

            os.remove(file_path)


        return jsonify({

            "success": True,

            "message":
                "Document deleted successfully"

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