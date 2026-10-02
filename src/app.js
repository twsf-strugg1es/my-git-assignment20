const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Blog Management System API is running',
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;