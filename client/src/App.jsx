// client/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail';

// Import Page Components
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage'; // <<< Import Edit Page component

// Import Global Styles
import './App.css';

function App() {
  return (
    // Main application container
    <div className="App">

      {/* Add the Navbar component at the top */}
      <Navbar />

      {/* Main content area where routed components will render */}
      <main style={{ padding: '10px 20px' }}> {/* Optional padding */}
        <Routes>
          {/* --- Core Routes --- */}
          <Route path="/" element={<PropertyList />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />

          {/* --- Authentication Routes --- */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* --- Property Management Routes (Add protection later if needed) --- */}
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/edit-listing/:id" element={<EditListingPage />} /> {/* <<< Added Edit Route */}

          {/* Optional: Catch-all route for 404 Not Found pages */}
          {/*
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px', color: '#555' }}>
              <h2>404 - Page Not Found</h2>
              <p>Sorry, the page you are looking for does not exist.</p>
            </div>
          } />
          */}
        </Routes>
      </main>

      {/* Optional: Footer component can be added here later */}
      {/*
      <footer style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid #eee', textAlign: 'center', color: '#777' }}>
        <p>© {new Date().getFullYear()} Real Estate Marketplace. All rights reserved.</p>
      </footer>
      */}

    </div> // End of App div
  );
}

export default App;