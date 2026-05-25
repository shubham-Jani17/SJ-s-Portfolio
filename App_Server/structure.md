# Shubham's Portfolio Backend — API Server

This is the FastAPI backend API server for the portfolio website. It manages administrative operations (projects, experiences, skills, blog entries, messages, and analytics) and stores all dynamic content inside a MySQL database using SQLAlchemy ORM.

---

## 📂 Backend File Structure

The backend application contains the following core files:

```text
App_Server/
├── App.py             # Main entry point: defines FastAPI routes, CORS middleware, admin checks, and startup events
├── config.py          # Configuration loader: parses environments variables from .env using Pydantic Settings
├── database.py        # Database setup: handles automatic database creation and exposes database session helper (get_db)
├── models.py          # DB Schemas: defines SQLAlchemy ORM tables (Admin, SiteSettings, Skill, Project, Experience, Blog, Message, Analytics)
├── requirements.txt   # Python library requirements
├── schema.sql         # Optional database schema initialization dump file
└── .env.example       # Non-sensitive template showing the environment variables required to run the server
```

---

## 🔄 Backend Execution & Flow

### 1. Database & Startup Sync Flow

When the server starts up, it goes through these sequential steps:

```mermaid
graph TD
    A[Start Uvicorn] --> B[Load config.py & .env]
    B --> C[database.py: ensure_database_exists]
    C -->|If DB does not exist| D[Run CREATE DATABASE IF NOT EXISTS]
    C --> E[App.py: startup_event]
    E --> F[Base.metadata.create_all: Create tables if missing]
    F --> G[Seed default admin account using ADMIN_PASSWORD config]
    G --> H[Migrate legacy JSON data if any]
    H --> I[Application Startup Complete]
```

### 2. Request Handling Flow

For incoming API requests:

```mermaid
graph TD
    Request[Incoming Request] --> CORS[CORS Middleware]
    CORS --> Auth{Protected Route?}
    Auth -->|Yes| CheckAdmin[check_admin Dependency: Validate HTTP Bearer Token]
    Auth -->|No| DB[get_db Session Yield]
    CheckAdmin -->|Valid Token| DB
    CheckAdmin -->|Invalid Token| 401[Raise HTTP 401 Unauthorized]
    DB --> RouteHandler[Execute Route Logic]
    RouteHandler --> DBCommit[Commit Changes to Database]
    DBCommit --> Response[Return JSON Response]
```

---

## 🚀 Running the Server with Uvicorn

Make sure your virtual environment is active and all libraries in `requirements.txt` are installed.

### Option 1: Using the Uvicorn CLI
To run the server manually using the Uvicorn command-line interface:
```bash
uvicorn App:app --host 127.0.0.1 --port 3001 --reload
```
* `--host 127.0.0.1`: Runs the server locally.
* `--port 3001`: Sets the server to listen on port 3001 (which matches the frontend proxy target).
* `--reload`: Enables hot-reloading so the server restarts automatically when code changes.

### Option 2: Running the Python script directly
Alternatively, you can run the wrapper script which configures and calls Uvicorn programmatically using the values loaded from your config:
```bash
python App.py
```

---

## 🔒 Security Configuration (.env)
Create a `.env` file in the `App_Server` directory (never commit this file to Git). It must look like this:

```env
# Database URL (Format: mysql+pymysql://username:password@host:port/database)
MYSQL_URL=mysql+pymysql://your_db_user:your_db_password@localhost:3306/portfolio_db

# Default admin login password (used on startup to initialize the admin user)
ADMIN_PASSWORD=your_secure_dashboard_password_here

# Secret key for JWT auth verification
JWT_SECRET=your_secret_key_here

# Static token for authorized admin requests
STATIC_ADMIN_TOKEN=your_random_api_token_here

# Server Port
PORT=3001
```
