import { Routes, Route } from "react-router-dom"
import { AppShell, Box } from "@mantine/core"

// Import Components
import Navbar from "./components/Navbar"
import PropertyList from "./components/PropertyList"
import PropertyDetail from "./components/PropertyDetail"
import Footer from "./components/Footer"

// Import Page Components
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import CreateListingPage from "./pages/CreateListingPage"
import EditListingPage from "./pages/EditListingPage"

function App() {
  return (
    <Box style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppShell header={{ height: 60 }} padding="md">
        <Navbar />

        <AppShell.Main style={{ flex: 1 }}>
          <Routes>
            {/* Core Routes */}
            <Route path="/" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />

            {/* Authentication Routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Property Management Routes */}
            <Route path="/create-listing" element={<CreateListingPage />} />
            <Route path="/edit-listing/:id" element={<EditListingPage />} />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", padding: "50px", color: "#555" }}>
                  <h2>404 - Page Not Found</h2>
                  <p>Sorry, the page you are looking for does not exist.</p>
                </div>
              }
            />
          </Routes>
        </AppShell.Main>
      </AppShell>
      <Footer />
    </Box>
  )
}

export default App
