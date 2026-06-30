import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/Database.js';
import { SCHEMA, SEED_DATA } from './config/schema.js';
import { BookController } from './controllers/BookController.js';
import { MemberController } from './controllers/MemberController.js';
import { LoanController } from './controllers/LoanController.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize Controllers
const bookController = new BookController();
const memberController = new MemberController();
const loanController = new LoanController();

// Database bootstrap setup
const bootstrapDatabase = async () => {
  try {
    console.log('Initializing library database schema...');
    await db.exec(SCHEMA);
    console.log('Database schema verified.');
    await SEED_DATA(db);
    console.log('Database seeded.');
  } catch (err) {
    console.error('Failed to bootstrap library database:', err.message);
    process.exit(1);
  }
};

// Mount API endpoints
app.get('/api/dashboard/stats', loanController.getStats);

// Catalog Books CRUD
app.get('/api/books', bookController.getAll);
app.get('/api/books/:id', bookController.getById);
app.post('/api/books', bookController.create);
app.put('/api/books/:id', bookController.update);
app.delete('/api/books/:id', bookController.delete);

// Registry Members CRUD
app.get('/api/members', memberController.getAll);
app.get('/api/members/:id', memberController.getById);
app.post('/api/members', memberController.create);
app.put('/api/members/:id', memberController.update);
app.delete('/api/members/:id', memberController.delete);
app.get('/api/members/:id/logs', memberController.getLogs);

// Transactions Loans
app.get('/api/loans', loanController.getAll);
app.post('/api/loans', loanController.checkout);
app.post('/api/loans/:id/return', loanController.returnBook);

// Fallback index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Centralized error interceptor
app.use(errorHandler);

// Bootstrap and listen
bootstrapDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`Library Management System server is active!`);
    console.log(`API URL:      http://localhost:${PORT}/api`);
    console.log(`Client URL:   http://localhost:${PORT}`);
    console.log(`==================================================`);
  });
});
