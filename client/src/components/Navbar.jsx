// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <<< ENSURE THIS IMPORT IS PRESENT
import './Navbar.css';
const Navbar = () => {
    // <<< Now also get 'user' from context >>>
    const { isAuthenticated, user, logoutContext } = useAuth();
    const navigate = useNavigate();
    console.log("Navbar Auth State:", { isAuthenticated, user });
    const handleLogout = () => { 
        console.log("Navbar: Logout button clicked"); // <<< Keep this log too
        logoutContext();
        navigate('/login');
     };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Real Estate</Link>
            </div>
            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        {/* <<< Display username if available >>> */}
                        {user && <span className="navbar-user">Welcome, {user.name}!</span>}

                        <Link to="/create-listing">Create Listing</Link>
                        <button onClick={handleLogout} className="navbar-button logout-button">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;