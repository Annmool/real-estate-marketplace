// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Load JWT_SECRET

const protect = (req, res, next) => {
    let token;

    // Check for token in Authorization header (Bearer token)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header ('Bearer TOKEN_STRING')
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user ID from token payload to the request object
            // We assume the payload has { user: { id: '...' } } based on our login/register
            req.user = decoded.user; // Now routes after this middleware can access req.user.id

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ msg: 'Not authorized, token failed' }); // 401 Unauthorized
        }
    }

    // If no token found in header
    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' }); // 401 Unauthorized
    }
};

module.exports = { protect };