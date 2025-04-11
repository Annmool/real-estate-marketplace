// server/models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    // --- NEW FIELD ---
    owner: {
        type: mongoose.Schema.Types.ObjectId, // Links to the User model's ID
        required: true,
        ref: 'User' // Establishes relationship to the 'User' model
    },
    // --- Existing fields ---
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    address: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String },
    propertyType: { type: String, required: true, enum: ['House', 'Office', 'Shop', 'Apartment', 'Land'] },
    status: { type: String, required: true, enum: ['For Sale', 'For Rent'] },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    squareFootage: { type: Number },
    imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);