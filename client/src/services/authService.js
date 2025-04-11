// client/src/services/authService.js
import axios from 'axios';

const API_URL = '/api/auth';

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


// Register User function
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        console.log('Registration API response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Registration service error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || 'Registration failed');
    }
};

// Login User function
export const loginUser = async (userData) => {
     try {
        const response = await axios.post(`${API_URL}/login`, userData);
        console.log('Login API response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Login service error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || 'Login failed');
    }
};

// Get User Profile function
export const getUserProfile = async () => {
    console.log("AuthService: getUserProfile called."); // <<< Log 1
    const headers = getAuthHeaders();
    console.log("AuthService: Headers being sent:", headers); // <<< Log 2
    if (!headers.Authorization) {
        console.warn("AuthService: No auth token found for getUserProfile request."); // <<< Log 3
        // Decide if we should throw error immediately if no token
        // throw new Error("Not authorized");
    }
    try {
        const response = await axios.get(`${API_URL}/user`, { headers });
        console.log('AuthService: Get User Profile API SUCCESS:', response.data); // <<< Log 4
        return response.data;
    } catch (error) {
        console.error("AuthService: Get user profile API FAILED:", error.response?.data || error.message); // <<< Log 5
        throw error;
    }
};