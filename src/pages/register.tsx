import { useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Paper, Typography, TextField, Button, Alert } from '@mui/material'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.74.42.88:8081'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Account created! Redirecting to login...')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Network error. Is backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f7f9fc">
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Start managing your cloud infrastructure
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              type="email"
            />
            <TextField
              fullWidth
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              type="password"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 4, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#2d2d44' } }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button color="inherit" onClick={() => router.push('/login')} sx={{ fontWeight: 500 }}>
                Sign In
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
