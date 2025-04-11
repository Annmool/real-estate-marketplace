// server/controllers/propertyController.js
const Property = require('../models/Property'); // Ensure path is correct, likely ../models/Property.js
const mongoose = require('mongoose');

// @desc    Get all properties (with optional filtering)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
    try {
        // --- Build Filter Object from Query Params ---
        const queryFilter = {};
        console.log("Received query params:", req.query); // Log received params

        // Filter by City (Case-insensitive partial match)
        if (req.query.city && req.query.city.trim() !== '') {
            queryFilter.city = { $regex: req.query.city.trim(), $options: 'i' };
        }
        // Filter by Property Type (Exact match from Enum)
        if (req.query.propertyType && req.query.propertyType !== '') {
             // Optional: Validate against schema enum if needed, for now trust frontend/user input
             queryFilter.propertyType = req.query.propertyType;
        }
        // Filter by Status (Exact match from Enum)
        if (req.query.status && req.query.status !== '') {
             queryFilter.status = req.query.status;
        }
        // Example: Filter by Min Price
        if (req.query.minPrice && !isNaN(Number(req.query.minPrice))) {
            queryFilter.price = { ...queryFilter.price, $gte: Number(req.query.minPrice) };
        }
        // Example: Filter by Max Price
        if (req.query.maxPrice && !isNaN(Number(req.query.maxPrice))) {
            // Ensure price filter exists before adding $lte
            if (!queryFilter.price) { queryFilter.price = {}; }
            queryFilter.price = { ...queryFilter.price, $lte: Number(req.query.maxPrice) };
        }
        // TODO: Add filters for bedrooms, bathrooms etc. similarly

        console.log("API Filter Applied:", queryFilter); // Log the final filter object

        // --- Apply Filter to Mongoose Query ---
        const properties = await Property.find(queryFilter).sort({ createdAt: -1 }); // Find with filter

        // Send response (send the array directly, consistent with other routes)
        res.status(200).json(properties);

    } catch (err) {
        console.error("Controller Error fetching filtered properties:", err.message);
        // Send a structured error response
        res.status(500).json({ success: false, error: 'Server Error fetching properties' });
    }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, error: 'Invalid property ID format' });
    }
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }
        res.status(200).json(property); // Send object directly
    } catch (err) {
        console.error(`Controller Error fetching property ${req.params.id}:`, err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Middleware handles auth)
const createProperty = async (req, res, next) => {
     const {
        title, description, price, address, city, state, zipCode,
        propertyType, status, bedrooms, bathrooms, squareFootage, imageUrl
    } = req.body;

     // Basic server-side validation
    if (!title || !price || !city || !state || !propertyType || !status) {
        return res.status(400).json({ success: false, error: 'Please include all required fields (title, price, city, state, type, status)' });
    }

    try {
        const property = await Property.create({
            owner: req.user.id, // Get owner from protect middleware
            title, description, price, address, city, state, zipCode,
            propertyType, status, bedrooms, bathrooms, squareFootage, imageUrl
        });
        console.log(`Property created by user ${req.user.id}: ${property._id}`);
        res.status(201).json(property); // Return the created property
    } catch (err) {
        console.error("Controller Error creating property:", err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(500).json({ success: false, error: 'Server Error creating property' });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Middleware handles auth, controller checks ownership)
const updateProperty = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, error: 'Invalid property ID format' });
    }
    try {
        let property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Ownership Check
        if (property.owner.toString() !== req.user.id) {
            console.warn(`User ${req.user.id} attempted to edit property ${property._id} owned by ${property.owner}`);
            return res.status(401).json({ success: false, error: 'User not authorized to edit this property' });
        }

        // Proceed with update
        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        console.log(`Property ${property._id} updated by owner ${req.user.id}`);
        res.status(200).json(property);

    } catch (err) {
        console.error(`Controller Error updating property ${req.params.id}:`, err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(500).json({ success: false, error: 'Server Error updating property' });
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Middleware handles auth, controller checks ownership)
const deleteProperty = async (req, res, next) => {
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, error: 'Invalid property ID format' });
    }
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Ownership Check
        if (property.owner.toString() !== req.user.id) {
            console.warn(`User ${req.user.id} attempted to delete property ${property._id} owned by ${property.owner}`);
            return res.status(401).json({ success: false, error: 'User not authorized to delete this property' });
        }

        // Proceed with deletion
        await property.deleteOne();
        console.log(`Property ${req.params.id} deleted by owner ${req.user.id}`);
        // Send structured success response
        res.status(200).json({ success: true, msg: 'Property removed successfully', id: req.params.id });

    } catch (err) {
        console.error(`Controller Error deleting property ${req.params.id}:`, err.message);
        res.status(500).json({ success: false, error: 'Server Error deleting property' });
    }
};


module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
};