"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../services/authService"
import { useAuth } from "../context/AuthContext"
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Divider, Alert, Box } from "@mantine/core"
import { IconAlertCircle, IconLogin, IconBuildingEstate } from "@tabler/icons-react"

const LoginPage = () => {
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
    try {
      const responseData = await loginUser({ email, password })

      if (responseData.token) {
        loginContext(responseData.token)
        console.log("Login successful, navigating home...")
        navigate("/")
      } else {
        setError("Login completed but no token received.")
      }
    } catch (err) {
      console.error("Login page error:", err)
      setError(err.message || "Login failed. Please check credentials.")
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
            <IconBuildingEstate size={50} style={{ color: "#009688" }} />
            <Title order={2} ta="center" mt="md" mb="md" className="gradient-text">
              Welcome Back!
            </Title>
          </Box>

          <Text c="dimmed" size="sm" ta="center" mb="xl">
            Enter your credentials to access your account
          </Text>

          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              mb="xl"
            />

            <Button
              fullWidth
              type="submit"
              loading={loading}
              leftSection={<IconLogin size={18} />}
              className="gradient-button"
              size="md"
            >
              Sign in
            </Button>
          </form>

          <Divider
            label="Don't have an account?"
            labelPosition="center"
            my="lg"
            style={{
              color: "#009688",
            }}
          />

          <Button component={Link} to="/register" variant="outline" fullWidth color="teal">
            Create account
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
