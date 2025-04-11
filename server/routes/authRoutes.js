const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware'); // <<< Import protect middleware
require('dotenv').config({ path: '../.env' });

const router = express.Router();

// --- REGISTER Route ---
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    // Get name, email, password from request body
    const { name, email, password } = req.body;

    // Basic validation (can add more robust validation later)
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() }); // Case-insensitive check
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }

        // 2. If user doesn't exist, create new user instance
        user = new User({
            name,
            email: email.toLowerCase(), // Store email consistently
            password // We'll hash this next
        });

        // 3. Hash the password before saving
        const salt = await bcrypt.genSalt(10); // Generate salt (complexity factor)
        user.password = await bcrypt.hash(password, salt); // Hash the password

        // 4. Save the user to the database
        await user.save();
        console.log(`User registered: ${user.email}`);

        // 5. Create JWT Payload (what info to encode in the token)
        const payload = {
            user: {
                id: user.id // Include user ID
                // Can add name, email etc. if needed, but keep payload small
            }
        };

        // 6. Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret key from .env
            { expiresIn: '5h' }, // Token expiration (e.g., 5 hours)
            (err, token) => {
                if (err) throw err; // Handle signing errors
                // 7. Send token back to the client
                res.status(201).json({ // 201 Created status
                    msg: 'User registered successfully',
                    token // Send the token
                    // Optionally send user info (excluding password)
                    // user: { id: user.id, name: user.name, email: user.email }
                });
            }
        );

    } catch (err) {
        console.error("Registration Error:", err.message);
        // Handle potential validation errors from Mongoose schema
        if (err.name === 'ValidationError') {
             const messages = Object.values(err.errors).map(val => val.message);
             return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).send('Server Error during registration');
    }
});

// --- LOGIN Route (Coming Soon) ---
// router.post('/login', async (req, res) => { ... });
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    try {
        // 1. Find user by email (case-insensitive)
        // IMPORTANT: Use .select('+password') to explicitly include the password field,
        // which we excluded by default in the User model schema using `select: false`.
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        // 2. If user not found
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' }); // Use a generic message for security
        }

        // 3. Compare provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // 4. If passwords don't match
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' }); // Use a generic message
        }

        // 5. Passwords match - Create JWT Payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // 6. Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Consistent expiration
            (err, token) => {
                if (err) throw err;
                // 7. Send token back to the client
                res.json({ // Default 200 OK status
                    msg: 'Login successful',
                    token
                    // Optionally send user info (excluding password!)
                    // user: { id: user.id, name: user.name, email: user.email }
                });
            }
        );

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server Error during login');
    }
});
router.get('/user', protect, async (req, res) => { // <<< Use protect middleware
    try {
        // The 'protect' middleware already verified the token and attached req.user
        // req.user contains the payload we put in the token (which has user.id)
        console.log(`Fetching user data for ID: ${req.user.id}`);

        // Find the user by ID from the token, explicitly exclude the password
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            // Should technically not happen if token is valid, but good check
            return res.status(404).json({ msg: 'User not found' });
        }

        // Send back user data (id, name, email, createdAt etc.)
        res.json(user);

    } catch (err) {
        console.error("Error fetching user data:", err.message);
        res.status(500).send('Server Error getting user data');
    }
});
// --- End Get User Route ---

module.exports = router;