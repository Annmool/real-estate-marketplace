"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../services/authService"
import { useAuth } from "../context/AuthContext"
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Divider, Alert, Box } from "@mantine/core"
import { IconAlertCircle, IconUserPlus, IconBuildingEstate } from "@tabler/icons-react"

const RegisterPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { loginContext } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const responseData = await registerUser({ name, email, password })

      if (responseData.token) {
        loginContext(responseData.token)
        console.log("Registration successful, navigating home...")
        navigate("/")
      } else {
        setError("Registration completed but no token received.")
      }
    } catch (err) {
      console.error("Registration page error:", err)
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="animated-bg">
      <div className="decorative-circle top-right"></div>
      <div className="decorative-circle bottom-left"></div>

      <Container size="xs" py="xl">
        <Paper
          radius="lg"
          p="xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box ta="center" mb="lg">
            <IconBuildingEstate size={50} style={{ color: "#9c27b0" }} />
            <Title order={2} ta="center" mt="md" mb="md" className="gradient-text">
              Create an Account
            </Title>
          </Box>

          <Text c="dimmed" size="sm" ta="center" mb="xl">
            Fill out the form below to join our platform
          </Text>

          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextInput
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mb="md"
            />

            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              mb="md"
            />

            <PasswordInput
              label="Password"
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              mb="xl"
            />

            <Button
              fullWidth
              type="submit"
              loading={loading}
              leftSection={<IconUserPlus size={18} />}
              className="gradient-button"
              size="md"
              style={{
                background: "linear-gradient(90deg, #9c27b0, #ab47bc)",
              }}
            >
              Create account
            </Button>
          </form>

          <Divider
            label="Already have an account?"
            labelPosition="center"
            my="lg"
            style={{
              color: "#9c27b0",
            }}
          />

          <Button component={Link} to="/login" variant="outline" fullWidth color="purple">
            Sign in
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegisterPage
