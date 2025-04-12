import { Link } from "react-router-dom"
import { Card, Image, Text, Badge, Group, ThemeIcon, Flex, Box } from "@mantine/core"
import { IconBed, IconBath, IconRulerMeasure, IconMapPin, IconHome } from "@tabler/icons-react"
import classes from "./PropertyCard.module.css"

// Helper function to format price
const formatPrice = (price, status) => {
  if (price == null) return "Contact for price"
  const formatted = `${price.toLocaleString()}`
  return status === "For Rent" ? `${formatted} / month` : formatted
}

const PropertyCard = ({ property }) => {
  const { _id, title, imageUrl, city, state, propertyType, status, price, bedrooms, bathrooms, squareFootage } =
    property

  const detailUrl = _id ? `/properties/${_id}` : "#"

  // Determine badge color based on status
  const badgeColor = status === "For Sale" ? "orange" : "teal"

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      to={detailUrl}
      className={`${classes.card} hover-lift`}
    >
      <Card.Section className={classes.imageSection}>
        <div className={classes.imageWrapper}>
          <Image
            src={imageUrl || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"}
            height={200}
            alt={`Image of ${title || "property"}`}
          />
          <div className={classes.imageOverlay}></div>
        </div>
        <Badge className={classes.statusBadge} color={badgeColor} variant="filled" size="lg">
          {status || "N/A"}
        </Badge>
      </Card.Section>

      <Box pt="md">
        <Text fw={700} size="lg" lineClamp={1} mb={5}>
          {title || "Untitled Property"}
        </Text>

        <Group gap={6} mb={10}>
          <ThemeIcon size="sm" variant="light" color="teal">
            <IconMapPin size={14} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" lineClamp={1}>
            {city || "N/A"}, {state || "N/A"}
          </Text>
        </Group>

        <Group gap={6} mb={10}>
          <ThemeIcon size="sm" variant="light" color="purple">
            <IconHome size={14} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            {propertyType || "N/A"}
          </Text>
        </Group>
      </Box>

      <Box className={classes.detailsGroup}>
        <Flex gap="md" wrap="wrap">
          {bedrooms != null && (
            <Group gap={4}>
              <ThemeIcon variant="light" size="sm" color="teal">
                <IconBed size={14} />
              </ThemeIcon>
              <Text size="xs">
                {bedrooms} bed{bedrooms !== 1 ? "s" : ""}
              </Text>
            </Group>
          )}
          {bathrooms != null && (
            <Group gap={4}>
              <ThemeIcon variant="light" size="sm" color="purple">
                <IconBath size={14} />
              </ThemeIcon>
              <Text size="xs">
                {bathrooms} bath{bathrooms !== 1 ? "s" : ""}
              </Text>
            </Group>
          )}
          {squareFootage != null && (
            <Group gap={4}>
              <ThemeIcon variant="light" size="sm" color="orange">
                <IconRulerMeasure size={14} />
              </ThemeIcon>
              <Text size="xs">{squareFootage.toLocaleString()} sqft</Text>
            </Group>
          )}
        </Flex>
      </Box>

      <Text size="xl" fw={700} className={classes.price}>
        {formatPrice(price, status)}
      </Text>
    </Card>
  )
}

export default PropertyCard
