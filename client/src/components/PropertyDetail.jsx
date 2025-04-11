// client/src/components/PropertyDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link and useNavigate
import { getPropertyById, deleteProperty } from '../services/propertyService'; // Import property services
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import './PropertyDetail.css'; // Import styling

const PropertyDetail = () => {
    const { id } = useParams(); // Get property ID from URL
    const navigate = useNavigate();
    // Call useAuth Hook to get context values
    const { user, isAuthenticated, isLoading: authLoading } = useAuth(); // Get user, auth status, and loading status from context

    // State for this component
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true); // Loading property data
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // Effect to fetch property data when component mounts or ID changes
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            if (!id) {
                setError("No property ID provided in URL.");
                setLoading(false);
                return;
            }
            console.log(`PropertyDetail: Fetching data for ID: ${id}`);
            setLoading(true);
            setError(null);
            try {
                const data = await getPropertyById(id);
                console.log("PropertyDetail: Fetched property data:", data);
                setProperty(data);
            } catch (err) {
                console.error("Error in PropertyDetail component fetching data:", err);
                setError(err.message || `Failed to load property details for ID: ${id}`);
                setProperty(null); // Ensure property is null on error
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [id]); // Dependency array includes 'id'

    // Delete Handler function
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) {
            return;
        }
        setDeleteLoading(true);
        setDeleteError('');
        try {
            await deleteProperty(id);
            console.log('Property deleted successfully from detail page.');
            alert('Property deleted successfully!');
            navigate('/'); // Redirect to homepage after deletion
        } catch (err) {
            console.error("Error deleting property from detail page:", err);
            setDeleteError(err.message || 'Failed to delete property.');
        } finally {
            setDeleteLoading(false);
        }
    };

    // --- Render Logic ---

    // Show loading state while either auth or property data is loading
    if (authLoading || loading) {
        return <div className="loading">Loading...</div>;
    }

    // Display error if fetching the property failed
    if (error) {
         return <div className="error" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
    }

    // Display if property data couldn't be loaded (e.g., 404)
    if (!property) {
         return <div className="not-found" style={{ textAlign: 'center', padding: '20px' }}>Property not found.</div>;
    }

    // --- Perform Ownership Check ONLY after data is loaded ---
    // Check if authenticated, user object exists, and user ID matches property owner ID
    const isOwner = isAuthenticated && user && property && user.id === property.owner;

    // <<< --- DEBUGGING LOGS --- >>>
    console.log("--- PropertyDetail Ownership Check ---");
    console.log("isAuthenticated (from context):", isAuthenticated);
    console.log("User ID (from context):", user?.id); // Use optional chaining
    console.log("Property Owner ID (from data):", property?.owner);
    console.log("IDs Match?", user?.id === property?.owner);
    console.log("Is Owner calculated?", isOwner);
    console.log("------------------------------------");
    // <<< --- END DEBUGGING LOGS --- >>>

    // Destructure property details safely now that property is not null
    const {
        title = 'N/A', description = 'No description available.', imageUrl = 'https://placehold.co/800x500/eee/ccc?text=No+Image',
        price, status, address = 'N/A', city = 'N/A', state = 'N/A', zipCode = 'N/A',
        propertyType = 'N/A', bedrooms, bathrooms, squareFootage
    } = property;

    const displayPrice = price ? `$${price.toLocaleString()}` : 'Contact for price';
    const priceSuffix = status === 'For Rent' ? ' / month' : '';

    return (
        <div className="property-detail-container">
            {/* Display Property Title */}
            <h2 className="property-detail-title">{title}</h2>

            {/* --- Edit/Delete Buttons (Show only if isOwner is true) --- */}
            {isOwner && (
                <div className="owner-actions" style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                    {/* Link to the Edit page */}
                    <Link to={`/edit-listing/${id}`} className="button edit-button" style={buttonStyle('#f0ad4e')}>
                        Edit Listing
                    </Link>
                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="button delete-button"
                        style={buttonStyle('#d9534f', deleteLoading)}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete Listing'}
                    </button>
                    {/* Display delete error message if any */}
                    {deleteError && <p style={{ color: 'red', textAlign: 'right', marginTop: '5px', fontSize: '0.9em' }}>{deleteError}</p>}
                </div>
             )}
             {/* --- END Edit/Delete Buttons --- */}

            {/* Display Property Image */}
            <img
                src={imageUrl} // Use the actual URL or fallback
                alt={`Image of ${title}`}
                className="property-detail-image"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x500/eee/ccc?text=Image+Error'; }}
            />

            {/* Display Property Information */}
            <div className="property-detail-info">
                <h3>Key Information</h3>
                <p><strong>Status:</strong> {status || 'N/A'}</p>
                <p><strong>Type:</strong> {propertyType || 'N/A'}</p>
                <p className="property-detail-price"><strong>Price:</strong> {displayPrice}{priceSuffix}</p>
                <p><strong>Address:</strong> {address ? `${address}, ${city}, ${state} ${zipCode || ''}` : `${city || 'N/A'}, ${state || 'N/A'}`}</p>

                <h3>Details</h3>
                {bedrooms != null ? <p><strong>Bedrooms:</strong> {bedrooms}</p> : null}
                {bathrooms != null ? <p><strong>Bathrooms:</strong> {bathrooms}</p> : null}
                {squareFootage != null ? <p><strong>Sq. Footage:</strong> {squareFootage.toLocaleString()} sqft</p> : null}

                <h3>Description</h3>
                <p className="property-detail-description">{description || 'No description provided.'}</p>

            </div>
        </div>
    );
};

// Helper function for button styles (remains the same)
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
    textDecoration: 'none'
});

export default PropertyDetail;