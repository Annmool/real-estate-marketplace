// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService'; // <<< Import service function
import { useAuth } from '../context/AuthContext';   // <<< Import context hook

const LoginPage = () => {
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
        try {
            // <<< Call actual login service >>>
            const responseData = await loginUser({ email, password });

            // <<< Use context to store token >>>
            if (responseData.token) {
                loginContext(responseData.token); // Pass token to context
                console.log("Login successful, navigating home...");
                navigate('/'); // Redirect to homepage after successful login
            } else {
                setError('Login completed but no token received.');
            }

        } catch (err) {
            console.error("Login page error:", err);
            // Display the error message thrown by the service
            setError(err.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    // --- Keep Styles and Return JSX the same ---
    const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' };
    const inputStyle = { marginBottom: '15px', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' };
    const buttonStyle = { padding: '10px 15px', fontSize: '1rem', backgroundColor: '#0275d8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
    const errorStyle = { color: 'red', marginBottom: '10px'};
    const linkStyle = { marginTop: '15px', textAlign: 'center' };

    return (
        <div style={{ color: '#333' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                 {/* ... (form inputs remain the same) ... */}
                 {error && <p style={errorStyle}>{error}</p>}
                 <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle}/>
                 <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle}/>
                <button type="submit" disabled={loading} style={buttonStyle}>
                     {loading ? 'Logging In...' : 'Login'}
                </button>
                <p style={linkStyle}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;