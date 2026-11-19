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

// Middlewares
app.use(cors({
  origin: [...new Set(allowedOrigins)],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mini CRM API is running healthy on port 5000' });
});

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    res.status(503).json({
      success: false,
      message: 'Database unavailable. Check the backend MONGODB_URI and MongoDB network access settings.'
    });
  }
});

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/tasks', taskRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Mini CRM Server running on http://localhost:${PORT}`);
});
