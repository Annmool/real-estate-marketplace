// client/src/components/PropertyList.jsx

import React, { useState, useEffect } from 'react';
import { getAllProperties } from '../services/propertyService';
import PropertyCard from './PropertyCard'; // We'll refactor this next

// --- Mantine Imports ---
import { SimpleGrid, Loader, Alert, TextInput, Select, Container, Title, Box } from '@mantine/core';
import { IconAlertCircle, IconSearch } from '@tabler/icons-react'; // Icons for UI elements

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ city: '', propertyType: '', status: '' });

    // --- Effect to Fetch Properties (Keep logic, service call handles filters) ---
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("PropertyList: Fetching properties with filters:", filters);
                const data = await getAllProperties(filters);
                setProperties(data);
            } catch (err) {
                console.error("Error fetching properties:", err);
                setError(err.message || 'Failed to load properties.');
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [filters]); // Re-run when filters change

    // --- Handler for Filter Input Changes (Keep As Is) ---
    const handleFilterChange = (e) => {
        // Can handle Select components directly with Mantine's onChange if needed,
        // but this generic handler works for both input and select if names match state keys.
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    // --- Render Logic using Mantine Components ---
    return (
        // Mantine Container for centered content with max-width
        <Container size="xl" py="md">
            <Title order={2} ta="center" mb="xl">Available Properties</Title>

            {/* --- Filter Controls using Mantine Input/Select --- */}
            {/* Use Mantine Box for grouping and styling */}
            <Box mb="xl" p="md" style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)', backgroundColor: 'var(--mantine-color-gray-0)' }}>
                {/* Use SimpleGrid for responsive layout of filters */}
                 <SimpleGrid
                     cols={{ base: 1, xs: 2, md: 4 }} // Adjust columns based on screen size
                     spacing="md"
                 >
                    <TextInput
                        label="Filter by City"
                        placeholder="Enter city name..."
                        name="city"
                        value={filters.city}
                        onChange={handleFilterChange}
                        leftSection={<IconSearch size={16} />} // Add search icon
                    />
                    <Select
                        label="Property Type"
                        placeholder="All Types"
                        name="propertyType"
                        value={filters.propertyType}
                        // Mantine Select's onChange provides the value directly
                        onChange={(value) => handleFilterChange({ target: { name: 'propertyType', value: value || '' } })}
                        data={[
                            { value: '', label: 'All Types' },
                            { value: 'House', label: 'House' },
                            { value: 'Apartment', label: 'Apartment' },
                            { value: 'Office', label: 'Office' },
                            { value: 'Shop', label: 'Shop' },
                            { value: 'Land', label: 'Land' },
                        ]}
                        clearable // Allow clearing the selection
                    />
                     <Select
                        label="Status"
                        placeholder="All Statuses"
                        name="status"
                        value={filters.status}
                        onChange={(value) => handleFilterChange({ target: { name: 'status', value: value || '' } })}
                        data={[
                            { value: '', label: 'All Statuses' },
                            { value: 'For Sale', label: 'For Sale' },
                            { value: 'For Rent', label: 'For Rent' },
                        ]}
                        clearable
                    />
                     {/* Add more filters (e.g., Price range using RangeSlider) here later */}
                 </SimpleGrid>
            </Box>
            {/* --- END Filter Controls --- */}


            {/* --- Conditional Rendering for Loading/Error/No Results --- */}
            {loading && (
                // Mantine Loader component
                <Box style={{ display: 'flex', justifyContent: 'center', padding: 'xl' }}>
                    <Loader color="blue" />
                </Box>
            )}

            {error && (
                // Mantine Alert component for errors
                <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red" radius="md" withCloseButton onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {!loading && !error && properties.length === 0 && (
                 <Alert color="gray" radius="md" ta="center">
                    No properties found matching your criteria.
                </Alert>
            )}

            {/* --- Render Property List using Mantine SimpleGrid --- */}
            {!loading && !error && properties.length > 0 && (
                 <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3, lg: 4 }} // Responsive columns
                    spacing="lg" // Spacing between grid items
                    verticalSpacing="lg"
                 >
                    {/* Map over the properties array and render a Mantine Card for each */}
                    {properties.map((property) => (
                        // Pass data to the refactored PropertyCard
                        <PropertyCard key={property._id} property={property} />
                    ))}
                </SimpleGrid>
            )}
            {/* --- END Property List Display --- */}

        </Container> // End Mantine Container
    );
};

export default PropertyList;