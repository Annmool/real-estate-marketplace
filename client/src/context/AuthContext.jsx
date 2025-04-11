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
                console.log("AuthContext (Effect): Initial token found. Attempting to fetch user profile..."); // Log 1
                try {
                    const userData = await getUserProfile(); // Call service
                    // <<< ADD LOG HERE >>>
                    console.log("AuthContext (Effect): Successfully fetched userData:", userData); // Log 2: Check the structure of userData

                    if (userData && userData.id) { // <<< ADD Check: Ensure userData and id exist >>>
                         setAuthState({
                            token: token,
                            isAuthenticated: true,
                            isLoading: false,
                            user: { // Explicitly structure the user object if needed
                                id: userData.id, // Make sure your backend returns 'id' or '_id'
                                name: userData.name,
                                email: userData.email
                                // Add other relevant fields returned by backend
                            }
                         });
                         console.log("AuthContext (Effect): Auth state updated with user."); // Log 3
                    } else {
                        // Handle case where API returned success but no valid user data/id
                        console.error("AuthContext (Effect): Fetched user data is invalid or missing ID:", userData);
                        localStorage.removeItem('token');
                        setAuthState({ token: null, isAuthenticated: false, isLoading: false, user: null });
                    }
                } catch (error) {
                    console.error("AuthContext (Effect): API call to getUserProfile failed.", error.response?.data || error.message); // Log 4: Check the error
                    localStorage.removeItem('token');
                    setAuthState({ token: null, isAuthenticated: false, isLoading: false, user: null });
                }
            } else {
                console.log("AuthContext (Effect): No initial token found.");
                setAuthState({ token: null, isAuthenticated: false, isLoading: false, user: null });
            }
        };

        loadUserFromToken();
    }, []);
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