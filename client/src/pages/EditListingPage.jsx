// client/src/pages/EditListingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../services/propertyService';
// We might need useAuth later if we want extra checks, but ownership is checked backend
// import { useAuth } from '../context/AuthContext';

const EditListingPage = () => {
    const { id } = useParams(); // Get property ID from URL
    const navigate = useNavigate();
    // const { user } = useAuth(); // Optional: Get user if needed for extra checks

    // State for form fields - initialize empty
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', address: '', city: '',
        state: '', zipCode: '', propertyType: 'House', status: 'For Sale',
        bedrooms: '', bathrooms: '', squareFootage: '', imageUrl: ''
    });
    const [loading, setLoading] = useState(true); // Loading existing data
    const [submitting, setSubmitting] = useState(false); // Submitting update
    const [error, setError] = useState('');

    // --- Effect to Fetch Existing Property Data ---
    useEffect(() => {
        const fetchPropertyData = async () => {
            setLoading(true);
            setError('');
            try {
                console.log(`EditPage: Fetching data for property ID: ${id}`);
                const data = await getPropertyById(id);

                // Optional Frontend Check: Verify if logged-in user is owner
                // Note: Backend *already* enforces this on the PUT request,
                // but this prevents users even loading the edit form for listings they don't own.
                // Uncomment if you add 'user' from useAuth() above.
                // if (user && user.id !== data.owner) {
                //     setError("You are not authorized to edit this listing.");
                //     setLoading(false);
                //     // Optional: navigate('/unauthorized'); or similar
                //     return;
                // }

                // Pre-fill form state (handle potential missing fields)
                // Convert numbers back to strings for input fields
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    price: data.price != null ? String(data.price) : '',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    zipCode: data.zipCode || '',
                    propertyType: data.propertyType || 'House',
                    status: data.status || 'For Sale',
                    bedrooms: data.bedrooms != null ? String(data.bedrooms) : '',
                    bathrooms: data.bathrooms != null ? String(data.bathrooms) : '',
                    squareFootage: data.squareFootage != null ? String(data.squareFootage) : '',
                    imageUrl: data.imageUrl || ''
                });
                console.log("EditPage: Form data pre-filled.");
            } catch (err) {
                console.error("EditPage: Error fetching property data:", err);
                // Handle cases where property might not be found (e.g., deleted after clicking link)
                if (err.message.includes('not found')) {
                     setError('Property not found. It may have been deleted.');
                } else {
                    setError(err.message || 'Failed to load property data for editing.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPropertyData();
        } else {
            setError("No property ID found in URL.");
            setLoading(false);
        }
        // Add 'user' to dependency array if you uncomment the owner check above
    }, [id]);


    // --- Handle Form Input Changes ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Handle Form Submission (Update) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous submission errors
        setSubmitting(true);

         // Prepare data for API (convert numbers, same as create page)
         // Only send fields that were actually part of the form state
        const propertyDataToSend = {
            title: formData.title,
            description: formData.description,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            propertyType: formData.propertyType,
            status: formData.status,
            imageUrl: formData.imageUrl,
            price: Number(formData.price) || 0,
            // Conditionally add number fields only if they have a value
            ...(formData.bedrooms && { bedrooms: Number(formData.bedrooms) }),
            ...(formData.bathrooms && { bathrooms: Number(formData.bathrooms) }),
            ...(formData.squareFootage && { squareFootage: Number(formData.squareFootage) }),
        };
         // Clean potentially empty optional strings if needed (optional)
         if (!propertyDataToSend.description) delete propertyDataToSend.description;
         if (!propertyDataToSend.address) delete propertyDataToSend.address;
         if (!propertyDataToSend.zipCode) delete propertyDataToSend.zipCode;
         if (!propertyDataToSend.imageUrl) delete propertyDataToSend.imageUrl;


        try {
            console.log(`EditPage: Submitting update for property ID: ${id}`, propertyDataToSend);
            const updatedProperty = await updateProperty(id, propertyDataToSend); // Call update service
            console.log("Property updated successfully:", updatedProperty);
            alert("Listing updated successfully!"); // Feedback
            // Redirect back to the updated property's detail page
            navigate(`/properties/${id}`);

        } catch (err) {
            console.error("Edit listing page error:", err);
            setError(err.message || 'Failed to update listing. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // --- Render Logic ---
    if (loading) return <div style={{ textAlign: 'center', padding: '30px' }}>Loading listing data...</div>;
    // Show fetch error (e.g., property not found, not authorized)
    if (error && !formData.title) return <div style={{ color: 'red', textAlign: 'center', padding: '30px' }}>Error: {error}</div>;

    // --- Re-use Form Structure (Identical to CreateListingPage, just button text changes) ---
    const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '30px auto', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' };
    const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
    const inputStyle = { padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '3px' };
    const selectStyle = { padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '3px' };
    const textareaStyle = { padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '3px', minHeight: '100px', resize: 'vertical'};
    const buttonStyle = { padding: '12px', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '4px' }; // Orange for update
    const errorStyle = { color: 'red', marginBottom: '10px', fontWeight: 'bold', backgroundColor: '#fdd', padding: '10px', borderRadius: '4px' }; // Style error msg
    const requiredMark = { color: 'red', marginLeft: '2px' };


    return (
        <div style={{ color: '#333' }}>
            <h2>Edit Property Listing</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                {/* Display submission error here */}
                {error && <p style={errorStyle}>{error}</p>}

                {/* --- Form Fields (Same as CreateListingPage) --- */}
                {/* Title */}
                <div style={inputGroupStyle}>
                    <label htmlFor="title">Title<span style={requiredMark}>*</span>:</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
                </div>
                 {/* Description */}
                <div style={inputGroupStyle}>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} style={textareaStyle}></textarea>
                </div>
                 {/* Price & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                     <div style={inputGroupStyle}>
                        <label htmlFor="price">Price ($)<span style={requiredMark}>*</span>:</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="any" style={inputStyle} />
                    </div>
                     <div style={inputGroupStyle}>
                        <label htmlFor="status">Status<span style={requiredMark}>*</span>:</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} required style={selectStyle}>
                            <option value="For Sale">For Sale</option>
                            <option value="For Rent">For Rent</option>
                        </select>
                    </div>
                </div>
                 {/* Property Type */}
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
                        <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" step="0.5" style={inputStyle} />
                    </div>
                     <div style={inputGroupStyle}>
                        <label htmlFor="squareFootage">Square Footage:</label>
                        <input type="number" id="squareFootage" name="squareFootage" value={formData.squareFootage} onChange={handleChange} min="0" style={inputStyle} />
                    </div>
                 </div>
                 {/* Image URL */}
                <div style={inputGroupStyle}>
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={inputStyle} />
                </div>
                {/* --- END Form Fields --- */}


                <button type="submit" disabled={submitting} style={buttonStyle}>
                    {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditListingPage;