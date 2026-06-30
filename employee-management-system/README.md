# Enterprise Employee Management System

A premium, fully featured workforce administration portal showcasing modular Object-Oriented Programming (OOP) design, relational database consistency (SQLite), transactional audit trails, strict schema validation, and an interactive, visually striking dark-mode client dashboard.

---

## 🚀 Setup & Running Instructions

This project is designed to be lightweight, zero-configuration, and runs with standard Node.js out of the box.

### Prerequisites
- Node.js (version 18+ recommended)
- NPM (comes with Node)

### 1. Install Dependencies
Navigate to the project directory and install the required dependencies:
```bash
npm install
```

### 2. Run Verification Tests
Verify database schema constraints, OOP models, calculated fields, and exception mapping by running the program's test suite:
```bash
npm run verify
```
This runs the `verify.js` test pipeline and verifies all criteria.

### 3. Start the Web Server
Launch the Node.js Express server:
```bash
npm start
```
The server will initialize the SQLite schema, seed initial records, index searchable fields, and output the URL:
```text
==================================================
Employee Management System server is active!
API URL:      http://localhost:3000/api
Client URL:   http://localhost:3000
==================================================
```

Open **`http://localhost:3000`** in your browser to view and interact with the application!

---

## 🛠️ Architecture & Requirements Fulfillment

Here is how each bullet of the project criteria is fulfilled:

### 1. Workforce Administration (Onboarding, Updates, Retrieval)
- **Onboarding**: Form wizard validates details (email format, phone formats, logical hiring date, and positive salary bounds) before creating records.
- **Updates**: Edits on active employee records log changes (recording old vs new values) directly into the database.
- **Retrieval**: Side-drawer component shows full employee details, calculated stats, and audit logs.

### 2. Relational Database Connectivity
- **SQLite Database (`database.db`)**: Configured with strict schemas (`employees`, `departments`, `activity_logs`).
- **Data Integrity**: Enforces `FOREIGN KEY` constraints (e.g. blocking onboarding of employees to invalid departments, and deleting records is safe).
- **Write Consistency**: Relational database updates are handled inside SQL transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) to protect information accuracy.

### 3. Object-Oriented Programming (OOP) Principles
- **Singleton Pattern**: The `Database` class (`server/config/Database.js`) manages a single connection pool across the application.
- **Domain Model Design**: The `Employee` class (`server/models/Employee.js`) encapsulates:
  - Fields and entity states.
  - Form validation rules (`validate()` method).
  - Business rules as calculated getters:
    - `fullName`: First & Last name concatenation.
    - `tenureInMonths`: Computed length of service.
    - `taxBracket`: Tier calculation based on salary levels.
    - `benefitsEligibility`: Custom benefit package tiering based on status and compensation.
- **Data Access Object (DAO) / Repository Pattern**: `EmployeeRepository`, `DepartmentRepository`, and `ActivityLogRepository` isolate parameterized queries from HTTP control flow.

### 4. Input Validation & Exception Handling
- **Custom Error Hierarchy**: Built with a base class `AppError` and specialized sub-classes: `ValidationError`, `NotFoundError`, `ConflictError`, and `DatabaseError`.
- **Standardized Error Middleware**: Catch block interceptor (`server/middleware/errorHandler.js`) formats backend exceptions, logs stack traces, and sends clean JSON payloads to the frontend, blocking details leaks on unhandled 500 issues.

### 5. Optimized Search & Filters
- **Indexing**: Database sets up binary lookup indexes on `employees(email)`, `employees(last_name, first_name)`, and `employees(department_id)` for high speed index scans.
- **Paginated Filters**: Repository uses SQL `LIMIT` and `OFFSET` queries to keep transfer sizes light.
- **Debounced Input**: Client search executes queries 300ms after typing halts to avoid database spamming.

---

## 🎨 Design System & Aesthetic Accents

- **Theme**: Slate violet-emerald theme built from HSL coordinates (`public/css/variables.css`).
- **Glassmorphism**: High-blur background panels (`backdrop-filter`) with glowing border highlights.
- **Interactive SVG Chart**: Headcount distribution chart drawn dynamically with vector paths. Clicking any bar automatically redirects you to the Employee Directory and filters records by that department.
- **Audit Timelines**: Audit trails of onboarding, updates, and accesses rendered as vertical logs with action-themed indicator badges (active, terminated, etc).
