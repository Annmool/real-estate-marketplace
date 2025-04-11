// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateListingPage from './pages/CreateListingPage'; // <<< Import Create Page
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main style={{ padding: '10px 20px' }}>
        <Routes>
          <Route path="/" element={<PropertyList />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} /> {/* <<< Add Create Route */}
          {/* <Route path="*" element={<h2>404 Page Not Found</h2>} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;