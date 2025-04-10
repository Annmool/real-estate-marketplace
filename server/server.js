require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable or default

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production later)
app.use(express.json()); // Allow server to accept JSON in request body

// Basic Route (for testing)
app.get('/', (req, res) => {
    res.send('Real Estate Marketplace API Running!');
});

// TODO: Add other routes (auth, properties) later

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected...');
        // Start server only after successful DB connection
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    });