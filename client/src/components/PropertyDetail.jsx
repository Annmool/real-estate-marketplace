"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getPropertyById, deleteProperty } from "../services/propertyService"
import { useAuth } from "../context/AuthContext"
import {
  Container,
  Image,
  Text,
  Group,
  Badge,
  Button,
  Paper,
  Grid,
  Divider,
  Box,
  Title,
  Loader,
  Alert,
  ThemeIcon,
  Modal,
  useMantineTheme,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  IconBed,
  IconBath,
  IconRulerMeasure,
  IconMapPin,
  IconCurrencyDollar,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconArrowLeft,
} from "@tabler/icons-react"

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const theme = useMantineTheme()

  // State
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [opened, { open, close }] = useDisclosure(false)

  // Effect to fetch property data
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) {
        setError("No property ID provided in URL.")
        setLoading(false)
        return
      }
      console.log(`PropertyDetail: Fetching data for ID: ${id}`)
      setLoading(true)
      setError(null)
      try {
        const data = await getPropertyById(id)
        console.log("PropertyDetail: Fetched property data:", data)
        setProperty(data)
      } catch (err) {
        console.error("Error in PropertyDetail component fetching data:", err)
        setError(err.message || `Failed to load property details for ID: ${id}`)
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPropertyDetails()
  }, [id])

  // Delete Handler function
  const handleDelete = async () => {
    setDeleteLoading(true)
    setDeleteError("")
    try {
      await deleteProperty(id)
      console.log("Property deleted successfully from detail page.")
      close()
      navigate("/")
    } catch (err) {
      console.error("Error deleting property from detail page:", err)
      setDeleteError(err.message || "Failed to delete property.")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Render Logic
  if (authLoading || loading) {
    return (
      <Container size="md" py="xl" style={{ display: "flex", justifyContent: "center" }}>
        <Loader size="lg" color="teal" />
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    )
  }

  if (!property) {
    return (
      <Container size="md" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Not Found" color="yellow">
          Property not found.
        </Alert>
      </Container>
    )
  }

  // Perform Ownership Check
  const isOwner = isAuthenticated && user && property && user.id === property.owner

  // Destructure property details
  const {
    title = "N/A",
    description = "No description available.",
    imageUrl = "https://placehold.co/800x500/e2e8f0/94a3b8?text=No+Image",
    price,
    status,
    address = "N/A",
    city = "N/A",
    state = "N/A",
    zipCode = "N/A",
    propertyType = "N/A",
    bedrooms,
    bathrooms,
    squareFootage,
  } = property

  const displayPrice = price ? `${price.toLocaleString()}` : "Contact for price"
  const priceSuffix = status === "For Rent" ? " / month" : ""
  const badgeColor = status === "For Sale" ? "orange" : "teal"

  return (
    <Box className="animated-bg">
      <div className="decorative-circle top-right"></div>
      <Container size="lg" py="xl">
        <Button component={Link} to="/" variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="md" color="teal">
          Back to listings
        </Button>

        <Paper
          shadow="md"
          radius="lg"
          p={0}
          style={{
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {/* Property Image */}
          <Box style={{ position: "relative" }}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              height={400}
              alt={`Image of ${title}`}
              fallbackSrc="https://placehold.co/800x500/e2e8f0/94a3b8?text=No+Image"
            />
            <Badge
              size="lg"
              color={badgeColor}
              variant="filled"
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 2,
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              {status}
            </Badge>
          </Box>

          <Box p="xl">
            {/* Owner Actions */}
            {isOwner && (
              <Group position="right" mb="md">
                <Button
                  component={Link}
                  to={`/edit-listing/${id}`}
                  variant="outline"
                  color="teal"
                  leftSection={<IconEdit size={16} />}
                  className="hover-lift"
                >
                  Edit Listing
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={open}
                  className="hover-lift"
                >
                  Delete Listing
                </Button>
              </Group>
            )}

            {/* Title and Price */}
            <Title order={1} mb="xs" className="gradient-text">
              {title}
            </Title>
            <Group mb="lg">
              <Badge size="lg" color={badgeColor}>
                {status}
              </Badge>
              <Badge size="lg" color="purple">
                {propertyType}
              </Badge>
            </Group>

            <Text
              size="xl"
              fw={700}
              mb="md"
              style={{
                background: "linear-gradient(90deg, var(--mantine-color-teal-6), var(--mantine-color-purple-6))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                display: "inline-block",
                fontSize: "2rem",
              }}
            >
              <Group gap={5}>
                <IconCurrencyDollar size={28} style={{ color: theme.colors.teal[6] }} />
                {displayPrice}
                {priceSuffix}
              </Group>
            </Text>

            <Group mb="lg">
              <ThemeIcon size="lg" variant="light" color="teal" radius="md">
                <IconMapPin size={20} />
              </ThemeIcon>
              <Text>{address ? `${address}, ${city}, ${state} ${zipCode || ""}` : `${city}, ${state}`}</Text>
            </Group>

            <Divider
              my="lg"
              style={{
                background: "linear-gradient(90deg, var(--mantine-color-teal-3), var(--mantine-color-purple-3))",
                height: "2px",
                border: "none",
              }}
            />

            {/* Property Details */}
            <Grid mb="xl">
              {bedrooms != null && (
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Paper
                    p="md"
                    withBorder
                    style={{
                      borderColor: theme.colors.teal[1],
                      background: "linear-gradient(135deg, rgba(224, 242, 241, 0.5), rgba(178, 223, 219, 0.3))",
                    }}
                    className="hover-lift"
                  >
                    <Group>
                      <ThemeIcon size="lg" radius="md" color="teal" variant="light">
                        <IconBed size={20} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="dimmed">
                          Bedrooms
                        </Text>
                        <Text fw={700}>{bedrooms}</Text>
                      </div>
                    </Group>
                  </Paper>
                </Grid.Col>
              )}

              {bathrooms != null && (
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Paper
                    p="md"
                    withBorder
                    style={{
                      borderColor: theme.colors.purple[1],
                      background: "linear-gradient(135deg, rgba(243, 229, 245, 0.5), rgba(225, 190, 231, 0.3))",
                    }}
                    className="hover-lift"
                  >
                    <Group>
                      <ThemeIcon size="lg" radius="md" color="purple" variant="light">
                        <IconBath size={20} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="dimmed">
                          Bathrooms
                        </Text>
                        <Text fw={700}>{bathrooms}</Text>
                      </div>
                    </Group>
                  </Paper>
                </Grid.Col>
              )}

              {squareFootage != null && (
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Paper
                    p="md"
                    withBorder
                    style={{
                      borderColor: theme.colors.orange[1],
                      background: "linear-gradient(135deg, rgba(255, 243, 224, 0.5), rgba(255, 224, 178, 0.3))",
                    }}
                    className="hover-lift"
                  >
                    <Group>
                      <ThemeIcon size="lg" radius="md" color="orange" variant="light">
                        <IconRulerMeasure size={20} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="dimmed">
                          Square Footage
                        </Text>
                        <Text fw={700}>{squareFootage.toLocaleString()} sqft</Text>
                      </div>
                    </Group>
                  </Paper>
                </Grid.Col>
              )}
            </Grid>

            {/* Description */}
            <Title order={3} mb="md" className="gradient-text">
              Description
            </Title>
            <Text style={{ lineHeight: 1.7 }}>{description}</Text>
          </Box>
        </Paper>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal opened={opened} onClose={close} title="Confirm Deletion" centered>
        <Text mb="lg">Are you sure you want to delete this listing? This action cannot be undone.</Text>
        {deleteError && (
          <Alert color="red" mb="md">
            {deleteError}
          </Alert>
        )}
        <Group position="right">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete} loading={deleteLoading}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Box>
  )
}

export default PropertyDetail
