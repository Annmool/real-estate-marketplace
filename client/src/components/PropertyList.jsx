"use client"

import { useState, useEffect } from "react"
import { getAllProperties } from "../services/propertyService"
import PropertyCard from "./PropertyCard"
import {
  SimpleGrid,
  Loader,
  Alert,
  TextInput,
  Select,
  Container,
  Title,
  Box,
  Paper,
  Group,
  Text,
  Button,
  Collapse,
  NumberInput,
  Divider,
  useMantineTheme,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  IconAlertCircle,
  IconSearch,
  IconHome,
  IconAdjustments,
  IconFilter,
  IconX,
  IconBuildingEstate,
} from "@tabler/icons-react"

const PropertyList = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    city: "",
    propertyType: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  })
  const [advancedFiltersOpened, { toggle: toggleAdvancedFilters }] = useDisclosure(false)
  const theme = useMantineTheme()

  // Effect to Fetch Properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("PropertyList: Fetching properties with filters:", filters)
        const data = await getAllProperties(filters)
        setProperties(data)
      } catch (err) {
        console.error("Error fetching properties:", err)
        setError(err.message || "Failed to load properties.")
        setProperties([])
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [filters])

  // Handler for Filter Input Changes
  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      city: "",
      propertyType: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    })
  }

  return (
    <Box className="animated-bg">
      <div className="decorative-circle top-right"></div>
      <div className="decorative-circle bottom-left"></div>

      <Container size="xl" py="xl">
        <Box mb="xl" className="hero-section" py="xl">
          <Title order={1} ta="center" mb="sm" className="gradient-text" size="3rem">
            Find Your Dream Property
          </Title>
          <Text c="dimmed" ta="center" mb="xl" size="xl">
            Browse our selection of premium properties for sale and rent
          </Text>
        </Box>

        {/* Main Filter Controls */}
        <Paper
          shadow="md"
          p="xl"
          radius="lg"
          mb="xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <Group mb="md" position="apart">
            <Title order={4}>
              <Group gap="xs">
                <IconFilter size={20} style={{ color: theme.colors.teal[6] }} />
                <span>Filters</span>
              </Group>
            </Title>
            <Group>
              <Button
                variant="subtle"
                size="xs"
                onClick={toggleAdvancedFilters}
                leftSection={<IconAdjustments size={16} />}
                color="teal"
              >
                {advancedFiltersOpened ? "Hide Advanced" : "Show Advanced"}
              </Button>
              {Object.values(filters).some((val) => val !== "") && (
                <Button variant="subtle" color="red" size="xs" onClick={clearFilters} leftSection={<IconX size={16} />}>
                  Clear All
                </Button>
              )}
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <TextInput
              label="Location"
              placeholder="Enter city name..."
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              leftSection={<IconSearch size={16} />}
            />
            <Select
              label="Property Type"
              placeholder="All Types"
              value={filters.propertyType}
              onChange={(value) => handleFilterChange("propertyType", value || "")}
              data={[
                { value: "", label: "All Types" },
                { value: "House", label: "House" },
                { value: "Apartment", label: "Apartment" },
                { value: "Office", label: "Office" },
                { value: "Shop", label: "Shop" },
                { value: "Land", label: "Land" },
              ]}
              leftSection={<IconHome size={16} />}
              clearable
            />
            <Select
              label="Status"
              placeholder="All Statuses"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value || "")}
              data={[
                { value: "", label: "All Statuses" },
                { value: "For Sale", label: "For Sale" },
                { value: "For Rent", label: "For Rent" },
              ]}
              leftSection={<IconBuildingEstate size={16} />}
              clearable
            />
          </SimpleGrid>

          <Collapse in={advancedFiltersOpened}>
            <Divider my="md" />
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <NumberInput
                label="Min Price ($)"
                placeholder="No minimum"
                value={filters.minPrice || ""}
                onChange={(value) => handleFilterChange("minPrice", value || "")}
                min={0}
                allowNegative={false}
                thousandSeparator=","
              />
              <NumberInput
                label="Max Price ($)"
                placeholder="No maximum"
                value={filters.maxPrice || ""}
                onChange={(value) => handleFilterChange("maxPrice", value || "")}
                min={0}
                allowNegative={false}
                thousandSeparator=","
              />
              <Select
                label="Bedrooms"
                placeholder="Any"
                value={filters.bedrooms}
                onChange={(value) => handleFilterChange("bedrooms", value || "")}
                data={[
                  { value: "", label: "Any" },
                  { value: "1", label: "1+" },
                  { value: "2", label: "2+" },
                  { value: "3", label: "3+" },
                  { value: "4", label: "4+" },
                  { value: "5", label: "5+" },
                ]}
                clearable
              />
            </SimpleGrid>
          </Collapse>
        </Paper>

        {/* Conditional Rendering for Loading/Error/No Results */}
        {loading && (
          <Box style={{ display: "flex", justifyContent: "center", padding: "xl" }}>
            <Loader color="teal" size="lg" />
          </Box>
        )}

        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error!"
            color="red"
            radius="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && properties.length === 0 && (
          <Alert color="teal" radius="md" title="No properties found" icon={<IconAlertCircle size="1rem" />}>
            No properties match your search criteria. Try adjusting your filters.
          </Alert>
        )}

        {/* Property Grid */}
        {!loading && !error && properties.length > 0 && (
          <>
            <Text mb="md" size="sm" c="dimmed">
              Showing {properties.length} properties
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg" verticalSpacing="lg">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </SimpleGrid>
          </>
        )}
      </Container>
    </Box>
  )
}

export default PropertyList
