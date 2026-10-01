from flask import Flask, jsonify

from database import initialize_database

from auth import auth
from employees import employees
from departments import departments
from attendance import attendance
from leaves import leaves
from tasks import tasks
from performance import performance
from documents import documents
from payroll import payroll
from notifications import notifications
from reports import reports
from activity_logs import activity_logs

from authorization import check_authorization


app = Flask(__name__)

initialize_database()


app.register_blueprint(auth)
app.register_blueprint(employees)
app.register_blueprint(departments)
app.register_blueprint(attendance)
app.register_blueprint(leaves)
app.register_blueprint(tasks)
app.register_blueprint(performance)
app.register_blueprint(documents)
app.register_blueprint(payroll)
app.register_blueprint(notifications)
app.register_blueprint(reports)
app.register_blueprint(activity_logs)


@app.before_request
def authorization_middleware():
    return check_authorization()


@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message":
            "Employee Management System Backend is running"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )