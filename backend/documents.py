from flask import Blueprint, request, jsonify, send_from_directory
from database import get_db
from bson import ObjectId
from werkzeug.utils import secure_filename
from datetime import datetime
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
# HELPER FUNCTION
# =========================================================

def document_response(
    document,
    employee=None
):

    response = {
        "id": str(document["_id"]),
        "employee_id": str(
            document["employee_id"]
        ),
        "document_name":
            document.get("document_name"),
        "document_type":
            document.get("document_type"),
        "file_name":
            document.get("file_name"),
        "created_at":
            document.get("created_at")
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
            "message": "File type not allowed"
        }), 400

    # -----------------------------------------------------
    # Validate employee ID
    # -----------------------------------------------------

    if not ObjectId.is_valid(employee_id):

        return jsonify({
            "success": False,
            "message": "Invalid employee ID"
        }), 400

    db = get_db()

    employees_collection = db["employees"]
    documents_collection = db["documents"]

    # -----------------------------------------------------
    # Check employee
    # -----------------------------------------------------

    employee = employees_collection.find_one({
        "_id": ObjectId(employee_id)
    })

    if not employee:

        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    try:

        # -------------------------------------------------
        # Secure original filename
        # -------------------------------------------------

        original_filename = secure_filename(
            file.filename
        )

        # -------------------------------------------------
        # Get extension
        # -------------------------------------------------

        extension = original_filename.rsplit(
            ".",
            1
        )[1].lower()

        # -------------------------------------------------
        # Generate unique filename
        # -------------------------------------------------

        unique_filename = (
            str(uuid.uuid4())
            + "."
            + extension
        )

        # -------------------------------------------------
        # Complete file path
        # -------------------------------------------------

        file_path = os.path.join(
            UPLOAD_DIR,
            unique_filename
        )

        # -------------------------------------------------
        # Save physical file
        # -------------------------------------------------

        file.save(file_path)

        # -------------------------------------------------
        # Save document information in MongoDB
        # -------------------------------------------------

        document = {
            "employee_id": ObjectId(employee_id),
            "document_name": document_name,
            "document_type": document_type,
            "file_name": original_filename,
            "file_path": unique_filename,
            "created_at": datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            )
        }

        result = documents_collection.insert_one(
            document
        )

        return jsonify({

            "success": True,

            "message":
                "Document uploaded successfully",

            "document_id":
                str(result.inserted_id),

            "employee_id":
                employee_id,

            "document_name":
                document_name,

            "document_type":
                document_type,

            "file_name":
                original_filename

        }), 201

    except Exception as error:

        # If database insertion fails after
        # the physical file was saved, remove it.
        if os.path.exists(file_path):

            os.remove(file_path)

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500


# =========================================================
# GET ALL DOCUMENTS
# =========================================================

@documents.route(
    "/api/documents",
    methods=["GET"]
)
def get_documents():

    db = get_db()

    documents_collection = db["documents"]
    employees_collection = db["employees"]

    records = documents_collection.find().sort(
        "_id",
        -1
    )

    document_list = []

    for document in records:

        employee = employees_collection.find_one({
            "_id": document["employee_id"]
        })

        document_list.append(
            document_response(
                document,
                employee
            )
        )

    return jsonify({

        "success": True,

        "documents":
            document_list

    }), 200


# =========================================================
# GET EMPLOYEE DOCUMENTS
# =========================================================

@documents.route(
    "/api/documents/employee/<employee_id>",
    methods=["GET"]
)
def get_employee_documents(employee_id):

    if not ObjectId.is_valid(employee_id):

        return jsonify({

            "success": False,

            "message":
                "Invalid employee ID"

        }), 400

    db = get_db()

    employees_collection = db["employees"]
    documents_collection = db["documents"]

    employee_object_id = ObjectId(
        employee_id
    )

    # -----------------------------------------------------
    # Check employee
    # -----------------------------------------------------

    employee = employees_collection.find_one({
        "_id": employee_object_id
    })

    if not employee:

        return jsonify({

            "success": False,

            "message":
                "Employee not found"

        }), 404

    # -----------------------------------------------------
    # Get documents
    # -----------------------------------------------------

    records = documents_collection.find({
        "employee_id": employee_object_id
    }).sort(
        "_id",
        -1
    )

    document_list = []

    for document in records:

        document_list.append(
            document_response(
                document
            )
        )

    return jsonify({

        "success": True,

        "documents":
            document_list

    }), 200


# =========================================================
# DOWNLOAD DOCUMENT
# =========================================================

@documents.route(
    "/api/documents/download/<document_id>",
    methods=["GET"]
)
def download_document(document_id):

    if not ObjectId.is_valid(document_id):

        return jsonify({

            "success": False,

            "message":
                "Invalid document ID"

        }), 400

    db = get_db()

    documents_collection = db["documents"]

    document = documents_collection.find_one({
        "_id": ObjectId(document_id)
    })

    if not document:

        return jsonify({

            "success": False,

            "message":
                "Document not found"

        }), 404

    file_name = document.get(
        "file_path"
    )

    if not file_name:

        return jsonify({

            "success": False,

            "message":
                "File path not found"

        }), 404

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
    "/api/documents/<document_id>",
    methods=["DELETE"]
)
def delete_document(document_id):

    if not ObjectId.is_valid(document_id):

        return jsonify({

            "success": False,

            "message":
                "Invalid document ID"

        }), 400

    db = get_db()

    documents_collection = db["documents"]

    # -----------------------------------------------------
    # Check document exists
    # -----------------------------------------------------

    document = documents_collection.find_one({
        "_id": ObjectId(document_id)
    })

    if not document:

        return jsonify({

            "success": False,

            "message":
                "Document not found"

        }), 404

    file_name = document.get(
        "file_path"
    )

    try:

        # -------------------------------------------------
        # Delete database record
        # -------------------------------------------------

        documents_collection.delete_one({
            "_id": ObjectId(document_id)
        })

        # -------------------------------------------------
        # Delete physical file
        # -------------------------------------------------

        if file_name:

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

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500