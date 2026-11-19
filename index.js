const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const seedAdmin = require('./config/seedAdmin');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leadRoutes = require('./routes/leadRoutes');
const companyRoutes = require('./routes/companyRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database & auto-seed mock/default data
connectDB().then(() => {
  seedAdmin();
});

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
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

// Root Health Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mini CRM API is running healthy on port 5000' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Mini CRM Server running on http://localhost:${PORT}`);
});
