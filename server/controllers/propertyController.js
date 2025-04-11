// server/controllers/propertyController.js
const Property = require('../models/Property'); // Import the Property model

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
    try {
        // Basic fetch - Add filtering/pagination later
        const properties = await Property.find();

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (err) {
        console.error(err);
        // TODO: Better error handling
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            // Use return to stop execution after sending response
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        res.status(200).json({ success: true, data: property });
    } catch (err) {
        console.error(err);
         if (err.name === 'CastError') { // Handle invalid ID format
            return res.status(400).json({ success: false, error: 'Invalid property ID format' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (will be enforced later with auth middleware)
const createProperty = async (req, res, next) => {
    try {
        // TODO: Add user ID from authentication later: req.body.user = req.user.id;

        const property = await Property.create(req.body); // req.body contains the form data

        res.status(201).json({ // 201 Created status
            success: true,
            data: property
        });
    } catch (err) {
        console.error(err);
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (will be enforced later)
const updateProperty = async (req, res, next) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // TODO: Add check: Ensure user owns the property before update (Authorization)
        // if (property.user.toString() !== req.user.id) { ... return 401 }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document rather than the original
            runValidators: true // Ensure validation rules are run on update
        });

        res.status(200).json({ success: true, data: property });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
         if (err.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid property ID format' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (will be enforced later)
const deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // TODO: Add check: Ensure user owns the property before delete (Authorization)
         // if (property.user.toString() !== req.user.id) { ... return 401 }

        await property.deleteOne(); // Use deleteOne() on the document instance

        res.status(200).json({ success: true, data: {} }); // Return empty object on successful delete
    } catch (err) {
        console.error(err);
         if (err.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid property ID format' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
};