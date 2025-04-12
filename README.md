# Real Estate Marketplace (MERN Stack)

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) allowing users to browse, list, search, and manage property listings (for sale or rent), including residential and commercial properties.


## Features

*   **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens) and password hashing (bcryptjs).
*   **Property Listings:**
    *   Browse all available properties (houses, apartments, offices, shops, land).
    *   View detailed information for each property.
    *   Filter properties by city, property type, and status (for sale/rent).
    *   *(Planned/Optional: Add more filters like price range, beds/baths)*
    *   *(Planned/Optional: Keyword search)*
*   **Property Management (Authenticated Users):**
    *   Create new property listings.
    *   View listings created by the logged-in user *(Planned/Optional: Add "My Listings" page)*.
    *   Edit existing listings owned by the user.
    *   Delete listings owned by the user.
*   **Responsive UI:** Basic responsive design using Mantine component library (or your chosen method).
*   **(Planned/Optional Features):**
    *   Image uploads for listings.
    *   Map integration (Leaflet/Mapbox/Google Maps).
    *   User profiles.
    *   Pagination for property lists.
    *   Contact forms/messaging.

---

## Technology Stack

**Backend:**

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js.
*   **MongoDB:** NoSQL database for storing user and property data.
*   **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
*   **JSON Web Token (jsonwebtoken):** For generating and verifying user session tokens.
*   **bcryptjs:** For securely hashing user passwords.
*   **dotenv:** For managing environment variables.
*   **cors:** For enabling Cross-Origin Resource Sharing.
*   **(Optional):** `nodemon` for development server auto-restarts.

**Frontend:**

*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Fast frontend build tool and development server.
*   **React Router DOM:** For client-side routing and navigation.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **Mantine UI (@mantine/core, @mantine/hooks):** Component library for styling and UI elements.
*   **Tabler Icons (@tabler/icons-react):** Icon library used with Mantine.
*   **React Context API:** For managing global authentication state.
*   **CSS / CSS Modules:** For styling components.

**Development Tools:**

*   **Git & GitHub:** Version control.
*   **VS Code:** Code editor.
*   **Postman/Insomnia:** API testing tool.
*   **npm:** Package manager.

---

## Setup and Installation

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Annmool/real-estate-marketplace.git
    cd real-estate-marketplace
    ```

2.  **Install Server Dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4.  **Environment Variables:**
    *   Navigate back to the `server` directory (`cd ../server`).
    *   Create a `.env` file in the `server` directory.
    *   Add the following environment variables, replacing the placeholders with your actual values:
        ```env
        PORT=5001
        MONGODB_URI=your_mongodb_connection_string # Replace with your local or Atlas URI
        JWT_SECRET=your_strong_jwt_secret_key     # Replace with a strong secret
        ```

5.  **Database Seeding (Optional but Recommended):**
    *   Ensure your MongoDB server is running and accessible via the `MONGODB_URI`.
    *   *(Optional: Modify `server/seed.js` if you want to assign seeded properties to a specific test user ID).*
    *   Run the seed script from the `server` directory:
        ```bash
        node seed.js
        ```

6.  **Run the Development Servers:**
    *   **Backend:** Open a terminal in the `server` directory and run:
        ```bash
        npm run dev
        ```
        *(The backend should start on the port specified in `.env`, e.g., http://localhost:5001)*
    *   **Frontend:** Open a *separate* terminal in the `client` directory and run:
        ```bash
        npm run dev
        ```
        *(The frontend should start, likely on http://localhost:5173, and automatically open in your browser).*

7.  **Access the Application:** Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).

---

## API Endpoints

*(Briefly list the main API endpoints)*

*   **Auth:**
    *   `POST /api/auth/register`: Register new user.
    *   `POST /api/auth/login`: Login user, get JWT token.
    *   `GET /api/auth/user`: Get logged-in user details (Protected).
*   **Properties:**
    *   `GET /api/properties`: Get all properties (supports filtering via query params: `city`, `propertyType`, `status`).
    *   `POST /api/properties`: Create new property (Protected).
    *   `GET /api/properties/:id`: Get single property details.
    *   `PUT /api/properties/:id`: Update property (Protected, Owner only).
    *   `DELETE /api/properties/:id`: Delete property (Protected, Owner only).

---

## Project Status

This project is currently under development as a portfolio piece. Key features like CRUD operations, authentication, and basic filtering are implemented.

**Future Improvements / To-Do:**

*   [ ] Implement more robust filtering/search (price range, keywords).
*   [ ] Add image file uploads instead of URL input.
*   [ ] Integrate map view (Leaflet/Mapbox).
*   [ ] Create "My Listings" page for users.
*   [ ] Implement pagination for property list.
*   [ ] Add unit and integration tests.
*   [ ] Refine UI/UX further, improve responsiveness.
*   [ ] Deploy to a hosting service (e.g., Render, Vercel, Netlify).
*   [ ] Add user profile editing.

---

## Contributing

This is primarily a portfolio project, but suggestions or feedback are welcome via GitHub Issues.

---

## Author

*   **Anmol Yadav** - [https://github.com/Annmool]

---

## License

This project is licensed under the MIT License - see the `LICENSE` file (you would need to create this file) for details.
