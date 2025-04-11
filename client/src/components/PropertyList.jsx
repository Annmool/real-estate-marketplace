// client/src/components/PropertyList.jsx
import React, { useState, useEffect } from 'react';
import { getAllProperties } from '../services/propertyService'; // Import the service
import PropertyCard from './PropertyCard'; // Import the card component
// Optional: import './PropertyList.css'; // CSS for layout

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllProperties(); // Use the service function
                setProperties(data);
            } catch (err) {
                // Use the error thrown by the service
                console.error("Error in PropertyList component:", err);
                setError(err.message || 'Failed to load properties.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []); // Empty dependency array runs once on mount

    if (loading) {
        return <div className="loading">Loading properties...</div>;
    }

    if (error) {
        // Display the error message from the state
        return <div className="error" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
    }

    // Use a more descriptive message if properties is empty after loading without error
    if (properties.length === 0) {
        return <div className="no-properties" style={{ textAlign: 'center', padding: '20px' }}>No properties found.</div>;
    }

    return (
        <div className="property-list-container">
            <h2>Available Properties</h2>
            {/* Add basic grid styling */}
            <div className="property-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {properties.map((property) => (
                    <PropertyCard key={property._id || property.title} property={property} /> // Use _id if available from MongoDB
                ))}
            </div>
        </div>
    );
};

export default PropertyList;