// client/src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
    const {
        _id, title, imageUrl, city, state, propertyType, status, price, bedrooms, bathrooms, squareFootage
    } = property;

    const displayPrice = price ? `$${price.toLocaleString()}` : 'Contact for price';
    const priceSuffix = status === 'For Rent' ? ' / month' : '';

    // Check if _id exists before creating the link URL
    const detailUrl = _id ? `/properties/${_id}` : '#'; // Fallback if no ID

    return (
        // Wrap the entire card in a Link (or just part of it if preferred)
        <Link to={detailUrl} className="property-card-link-wrapper"> {/* Added a wrapper class */}
            <div className="property-card">
                <img
                    src={imageUrl}
                    alt={`Image of ${title}`}
                    className="property-card-image"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/eee/ccc?text=Image+Error'; }}
                />
                <div className="property-card-body">
                    <h3 className="property-card-title">{title}</h3>
                    <p className="property-card-location">{city}, {state}</p>
                    <p className="property-card-type">{propertyType} - {status}</p>
                    <div className="property-card-details">
                        {bedrooms != null && <span>{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>}
                        {bathrooms != null && <span>{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>}
                        {squareFootage != null && <span>{squareFootage.toLocaleString()} sqft</span>}
                    </div>
                    <p className="property-card-price">
                        {displayPrice}{priceSuffix}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;