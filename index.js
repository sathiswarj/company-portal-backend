const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db');
// Route Imports
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const leadRoutes = require('./src/routes/leadRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:3000',
  'https://minicrm-murex-xi.vercel.app',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean)
];

// Connect to Database & auto-seed mock/default data
connectDB();

// Middlewares
app.use(cors({
  origin: [...new Set(allowedOrigins)],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', require('./src/routes/userRoutes'));
// Root Health Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mini CRM API is running healthy on port 5000' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Mini CRM Server running on http://localhost:${PORT}`);
});
