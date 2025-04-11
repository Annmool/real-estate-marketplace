// server/seed.js

const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

// --- Sample Property Data with Updated Image URLs ---
const sampleProperties = [
    {
        title: 'Spacious Downtown Office Space',
        description: 'Modern office space in the heart of the city. Perfect for startups or established businesses. Includes meeting rooms and kitchen.',
        price: 2500, // Assuming monthly rent
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '98765',
        propertyType: 'Office',
        status: 'For Rent',
        squareFootage: 1200,
        // --- NEW IMAGE URL ---
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        bathrooms: 2,
    },
    {
        title: 'Cozy Suburban Family Home',
        description: 'Beautiful 3-bedroom home in a quiet neighborhood. Large backyard, recently renovated kitchen. Close to schools and parks.',
        price: 450000, // Assuming sale price
        address: '456 Oak Ave',
        city: 'Suburbia',
        state: 'TX',
        zipCode: '12345',
        propertyType: 'House',
        status: 'For Sale',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1800,
        // --- NEW IMAGE URL ---
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
        title: 'High-Traffic Retail Shop Front',
        description: 'Excellent visibility retail space on a busy street. Large display windows, storage area in back. High foot traffic.',
        price: 3000, // Assuming monthly rent
        address: '789 Market Blvd',
        city: 'Metroville',
        state: 'NY',
        zipCode: '54321',
        propertyType: 'Shop',
        status: 'For Rent',
        squareFootage: 950,
        // --- NEW IMAGE URL ---
        imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        bathrooms: 1,
    },
    {
        title: 'Luxury Downtown Apartment View',
        description: 'Stunning 2-bedroom apartment with city views. Rooftop pool, gym, and concierge service. Floor-to-ceiling windows.',
        price: 3800, // Assuming monthly rent
        address: '101 Sky Tower',
        city: 'Anytown',
        state: 'CA',
        zipCode: '98766',
        propertyType: 'Apartment',
        status: 'For Rent',
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1100,
        // --- NEW IMAGE URL ---
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
     {
        title: 'Large Vacant Land Parcel',
        description: '10-acre parcel zoned for residential development. Utilities available nearby. Great investment opportunity.',
        price: 150000, // Assuming sale price
        city: 'Ruralton',
        state: 'TX',
        propertyType: 'Land',
        status: 'For Sale',
        squareFootage: 435600, // 10 acres * 43560 sqft/acre
        // --- NEW IMAGE URL ---
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
    },
    // Add more sample properties as needed
];

// --- Database Connection and Seeding Function (Keep this part the same) ---
const seedDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing properties
        console.log('Deleting existing properties...');
        await Property.deleteMany({});
        console.log('Existing properties deleted.');

        // Insert sample properties
        console.log('Inserting sample properties...');
        await Property.insertMany(sampleProperties);
        console.log('Sample properties inserted successfully!');

    } catch (err) {
        console.error('Error during seeding process:', err.message);
    } finally {
        // Close the database connection
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        } catch (closeErr) {
            console.error('Error closing MongoDB connection:', closeErr.message);
        }
        process.exit(); // Exit the script
    }
};

// --- Execute the Seeding Function ---
seedDB();