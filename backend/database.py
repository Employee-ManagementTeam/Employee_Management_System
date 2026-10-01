import sqlite3
import os


# =========================================================
# PROJECT DIRECTORIES
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATABASE_DIR = os.path.join(
    BASE_DIR,
    "database"
)

DATABASE_PATH = os.path.join(
    DATABASE_DIR,
    "employee_management.db"
)


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_connection():

    os.makedirs(
        DATABASE_DIR,
        exist_ok=True
    )

    connection = sqlite3.connect(
        DATABASE_PATH
    )

    connection.row_factory = sqlite3.Row

    connection.execute(
        "PRAGMA foreign_keys = ON"
    )

    return connection


# =========================================================
# INITIALIZE DATABASE
# =========================================================

def initialize_database():

    connection = get_connection()
    cursor = connection.cursor()


    # =====================================================
    # USERS TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE NOT NULL,

            email TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL,

            role TEXT NOT NULL DEFAULT 'employee',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)


    # =====================================================
    # EMPLOYEES TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER,

            employee_code TEXT UNIQUE NOT NULL,

            first_name TEXT NOT NULL,

            last_name TEXT NOT NULL,

            phone TEXT,

            department TEXT,

            designation TEXT,

            joining_date TEXT,

            address TEXT,

            employment_status TEXT DEFAULT 'Active',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE SET NULL
        )
    """)


    # =====================================================
    # DEPARTMENTS TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS departments (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            department_name TEXT UNIQUE NOT NULL,

            description TEXT,

            status TEXT DEFAULT 'Active',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)


    # =====================================================
    # ATTENDANCE TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS attendance (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,

            attendance_date TEXT NOT NULL,

            check_in TEXT,

            check_out TEXT,

            status TEXT DEFAULT 'Present',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (employee_id)
                REFERENCES employees(id)
                ON DELETE CASCADE
        )
    """)


    # =====================================================
    # LEAVES TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leaves (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,

            leave_type TEXT NOT NULL,

            start_date TEXT NOT NULL,

            end_date TEXT NOT NULL,

            reason TEXT,

            status TEXT DEFAULT 'Pending',

            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            approved_by INTEGER,

            approved_at TIMESTAMP,

            FOREIGN KEY (employee_id)
                REFERENCES employees(id)
                ON DELETE CASCADE,

            FOREIGN KEY (approved_by)
                REFERENCES users(id)
                ON DELETE SET NULL
        )
    """)


    # =====================================================
    # TASKS TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,

            title TEXT NOT NULL,

            description TEXT,

            assigned_by INTEGER,

            priority TEXT DEFAULT 'Medium',

            due_date TEXT,

            status TEXT DEFAULT 'Pending',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (employee_id)
                REFERENCES employees(id)
                ON DELETE CASCADE,

            FOREIGN KEY (assigned_by)
                REFERENCES users(id)
                ON DELETE SET NULL
        )
    """)


    # =====================================================
    # PERFORMANCE TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS performance (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,

            reviewer_id INTEGER,

            review_period TEXT NOT NULL,

            rating REAL NOT NULL,

            strengths TEXT,

            areas_for_improvement TEXT,

            comments TEXT,

            status TEXT DEFAULT 'Completed',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (employee_id)
                REFERENCES employees(id)
                ON DELETE CASCADE,

            FOREIGN KEY (reviewer_id)
                REFERENCES users(id)
                ON DELETE SET NULL
        )
    """)


    # =====================================================
    # DOCUMENTS TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,

            document_name TEXT NOT NULL,

            document_type TEXT NOT NULL,

            file_name TEXT NOT NULL,

            file_path TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (employee_id)
                REFERENCES employees(id)
                ON DELETE CASCADE
        )
    """)


    # =====================================================
    # SALARY TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS salary (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,

            basic_salary REAL NOT NULL,

            housing_allowance REAL DEFAULT 0,

            transport_allowance REAL DEFAULT 0,

            other_allowance REAL DEFAULT 0,

            deductions REAL DEFAULT 0,

            effective_from TEXT,

            status TEXT DEFAULT 'Active',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (employee_id)
                REFERENCES employees(id)
                ON DELETE CASCADE
        )
    """)


    # =====================================================
    # PAYROLL TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payroll (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,

            salary_id INTEGER,

            payroll_month TEXT NOT NULL,

            basic_salary REAL NOT NULL,

            allowances REAL DEFAULT 0,

            deductions REAL DEFAULT 0,

            gross_salary REAL NOT NULL,

            net_salary REAL NOT NULL,

            payment_status TEXT DEFAULT 'Pending',

            payment_date TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (employee_id)
                REFERENCES employees(id)
                ON DELETE CASCADE,

            FOREIGN KEY (salary_id)
                REFERENCES salary(id)
                ON DELETE SET NULL
        )
    """)


    # =====================================================
    # NOTIFICATIONS TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notifications (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            title TEXT NOT NULL,

            message TEXT NOT NULL,

            notification_type TEXT DEFAULT 'General',

            is_read INTEGER DEFAULT 0,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
        )
    """)


    # =====================================================
    # ACTIVITY LOGS TABLE
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS activity_logs (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER,

            action TEXT NOT NULL,

            description TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE SET NULL
        )
    """)


    # =====================================================
    # SAVE DATABASE
    # =====================================================

    connection.commit()

    connection.close()

    print("Database initialized successfully.")


# =========================================================
# RUN DATABASE INITIALIZATION
# =========================================================

if __name__ == "__main__":

    initialize_database()