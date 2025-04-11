// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // <<< Add this server configuration block
    proxy: {
      // Requests starting with /api will be forwarded to the target
      '/api': {
        target: 'http://localhost:5001', // Your backend server URL
        changeOrigin: true, // Recommended for virtual hosted sites
        // secure: false, // Uncomment if backend is not HTTPS
        // rewrite: (path) => path.replace(/^\/api/, '') // Use if your backend routes DON'T start with /api
      }
    }
  } // <<< End server configuration block
})