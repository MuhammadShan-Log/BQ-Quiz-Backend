require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

// Import Routes
const authRoutes = require('./routes/userRoute');
const courseRoutes = require('./routes/courseRoute');
const quizRoutes = require('./routes/quiz.routes');

// Import Middlewares
const apiResponse = require('./middlewares/apiResponse');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Custom API response helpers (must be before routes)
app.use(apiResponse);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Stop server if DB connection fails
  });

// Routes
app.use('/auth', authRoutes);
app.use('/course', courseRoutes);
app.use('/quiz', quizRoutes); 

// Health Check Route (optional)
app.get('/', (req, res) => {
  res.apiSuccess(null, 'BQ-Quiz-App Backend Running');
});

// Global Error Handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.apiError(err.message || 'Internal Server Error');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
