from pymongo import MongoClient


# MongoDB connection
MONGO_URI = "mongodb://127.0.0.1:27017/"
DATABASE_NAME = "employee_management"


# Create MongoDB client
client = MongoClient(MONGO_URI)


# Select our project database
db = client[DATABASE_NAME]


def get_db():
    """
    Return the MongoDB database.
    """
    return db


def initialize_database():
    """
    Check MongoDB connection and create the main collections
    used by the Employee Management System.
    """
    try:
        # Test the connection
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
        print("MongoDB connection failed:", error)