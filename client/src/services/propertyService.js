// client/src/services/propertyService.js
import axios from 'axios'; // Use import for frontend

// Base URL relies on the proxy configured in vite.config.js
const API_BASE_URL = '/api/properties';

// Function 1: Get All Properties
export const getAllProperties = async () => {
    try {
        // Use axios to make the GET request
        const response = await axios.get(API_BASE_URL);
        // Return the data array from the response
        return response.data;
    } catch (error) {
        // Log error and create a user-friendly message
        console.error("Error fetching all properties in service:", error);
        const message = error.response?.data?.msg || // Check for backend JSON error message
                        error.message || // Otherwise use Axios/network error message
                        'Failed to load properties'; // Default fallback
        throw new Error(message); // Re-throw the error for the component
    }
};

// Function 2: Get Property By ID
export const getPropertyById = async (id) => {
    if (!id) {
        // Basic validation
        throw new Error('Property ID is required');
    }
    try {
        // Use axios to make the GET request to the specific property endpoint
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        // Return the single property object data
        return response.data;
    } catch (error) {
        // Log error and create a user-friendly message
        console.error(`Error fetching property ${id} in service:`, error);
        const message = error.response?.data?.msg || // Check for backend JSON error message (like 'Property not found')
                        error.message || // Otherwise use Axios/network error message
                        `Failed to load property ${id}`; // Default fallback
        throw new Error(message); // Re-throw the error for the component
    }
};

export const createProperty = async (propertyData) => {
    try {
        // Make POST request with property data and Authorization header
        const response = await axios.post(API_BASE_URL, propertyData, {
            headers: getAuthHeaders() // Get token from localStorage
        });
        console.log('Create Property API response:', response.data);
        // Return the newly created property object from the backend
        return response.data;
    } catch (error) {
        console.error("Create property service error:", error.response?.data || error.message);
        // Throw a user-friendly error message
        throw new Error(error.response?.data?.msg || 'Failed to create property listing');
    }
};

// Add createProperty, updateProperty, deleteProperty functions later...
// export const createProperty = async (propertyData) => { ... };
// --- NEW FUNCTION: Update Property ---
export const updateProperty = async (id, propertyData) => {
    if (!id) throw new Error('Property ID is required for update');
    try {
        // Make PUT request with property data and Auth header
        const response = await axios.put(`${API_BASE_URL}/${id}`, propertyData, {
            headers: getAuthHeaders()
        });
        console.log('Update Property API response:', response.data);
        // Return the updated property object
        return response.data;
    } catch (error) {
        console.error(`Update property ${id} service error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || `Failed to update property ${id}`);
    }
};

// --- NEW FUNCTION: Delete Property ---
export const deleteProperty = async (id) => {
    if (!id) throw new Error('Property ID is required for deletion');
    try {
        // Make DELETE request with Auth header
        const response = await axios.delete(`${API_BASE_URL}/${id}`, {
            headers: getAuthHeaders()
        });
        console.log('Delete Property API response:', response.data);
        // Return the success message/data from the backend
        return response.data; // Should contain { msg: '...', id: '...' }
    } catch (error) {
        console.error(`Delete property ${id} service error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || `Failed to delete property ${id}`);
    }
};
// --- End New Functions ---