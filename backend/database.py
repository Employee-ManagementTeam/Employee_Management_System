import os

from pymongo import MongoClient


# =========================================================
# MongoDB Configuration
# =========================================================

# For deployment, set MONGO_URI as an environment variable.
#
# Local development fallback:
# mongodb://127.0.0.1:27017/
#
# Atlas example:
# mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/employee_management
#
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://127.0.0.1:27017/"
)

DATABASE_NAME = os.getenv(
    "MONGO_DATABASE",
    "employee_management"
)


# =========================================================
# MongoDB Client
# =========================================================

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=10000
)


# Select our project database
db = client[DATABASE_NAME]


# =========================================================
# Get Database
# =========================================================

def get_db():
    """
    Return the MongoDB database.
    """
    return db


# =========================================================
# Initialize Database
# =========================================================

def initialize_database():
    """
    Check MongoDB connection and create the main collections
    used by the Employee Management System.
    """
    try:
        # Test the MongoDB connection
        client.admin.command("ping")

        # Collections used in the project
        collections = [
            "users",
            "employees",
            "departments",
            "attendance",
            "leaves",
            "tasks",
            "performance",
            "documents",
            "salary",
            "payroll",
            "notifications",
            "activity_logs"
        ]

        existing_collections = db.list_collection_names()

        for collection_name in collections:
            if collection_name not in existing_collections:
                db.create_collection(collection_name)

        print("MongoDB connected successfully")
        print("Database:", DATABASE_NAME)

    except Exception as error:
        print("MongoDB connection failed:", str(error))
        raise