// server/routes/propertyRoutes.js
const express = require('express');
const Property = require('../models/property'); // Make sure this path is correct
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose to check for valid ObjectId
const { protect } = require('../middleware/authMiddleware'); // <<< Import middleware


// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });
        // Send the array of properties directly as JSON
        res.json(properties);
    } catch (err) {
        console.error("API Error fetching all properties:", err.message);
        res.status(500).send('Server Error'); // Send plain text error for now
    }
});

// @route   GET /api/properties/:id
// @desc    Get a single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
    // Validate if the provided ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid property ID format' }); // Send JSON error
    }

    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            // If no property found for that valid ID
            return res.status(404).json({ msg: 'Property not found' }); // Send JSON error
        }

        // Property found, send it directly as JSON
        res.json(property);

    } catch (err) {
        console.error(`API Error fetching property ${req.params.id}:`, err.message);
        // Handle potential errors during DB query (besides not found or invalid format)
        res.status(500).send('Server Error'); // Keep this general for now
    }
});

router.post('/', protect, async (req, res) => { // <<< Added protect middleware here
    // Extract property details from request body
    const {
        title, description, price, address, city, state, zipCode,
        propertyType, status, bedrooms, bathrooms, squareFootage, imageUrl
    } = req.body;

    // Basic validation (can add more robust library later like express-validator)
    if (!title || !price || !city || !state || !propertyType || !status) {
        return res.status(400).json({ msg: 'Please include all required fields (title, price, city, state, type, status)' });
    }

    try {
        // Create new property object, including the owner ID from the middleware
        const newProperty = new Property({
            owner: req.user.id, // Get owner ID from the verified token payload
            title,
            description,
            price,
            address,
            city,
            state,
            zipCode,
            propertyType,
            status,
            bedrooms,
            bathrooms,
            squareFootage,
            imageUrl
        });

        // Save the property to the database
        const savedProperty = await newProperty.save();

        console.log(`Property created by user ${req.user.id}: ${savedProperty._id}`);
        res.status(201).json(savedProperty); // Return the newly created property

    } catch (err) {
        console.error("Error creating property:", err.message);
         if (err.name === 'ValidationError') {
             const messages = Object.values(err.errors).map(val => val.message);
             return res.status(400).json({ msg: messages.join(', ') });
         }
        res.status(500).send('Server Error creating property');
    }
});
router.put('/:id', protect, async (req, res) => {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid property ID format' });
    }

    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        // --- Ownership Check ---
        // Convert owner ObjectId to string for comparison
        if (property.owner.toString() !== req.user.id) {
            console.warn(`User ${req.user.id} attempted to edit property ${property._id} owned by ${property.owner}`);
            return res.status(401).json({ msg: 'User not authorized to edit this property' });
        }

        // If owner matches, proceed with update
        // Use findByIdAndUpdate, pass the request body, return the updated document
        // { new: true } ensures the updated document is returned
        // runValidators: true ensures schema validations are run on update
        property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // Update fields provided in the body
            { new: true, runValidators: true }
        );

        console.log(`Property ${property._id} updated by owner ${req.user.id}`);
        res.json(property); // Return updated property

    } catch (err) {
        console.error(`Error updating property ${req.params.id}:`, err.message);
         if (err.name === 'ValidationError') {
             const messages = Object.values(err.errors).map(val => val.message);
             return res.status(400).json({ msg: messages.join(', ') });
         }
        res.status(500).send('Server Error updating property');
    }
});
// --- END PUT Route ---


// --- NEW ROUTE: Delete Property ---
// @route   DELETE /api/properties/:id
// @desc    Delete a property listing
// @access  Private (Owner Only)
router.delete('/:id', protect, async (req, res) => {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid property ID format' });
    }

    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        // --- Ownership Check ---
        if (property.owner.toString() !== req.user.id) {
            console.warn(`User ${req.user.id} attempted to delete property ${property._id} owned by ${property.owner}`);
            return res.status(401).json({ msg: 'User not authorized to delete this property' });
        }

        // If owner matches, proceed with deletion
        await Property.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

        console.log(`Property ${req.params.id} deleted by owner ${req.user.id}`);
        res.json({ msg: 'Property removed successfully', id: req.params.id }); // Send success message

    } catch (err) {
        console.error(`Error deleting property ${req.params.id}:`, err.message);
        res.status(500).send('Server Error deleting property');
    }
});
// --- END DELETE Route ---


module.exports = router; // Make sure this is at the very end
