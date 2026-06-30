import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/Database.js';
import { SCHEMA, SEED_DATA } from './config/schema.js';
import { EmployeeController } from './controllers/EmployeeController.js';
import { DepartmentController } from './controllers/DepartmentController.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Initialize Controllers
const employeeController = new EmployeeController();
const departmentController = new DepartmentController();

// Database initialization
const bootstrapDatabase = async () => {
  try {
    console.log('Initializing database schema...');
    await db.exec(SCHEMA);
    console.log('Database schema verified.');
    await SEED_DATA(db);
    console.log('Database seeded.');
  } catch (err) {
    console.error('Failed to bootstrap database:', err.message);
    process.exit(1);
  }
};

// Mount API routes
// Dashboard and statistics
app.get('/api/dashboard/stats', employeeController.getStats);

// Employees CRUD
app.get('/api/employees', employeeController.getAll);
app.get('/api/employees/:id', employeeController.getById);
app.post('/api/employees', employeeController.create);
app.put('/api/employees/:id', employeeController.update);
app.delete('/api/employees/:id', employeeController.delete);
app.get('/api/employees/:id/logs', employeeController.getLogs);

// Departments metadata
app.get('/api/departments', departmentController.getAll);
app.get('/api/departments/:id', departmentController.getById);

// Wildcard index handler for client side SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Centralized error interceptor middleware
app.use(errorHandler);

// Bootstrap DB and start HTTP server
bootstrapDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`Employee Management System server is active!`);
    console.log(`API URL:      http://localhost:${PORT}/api`);
    console.log(`Client URL:   http://localhost:${PORT}`);
    console.log(`==================================================`);
  });
});
