// client/src/services/authService.js
import axios from 'axios';

const API_URL = '/api/auth'; // Base URL for auth routes (relies on proxy)

// Register User function
export const registerUser = async (userData) => {
    // userData should be an object like { name, email, password }
    try {
        // Make POST request to the backend register route
        const response = await axios.post(`${API_URL}/register`, userData);
        // Backend should return { msg: '...', token: '...' } on success
        console.log('Registration API response:', response.data); // Log for debugging
        return response.data; // Return the response data (including the token)
    } catch (error) {
        // Log the detailed error
        console.error("Registration service error:", error.response?.data || error.message);
        // Throw a user-friendly error message
        throw new Error(error.response?.data?.msg || 'Registration failed');
    }
};

// Login User function
export const loginUser = async (userData) => {
    // userData should be an object like { email, password }
    try {
        // Make POST request to the backend login route
        const response = await axios.post(`${API_URL}/login`, userData);
        // Backend should return { msg: '...', token: '...' } on success
        console.log('Login API response:', response.data); // Log for debugging
        return response.data; // Return the response data (including the token)
    } catch (error) {
        // Log the detailed error
        console.error("Login service error:", error.response?.data || error.message);
        // Throw a user-friendly error message
        throw new Error(error.response?.data?.msg || 'Login failed');
    }
};

// TODO: Add function later to get user data using token
export const getUserProfile = async () => {
    try {
        // Make GET request with Authorization header
        const response = await axios.get(`${API_URL}/user`, {
            headers: getAuthHeaders()
        });
        console.log('Get User Profile API response:', response.data);
        // Return the user data object
        return response.data;
    } catch (error) {
        console.error("Get user profile service error:", error.response?.data || error.message);
        // Don't throw a generic error here, let the context handle auth failure
        // If the token is invalid, the backend returns 401, axios might throw
        // Re-throw the original error so context can check status code maybe
        throw error;
    }
};