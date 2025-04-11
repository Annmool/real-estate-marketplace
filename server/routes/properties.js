// server/routes/properties.js
const express = require('express');
const router = express.Router();

// We will import controller functions here later
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
} = require('../controllers/propertyController'); // Adjust path as needed

// Define routes
router.route('/')
    .get(getProperties)      // GET /api/properties
    .post(createProperty);    // POST /api/properties

router.route('/:id')
    .get(getPropertyById)    // GET /api/properties/123
    .put(updateProperty)     // PUT /api/properties/123
    .delete(deleteProperty); // DELETE /api/properties/123

module.exports = router;