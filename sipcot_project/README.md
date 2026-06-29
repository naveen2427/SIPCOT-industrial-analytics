# SIPCOT Industrial Analytics and Management System

A premium, multi-page web application built with React, Vite, Tailwind CSS, and Node.js. 
This platform serves as an analytics and authentication management system for companies operating within SIPCOT industrial parks.

## Features

- **Role-based Dashboards:** Dedicated portals for Company Admins, SIPCOT Admins, and Investors.
- **Company Authentication:** Secure document upload and verification pipeline.
- **Digital Certificates:** Automated generation of authenticity certificates upon approval.
- **Industrial Clusters:** AI-driven mapping of dominant industry sectors across parks.
- **Analytics Dashboard:** Comprehensive data visualization using Recharts.
- **Investor AI Chatbot:** An intelligent assistant that provides investment recommendations strictly based on verified company data and growth metrics.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router, Recharts, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js, MongoDB, Multer

## Project Structure

```text
sipcot_project/
├── client/         # Frontend React + Vite application
│   ├── src/        # Source code (Components, Pages, Context)
│   ├── index.html  # Entry HTML
│   └── vite.config.js
└── server/         # Backend Node.js + Express server
    ├── index.js    # Entry file and API routes
    └── uploads/    # Directory for uploaded PDFs and Certificates
```

## Setup & Running Instructions

### 1. Setup Backend

Navigate to the server directory, install dependencies, and start the mock server:

```bash
cd server
npm install
node index.js
```

The server will run on `http://localhost:5000` (Mock Mode - No MongoDB required by default).

### 2. Setup Frontend

Open a new terminal, navigate to the client directory, install dependencies, and start the development server:

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

### 3. Usage Guide

- **Login / Register:** The frontend uses mock authentication. Register a new user or log in with any email to see the dashboard.
  - To view the **SIPCOT Admin Portal**, use an email containing `admin@sipcot.com` (e.g., `admin@sipcot.com`).
  - To view the **Company Admin Portal**, use an email containing `company` (e.g., `company@example.com`).
  - To view the **Investor Portal**, use any other email.
- **AI Chatbot:** Navigate to the AI Investor Chat and try asking "Tell me about Samsung Electronics" or "Which company has the best growth?".
- **Certificates:** Access the certificate page to see the generated digital authenticity seal.
