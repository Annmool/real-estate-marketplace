// client/src/components/PropertyDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook to get URL parameters
import { getPropertyById } from '../services/propertyService'; // Service function
import './PropertyDetail.css'; // We created this CSS file earlier

const PropertyDetail = () => {
    // Get the 'id' parameter from the URL (defined in App.jsx route)
    const { id } = useParams();

    const [property, setProperty] = useState(null); // State for the single property object
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define async function to fetch the specific property
        const fetchPropertyDetails = async () => {
            if (!id) {
                setError("No property ID provided in URL.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const data = await getPropertyById(id); // Call service with the ID
                setProperty(data);
            } catch (err) {
                console.error("Error in PropertyDetail component:", err);
                setError(err.message || `Failed to load property details for ID: ${id}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetails();

    }, [id]); // Dependency array includes 'id' - effect re-runs if the ID changes

    // --- Render Logic ---

    if (loading) {
        return <div className="loading">Loading property details...</div>;
    }

    if (error) {
        return <div className="error" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
    }

    // If loading is done, no error, but property is still null (e.g., 404 from API)
    if (!property) {
         return <div className="not-found" style={{ textAlign: 'center', padding: '20px' }}>Property not found.</div>;
    }
    const isOwner = isAuthenticated && user && user.id === property.owner;
    // --- Display Property Details ---
    // Destructure for easier access (provide defaults)
    const {
        title = 'N/A', description = 'No description available.', imageUrl = 'https://placehold.co/800x500/eee/ccc?text=No+Image',
        price, status, address = 'N/A', city = 'N/A', state = 'N/A', zipCode = 'N/A',
        propertyType = 'N/A', bedrooms, bathrooms, squareFootage
    } = property;

    const displayPrice = price ? `$${price.toLocaleString()}` : 'Contact for price';
    const priceSuffix = status === 'For Rent' ? ' / month' : '';

    return (
        <div className="property-detail-container">
            <h2 className="property-detail-title">{title}</h2>
            {/* --- NEW: Edit/Delete Buttons (Conditional) --- */}
            {isOwner && (
                <div className="owner-actions" style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                    {/* Link to an Edit page (we'll create this later) */}
                    <Link to={`/edit-listing/${id}`} className="button edit-button" style={buttonStyle('#f0ad4e')}>
                        Edit Listing
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="button delete-button"
                        style={buttonStyle('#d9534f', deleteLoading)} // Pass loading state to style helper
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete Listing'}
                    </button>
                    {deleteError && <p style={{ color: 'red', textAlign: 'right', marginTop: '5px', fontSize: '0.9em' }}>{deleteError}</p>}
                </div>
             )}
             {/* --- END Edit/Delete Buttons --- */}

            <img src={imageUrl} alt={`Image of ${title}`} className="property-detail-image"/>

            <div className="property-detail-info">
                <h3>Key Information</h3>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Type:</strong> {propertyType}</p>
                <p className="property-detail-price"><strong>Price:</strong> {displayPrice}{priceSuffix}</p>
                <p><strong>Address:</strong> {address}, {city}, {state} {zipCode}</p>

                <h3>Details</h3>
                {/* Conditionally render details */}
                {bedrooms != null ? <p><strong>Bedrooms:</strong> {bedrooms}</p> : null}
                {bathrooms != null ? <p><strong>Bathrooms:</strong> {bathrooms}</p> : null}
                {squareFootage != null ? <p><strong>Sq. Footage:</strong> {squareFootage.toLocaleString()} sqft</p> : null}

                <h3>Description</h3>
                <p className="property-detail-description">{description}</p>

                 {/* TODO: Add contact form or agent info later */}
            </div>
        </div>
    );
};

const buttonStyle = (bgColor, disabled = false) => ({
    padding: '8px 15px',
    marginLeft: '10px',
    fontSize: '0.9rem',
    color: 'white',
    backgroundColor: disabled ? '#ccc' : bgColor,
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    textDecoration: 'none' // For Link acting as button
});


export default PropertyDetail;