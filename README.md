# 🌟 Shubham's Developer Portfolio & Admin Dashboard 🚀

Welcome to the repository for **Shubham's Portfolio**—a modern, full-stack, production-ready portfolio application featuring a public-facing developer website, a secure glassmorphic Admin Dashboard, and a robust FastAPI backend API server powered by a MySQL database.

---

## ✨ Features

### 🌐 1. Public Portfolio (`Portfolio/`)
* **Dynamic Content Loading**: Fetches profile data, projects, experiences, skills, blogs, and contact options directly from the API.
* **Modern UI/UX**: Designed with smooth animations and interactive components.
* **Contact Form**: Direct messaging pipeline routed straight to the admin messages database.
* **Views & Traffic Tracker**: Log views and track analytics dynamically.

### 🔒 2. Admin Dashboard (`Admin_Dashboard/`)
* **Secure Cookie-Based Auth**: Leverages HttpOnly session cookies for state-of-the-art authentication security.
* **Glassmorphic UI**: High-fidelity dark mode with modern blur panels and animations using Framer Motion.
* **Full CRUD Management**: Edit site information, add/modify skills, projects, work experience, blogs, and review contact messages.
* **Live Server Syncing**: Features instant cross-tab updating and syncing of data changes.

### ⚡ 3. API Server Backend (`App_Server/`)
* **FastAPI Performance**: High-concurrency performance with Python.
* **SQLAlchemy & MySQL**: Smooth object-relational mapping (ORM) with automated database and table creation at startup.
* **Data Migration Engine**: Automatically translates legacy JSON records into SQL database rows.

---

## 📂 Repository Directory Structure

```text
Shubham's Portfolio/
├── App_Server/            # 🐍 FastAPI API Server
│   ├── App.py             # Main router, setup, CORS, and auth validation
│   ├── config.py          # Environment settings loader via Pydantic
│   ├── database.py        # Database connection & auto-creation helpers
│   ├── models.py          # SQLAlchemy schemas (Admin, Skills, Projects, Blogs, etc.)
│   └── requirements.txt   # Python package dependencies
│
├── Portfolio/             # 🎨 Public Front-end Portfolio
│   ├── src/               # React components and styling
│   ├── package.json       # Front-end scripts & modules
│   └── vite.config.js     # Dev server configurations (Proxies /api calls)
│
├── Admin_Dashboard/       # 💼 Glassmorphic Admin Dashboard
│   ├── src/               # Rich dashboard panels and CRUD pages
│   ├── package.json       # Tailwind & Framer Motion setup
│   └── vite.config.js     # Dev configurations (Runs on default port 5000)
│
└── GITHUB_INSTRUCTIONS.md # 📝 Git upload helper instruction file
```

---

## 🚀 Setup & Installation

### 1. Backend Server Setup (`App_Server/`)
1. Change directory to the server folder:
   ```bash
   cd App_Server
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv myenv
   # On Windows (cmd):
   myenv\Scripts\activate
   # On macOS/Linux:
   source myenv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables. Create a `.env` file in the `App_Server` directory (never upload this to Git):
   ```env
   MYSQL_URL=mysql+pymysql://your_user:your_password@localhost:3306/portfolio_db
   ADMIN_PASSWORD=your_secure_dashboard_password_here
   JWT_SECRET=your_secret_key_here
   PORT=8000
   ```
5. Run the server:
   ```bash
   python App.py
   ```

---

### 2. Public Portfolio Setup (`Portfolio/`)
1. Change directory to the portfolio folder:
   ```bash
   cd ../Portfolio
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server (runs on port `3001` or `5173` with proxy mapping `/api` to port `8000`):
   ```bash
   npm run dev
   ```

---

### 3. Admin Dashboard Setup (`Admin_Dashboard/`)
1. Change directory to the dashboard folder:
   ```bash
   cd ../Admin_Dashboard
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the administration dashboard (runs on port `5000` by default):
   ```bash
   npm run dev
   ```

---

## 🔒 Security & CORS configuration
The API server is preconfigured with CORS protections that restrict communication to local development endpoints (ports `3001`, `5173`, `5000`, `3002`). Feel free to expand the `allow_origins` array in `App_Server/App.py` when deploying to production!
