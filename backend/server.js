const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize app
const app = express();

// ✅ Import routes
const donorRoutes = require('./routes/donorRoutes');  // for email booking
const profileRoutes = require('./routes/profile');    // for profile GET/PUT

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ✅ API Routes
app.use('/api/donors', donorRoutes);   // e.g., POST /api/donors/register, POST /api/donors/book
app.use('/api/profile', profileRoutes);     // e.g., GET /api/profile, PUT /api/profile/update

// ✅ Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
