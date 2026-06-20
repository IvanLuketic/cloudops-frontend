import { useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Paper, Typography, TextField, Button, Alert } from '@mui/material'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.74.42.88:8081'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Network error. Is backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f7f9fc' }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
            Sign In
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Welcome back to CloudOps
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
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
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button color="inherit" onClick={() => router.push('/register')} sx={{ fontWeight: 500 }}>
                Register
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}