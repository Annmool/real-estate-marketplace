"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  AppShell,
  Group,
  Button,
  Text,
  Container,
  Burger,
  Drawer,
  Stack,
  Avatar,
  Menu,
  rem,
  useMantineTheme,
  Box,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  IconHome2,
  IconPlus,
  IconLogin,
  IconUserPlus,
  IconLogout,
  IconUser,
  IconChevronDown,
  IconBuildingEstate,
} from "@tabler/icons-react"

const Navbar = () => {
  const { isAuthenticated, user, logoutContext } = useAuth()
  const navigate = useNavigate()
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)
  const theme = useMantineTheme()

  const handleLogout = () => {
    console.log("Navbar: Logout button clicked")
    logoutContext()
    navigate("/login")
  }

  const navItems = isAuthenticated
    ? [
        { label: "Home", icon: <IconHome2 size={18} />, to: "/" },
        { label: "Create Listing", icon: <IconPlus size={18} />, to: "/create-listing" },
      ]
    : [
        { label: "Home", icon: <IconHome2 size={18} />, to: "/" },
        { label: "Login", icon: <IconLogin size={18} />, to: "/login" },
        { label: "Register", icon: <IconUserPlus size={18} />, to: "/register" },
      ]

  return (
    <AppShell.Header className="navbar-gradient">
      <Container size="xl">
        <Group justify="space-between" h="60px">
          <Group>
            <Text
              component={Link}
              to="/"
              size="xl"
              fw={700}
              className="gradient-text"
              style={{ textDecoration: "none" }}
            >
              <Group gap={8}>
                <IconBuildingEstate size={24} />
                Nexus Prime Properties
              </Group>
            </Text>
          </Group>

          {/* Desktop navigation */}
          <Group gap={5} visibleFrom="xs">
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.to}
                variant="subtle"
                leftSection={item.icon}
                color="teal"
              >
                {item.label}
              </Button>
            ))}

            {isAuthenticated && (
              <Menu position="bottom-end" withArrow shadow="md">
                <Menu.Target>
                  <Button variant="subtle" color="teal" rightSection={<IconChevronDown size={rem(16)} />}>
                    <Group gap="xs">
                      <Avatar color="teal" radius="xl" size="sm">
                        {user?.name?.charAt(0) || "U"}
                      </Avatar>
                      <Text size="sm">{user?.name || "User"}</Text>
                    </Group>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

          {/* Mobile burger menu */}
          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="xs" />
        </Group>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <Text className="gradient-text" fw={700}>
             Nexus Prime Properties
          </Text>
        }
        hiddenFrom="xs"
        zIndex={1000}
      >
        <Stack>
          {navItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.to}
              variant="subtle"
              leftSection={item.icon}
              onClick={closeDrawer}
              fullWidth
              justify="start"
              color="teal"
            >
              {item.label}
            </Button>
          ))}

          {isAuthenticated && (
            <>
              <Box
                p="md"
                style={{
                  background: "linear-gradient(135deg, #e0f2f1, #b2dfdb)",
                  borderRadius: theme.radius.md,
                }}
              >
                <Group>
                  <Avatar color="teal" radius="xl">
                    {user?.name?.charAt(0) || "U"}
                  </Avatar>
                  <div>
                    <Text fw={500}>{user?.name || "User"}</Text>
                    <Text size="xs" c="dimmed">
                      {user?.email || ""}
                    </Text>
                  </div>
                </Group>
              </Box>
              <Button
                color="red"
                leftSection={<IconLogout size={18} />}
                onClick={() => {
                  handleLogout()
                  closeDrawer()
                }}
                variant="light"
                fullWidth
                justify="start"
              >
                Logout
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </AppShell.Header>
  )
}

export default Navbar
