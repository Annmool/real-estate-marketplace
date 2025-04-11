// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Import Routes ---
const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes'); // <<< Add this line

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // Make sure this is before routes

// Basic Route
app.get('/', (req, res) => {
    res.send('Real Estate Marketplace API Running!');
});

// --- Mount API Routes ---
// server/server.js
// ... (keep code above this line the same) ...

// --- Mount API Routes ---
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);

// --- Database Connection & Start Server (Modified for better logging) ---
console.log('Attempting to connect to MongoDB...');
console.log(`Using MONGODB_URI: ${process.env.MONGODB_URI ? '******' : 'NOT SET!'}`); // Mask URI in log

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected successfully!'); // Success message

        // Start server ONLY after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is now running on http://localhost:${PORT}`); // Confirmation
        });
    })
    .catch(err => {
        // Log the specific error object
        console.error('!!! MongoDB Connection Error !!!');
        console.error(err); // Print the full error object
        console.error(`Error Message: ${err.message}`);
        console.error('------------------------------------');
        console.error('Troubleshooting Tips:');
        console.error('1. Is your MongoDB server (local or Atlas) running?');
        console.error('2. Is the MONGODB_URI in your server/.env file correct?');
        console.error('3. If using Atlas, is your current IP address whitelisted?');
        console.error('4. Are there any typos in the URI?');
        console.error('------------------------------------');
        process.exit(1); // Exit process with failure code
    });
// --- End Modified Block ---