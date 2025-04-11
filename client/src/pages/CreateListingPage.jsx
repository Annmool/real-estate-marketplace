// client/src/pages/CreateListingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/propertyService';
// We don't necessarily need useAuth here unless we want user info directly

const CreateListingPage = () => {
    // State for all form fields - initialize with defaults
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '', // Keep as string initially for input field
        address: '',
        city: '',
        state: '',
        zipCode: '',
        propertyType: 'House', // Default selection
        status: 'For Sale', // Default selection
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        imageUrl: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic frontend validation (optional, add more as needed)
        if (!formData.title || !formData.price || !formData.city || !formData.state || !formData.propertyType || !formData.status) {
            setError('Please fill in all required fields (marked with *)');
            setLoading(false);
            return;
        }

        // Prepare data for API (convert numbers)
        const propertyDataToSend = {
            ...formData,
            price: Number(formData.price) || 0, // Convert to number, default 0 if invalid
            bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined, // Convert or omit
            bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
            squareFootage: formData.squareFootage ? Number(formData.squareFootage) : undefined,
        };
        // Remove empty optional number fields if they weren't entered
        if (!propertyDataToSend.bedrooms) delete propertyDataToSend.bedrooms;
        if (!propertyDataToSend.bathrooms) delete propertyDataToSend.bathrooms;
        if (!propertyDataToSend.squareFootage) delete propertyDataToSend.squareFootage;


        try {
            console.log("Submitting property data:", propertyDataToSend);
            const newProperty = await createProperty(propertyDataToSend); // Call service
            console.log("Property created successfully:", newProperty);

            // Redirect to the newly created property's detail page
            navigate(`/properties/${newProperty._id}`);

        } catch (err) {
            console.error("Create listing page error:", err);
            setError(err.message || 'Failed to create listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Basic Styling (consider moving to CSS)
    const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '30px auto', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' };
    const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
    const inputStyle = { padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '3px' };
    const selectStyle = { padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '3px' };
    const textareaStyle = { padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '3px', minHeight: '100px', resize: 'vertical'};
    const buttonStyle = { padding: '12px', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px' };
    const errorStyle = { color: 'red', marginBottom: '10px', fontWeight: 'bold' };
    const requiredMark = { color: 'red', marginLeft: '2px' };


    return (
        <div style={{ color: '#333' }}>
            <h2>Create New Property Listing</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                {error && <p style={errorStyle}>{error}</p>}

                {/* Group fields for better structure */}
                <div style={inputGroupStyle}>
                    <label htmlFor="title">Title<span style={requiredMark}>*</span>:</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
                </div>

                <div style={inputGroupStyle}>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} style={textareaStyle}></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}> {/* Grid for side-by-side */}
                    <div style={inputGroupStyle}>
                        <label htmlFor="price">Price ($)<span style={requiredMark}>*</span>:</label>
                        <input type="number" id="price" name="price" placeholder="e.g., 3000 or 450000" value={formData.price} onChange={handleChange} required min="0" step="any" style={inputStyle} />
                    </div>
                    <div style={inputGroupStyle}>
                        <label htmlFor="status">Status<span style={requiredMark}>*</span>:</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} required style={selectStyle}>
                            <option value="For Sale">For Sale</option>
                            <option value="For Rent">For Rent</option>
                        </select>
                    </div>
                </div>

                 <div style={inputGroupStyle}>
                    <label htmlFor="propertyType">Property Type<span style={requiredMark}>*</span>:</label>
                    <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} required style={selectStyle}>
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Office">Office</option>
                        <option value="Shop">Shop</option>
                        <option value="Land">Land</option>
                    </select>
                </div>

                 {/* Address Fields */}
                 <div style={inputGroupStyle}>
                    <label htmlFor="address">Street Address:</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} style={inputStyle} />
                </div>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                     <div style={inputGroupStyle}>
                        <label htmlFor="city">City<span style={requiredMark}>*</span>:</label>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required style={inputStyle} />
                    </div>
                     <div style={inputGroupStyle}>
                        <label htmlFor="state">State<span style={requiredMark}>*</span>:</label>
                        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required style={inputStyle} />
                    </div>
                     <div style={inputGroupStyle}>
                        <label htmlFor="zipCode">Zip Code:</label>
                        <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} style={inputStyle} />
                    </div>
                 </div>

                {/* Optional Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                     <div style={inputGroupStyle}>
                        <label htmlFor="bedrooms">Bedrooms:</label>
                        <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" style={inputStyle} />
                    </div>
                     <div style={inputGroupStyle}>
                        <label htmlFor="bathrooms">Bathrooms:</label>
                        <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} min="0" step="0.5" style={inputStyle} />
                    </div>
                     <div style={inputGroupStyle}>
                        <label htmlFor="squareFootage">Square Footage:</label>
                        <input type="number" id="squareFootage" name="squareFootage" value={formData.squareFootage} min="0" style={inputStyle} />
                    </div>
                </div>

                <div style={inputGroupStyle}>
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input type="url" id="imageUrl" name="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={handleChange} style={inputStyle} />
                    <small>Enter the full URL of an image hosted online.</small>
                </div>


                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Creating Listing...' : 'Create Listing'}
                </button>
            </form>
        </div>
    );
};

export default CreateListingPage;