import { Container, Grid, Text, Group, ActionIcon, Box, Title, Anchor, Divider } from "@mantine/core"
import { Link } from "react-router-dom"
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBuildingEstate,
} from "@tabler/icons-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box className="footer-gradient">
      <Container size="xl" py="xl">
        <Grid>
          {/* Company Info */}
          <Grid.Col span={{ base: 12, md: 4 }} mb={{ base: "xl", md: 0 }}>
            <Group mb="md">
              <IconBuildingEstate size={32} color="white" />
              <Title order={3} className="footer-logo">
                Anmol Estates
              </Title>
            </Group>
            <Text c="gray.2" mb="lg" size="sm">
              Providing premium real estate solutions with a focus on customer satisfaction and exceptional property
              listings. Your dream home is just a click away.
            </Text>
            <Group>
              <ActionIcon variant="subtle" color="gray.0" size="lg" radius="xl">
                <IconBrandFacebook size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray.0" size="lg" radius="xl">
                <IconBrandTwitter size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray.0" size="lg" radius="xl">
                <IconBrandInstagram size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray.0" size="lg" radius="xl">
                <IconBrandLinkedin size={20} />
              </ActionIcon>
            </Group>
          </Grid.Col>

          {/* Quick Links */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} mb={{ base: "xl", md: 0 }}>
            <Title order={4} c="gray.0" mb="md">
              Quick Links
            </Title>
            <Box component="ul" style={{ listStyle: "none", padding: 0 }}>
              <Box component="li" mb="sm">
                <Anchor component={Link} to="/" c="gray.2" style={{ textDecoration: "none" }}>
                  Home
                </Anchor>
              </Box>
              <Box component="li" mb="sm">
                <Anchor component={Link} to="/properties" c="gray.2" style={{ textDecoration: "none" }}>
                  Properties
                </Anchor>
              </Box>
              <Box component="li" mb="sm">
                <Anchor component="a" href="#" c="gray.2" style={{ textDecoration: "none" }}>
                  About Us
                </Anchor>
              </Box>
              <Box component="li" mb="sm">
                <Anchor component="a" href="#" c="gray.2" style={{ textDecoration: "none" }}>
                  Services
                </Anchor>
              </Box>
              <Box component="li" mb="sm">
                <Anchor component="a" href="#" c="gray.2" style={{ textDecoration: "none" }}>
                  Contact
                </Anchor>
              </Box>
            </Box>
          </Grid.Col>

          {/* Contact Info */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Title order={4} c="gray.0" mb="md">
              Contact Us
            </Title>
            <Group mb="sm" align="flex-start" gap="xs">
              <IconMapPin size={20} color="white" style={{ marginTop: 2 }} />
              <Text c="gray.2" size="sm">
                123 Real Estate Avenue, Property City, 12345
              </Text>
            </Group>
            <Group mb="sm" gap="xs">
              <IconPhone size={20} color="white" />
              <Text c="gray.2" size="sm">
                +1 (555) 123-4567
              </Text>
            </Group>
            <Group mb="sm" gap="xs">
              <IconMail size={20} color="white" />
              <Text c="gray.2" size="sm">
                info@anmolestates.com
              </Text>
            </Group>
          </Grid.Col>
        </Grid>

        <Divider my="xl" color="gray.7" />

        <Group justify="space-between" wrap="wrap">
          <Text c="gray.2" size="sm">
            © {currentYear} Anmol Estates. All rights reserved.
          </Text>
          <Group gap="md" wrap="wrap">
            <Anchor href="#" c="gray.2" size="sm" style={{ textDecoration: "none" }}>
              Privacy Policy
            </Anchor>
            <Anchor href="#" c="gray.2" size="sm" style={{ textDecoration: "none" }}>
              Terms of Service
            </Anchor>
            <Anchor href="#" c="gray.2" size="sm" style={{ textDecoration: "none" }}>
              Cookie Policy
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  )
}

export default Footer
