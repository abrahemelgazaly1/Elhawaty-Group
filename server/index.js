const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');

const authRoutes = require('./api/auth');
const productsRoutes = require('./api/products');
const ordersRoutes = require('./api/orders');
const requestsRoutes = require('./api/requests');
const uploadRoutes = require('./api/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// اتصال بـ MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for Base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'ELHAWTY Admin Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});