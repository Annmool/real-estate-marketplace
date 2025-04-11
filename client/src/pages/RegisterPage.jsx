// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService'; // <<< Import service function
import { useAuth } from '../context/AuthContext';     // <<< Import context hook

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { loginContext } = useAuth(); // <<< Get login function from context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password.length < 6) {
             setError('Password must be at least 6 characters');
             setLoading(false);
             return;
        }

        try {
            // <<< Call actual register service >>>
            const responseData = await registerUser({ name, email, password });

            // <<< Use context to store token >>>
            // Assuming responseData has a 'token' field
            if (responseData.token) {
                loginContext(responseData.token); // Pass token to context
                console.log("Registration successful, navigating home...");
                navigate('/'); // Redirect to homepage after successful registration
            } else {
                // Handle case where backend didn't return a token unexpectedly
                setError('Registration completed but no token received.');
            }

        } catch (err) {
            console.error("Registration page error:", err);
            // Display the error message thrown by the service
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // --- Keep Styles and Return JSX the same ---
    const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' };
    const inputStyle = { marginBottom: '15px', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' };
    const buttonStyle = { padding: '10px 15px', fontSize: '1rem', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
    const errorStyle = { color: 'red', marginBottom: '10px'};
    const linkStyle = { marginTop: '15px', textAlign: 'center' };

    return (
        <div style={{ color: '#333' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                {/* ... (form inputs remain the same) ... */}
                 <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle}/>
                 <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle}/>
                 <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" style={inputStyle}/>
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p style={linkStyle}>
                   Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;