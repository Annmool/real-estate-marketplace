// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../services/authService'; // Make sure this service function exists

// 1. Create the Context Object
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    // --- State ---
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        isLoading: true,
        user: null
    });

    // --- Effect for Initial Load & Token Validation ---
    useEffect(() => {
        const loadUserFromToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                console.log("AuthContext: Initial token found. Verifying...");
                try {
                    const userData = await getUserProfile(); // Call service
                    console.log("AuthContext: Token valid, user data fetched:", userData);
                    setAuthState({ // Update state with user
                        token: token,
                        isAuthenticated: true,
                        isLoading: false,
                        user: userData
                    });
                } catch (error) {
                    console.error("AuthContext: Failed to verify token/fetch user.", error.response?.data?.msg || error.message);
                    localStorage.removeItem('token'); // Remove invalid token
                    setAuthState({ token: null, isAuthenticated: false, isLoading: false, user: null });
                }
            } else {
                console.log("AuthContext: No initial token found.");
                setAuthState({ token: null, isAuthenticated: false, isLoading: false, user: null });
            }
        };

        loadUserFromToken();
    }, []); // <<< Semicolon added here (best practice)

    // --- Login Function ---
    // Corrected 'const' keyword
    const loginContext = (token, userData = null) => {
        console.log("AuthContext: loginContext called. Storing token and user data (if provided)...");
        localStorage.setItem('token', token);
        const newState = { // Create new state object first
            token: token,
            isAuthenticated: true,
            isLoading: false,
            user: userData
        };
        setAuthState(newState); // Update state
        // <<< ADD THIS LOG >>>
        console.log("AuthContext: State AFTER loginContext:", newState);
    };

    // --- Logout Function ---
    const logoutContext = () => {
        console.log("AuthContext: logoutContext called. Removing token...");
        localStorage.removeItem('token');
        const newState = { // Create new state object first
            token: null,
            isAuthenticated: false,
            isLoading: false,
            user: null
        };
        setAuthState(newState); // Update state
        // <<< ADD THIS LOG >>>
        console.log("AuthContext: State AFTER logoutContext:", newState);
    };


    // --- Value Provided to Context Consumers ---
    const authContextValue = {
        ...authState,
        loginContext,
        logoutContext
    };

    // --- Render the Provider ---
    return (
        <AuthContext.Provider value={authContextValue}>
            {!authState.isLoading ? children : <div>Loading Application...</div>}
        </AuthContext.Provider>
    );

}; // Closing brace for AuthProvider

// 3. Create and Export the Custom Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; // Closing brace for useAuth