const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON requests

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000', // For development
  'https://front1234.netlify.app', // Your deployed frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// Connect to MongoDB using the URI from the .env file
const db = process.env.MONGO_URI;
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define routes
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const listingsRoutes = require('./routes/listingsRoutes'); // Added Listings Routes

// Use routes
app.use('/api/users', userRoutes); // User-related routes (login, register)
app.use('/api/dashboard', dashboardRoutes); // Protected routes
app.use('/api/listings', listingsRoutes); // Listings routes

// Set up environment variables for the JWT secret
const jwtSecret = process.env.JWT_SECRET;

// Serve frontend in production (if you’re deploying a full-stack app)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
