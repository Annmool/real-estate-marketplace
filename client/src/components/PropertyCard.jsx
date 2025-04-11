// client/src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// --- Mantine Imports ---
import { Card, Image, Text, Badge, Group, ThemeIcon } from '@mantine/core';
import { IconBed, IconBath, IconRulerMeasure } from '@tabler/icons-react'; // Icons for details
import classes from './PropertyCard.module.css'; // Import CSS Modules for custom styles

// Helper function to format price
const formatPrice = (price, status) => {
    if (price == null) return 'Contact for price';
    const formatted = `$${price.toLocaleString()}`;
    return status === 'For Rent' ? `${formatted} / month` : formatted;
};

const PropertyCard = ({ property }) => {
    const {
        _id, title, imageUrl, city, state, propertyType, status, price, bedrooms, bathrooms, squareFootage
    } = property;

    const detailUrl = _id ? `/properties/${_id}` : '#';

    return (
        // Use Mantine Card component as the base
        <Card shadow="sm" padding="lg" radius="md" withBorder component={Link} to={detailUrl} className={classes.card}>
            <Card.Section>
                {/* Mantine Image component with fallback */}
                <Image
                    src={imageUrl}
                    height={180}
                    alt={`Image of ${title || 'property'}`}
                    fallbackSrc="https://placehold.co/600x400/eee/ccc?text=No+Image"
                />
            </Card.Section>

            {/* Group component for Status/Type Badges */}
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={600} size="lg" truncate="end">{title || 'Untitled Property'}</Text>
                <Badge color={status === 'For Sale' ? 'blue' : 'green'} variant="light">
                    {status || 'N/A'}
                </Badge>
            </Group>

            {/* Location and Type */}
            <Text size="sm" c="dimmed" mb="sm">
                {city || 'N/A'}, {state || 'N/A'} - {propertyType || 'N/A'}
            </Text>

             {/* Details with Icons */}
             <Group gap="xs" mb="md" className={classes.detailsGroup}>
                {bedrooms != null && (
                    <Group gap={4}>
                         <ThemeIcon variant="light" size="sm" color="gray"><IconBed size={14} /></ThemeIcon>
                         <Text size="xs" c="dimmed">{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</Text>
                    </Group>
                )}
                 {bathrooms != null && (
                     <Group gap={4}>
                         <ThemeIcon variant="light" size="sm" color="gray"><IconBath size={14} /></ThemeIcon>
                         <Text size="xs" c="dimmed">{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</Text>
                     </Group>
                )}
                {squareFootage != null && (
                     <Group gap={4}>
                         <ThemeIcon variant="light" size="sm" color="gray"><IconRulerMeasure size={14} /></ThemeIcon>
                         <Text size="xs" c="dimmed">{squareFootage.toLocaleString()} sqft</Text>
                    </Group>
                )}
            </Group>

            {/* Price - Use Mantine Text component */}
            <Text size="xl" fw={700} className={classes.price}>
                 {formatPrice(price, status)}
            </Text>

            {/* Card automatically acts as link due to component={Link} prop */}
        </Card>
    );
};

export default PropertyCard;