import os
import cv2
import qrcode

from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId

from database import get_db
from authorization import get_current_user


# ============================================================
# QR ATTENDANCE BLUEPRINT
# ============================================================

qr_attendance = Blueprint(
    "qr_attendance",
    __name__,
    url_prefix="/api/attendance"
)


# ============================================================
# QR CODE GENERATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

QR_FOLDER = os.path.join(
    BASE_DIR,
    "static",
    "qr_codes"
)

os.makedirs(QR_FOLDER, exist_ok=True)


def generate_employee_qr(employee_id, employee_code):
    """
    Generate a QR code for an employee.

    The QR code contains only the employee ID.
    """

    qr_data = str(employee_id)

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=4
    )

    qr.add_data(qr_data)
    qr.make(fit=True)

    image = qr.make_image()

    filename = f"{employee_code}.png"

    filepath = os.path.join(
        QR_FOLDER,
        filename
    )

    image.save(filepath)

    return filepath


# ============================================================
# QR CODE CAMERA SCANNER
# ============================================================

def scan_qr_from_camera():
    """
    Open the camera and scan an employee QR code.

    Returns the employee ID when a QR code is detected.
    """

    detector = cv2.QRCodeDetector()

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():

        print("Camera could not be opened.")

        return None

    print("Camera started.")
    print("Show the employee QR code to the camera.")
    print("Press Q to quit.")

    while True:

        success, frame = camera.read()

        if not success:
            continue

        data, points, _ = detector.detectAndDecode(frame)

        if data:

            print("QR Code detected!")
            print("Employee ID:", data)

            camera.release()
            cv2.destroyAllWindows()

            return data

        cv2.imshow(
            "QR Attendance Scanner",
            frame
        )

        if cv2.waitKey(1) & 0xFF == ord("q"):

            break

    camera.release()

    cv2.destroyAllWindows()

    return None


# ============================================================
# HELPER FUNCTION
# ============================================================

def get_employee_for_user(user):
    """
    Find the employee record linked
    to the currently logged-in user.
    """

    db = get_db()

    try:

        employee = db["employees"].find_one({
            "user_id": ObjectId(user["id"])
        })

        return employee

    except Exception:

        return None


# ============================================================
# QR CHECK-IN
# ============================================================

@qr_attendance.route(
    "/qr-check-in",
    methods=["POST"]
)
def qr_check_in():

    # Get logged-in user
    user = get_current_user()

    if user is None:

        return jsonify({
            "success": False,
            "message": "Authentication required."
        }), 401

    # Read JSON request
    data = request.get_json(
        silent=True
    ) or {}

    employee_id = data.get(
        "employee_id"
    )

    if not employee_id:

        return jsonify({
            "success": False,
            "message": "Employee ID is required."
        }), 400

    # Validate MongoDB ObjectId
    if not ObjectId.is_valid(employee_id):

        return jsonify({
            "success": False,
            "message": "Invalid employee ID."
        }), 400

    # Find employee linked to logged-in user
    employee = get_employee_for_user(
        user
    )

    if employee is None:

        return jsonify({
            "success": False,
            "message": "Employee record not found."
        }), 404

    # Make sure QR belongs to logged-in employee
    if str(employee["_id"]) != str(employee_id):

        return jsonify({
            "success": False,
            "message":
                "QR code does not belong to "
                "the logged-in employee."
        }), 403

    db = get_db()

    today = datetime.now().strftime(
        "%Y-%m-%d"
    )

    current_time = datetime.now().strftime(
        "%H:%M:%S"
    )

    # Check whether employee already checked in
    existing = db["attendance"].find_one({
        "employee_id": ObjectId(employee_id),
        "date": today
    })

    if existing:

        return jsonify({
            "success": False,
            "message":
                "Employee already checked in today."
        }), 409

    # Create attendance record
    attendance_record = {

        "employee_id":
            ObjectId(employee_id),

        "date":
            today,

        "check_in":
            current_time,

        "check_out":
            None,

        "status":
            "Present",

        "created_at":
            datetime.now()
    }

    result = db["attendance"].insert_one(
        attendance_record
    )

    return jsonify({

        "success": True,

        "message":
            "QR check-in successful.",

        "attendance_id":
            str(result.inserted_id),

        "employee_id":
            employee_id,

        "date":
            today,

        "check_in":
            current_time

    }), 201


# ============================================================
# QR CHECK-OUT
# ============================================================

@qr_attendance.route(
    "/qr-check-out",
    methods=["POST"]
)
def qr_check_out():

    # Get logged-in user
    user = get_current_user()

    if user is None:

        return jsonify({
            "success": False,
            "message": "Authentication required."
        }), 401

    # Read JSON request
    data = request.get_json(
        silent=True
    ) or {}

    employee_id = data.get(
        "employee_id"
    )

    if not employee_id:

        return jsonify({
            "success": False,
            "message": "Employee ID is required."
        }), 400

    # Validate ObjectId
    if not ObjectId.is_valid(employee_id):

        return jsonify({
            "success": False,
            "message": "Invalid employee ID."
        }), 400

    # Find logged-in user's employee
    employee = get_employee_for_user(
        user
    )

    if employee is None:

        return jsonify({
            "success": False,
            "message": "Employee record not found."
        }), 404

    # Verify QR belongs to employee
    if str(employee["_id"]) != str(employee_id):

        return jsonify({
            "success": False,
            "message":
                "QR code does not belong to "
                "the logged-in employee."
        }), 403

    db = get_db()

    today = datetime.now().strftime(
        "%Y-%m-%d"
    )

    current_time = datetime.now().strftime(
        "%H:%M:%S"
    )

    # Find today's attendance
    attendance_record = db["attendance"].find_one({

        "employee_id":
            ObjectId(employee_id),

        "date":
            today

    })

    if attendance_record is None:

        return jsonify({
            "success": False,
            "message":
                "Employee has not checked in today."
        }), 404

    # Check if already checked out
    if attendance_record.get(
        "check_out"
    ):

        return jsonify({
            "success": False,
            "message":
                "Employee already checked out today."
        }), 409

    # Update check-out time
    db["attendance"].update_one(

        {
            "_id":
                attendance_record["_id"]
        },

        {
            "$set": {
                "check_out":
                    current_time
            }
        }
    )

    return jsonify({

        "success": True,

        "message":
            "QR check-out successful.",

        "attendance_id":
            str(attendance_record["_id"]),

        "employee_id":
            employee_id,

        "date":
            today,

        "check_out":
            current_time

    }), 200