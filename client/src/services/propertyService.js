// client/src/services/propertyService.js
import axios from 'axios';

const API_BASE_URL = '/api/properties';

// <<< --- ADD THIS HELPER FUNCTION --- >>>
// Function to get the Authorization header object
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Get token from storage
    if (token) {
        // If token exists, return the header object
        return { Authorization: `Bearer ${token}` };
    }
    // If no token, return an empty object (no auth header)
    return {};
};
// <<< --- END HELPER FUNCTION --- >>>


// --- Existing Functions ---
export const getAllProperties = async (filters = {}) => {
    try {
        // --- Build Query String ---
        const params = new URLSearchParams();
        // Append filters to query parameters if they have a value
        if (filters.city) params.append('city', filters.city);
        if (filters.propertyType) params.append('propertyType', filters.propertyType);
        if (filters.status) params.append('status', filters.status);
        // Add other filters like minPrice, maxPrice here if needed
        // if (filters.minPrice) params.append('minPrice', filters.minPrice);

        const queryString = params.toString();
        const requestUrl = `${API_BASE_URL}${queryString ? `?${queryString}` : ''}`; // Append ? only if query exists
        console.log("Service making request to:", requestUrl); // Log the final URL
        // --- END Build Query String ---

        // Make the GET request with the potentially filtered URL
        const response = await axios.get(requestUrl);
        return response.data; // Return the array
    } catch (error) {
        console.error("Error fetching all properties in service:", error);
        const message = error.response?.data?.msg || error.message || 'Failed to load properties';
        throw new Error(message);
    }
};

export const getPropertyById = async (id) => {
     if (!id) throw new Error('Property ID is required');
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching property ${id} in service:`, error);
        const message = error.response?.data?.msg || error.message || `Failed to load property ${id}`;
        throw new Error(message);
    }
};

export const createProperty = async (propertyData) => {
    try {
        // Now this call will work because getAuthHeaders is defined above
        const response = await axios.post(API_BASE_URL, propertyData, {
            headers: getAuthHeaders()
        });
        console.log('Create Property API response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Create property service error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || 'Failed to create property listing');
    }
};

export const updateProperty = async (id, propertyData) => {
    if (!id) throw new Error('Property ID is required for update');
    try {
        // Now this call will work
        const response = await axios.put(`${API_BASE_URL}/${id}`, propertyData, {
            headers: getAuthHeaders()
        });
        console.log('Update Property API response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Update property ${id} service error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || `Failed to update property ${id}`);
    }
};

export const deleteProperty = async (id) => {
    if (!id) throw new Error('Property ID is required for deletion');
    try {
        // Now this call will work
        const response = await axios.delete(`${API_BASE_URL}/${id}`, {
            headers: getAuthHeaders()
        });
        console.log('Delete Property API response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Delete property ${id} service error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || `Failed to delete property ${id}`);
    }
};