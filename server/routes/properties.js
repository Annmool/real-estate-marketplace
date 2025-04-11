// server/routes/properties.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controller functions
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
} = require('../controllers/propertyController');

// Define routes using controller functions
router.route('/')
    .get(getProperties)             // GET /api/properties
    .post(protect, createProperty); // POST /api/properties (Protected)

router.route('/:id')
    .get(getPropertyById)           // GET /api/properties/:id
    .put(protect, updateProperty)     // PUT /api/properties/:id (Protected)
    .delete(protect, deleteProperty); // DELETE /api/properties/:id (Protected)

module.exports = router;