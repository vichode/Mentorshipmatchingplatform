const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', require('./routes/authRoutes'));         // includes login, register, test, me, profile, requests
app.use('/api/users', require('./routes/userRoutes'));        // for any additional user-specific logic
app.use('/api/sessions', require('./routes/sessionRoutes'));  // for booking/viewing sessions


// Render deployment fix (must bind to 0.0.0.0)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
);
