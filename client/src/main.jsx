// client/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Mantine Imports ---
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // Import Mantine base styles

// --- App Imports ---
// import './index.css'; // You might remove or keep parts of this
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* --- Wrap with MantineProvider --- */}
    <MantineProvider defaultColorScheme="auto"> {/* Or "light" / "dark" */}
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
    {/* --- End MantineProvider --- */}
  </StrictMode>,
);