const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up directories for uploads
const dirs = ['./uploads', './uploads/pdfs', './uploads/certificates'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
});

// Mock Database Connection (Skipping actual connection for demo purposes unless DB URL is provided)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Running without MongoDB connection (Mock Mode)');
}

// Routes
// Note: These are stub routes that return mock data to match the frontend functionality
// In a full production app, these would connect to MongoDB controllers

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'User registered successfully', user: { id: 1, ...req.body } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required' });
  }

  const emailParts = email.split('@');
  if (emailParts.length !== 2) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const domain = emailParts[1].toLowerCase();

  if (role === 'company_admin') {
    const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    if (publicDomains.includes(domain)) {
      return res.status(400).json({ message: 'Please use your company domain email for Company Admin login (e.g., admin@yourcompany.com).' });
    }
  } else if (role === 'sipcot_admin') {
    // Domain validation removed for testing
  } else {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  res.status(200).json({ 
    token: 'mock-jwt-token-xyz', 
    user: { id: role === 'sipcot_admin' ? 'admin-id' : 'company-id', name: emailParts[0], email, role, domain } 
  });
});

// Company Routes
app.get('/api/companies', (req, res) => {
  res.json([{ id: 1, name: 'Samsung', status: 'Approved' }]);
});

app.get('/api/companies/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Samsung', status: 'Approved' });
});

app.post('/api/companies', (req, res) => {
  res.status(201).json(req.body);
});

// PDF Upload Route (Mock)
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/pdfs/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.post('/api/uploads/company-pdf', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF file' });
  }
  res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Admin Routes
app.get('/api/admin/submissions', (req, res) => {
  res.json([{ id: 1, status: 'Pending', company: 'ABC Corp' }]);
});

app.put('/api/admin/submissions/:id/approve', (req, res) => {
  // Logic to generate certificate would go here using PDFKit
  res.json({ message: 'Approved successfully', certificateId: 'CERT-123' });
});

// Analytics Routes
app.get('/api/analytics/dashboard', (req, res) => {
  res.json({ totalParks: 24, totalCompanies: 3500 });
});

// Chatbot Route
app.post('/api/chatbot/investor-query', (req, res) => {
  res.json({ response: "I am a mock response from the server." });
});

// Catch-all route to serve the React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
