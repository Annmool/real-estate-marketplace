// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'] // Added validation message
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // Ensure emails are unique
        match: [ // Basic email format validation
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'], // Enforce minimum length
        select: false // Important: Don't automatically return password field in queries
    },
    // Add other fields later if needed (e.g., avatar, role)
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Note: We will add password hashing middleware later (in a separate step or before saving)
// For now, this defines the schema.

module.exports = mongoose.model('User', UserSchema);