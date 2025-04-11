// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Import Routes ---
const propertyRoutes = require('./routes/properties'); // Using the controller-based routes
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => { res.send('API Running!'); });

// --- Mount API Routes ---
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);

// --- Database Connection & Start Server ---
console.log('Attempting to connect to MongoDB...');
console.log(`Using MONGODB_URI: ${process.env.MONGODB_URI ? '******' : 'NOT SET!'}`);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected successfully!');
        app.listen(PORT, () => {
            console.log(`Server is now running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('!!! MongoDB Connection Error !!!');
        console.error(err);
        console.error(`Error Message: ${err.message}`);
        console.error('------------------------------------');
        console.error('Troubleshooting Tips: Check DB running, URI, IP Whitelist (Atlas)');
        console.error('------------------------------------');
        process.exit(1);
    });