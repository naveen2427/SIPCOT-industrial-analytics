# GranthOS - Indian Library Catalog & Loan Registry

A premium, fully featured Library Management System showcasing modular Object-Oriented Programming (OOP) design, relational database consistency (SQLite), transactional book loans checkout/return loops, automatic late fine computation, and an interactive, visually striking dark-mode client dashboard.

---

## 🚀 Setup & Running Instructions

This project runs out of the box with standard Node.js.

### Prerequisites
- Node.js (version 18+ recommended)
- NPM (comes with Node)

### 1. Install Dependencies
Navigate to the project directory and install dependencies:
```bash
npm install
```

### 2. Run Verification Tests
Verify catalog schema constraints, borrowing limits, transactional rollbacks, and late fee calculations by running the program's programmatic test suite:
```bash
npm run verify
```
This runs the `verify.js` test pipeline and verifies all criteria.

### 3. Start the Web Server
Launch the Node.js Express server:
```bash
npm start
```
The server will initialize the SQLite schema, seed initial Indian catalog assets, index searchable fields, and output the URL:
```text
==================================================
Library Management System server is active!
API URL:      http://localhost:3000/api
Client URL:   http://localhost:3000
==================================================
```

Open **`http://localhost:3000`** in your browser to view and interact with the application!

---

## 🛠️ Architecture & Requirements Fulfillment

Here is how each bullet of the project criteria is fulfilled:

### 1. Catalog Administration & Loans
- **Catalog Management**: Form wizard validates book details (normalized ISBN format, positive copy counts, published year check) before writing to catalog database.
- **Member Registry**: Supports registering members, checking their status (Active, Inactive, Suspended), and tracking active loans.
- **Checkout / Return Transactions**: Decrements copies when borrowing, checks limits (maximum 3 active loans), blocks duplicate checkouts, and increments copies when returned. Transactions are fully safe and handled inside SQLite database transaction blocks.

### 2. Relational Database Connectivity
- **SQLite Database (`database.db`)**: Enforces strict relations with tables `books`, `members`, `loans`, and `activity_logs`.
- **Integrity**: Employs `FOREIGN KEY` constraints (e.g. `loans.book_id` references `books.id`) and cascading triggers to protect database reliability.

### 3. Object-Oriented Programming (OOP) Principles
- **Singleton Pattern**: The `Database` class (`server/config/Database.js`) manages a single connection pool across the application.
- **Domain Model Design**: The `Book`, `Member`, and `Loan` classes encapsulate domain properties, validations, and calculated getters:
  - `Book.isAvailable`: Checks if any copies are left on shelves.
  - `Book.loanPercentage`: Dynamic checked-out copies indicator.
  - `Member.fullName` & `Member.membershipTenureInMonths`: Member identifiers.
  - `Loan.isOverdue`: Date comparison indicating late returns.
  - `Loan.computedFine`: Business logic computing fine amounts at **₹10 per day late** from the due date.
- **Data Access Object (DAO) / Repository Pattern**: repository classes separate SQL execution queries from controller business paths.

### 4. Input Validation & Exception Handling
- **Custom Error Hierarchy**: Built with a base class `AppError` and specialized sub-classes: `ValidationError`, `NotFoundError`, `LoanError`, and `DatabaseError`.
- **Standardized Error Middleware**: Intercepts backend exceptions, logs stack traces, and sends clean JSON payloads to the frontend, blocking details leaks on unhandled 500 issues.

### 5. Optimized Search & Filters
- **Indexing**: Database sets up indexes on `books(isbn)`, `books(title, author)`, and `loans(due_date)` for fast query scanning.
- **Paginated Filters**: Repository uses SQL `LIMIT` and `OFFSET` queries to keep transfer sizes light.
- **Debounced Input**: Client search executes queries 300ms after typing halts to avoid database spamming.

---

## 🌐 Deploying to Render (Render.com)

You can deploy this full-stack application to **Render** in just a few clicks:

1. **Sign In to Render**: Go to [Render.com](https://render.com) and log in with your GitHub account.
2. **Create a New Web Service**:
   - Click **New +** and select **Web Service**.
   - Connect your GitHub repository containing the library project.
3. **Configure Build & Deploy Settings**:
   - **Name**: `library-management-system`
   - **Runtime**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Deploy**: Click **Deploy Web Service**. Render will install packages and activate the Express server.
5. **Ephemeral Database Note**: This app utilizes SQLite. On Render's free tier, the database resets to the seeded state (The Guide, Midnight's Children, etc.) whenever the server restarts or a new build is deployed, making it ideal for demo environments.
